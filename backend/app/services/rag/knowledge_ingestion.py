import os
from typing import List
from backend.app.services.rag.retriever import local_retriever

def ingest_knowledge_files(kb_dir: str = "knowledge_base"):
    if not os.path.exists(kb_dir):
        print(f"Knowledge base directory '{kb_dir}' does not exist, creating directory.")
        os.makedirs(kb_dir, exist_ok=True)
        return

    texts: List[str] = []
    metadatas: List[dict] = []
    
    # Walk through Markdown files
    for filename in os.listdir(kb_dir):
        if filename.endswith(".md"):
            filepath = os.path.join(kb_dir, filename)
            try:
                with open(filepath, "r", encoding="utf-8") as f:
                    content = f.read()
                    
                # Store full content or segment by sections
                texts.append(content)
                metadatas.append({
                    "source": filename,
                    "filepath": os.path.abspath(filepath)
                })
            except Exception as e:
                print(f"Failed to read {filename}: {e}")
                
    if texts:
        local_retriever.initialize_chromadb(texts, metadatas)
        print(f"Successfully ingested {len(texts)} document nodes into RAG vector repository.")
    else:
        print("Knowledge base directory contains no documents to ingest.")

if __name__ == "__main__":
    ingest_knowledge_files()
