import asyncio
import os
import sys
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import text
from neo4j import AsyncGraphDatabase

# Resolve paths
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))
from backend.app.core.config import settings

async def verify_postgres():
    print("Checking PostgreSQL...")
    engine = create_async_engine(settings.DATABASE_URL, echo=False)
    async_session = sessionmaker(
        bind=engine, class_=AsyncSession, expire_on_commit=False
    )
    
    status = "CONNECTED"
    tables = {}
    error_msg = "None"
    
    try:
        async with async_session() as session:
            # Check tables
            # We check the count of rows in each table
            for table in ["users", "reports"]:
                try:
                    res = await session.execute(text(f"SELECT COUNT(*) FROM {table}"))
                    count = res.scalar()
                    tables[table] = {"exists": "YES", "rows": count}
                except Exception as e:
                    tables[table] = {"exists": "NO", "rows": 0, "error": str(e)}
    except Exception as e:
        status = "FAILED TO CONNECT"
        error_msg = str(e)
        
    return status, tables, error_msg

async def verify_neo4j():
    print("Checking Neo4j...")
    status = "CONNECTED"
    nodes = {}
    edges = {}
    pagerank_active = "NO"
    community_active = "NO"
    error_msg = "None"
    
    try:
        driver = AsyncGraphDatabase.driver(
            settings.NEO4J_URI,
            auth=(settings.NEO4J_USER, settings.NEO4J_PASSWORD)
        )
        async with driver.session() as session:
            # Query nodes count
            result = await session.run("MATCH (n) RETURN labels(n) AS label, count(n) AS count")
            records = await result.data()
            for r in records:
                label_name = r["label"][0] if r["label"] else "Unknown"
                nodes[label_name] = r["count"]
                
            # Query edges count
            result = await session.run("MATCH ()-[r]->() RETURN type(r) AS type, count(r) AS count")
            records = await result.data()
            for r in records:
                edges[r["type"]] = r["count"]
                
            # Query PageRank exists
            result = await session.run("MATCH (n) WHERE exists(n.pagerank) RETURN count(n) AS count")
            records = await result.data()
            if records and records[0]["count"] > 0:
                pagerank_active = f"YES ({records[0]['count']} nodes decorated)"
                
            # Query Community exists
            result = await session.run("MATCH (n) WHERE exists(n.community) OR exists(n.community_id) RETURN count(n) AS count")
            records = await result.data()
            if records and records[0]["count"] > 0:
                community_active = f"YES ({records[0]['count']} nodes decorated)"
                
        await driver.close()
    except Exception as e:
        status = "FAILED TO CONNECT"
        error_msg = str(e)
        
    return status, nodes, edges, pagerank_active, community_active, error_msg

async def main():
    pg_status, pg_tables, pg_err = await verify_postgres()
    neo_status, neo_nodes, neo_edges, neo_pr, neo_comm, neo_err = await verify_neo4j()
    
    os.makedirs("verification", exist_ok=True)
    with open("verification/database_verification_report.md", "w", encoding="utf-8") as f:
        f.write("# Database Verification Audit Report\n\n")
        
        f.write("## PostgreSQL Verification\n\n")
        f.write(f"* **Connection Status**: {pg_status}\n")
        if pg_err != "None":
            f.write(f"* **Error**: `{pg_err}`\n")
        f.write("\n### Table Audits\n\n")
        f.write("| Table Name | Exists | Row Count | Details |\n")
        f.write("|---|---|---|---|\n")
        for name, details in pg_tables.items():
            err_str = details.get("error", "None")
            f.write(f"| `{name}` | {details['exists']} | {details['rows']} | {err_str} |\n")
            
        f.write("\n## Neo4j Graph Database Verification\n\n")
        f.write(f"* **Connection Status**: {neo_status}\n")
        if neo_err != "None":
            f.write(f"* **Error**: `{neo_err}`\n")
            
        f.write("\n### Graph Node Inventory\n\n")
        f.write("| Node Label | Verified Node Count |\n")
        f.write("|---|---|\n")
        if neo_nodes:
            for label, count in neo_nodes.items():
                f.write(f"| `{label}` | {count} |\n")
        else:
            f.write("| N/A | 0 (or connection failed) |\n")
            
        f.write("\n### Graph Relationship Inventory\n\n")
        f.write("| Relationship Type | Verified Edge Count |\n")
        f.write("|---|---|\n")
        if neo_edges:
            for type_name, count in neo_edges.items():
                f.write(f"| `{type_name}` | {count} |\n")
        else:
            f.write("| N/A | 0 (or connection failed) |\n")
            
        f.write("\n### Analytics Engines\n\n")
        f.write(f"* **PageRank Computed**: {neo_pr}\n")
        f.write(f"* **Community Detection Computed**: {neo_comm}\n")
        
    print("Generated database_verification_report.md successfully")

if __name__ == "__main__":
    asyncio.run(main())
