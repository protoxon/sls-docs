# Server management

Routes under **`/api/servers/:server`** operate on a **single** server instance. `:server` is the server **id** returned by `POST /api/servers` or `GET /api/servers`.

All routes require **`Authorization: Bearer <app_admin_key>`** with **`AppAdmin`** scope. If the id is unknown, Protocube responds with **404**.

S4J: obtain a [`ClientServer`](https://github.com/jessefaler/SLS/blob/main/S4J/src/main/java/com/protoxon/S4J/client/entities/ClientServer.java) with `client.getServer("srv_...").execute()` (or use the instance returned from `createServer()`), then call the methods below. See the [API overview](./index#s4j-java-client) for `SLSClient` setup.

---

## `GET /api/servers/:server` — Get server details

**Example**

::: code-group

```http [HTTP]
GET /api/servers/srv_01HZ... HTTP/1.1
Authorization: Bearer sls_live_...
```

```java [S4J]
import com.protoxon.S4J.client.entities.ClientServer;

ClientServer srv = client.getServer("srv_01HZ...").execute();
```

:::

**Response** `200 OK`:

```json
{
  "id": "srv_01HZ...",
  "blueprint_id": "survival_lobby",
  "node_name": "node-us-east",
  "node_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "allocations": {
    "force_outgoing_ip": false,
    "default": { "ip": "203.0.113.10", "port": 25565 },
    "alias": "",
    "mappings": { "203.0.113.10": [25565] }
  },
  "overrides": null
}
```

---

## `DELETE /api/servers/:server` — Delete a server

Protocube asks the node to remove the instance; errors may come back as JSON from the remote client.

| Query parameter | Type | Description |
| --- | --- | --- |
| `force` | string | If `true`, Protocube still removes the local record even when remote delete fails |

**Example**

::: code-group

```http [HTTP]
DELETE /api/servers/srv_01HZ... HTTP/1.1
Authorization: Bearer sls_live_...
```

```java [S4J]
ClientServer srv = client.getServer("srv_01HZ...").execute();
srv.delete().execute();
// srv.delete(true).execute(); // force=true
```

:::

Append `?force=true` to the URL for the same behavior as `delete(true)` in S4J.

**Response** `200 OK` with empty body on success.

---

## `GET /api/servers/:server/logs` — Get console logs

Recent lines from the daemon (ANSI stripped).

| Query parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | integer | `100` | Number of lines (clamped to **100** max, minimum effective **1**) |

**Example**

::: code-group

```http [HTTP]
GET /api/servers/srv_01HZ.../logs?size=50 HTTP/1.1
Authorization: Bearer sls_live_...
```

```java [S4J]
import java.util.List;

ClientServer srv = client.getServer("srv_01HZ...").execute();
List<String> lines = srv.getLogs(50).execute();
```

:::

**Response** `200 OK`:

```json
{
  "data": [
    "[12:00:00 INFO] Done (2.5s)! For help, type \"help\"",
    "[12:00:01 INFO] Server running"
  ]
}
```

---

## `POST /api/servers/:server/power` — Power control (start, stop, …)

**Request body** — JSON:

| Field | Type | Description |
| --- | --- | --- |
| `action` | string | One of: `start`, `stop`, `restart`, `kill`, `pause`, `unpause` (validated on the node) |
| `wait_seconds` | integer | Optional wait hint forwarded to the node |

**Example**

::: code-group

```http [HTTP]
POST /api/servers/srv_01HZ.../power HTTP/1.1
Authorization: Bearer sls_live_...
Content-Type: application/json

{
  "action": "start",
  "wait_seconds": 0
}
```

```java [S4J]
import com.protoxon.S4J.PowerAction;

ClientServer srv = client.getServer("srv_01HZ...").execute();
srv.setPower(PowerAction.START).execute();
// or: srv.start().execute();
```

:::

S4J’s `setPower` currently sends **`action` only** (lowercase enum name); use raw HTTP if you need `wait_seconds`.

**Response** `200 OK` with an empty body when Protocube successfully forwards the action to the node (the node still runs the power transition asynchronously).

---

## `GET /api/servers/:server/status` — Runtime status string

**Example**

::: code-group

```http [HTTP]
GET /api/servers/srv_01HZ.../status HTTP/1.1
Authorization: Bearer sls_live_...
```

```java [S4J]
import com.protoxon.S4J.ServerStatus;

ClientServer srv = client.getServer("srv_01HZ...").execute();
ServerStatus st = srv.getStatus().execute();
```

:::

**Response** `200 OK`:

```json
{
  "status": "running"
}
```

Exact strings depend on the daemon / environment state machine.

---

## `GET /api/servers/:server/stats` — CPU, memory, disk, network usage

| Query parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `update_disk_usage` | string | — | If `true`, asks the node to refresh disk usage before responding |

**Example**

::: code-group

```http [HTTP]
GET /api/servers/srv_01HZ.../stats?update_disk_usage=true HTTP/1.1
Authorization: Bearer sls_live_...
```

```java [S4J]
import com.protoxon.S4J.ServerStats;

ClientServer srv = client.getServer("srv_01HZ...").execute();
ServerStats stats = srv.getStats(true).execute();
```

:::

**Response** `200 OK` (illustrative):

```json
{
  "memory_bytes": 2147483648,
  "memory_limit_bytes": 4294967296,
  "cpu_absolute": 0.42,
  "cpu_absolute_limit": 2.0,
  "network": { "rx_bytes": 1024000, "tx_bytes": 512000 },
  "uptime": 3600000,
  "state": "running",
  "disk_bytes": 1073741824,
  "disk_max": 5368709120,
  "overlay_bytes": 805306368
}
```

Field names follow `models.ResourceUsage` and embedded `environment.Stats`.

---

## `POST /api/servers/:server/commands` — Send console commands

**Request body**:

```json
{
  "commands": ["say Hello", "list"]
}
```

**Example**

::: code-group

```http [HTTP]
POST /api/servers/srv_01HZ.../commands HTTP/1.1
Authorization: Bearer sls_live_...
Content-Type: application/json

{
  "commands": ["say Server is back online"]
}
```

```java [S4J]
ClientServer srv = client.getServer("srv_01HZ...").execute();
srv.sendCommands("say Server is back online").execute();
```

:::

**Response** `204 No Content` on success.

---

## `POST /api/servers/:server/reset` — Reset server instance

**Example**

::: code-group

```http [HTTP]
POST /api/servers/srv_01HZ.../reset HTTP/1.1
Authorization: Bearer sls_live_...
```

```java [S4J]
ClientServer srv = client.getServer("srv_01HZ...").execute();
srv.reset().execute();
```

:::

**Response** `202 Accepted` with empty body on success.

---

## `GET /api/servers/:server/install` — Get blueprint install script

Returns `entrypoint`, `script`, and `skip_scripts` from the server’s software definition.

**Example**

::: code-group

```http [HTTP]
GET /api/servers/srv_01HZ.../install HTTP/1.1
Authorization: Bearer sls_live_...
```

```java [S4J]
// Not exposed on ClientServer in S4J today — call the HTTP API directly.
```

:::

**Response** `200 OK`:

```json
{
  "entrypoint": "/bin/bash",
  "script": "#!/bin/bash\necho installing...\n",
  "skip_scripts": false
}
```

Returns **404** if the blueprint or software definition is missing.
