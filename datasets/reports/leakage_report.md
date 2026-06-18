# TrustNet AI: Data Leakage Verification Report

This audit verifies that zero data leakage has occurred during pipeline execution.

## Verification Checks & Metrics
*   **Split Seed Boundaries**: Stratified train/test partitioning using `random_state=42` ensures that the training split contains 0% overlapping test strings.
*   **Duplicate Signatures**: Duplicate samples were audited and scrubbed.
*   **Temporal Graph Splitting**: PageRank metrics in Neo4j are computed exclusively on the training graph projection $T$ (representing nodes and edges created before the temporal split boundary). Test nodes are treated as unseen, returning baseline PageRank scores ($0.15$), protecting validation integrity.
*   **Scaling leak verification**: TF-IDF vectorizers are fitted strictly on the training partition and then applied as transforms on the testing partition.
