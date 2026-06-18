import pytest
from unittest.mock import AsyncMock, MagicMock, patch
from backend.app.core.database import get_db

@pytest.mark.anyio
async def test_get_db_lifecycle_success():
    mock_session = AsyncMock()
    
    # We want async_session_maker() to return a context manager mock
    mock_context = MagicMock()
    mock_context.__aenter__ = AsyncMock(return_value=mock_session)
    mock_context.__aexit__ = AsyncMock(return_value=False)
    
    with patch("backend.app.core.database.async_session_maker", return_value=mock_context):
        db_gen = get_db()
        session = await anext(db_gen)
        assert session == mock_session
        
        try:
            await anext(db_gen)
        except StopAsyncIteration:
            pass
            
        assert mock_session.commit.called
        assert mock_session.close.called

@pytest.mark.anyio
async def test_get_db_lifecycle_exception():
    mock_session = AsyncMock()
    
    mock_context = MagicMock()
    mock_context.__aenter__ = AsyncMock(return_value=mock_session)
    # Return False to avoid suppressing the raised exception in the generator block
    mock_context.__aexit__ = AsyncMock(return_value=False)
    
    with patch("backend.app.core.database.async_session_maker", return_value=mock_context):
        db_gen = get_db()
        session = await anext(db_gen)
        assert session == mock_session
        
        # Throw ValueError into generator
        with pytest.raises(ValueError, match="Test Database Error"):
            await db_gen.athrow(ValueError("Test Database Error"))
            
        assert mock_session.rollback.called
        assert mock_session.close.called
