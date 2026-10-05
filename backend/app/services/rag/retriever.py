import numpy as np
import os
import json
from typing import List, Dict, Any
from app.services.rag.embedder import local_embedder

class LocalDocumentRetriever:
    def __init__(self):
        self.documents: List[Dict[str, Any]] = []
        self._vector_store = None
        self._initialized = False
        self.persist_dir = "datasets/processed/chroma_db"
        self.local_json_path = os.path.join(self.persist_dir, "local_store.json")
        # Ensure threshold is configurable via env (default 0.15 for TF-IDF since exact match overlaps vary)
        self.threshold = float(os.environ.get("RAG_SIMILARITY_THRESHOLD", "0.15"))

    def initialize_chromadb(self, texts: List[str], metadatas: List[Dict[str, Any]]):
        os.makedirs(self.persist_dir, exist_ok=True)
        try:
            from langchain_community.vectorstores import Chroma
            # ChromaDB local initialization
            self._vector_store = Chroma.from_texts(
                texts=texts,
                embedding=local_embedder,
                metadatas=metadatas,
                persist_directory=self.persist_dir
            )
            self._initialized = True
            print("ChromaDB vector store initialized successfully.")
        except Exception as e:
            print(f"ChromaDB not available, using persistent local JSON fallback store: {e}")
            
            # Always re-index documents to catch new files and updates
            local_embedder.fit_tfidf(texts, force=True)
            self.documents = []
            for t, meta in zip(texts, metadatas):
                self.documents.append({
                    "text": t,
                    "metadata": meta,
                    "embedding": local_embedder.embed_query(t)
                })
            
            try:
                with open(self.local_json_path, "w", encoding="utf-8") as f:
                    json.dump(self.documents, f, indent=2)
                print(f"Saved {len(self.documents)} documents to persistent JSON store at {self.local_json_path}")
            except Exception as ex:
                print(f"Failed to persist local JSON store: {ex}")
                
            self._initialized = True

    def retrieve_similar_docs(self, query: str, k: int = 2) -> List[Dict[str, Any]]:
        if not self._initialized:
            if os.path.exists(self.local_json_path):
                try:
                    with open(self.local_json_path, "r", encoding="utf-8") as f:
                        self.documents = json.load(f)
                    self._initialized = True
                except Exception:
                    pass
            if not self._initialized:
                return []
            
        if self._vector_store:
            try:
                # With chromadb, Langchain similarity search does not natively return scores without similarity_search_with_score
                docs_with_scores = self._vector_store.similarity_search_with_score(query, k=k)
                results = []
                for doc, score in docs_with_scores:
                    # Chroma distances are often L2. Smaller is better.
                    # We will just map it roughly to relevance or fallback if thresholding is tricky in pure L2
                    if score <= (1.0 - self.threshold): # Assuming cosine distance
                        results.append({
                            "text": doc.page_content,
                            "metadata": doc.metadata,
                            "relevance_score": round(1.0 - score, 3)
                        })
                return results
            except Exception as e:
                print(f"ChromaDB search failed, falling back to local list: {e}")

        # In-memory cosine similarity retrieval fallback on persistent documents
        query_emb = np.array(local_embedder.embed_query(query))
        scores = []
        for doc in self.documents:
            doc_emb = np.array(doc["embedding"])
            dot = np.dot(query_emb, doc_emb)
            norm_q = np.linalg.norm(query_emb)
            norm_d = np.linalg.norm(doc_emb)
            score = dot / (norm_q * norm_d) if (norm_q > 0 and norm_d > 0) else 0.0
            
            if score >= self.threshold:
                scores.append((score, doc))
            
        scores.sort(key=lambda x: x[0], reverse=True)
        return [
            {
                "text": item[1]["text"],
                "metadata": item[1]["metadata"],
                "relevance_score": round(item[0], 3)
            }
            for item in scores[:k]
        ]

local_retriever = LocalDocumentRetriever()

