from typing import Any, Dict, List
from app.core.neo4j_conn import neo4j_client

class GraphService:
    async def create_entity_node(self, label: str, entity_id: str, properties: Dict[str, Any]) -> None:
        """
        Creates or updates a node of type Phone, UPI, Website, or Seller.
        """
        id_property_map = {
            "Phone": "phone_number",
            "UPI": "upi_id",
            "Website": "url",
            "Seller": "seller_id",
            "Report": "report_id"
        }
        id_key = id_property_map.get(label, "id")
        
        query = f"""
        MERGE (n:{label} {{{id_key}: $entity_id}})
        SET n += $properties
        """
        await neo4j_client.execute_query(query, {
            "entity_id": entity_id,
            "properties": properties
        })

    async def create_relationship(self, source_label: str, source_id: str, 
                                  target_label: str, target_id: str, 
                                  rel_type: str) -> None:
        """
        Establishes an edge between two nodes.
        """
        id_property_map = {
            "Phone": "phone_number",
            "UPI": "upi_id",
            "Website": "url",
            "Seller": "seller_id",
            "Report": "report_id"
        }
        src_key = id_property_map.get(source_label, "id")
        tgt_key = id_property_map.get(target_label, "id")
        
        query = f"""
        MATCH (a:{source_label} {{{src_key}: $source_id}})
        MATCH (b:{target_label} {{{tgt_key}: $target_id}})
        MERGE (a)-[r:{rel_type}]->(b)
        """
        await neo4j_client.execute_query(query, {
            "source_id": source_id,
            "target_id": target_id
        })

    async def lookup_entity(self, label: str, entity_id: str) -> List[Dict[str, Any]]:
        id_property_map = {
            "Phone": "phone_number",
            "UPI": "upi_id",
            "Website": "url",
            "Seller": "seller_id",
            "Report": "report_id"
        }
        id_key = id_property_map.get(label, "id")
        
        query = f"""
        MATCH (n:{label} {{{id_key}: $entity_id}})
        RETURN n
        """
        return await neo4j_client.execute_query(query, {"entity_id": entity_id})

    async def fetch_centrality_metrics(self, upi_id: str) -> Dict[str, Any]:
        """
        Queries graph centrality metrics, degree, and PageRank features for the meta-fusion engine.
        """
        query = """
        MATCH (u:UPI {upi_id: $upi_id})
        OPTIONAL MATCH (u)-[r]-()
        WITH u, count(r) AS degree
        OPTIONAL MATCH (u)-[*1..2]-(rep:Report)
        RETURN 
            coalesce(u.pagerank, 0.15) AS pagerank, 
            degree AS degree_centrality, 
            count(rep) AS nearby_reports_count
        """
        records = await neo4j_client.execute_query(query, {"upi_id": upi_id})
        if records:
            return records[0]
        return {"pagerank": 0.15, "degree_centrality": 0, "nearby_reports_count": 0}

    async def fetch_neighborhood(self, entity_id: str) -> List[Dict[str, Any]]:
        """
        Retrieves neighbors of a target node for frontend graph rendering.
        """
        query = """
        MATCH (n) WHERE n.upi_id = $entity_id OR n.phone_number = $entity_id OR n.url = $entity_id
        MATCH (n)-[r]-(m)
        RETURN n, r, m LIMIT 30
        """
        return await neo4j_client.execute_query(query, {"entity_id": entity_id})

graph_service = GraphService()
