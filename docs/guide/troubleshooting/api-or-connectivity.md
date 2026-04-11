# API or connectivity

Problems reaching Protocube or the daemon, or mismatched HTTP/TLS between clients and servers, usually come down to URL schemes, API keys, TLS files, or network reachability. Below are **common API-related errors** and how to approach them.

## Common API errors

### `http: server gave HTTP response to HTTPS client`

The client is speaking **HTTPS** to an endpoint that is only serving **plain HTTP** (or the reverse: less often, you’ll see the opposite mismatch).

**What to do:** Align the scheme in your config with what the service actually exposes.

- If the service uses **HTTP**, URLs must start with `http://`, not `https://`.
- Examples:
  - Protocube: `http://protocube.sls.net:5620`
  - Daemon API: `http://daemon.sls.net:5585`

Check the daemon `config.yml`. Ensure that the **API URL** and **remote URL** are correct so **HTTP** and **HTTPS** are set the right way for each endpoint.

### `401 Unauthorized: invalid API key`

The API key in your **daemon** `config.yml` does not match what Protocube expects (wrong key, revoked key, or wrong key **type**).

**What to do:**

- Generate a new key in Protocube and update the daemon config.
- See [Create a node API key](../installing-daemon#create-a-node-api-key) for the full flow.
- When creating a key for the daemon, make sure you create a **node API key**.

### `tls: no certificates configured` (or missing cert files)

TLS is enabled but **no valid certificates** are loaded, or the paths in config **do not exist** on the host.

**What to do:**

- **Preferred:** Configure real certificates (for example [Let’s Encrypt](https://letsencrypt.org/)) and point config at the correct `cert` and `key` files.
- **Or** fix filesystem paths so the process can read the files you configured.
- **Or** use HTTP instead of HTTPS if you are testing locally or using a reverse proxy like Nginx that handles TLS termination.

Example daemon API block with TLS:

```yaml
api:
  url: https://daemon.sls.net:5585
  host: 0.0.0.0
  port: 5585
  tls:
    enabled: true
    cert: /etc/ssl/certs/sls.crt
    key: /etc/ssl/private/sls.key
```

Apply the same idea on Protocube if it terminates TLS for its API.

### The daemon is not connecting to Protocube

**Ensure the daemon can connect to Protocube:**

1. Check your **`remote`** block in the daemon `config.yml`. The `url` must point at Protocube, use the correct **`http` or `https`** scheme, and be reachable from wherever the daemon is running (on the host or inside a container):

   ```yaml
   remote:
     url: https://protocube.sls.net:5620
     token: sls_live_your_node_key
   ```

2. On the **Protocube** side, confirm the API is listening on the host and port you expect, and that nothing (firewall, security group, etc.) is blocking it.

**If you use Docker:** Make sure you are **exposing the right ports** from the container to the host and that port mappings match what you put in your URLs.

---

If you are still stuck, ask in the [Discord](https://discord.gg/BrH8GtyGSh) **help** channels.
