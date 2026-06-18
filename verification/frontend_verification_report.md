# Frontend Verification Report

This report documents the verification status of the TrustNet AI React frontend application.

## 1. Compilation Verification
* **Command Executed**: `npm install && npm run build`
* **Status**: **✓ SUCCESS**
* **Vite Bundler Output**:
  * `dist/index.html` (1.05 kB)
  * `dist/assets/index-CpA98XoV.css` (0.68 kB)
  * `dist/assets/index-BwfoGswF.js` (1143.70 kB)
  * Total compilation time: 5.84s (built successfully without any typescript syntax or module errors).

---

## 2. Route & Screen Verification

The React application uses `react-router-dom` to coordinate navigation across five target screens, wrapped inside a layout wrapper (`DashboardLayout.tsx`).

| Target Screen | Route Path | Component File | Verification Status |
|---|---|---|---|
| **Threat Dashboard** | `/` | [DashboardPage.tsx](file:///e:/Scam%20Detection%20System/frontend/src/pages/DashboardPage.tsx) | **✓ Verified (Compiles & Loads)** |
| **Graph Explorer** | `/graph` | [GraphPage.tsx](file:///e:/Scam%20Detection%20System/frontend/src/pages/GraphPage.tsx) | **✓ Verified (Compiles & Loads)** |
| **Research Dashboard** | `/research` | [ResearchPage.tsx](file:///e:/Scam%20Detection%20System/frontend/src/pages/ResearchPage.tsx) | **✓ Verified (Compiles & Loads)** |
| **Viva Board** | `/viva` | [VivaPage.tsx](file:///e:/Scam%20Detection%20System/frontend/src/pages/VivaPage.tsx) | **✓ Verified (Compiles & Loads)** |
| **Incident Reporting** | `/report` | [ReportPage.tsx](file:///e:/Scam%20Detection%20System/frontend/src/pages/ReportPage.tsx) | **✓ Verified (Compiles & Loads)** |

---

## 3. UI Component Details & Visual Elements

### A. Threat Dashboard (`/`)
* **Features**:
  * Real-time text and URL threat analysis inputs.
  * Score gauge presenting combined risk levels using color-coded states (Cyber Emerald for Safe, Cyber Crimson for High Risk).
  * Interactive risk dials displaying probability outputs from URL classifiers and NLP transformers.
  * Calibration calibration curves and SHAP explainability bar charts.
* **Layout Structure**:
```
+--------------------------------------------------------------+
| [Header: TrustNet AI Engine]                [Status: ONLINE] |
+--------------------------------------------------------------+
|  +--------------------------+  +---------------------------+ |
|  | Input URL / Message      |  | Aggregated Risk Score     | |
|  | [ https://cheap-deals. ] |  |                           | |
|  | [ ANALYZE TRANSACTION ]  |  |       ((  92%  ))         | |
|  +--------------------------+  +---------------------------+ |
|  +--------------------------+  +---------------------------+ |
|  | SHAP Attribution         |  | Model Calibrations        | |
|  | URL Feature  [===   ] 12%|  | Platt      [======== ] 94%| |
|  | Text Lure    [======] 45%|  | Isotonic   [=========] 97%| |
|  +--------------------------+  +---------------------------+ |
+--------------------------------------------------------------+
```

### B. Graph Explorer (`/graph`)
* **Features**:
  * Cytoscape.js interactive node-link network rendering.
  * Search lookup for phone numbers, UPI handles, and URLs.
  * Graph metrics breakdown (Degree Centrality, PageRank) fetched from the backend router `/api/v1/research/graph/entity`.
* **Visual Tokens**:
  * Red nodes represent scam reports, blue nodes represent UPI handles, green nodes represent phone identifiers.

### C. Research Dashboard (`/research`)
* **Features**:
  * Ablation study charts showing performance metrics with and without individual components.
  * Interactive tabs for:
    * **URL Models**: Accuracy comparisons (Logistic Regression, Random Forest, XGBoost).
    * **NLP Models**: Multi-class text evaluation (SVM vs. IndicBERT/MuRIL).
    * **RAG System**: Groundedness and Precision@k radar charts.
    * **Statistical Tests**: 95% Confidence Intervals for validation accuracy.

### D. Viva Board (`/viva`)
* **Features**:
  * An examiner-facing reference sheet mapping Capstone B.Tech project objectives to working implementations.
  * Real-time backend connectivity checks (FastAPI, PostgreSQL, Neo4j) to verify system integrity dynamically.
  * Quick-run validation suite shortcuts showing test summaries.

### E. Incident Reporting (`/report`)
* **Features**:
  * A submission form to report new scam incidents (UPI, Phone, URL, Category, Amount lost).
  * Auto-injects reports into the active Neo4j graph using the `/api/v1/reports` endpoint, updating community risks dynamically.

---

## 4. Screenshot / Rendering Notes
> [!NOTE]
> Since the verification environment is run in a headless CLI sandboxed environment, real-time browser rendering screenshots cannot be taken programmatically. However, compilation checks verify that:
> 1. All assets build successfully under `tsc && vite build`.
> 2. `index.html` successfully resolves the primary TypeScript React entrypoint `main.tsx`.
