# Server connection issues

## Troubleshooting connection issues

If you see an error like:

```
Unable to connect to server
Connection timed out after 5000 ms: /127.0.0.1:40000
```

This usually means the server address is incorrect or unreachable on your network. Follow the guidance below to fix the issue.

### 1. Check your daemon configuration

The daemon defines **allocations**, which control which IP and port your server binds to.

Example configuration:

```yaml
allocations:
  - address: 0.0.0.0        # Bind server to all interfaces
    alias: 127.0.0.1        # Address you use to connect
    force_outgoing_ip: false
    ports: 40000-45000
```

**Tips:**

- **`address`** — The IP the server binds to. Use `0.0.0.0` to bind to all interfaces.
- **`alias`** — The IP or hostname used to connect:
  - **Local connection (host machine):** `127.0.0.1` or `localhost`
  - **External connection:** Your public IP or domain name
- **`ports`** — Ensure you are connecting to a port in this range.

### 2. Connecting from inside Docker

`127.0.0.1` inside a Docker container points to the **container itself**, not the host.

To connect from a container, use the **Docker bridge gateway**, typically `172.18.0.1`.

You can verify the gateway for your Docker network:

```bash
docker network inspect bridge -f '{{(index .IPAM.Config 0).Gateway}}'
```

Alternatively, create a custom Docker network.

More info: [Docker Networking](https://docs.docker.com/network/).

### 3. Connecting from an external network

- Make sure the server port is **forwarded** on your router.
- **Allow the port** through your firewall.
- Use the correct **public IP or domain name** to connect.
- Verify that the port **matches** the one defined in your allocations.

---

If you are still stuck, ask in the [Discord](https://discord.gg/BrH8GtyGSh) **help** channels.
