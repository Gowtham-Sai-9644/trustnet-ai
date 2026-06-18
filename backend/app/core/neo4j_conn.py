from typing import Any, Dict, List, Optional
from neo4j import AsyncGraphDatabase, AsyncDriver
from backend.app.core.config import settings

class Neo4jConnectionManager:
    def __init__(self):
        self._driver: Optional[AsyncDriver] = None

    def connect(self):
        if not self._driver:
            self._driver = AsyncGraphDatabase.driver(
                settings.NEO4J_URI,
                auth=(settings.NEO4J_USER, settings.NEO4J_PASSWORD)
            )

    async def close(self):
        if self._driver:
            await self._driver.close()
            self._driver = None

    def get_driver(self) -> AsyncDriver:
        if not self._driver:
            self.connect()
        return self._driver

    async def execute_query(self, query: str, parameters: Optional[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
        try:
            driver = self.get_driver()
            parameters = parameters or {}
            async with driver.session() as session:
                result = await session.run(query, parameters)
                records = await result.data()
                return records
        except Exception as err:
            import logging
            logging.getLogger("uvicorn.error").warning(f"Neo4j database query failed: {err}. Returning fallback values.")
            return []

    async def check_health(self) -> bool:
        try:
            import asyncio
            driver = self.get_driver()
            async with driver.session() as session:
                result = await asyncio.wait_for(session.run("RETURN 1"), timeout=2.0)
                await result.data()
                return True
        except Exception:
            return False

neo4j_client = Neo4jConnectionManager()

# FastAPI Dependency
async def get_neo4j() -> AsyncDriver:
    return neo4j_client.get_driver()
