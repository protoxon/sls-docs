# Browser pages (unauthenticated)

These routes return **HTML** for humans in a browser. They do **not** use the `/api` prefix and do **not** require an `Authorization` header. There is no S4J equivalent—use a browser or any HTTP client that renders HTML.

## `GET /` — HTML banner (version, credits, links)

**Example**

```http
GET / HTTP/1.1
Host: protocube.example.com
```

**Response** — `200 OK`, `Content-Type: text/html; charset=utf-8` (monospace-styled page).

---

## `GET /nodes` — HTML list of registered nodes

**Example**

```http
GET /nodes HTTP/1.1
Host: protocube.example.com
```

**Response** — `200 OK`, `Content-Type: text/html; charset=utf-8`. If there are no nodes, the page shows “No nodes found.”
