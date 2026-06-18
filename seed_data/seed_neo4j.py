import os
import sys
# Resolve absolute root directory and insert into sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../")))

import asyncio
from backend.app.core.neo4j_conn import neo4j_client
from backend.app.services.graph_service import graph_service
import random
import uuid

async def seed_neo4j_graph():
    print("Connecting to Neo4j to seed graph database...")
    neo4j_client.connect()
    
    # Check if database has nodes
    check_query = "MATCH (n) RETURN count(n) AS node_count"
    try:
        records = await neo4j_client.execute_query(check_query)
        if records and records[0]["node_count"] > 0:
            print(f"Neo4j already contains {records[0]['node_count']} nodes. Skipping seeding.")
            await neo4j_client.close()
            return
    except Exception as e:
        print(f"Could not connect to Neo4j database: {e}. Ensure container is active.")
        return

    print("Seeding 500 Phone nodes, 300 UPI nodes, and relationships...")
    categories = [
        "Fake Job Scam", "Fake KYC Scam", "Lottery Scam", 
        "Marketplace Scam", "Investment Scam", "Advance Payment Scam"
    ]
    
    # 1. Create Reports
    report_ids = [str(uuid.uuid4()) for _ in range(50)]
    for rid in report_ids:
        await graph_service.create_entity_node("Report", rid, {
            "loss_amount": float(random.randint(1000, 50000)),
            "scam_category": random.choice(categories),
            "timestamp": "2026-06-17T22:00:00Z"
        })
        
    # 2. Create Phone and UPI nodes
    phones = [f"+9198000{random.randint(10000, 99999)}" for _ in range(150)]
    upis = [f"merchant-scam-address-{random.randint(10, 99)}@ybl" for _ in range(100)]
    urls = [f"phishing-domain-lure-{random.randint(100, 999)}.net" for _ in range(50)]
    
    # Write nodes
    for phone in phones:
        await graph_service.create_entity_node("Phone", phone, {"phone_number": phone, "pagerank": random.uniform(0.15, 0.85)})
    for upi in upis:
        await graph_service.create_entity_node("UPI", upi, {"upi_id": upi, "pagerank": random.uniform(0.15, 0.85)})
    for url in urls:
        await graph_service.create_entity_node("Website", url, {"url": url, "domain_age_days": random.randint(1, 120)})
        
    # 3. Create Edges
    # Relate Phone -> UPI
    for i in range(len(phones)):
        phone = phones[i]
        upi = random.choice(upis)
        await graph_service.create_relationship("Phone", phone, "UPI", upi, "USES")
        
    # Relate UPI -> Website
    for i in range(len(upis)):
        upi = upis[i]
        url = random.choice(urls)
        await graph_service.create_relationship("Website", url, "UPI", upi, "LINKS_TO")
        
    # Relate Phone, UPI, URL to Reports
    for rid in report_ids:
        phone = random.choice(phones)
        upi = random.choice(upis)
        url = random.choice(urls)
        await graph_service.create_relationship("Phone", phone, "Report", rid, "REPORTED_AS")
        await graph_service.create_relationship("UPI", upi, "Report", rid, "REPORTED_AS")
        await graph_service.create_relationship("Website", url, "Report", rid, "REPORTED_AS")
        
    print("Neo4j database seeding successfully completed.")
    await neo4j_client.close()

if __name__ == "__main__":
    asyncio.run(seed_neo4j_graph())
