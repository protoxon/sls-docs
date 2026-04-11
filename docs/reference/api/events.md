# Event streams

Subscribe to the **global** server event bus (all servers). Requires **`AppAdmin`** and `Authorization: Bearer ...`.

You can use **WebSocket** (`GET /api/events/ws`) or **Server-Sent Events** (`GET /api/events`); both receive the same logical events. **S4J** exposes the WebSocket feed via `getEventStream()` only.

## Event topics (global bus)

Protocube’s global stream is fed from [`PublishEvent`](https://github.com/jessefaler/SLS/blob/main/protocube/server/events.go) on each server. Every message uses the wire shape `{"Topic":"<name>","Data":{...}}` (SSE) or the same object as each WebSocket JSON frame.

`Data` is always a wrapper with **`server_id`** (the affected server) and **`payload`** (type depends on the topic). [S4J](https://github.com/jessefaler/SLS/blob/main/S4J/src/main/java/com/protoxon/S4J/client/entities/ServerEventParser.java) maps these three topics to `StatusUpdateEvent`, `ServerCrashEvent`, and `ServerDeletedEvent`.

| Topic (`event:` name for SSE) | When it is emitted | `payload` |
| --- | --- | --- |
| **`status`** | Server power/process state changes ([`SetStatus`](https://github.com/jessefaler/SLS/blob/main/protocube/server/server.go)), including updates from the node (e.g. install finished → offline). | A **string** status such as `offline`, `starting`, `running`, `stopping` (see [`server/power.go`](https://github.com/jessefaler/SLS/blob/main/protocube/server/power.go)). |
| **`crash`** | The node reports a process crash ([`HandleServerCrash`](https://github.com/jessefaler/SLS/blob/main/protocube/server/crash.go)). | JSON object: `reason` (string), `exit_code` (number), `timestamp` (RFC3339 time). |
| **`deleted`** | The server record is torn down ([`CleanupForDestroy`](https://github.com/jessefaler/SLS/blob/main/protocube/server/server.go)). | **`null`** (no extra payload). |

**Example** (`status` on WebSocket / in SSE `data:`):

```json
{
  "Topic": "status",
  "Data": {
    "server_id": "srv_01HZ...",
    "payload": "running"
  }
}
```

**Example** (`crash`):

```json
{
  "Topic": "crash",
  "Data": {
    "server_id": "srv_01HZ...",
    "payload": {
      "reason": "signal: killed",
      "exit_code": 137,
      "timestamp": "2026-04-03T12:00:00Z"
    }
  }
}
```

If a topic ever includes a `:` suffix internally, the bus normalizes the listener name to the segment **before** the first `:` ([`events.Publish`](https://github.com/jessefaler/SLS/blob/main/protocube/events/events.go)); the topics above are what Protocube emits today.

---

## `GET /api/events/ws` — Global event stream (WebSocket)

Same events as SSE, over a **WebSocket** upgrade.

**Handshake** — standard WebSocket upgrade with `Authorization: Bearer ...` (or as your reverse proxy forwards it).

**Example**

::: code-group

```http [HTTP]
GET /api/events/ws HTTP/1.1
Host: protocube.example.com
Authorization: Bearer sls_live_...
Upgrade: websocket
Connection: Upgrade
```

```java [S4J]
import com.protoxon.S4J.client.entities.ServerEvent;
import com.protoxon.S4J.client.entities.WebSocketEventStream;

WebSocketEventStream stream = client.getEventStream()
    .onServerEvent((ServerEvent ev) -> {
      // handle parsed server-related events
    })
    .onError(Throwable::printStackTrace);

stream.start();
// when done: stream.stop();
```

:::

**Messages** — each application message is `{"Topic":"...","Data":{...}}` as in [Event topics](#event-topics-global-bus) above.

The server also sends **WebSocket ping** frames periodically to keep the connection alive.

Close the socket to unsubscribe.

---

## `GET /api/events` — Global event stream (SSE)

Long-lived response; skips the default HTTP timeout. **Server-Sent Events.**

**Headers** — clients often send:

::: code-group

```http [HTTP]
GET /api/events HTTP/1.1
Authorization: Bearer sls_live_...
Accept: text/event-stream
```

```java [S4J]
// S4J does not expose GET /api/events (SSE) on SLSClient.
// For Java, use client.getEventStream() in the WebSocket section — same global event bus.
```

:::

**Response** — `200 OK`, headers include:

- `Content-Type: text/event-stream`
- `Cache-Control: no-cache`
- `Connection: keep-alive`

Each event looks like:

```text
event: <topic>
data: {"Topic":"<topic>","Data":...}

```

The `data` line is JSON (field names are **`Topic`** and **`Data`** as emitted by the server). `Topic` matches the SSE `event:` name. `Data` is the payload (object, string, etc.).

**Example** (illustrative — same JSON as WebSocket, line-oriented for SSE):

```text
event: status
data: {"Topic":"status","Data":{"server_id":"srv_01HZ...","payload":"running"}}

```

Close the HTTP connection to unsubscribe.
