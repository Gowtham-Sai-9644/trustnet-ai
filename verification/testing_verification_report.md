# Testing Verification Report

This report presents the verified unit and integration test execution results and coverage statements for the TrustNet AI backend.

---

## 1. Pytest Execution Output
* **Command Executed**: `python -m pytest backend/tests/ --cov=backend/app --cov-report=term-missing`
* **Status**: **✓ SUCCESS**
* **Duration**: 0.66s
* **Test Summary**: 26 passed, 0 failed, 16 warnings

```
============================= test session starts =============================
platform win32 -- Python 3.11.5, pytest-9.1.0, pluggy-1.6.0
rootdir: E:\Scam Detection System
plugins: anyio-4.10.0, langsmith-0.8.16, cov-7.1.0
collected 26 items

backend\tests\test_analyze.py ...                                        [ 11%]
backend\tests\test_api.py .                                              [ 15%]
backend\tests\test_database.py ..                                        [ 23%]
backend\tests\test_graph.py ..                                           [ 30%]
backend\tests\test_ml.py .......                                         [ 57%]
backend\tests\test_rag.py ......                                         [ 80%]
backend\tests\test_reports.py ..                                         [ 88%]
backend\tests\test_research.py ...                                       [100%]

============================== warnings summary ===============================
backend\app\main.py:41
  E:\Scam Detection System\backend\app\main.py:41: DeprecationWarning: 
          on_event is deprecated, use lifespan event handlers instead.
  
          Read more about it in the
          [FastAPI docs for Lifespan Events](https://fastapi.tiangolo.com/advanced/events/).
          
    @app.on_event("startup")

C:\Users\n.gowtham sai\AppData\Local\Programs\Python\Python311\Lib\site-packages\fastapi\applications.py:4495
C:\Users\n.gowtham sai\AppData\Local\Programs\Python\Python311\Lib\site-packages\fastapi\applications.py:4495
  C:\Users\n.gowtham sai\AppData\Local\Programs\Python\Python311\Lib\site-packages\fastapi\applications.py:4495: DeprecationWarning: 
          on_event is deprecated, use lifespan event handlers instead.
  
          Read more about it in the
          [FastAPI docs for Lifespan Events](https://fastapi.tiangolo.com/advanced/events/).
          
    return self.router.on_event(event_type)

backend\app\main.py:53
  E:\Scam Detection System\backend\app\main.py:53: DeprecationWarning: 
          on_event is deprecated, use lifespan event handlers instead.
  
          Read more about it in the
          [FastAPI docs for Lifespan Events](https://fastapi.tiangolo.com/advanced/events/).
          
    @app.on_event("shutdown")

backend/tests/test_analyze.py: 3 warnings
backend/tests/test_api.py: 1 warning
backend/tests/test_graph.py: 1 warning
backend/tests/test_rag.py: 2 warnings
backend/tests/test_reports.py: 2 warnings
backend/tests/test_research.py: 3 warnings
  C:\Users\n.gowtham sai\AppData\Local\Programs\Python\Python311\Lib\site-packages\httpx\_client.py:680: DeprecationWarning: The 'app' shortcut is now deprecated. Use the explicit style 'transport=WSGITransport(app=...)' instead.
    warnings.warn(message, DeprecationWarning)

-- Docs: https://docs.pytest.org/en/stable/how-to/capture-warnings.html
=============================== tests coverage ================================
_______________ coverage: platform win32, python 3.11.5-final-0 _______________

Name                                              Stmts   Miss  Cover   Missing
-------------------------------------------------------------------------------
backend\app\api\router.py                             4      0   100%
backend\app\api\v1\endpoints\__init__.py              0      0   100%
backend\app\api\v1\endpoints\analyze.py              52      4    92%   98-102
backend\app\api\v1\endpoints\rag.py                  30      1    97%   32
backend\app\api\v1\endpoints\reports.py              26      0   100%
backend\app\api\v1\endpoints\research.py             60      8    87%   20, 25-26, 100-101, 115-117
backend\app\api\v1\router.py                          7      0   100%
backend\app\core\config.py                           17      0   100%
backend\app\core\database.py                         16      0   100%
backend\app\core\logging_setup.py                    18      0   100%
backend\app\main.py                                  35      3    91%   25-27
backend\app\schemas\analyze_schema.py                35      0   100%
backend\app\schemas\experiment_schema.py             14      0   100%
backend\app\schemas\graph_schema.py                  12      0   100%
backend\app\schemas\report_schema.py                 14      0   100%
backend\app\services\explain_service.py              35      0   100%
backend\app\services\graph_service.py                29      0   100%
backend\app\services\ml_service.py                   44      0   100%
backend\app\services\rag\embedder.py                 59     17    71%   17, 31-33, 37-43, 56-63
backend\app\services\rag\knowledge_ingestion.py      26      7    73%   7-9, 28-29, 35, 38
backend\app\services\rag\prompt_builder.py           46      0   100%
backend\app\services\rag\rag_service.py              49      1    98%   18
backend\app\services\rag\retriever.py                70     20    71%   26-27, 39-40, 56-57, 63-71, 74-84
-------------------------------------------------------------------------------
TOTAL                                               698     61    91%
======================= 26 passed, 16 warnings in 0.66s =======================
```

---

## 2. Coverage Summary
* **Total Statements**: 698
* **Missed Statements**: 61
* **Coverage Ratio**: **91%** (Exceeds B.Tech and IEEE evaluation bar of 90%)
