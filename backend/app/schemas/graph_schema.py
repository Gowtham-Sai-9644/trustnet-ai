from pydantic import BaseModel
from typing import List, Dict, Any

class RelationshipDetail(BaseModel):
    type: str
    target_node: str
    target_label: str

class EntityDetailsResponse(BaseModel):
    entity: str
    label: str
    pagerank: float
    degree_centrality: int
    relationships: List[RelationshipDetail]
