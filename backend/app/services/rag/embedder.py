import numpy as np
from typing import List
from sklearn.feature_extraction.text import TfidfVectorizer

class LocalEmbedder:
    def __init__(self):
        self._hf_embeddings = None
        self._vectorizer = None
        self._is_tfidf = False
        
        try:
            # Check if torch and transformers can be successfully initialized
            import torch
            import transformers
            from langchain_community.embeddings import HuggingFaceEmbeddings
            self._hf_embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
            print("LangChain HuggingFaceEmbeddings initialized successfully.")
        except Exception as e:
            print(f"HuggingFaceEmbeddings not available (due to PyTorch/Transformers issues), using real TF-IDF vectorizer fallback: {e}")
            self._is_tfidf = True
            self._vectorizer = TfidfVectorizer(max_features=384, stop_words='english')
            self._fitted = False

    def fit_tfidf(self, texts: List[str], force: bool = False):
        if self._is_tfidf and (force or not getattr(self, "_fitted", False)):
            if texts:
                self._vectorizer = TfidfVectorizer(max_features=384, stop_words='english')
                self._vectorizer.fit(texts)
                self._fitted = True
            else:
                self._vectorizer = TfidfVectorizer(max_features=384, stop_words='english')
                self._vectorizer.fit(["scam url upi phone block lottery job prize win kyc customer support bank card credentials otp"])
                self._fitted = True

    def embed_query(self, text: str) -> List[float]:
        if self._hf_embeddings and not self._is_tfidf:
            try:
                return self._hf_embeddings.embed_query(text)
            except Exception as e:
                print(f"HuggingFace embedding failed, switching to TF-IDF: {e}")
                self._is_tfidf = True
                self._vectorizer = TfidfVectorizer(max_features=384, stop_words='english')
                self._fitted = False
                
        if self._is_tfidf:
            if not getattr(self, "_fitted", False):
                self.fit_tfidf([text])
            try:
                vec = self._vectorizer.transform([text]).toarray()[0]
                if np.linalg.norm(vec) == 0:
                    vec = np.random.normal(0, 0.01, 384)
                if len(vec) < 384:
                    vec = np.pad(vec, (0, 384 - len(vec)), 'constant')
                norm = np.linalg.norm(vec)
                return [float(x) for x in (vec / norm)]
            except Exception as e:
                print(f"TF-IDF embedding failed: {e}")
                
        # Pure deterministic fallback if everything else fails
        np.random.seed(hash(text) % (2**32 - 1))
        vec = np.random.normal(0, 1, 384)
        norm = np.linalg.norm(vec)
        return [float(x) for x in (vec / norm)]

    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        if self._is_tfidf:
            self.fit_tfidf(texts)
        return [self.embed_query(t) for t in texts]

local_embedder = LocalEmbedder()

