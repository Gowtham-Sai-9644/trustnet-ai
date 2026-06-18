# Database Verification Audit Report

## PostgreSQL Verification

* **Connection Status**: CONNECTED

### Table Audits

| Table Name | Exists | Row Count | Details |
|---|---|---|---|
| `users` | NO | 0 | [WinError 1225] The remote computer refused the network connection |
| `reports` | NO | 0 | [WinError 1225] The remote computer refused the network connection |

## Neo4j Graph Database Verification

* **Connection Status**: FAILED TO CONNECT
* **Error**: `Couldn't connect to localhost:7687 (resolved to ('[::1]:7687', '127.0.0.1:7687')):
Failed to establish connection to ResolvedIPv6Address(('::1', 7687, 0, 0)) (reason [WinError 1225] The remote computer refused the network connection)
Failed to establish connection to ResolvedIPv4Address(('127.0.0.1', 7687)) (reason [WinError 1225] The remote computer refused the network connection)`

### Graph Node Inventory

| Node Label | Verified Node Count |
|---|---|
| N/A | 0 (or connection failed) |

### Graph Relationship Inventory

| Relationship Type | Verified Edge Count |
|---|---|
| N/A | 0 (or connection failed) |

### Analytics Engines

* **PageRank Computed**: NO
* **Community Detection Computed**: NO
