import pytest
from unittest.mock import AsyncMock, MagicMock
import sys
import os

# Resolve paths
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../../")))

# Mock neo4j_client and seeding functions BEFORE importing app to prevent real network connections during startup/tests
mock_neo4j = MagicMock()
mock_neo4j.connect = MagicMock()
mock_neo4j.close = AsyncMock()
mock_neo4j.execute_query = AsyncMock(return_value=[
    {
        "pagerank": 0.25,
        "degree_centrality": 2,
        "nearby_reports_count": 1
    }
])
mock_driver = MagicMock()
mock_neo4j.get_driver = MagicMock(return_value=mock_driver)

# Mock langchain_community embeddings to force offline TF-IDF fallback in tests
mock_embeddings_module = MagicMock()
def raise_offline_error(*args, **kwargs):
    raise ImportError("Offline test mode: HuggingFaceEmbeddings disabled")
mock_embeddings_module.HuggingFaceEmbeddings = raise_offline_error
sys.modules["langchain_community.embeddings"] = mock_embeddings_module

# Mock langchain_community.vectorstores to force persistent JSON fallback in tests
mock_vectorstores_module = MagicMock()
def raise_vectorstores_error(*args, **kwargs):
    raise ImportError("Offline test mode: Chroma vector store disabled")
mock_vectorstores_module.Chroma = raise_vectorstores_error
sys.modules["langchain_community.vectorstores"] = mock_vectorstores_module

# Patch the modules
sys.modules["backend.app.core.neo4j_conn"] = MagicMock(
    neo4j_client=mock_neo4j,
    get_neo4j=AsyncMock(return_value=mock_driver)
)

sys.modules["seed_data.seed_postgres"] = MagicMock(
    seed_postgres_db=AsyncMock()
)

sys.modules["seed_data.seed_neo4j"] = MagicMock(
    seed_neo4j_graph=AsyncMock()
)

from backend.app.main import app
from backend.app.core.database import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.testclient import TestClient

@pytest.fixture(scope="session")
def anyio_backend():
    return "asyncio"

@pytest.fixture
def mock_db() -> AsyncMock:
    """
    Mock SQLAlchemy database session fixture.
    """
    session = AsyncMock(spec=AsyncSession)
    session.commit = AsyncMock()
    session.rollback = AsyncMock()
    session.close = AsyncMock()
    return session

@pytest.fixture
def client(mock_db) -> TestClient:
    """
    FastAPI TestClient fixture overriding DB dependencies.
    """
    def _get_db_override():
        yield mock_db
        
    app.dependency_overrides[get_db] = _get_db_override
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()
