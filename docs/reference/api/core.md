# Core application endpoints

All routes in this page require **`Authorization: Bearer <app_admin_key>`** with **`AppAdmin`** scope. Paths are prefixed with `/api`.

S4J examples use [`SLSBuilder.createClient`](https://github.com/jessefaler/SLS/blob/main/S4J/src/main/java/com/protoxon/S4J/SLSBuilder.java): pass the Protocube **origin only** (no `/api` suffix); the client adds `/api/` to each request. See the [API overview](./index#s4j-java-client) for a full setup snippet.

---

## `GET /api/nodes` — List nodes (JSON)

| Query parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `ids_only` | string | — | If `true`, response is a JSON array of node id strings only. |

**Example**

::: code-group

```http [HTTP]
GET /api/nodes HTTP/1.1
Host: protocube.example.com
Authorization: Bearer sls_live_...
```

```java [S4J]
import com.protoxon.S4J.client.entities.ClientNode;
import java.util.List;

List<ClientNode> nodes = client.getAllNodes().execute();
// List<String> idsOnly = client.getAllNodeIds().execute();
```

:::

**Response** `200 OK` — array of node objects:

```json
[
  {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "name": "node-us-east",
    "location": "us-east",
    "url": "https://daemon.example.com:5585",
    "drained": false
  }
]
```

**Response** with `?ids_only=true`:

```json
["a1b2c3d4-e5f6-7890-abcd-ef1234567890"]
```

---

## `GET /api/system` — Host and Protocube version info

**Example**

::: code-group

```http [HTTP]
GET /api/system HTTP/1.1
Authorization: Bearer sls_live_...
```

```java [S4J]
import com.protoxon.S4J.entities.SystemInformation;

SystemInformation info = client.getSystemInformation().execute();
String protocubeVersion = info.getVersion();
```

:::

**Response** `200 OK`:

```json
{
  "version": "1.2.3",
  "system": {
    "architecture": "amd64",
    "cpu_threads": 8,
    "memory_bytes": 33554432000,
    "kernel_version": "6.x.x",
    "os": "Ubuntu 24.04 LTS",
    "os_type": "linux"
  }
}
```

---

## `GET /api/servers` — List all servers

| Query parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `ids_only` | string | — | If `true`, response is a JSON array of server id strings only. |

**Example**

::: code-group

```http [HTTP]
GET /api/servers HTTP/1.1
Authorization: Bearer sls_live_...
```

```java [S4J]
import com.protoxon.S4J.client.entities.ClientServer;
import java.util.List;

List<ClientServer> servers = client.getAllServers().execute();
// List<String> idsOnly = client.getAllServerIds().execute();
```

:::

**Response** `200 OK` — array of [server summaries](#server-object) (same shape as `GET /api/servers/:server`).

```json
[
  {
    "id": "srv_01HZ...",
    "blueprint_id": "survival_lobby",
    "node_name": "node-us-east",
    "node_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "allocations": {
      "force_outgoing_ip": false,
      "default": { "ip": "203.0.113.10", "port": 25565 },
      "alias": "",
      "mappings": { "203.0.113.10": [25565, 25566] }
    }
  }
]
```

With `?ids_only=true`:

```json
["srv_01HZ..."]
```

### Server object

| Field | Type | Description |
| --- | --- | --- |
| `id` | string | Server instance id |
| `blueprint_id` | string | Blueprint used to create the server |
| `node_name` | string | Display name of the assigned node |
| `node_id` | string | Id of the assigned node |
| `allocations` | object | IP/port mappings (`default`, `mappings`, `force_outgoing_ip`, `alias`) |
| `overrides` | object? | Creation-time overrides when present |

---

## `POST /api/servers` — Create a server

Protocube picks a node via the load balancer unless you pass `node_id`.

**Request body** — JSON:

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `blueprint_id` | string | yes | Id of an existing blueprint |
| `node_id` | string | no | Force placement on this node |
| `overrides` | object | no | Optional `save`, `limits`, `configs`, `software`, `version`, `image` |

**Example**

::: code-group

```http [HTTP]
POST /api/servers HTTP/1.1
Authorization: Bearer sls_live_...
Content-Type: application/json

{
  "blueprint_id": "survival_lobby",
  "node_id": "",
  "overrides": {
    "limits": { "memory_limit": 4096 }
  }
}
```

```java [S4J]
import com.protoxon.S4J.client.actions.ServerCreationAction;
import com.protoxon.S4J.client.entities.ClientServer;

ServerCreationAction req = client.createServer()
    .setBlueprintId("survival_lobby")
    .setMemoryLimit(4096L);

ClientServer server = req.execute();
String id = server.getId();
```

:::

**Response** `202 Accepted` — created server summary (same fields as [server object](#server-object)).

```json
{
  "id": "srv_01HZ...",
  "blueprint_id": "survival_lobby",
  "node_name": "node-us-east",
  "node_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "allocations": { ... },
  "overrides": { "limits": { "memory_limit": 4096 } }
}
```

Common errors: `404` unknown blueprint or node, `503` no nodes available, `422` invalid JSON body.

---

## `GET /api/blueprints` — List blueprints (paginated)

| Query parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `page` | integer | `1` | Page number (≥ 1) |
| `limit` | integer | `50` | Page size (falls back to `20` if `< 1`) |
| `meta` | string | — | Reserved; currently does not change the payload |

**Example**

::: code-group

```http [HTTP]
GET /api/blueprints?page=1&limit=10 HTTP/1.1
Authorization: Bearer sls_live_...
```

```java [S4J]
import com.protoxon.S4J.entities.Blueprint;
import com.protoxon.S4J.requests.PaginationAction;
import java.util.List;

PaginationAction<Blueprint> pages = client.getBlueprints()
    .limit(10)
    .skipTo(1);

List<Blueprint> firstPage = pages.execute();
```

:::

**Response** `200 OK`:

```json
{
  "meta": {
    "pagination": {
      "total": 42,
      "per_page": 10,
      "current_page": 1,
      "total_pages": 5
    }
  },
  "data": [
    {
      "metadata": {
        "id": "survival_lobby",
        "name": "Survival Lobby",
        "type": "game"
      },
      "server": {
        "software": "paper",
        "version": "1.21.1",
        "image": "ghcr.io/example/java:21",
        "limits": { "memory_limit": 2048 }
      },
      "state": null,
      "save": false,
      "annotations": {}
    }
  ]
}
```

Note: JSON uses **`metadata`** for the blueprint header (id/name/type), even though YAML blueprint files often use a top-level `blueprint:` key on disk.

---

## `POST /api/blueprints/reload` — Reload blueprints from disk

**Example**

::: code-group

```http [HTTP]
POST /api/blueprints/reload HTTP/1.1
Authorization: Bearer sls_live_...
```

```java [S4J]
client.reloadBlueprints().execute();
```

:::

**Response** `200 OK` with an empty body on success.

---

## `POST /api/software/reload` — Reload software definitions

**Example**

::: code-group

```http [HTTP]
POST /api/software/reload HTTP/1.1
Authorization: Bearer sls_live_...
```

```java [S4J]
client.reloadSoftwareConfigs().execute();
```

:::

**Response** `200 OK` with an empty body on success.
