# Installing the daemon

**Nodes** are **daemon** processes: they connect to Protocube, expose the node API, and start or stop server containers on that machine. Complete [Installing Protocube](./installing-protocube) (or have a reachable controller) before joining a node.

Official image: `ghcr.io/jessefaler/sls/daemon:latest`  
Binaries: [SLS GitHub Releases](https://github.com/jessefaler/SLS/releases).

## Before you start

- Install **Docker** on the host that will run servers. The daemon expects a full Linux environment; on Windows use WSL (see [Getting started](./getting-started)).
- Plan how **Protocube** and this **daemon** reach each other. The compose files use logical names (`protocube.sls.net`, `daemon.sls.net`) via `extra_hosts` **inside** containers; from the host, use `127.0.0.1`, real DNS, or `/etc/hosts` as appropriate.

## Docker Compose file

[`daemon/docker-compose.yml`](https://github.com/jessefaler/SLS/blob/main/daemon/docker-compose.yml) in the SLS repository includes comments on Docker socket access, **`rshared`** mounts for `/var/lib/sls`, `userns_mode`, and AppArmor — read them if you use user namespaces or a hardened Docker setup.

<ComposeDownloads which="daemon" />

## Run the daemon with Docker (recommended)

1. On the node machine, save the compose file as `docker-compose.yml` in its own directory.
2. Create log and config paths from the compose file:

   ```bash
   sudo mkdir -p /etc/sls/daemon /var/log/sls/daemon /tmp/sls/daemon
   ```

3. Start the daemon:

   ```bash
   docker compose up -d
   ```

On first start, expect a default **`/etc/sls/daemon/config.yml`** on the host. You still need a **node API key** and an edited config — see [Create a node API key](#create-a-node-api-key) and [Configure the daemon](#configure-the-daemon).

## Run the daemon from a release binary

1. Download the **daemon** binary for your platform from [SLS Releases](https://github.com/jessefaler/SLS/releases).
2. Install and prepare directories:

   ```bash
   chmod +x daemon
   sudo mkdir -p /etc/sls/daemon /var/lib/sls /var/log/sls/daemon /tmp/sls/daemon
   ```

3. The daemon needs **`CAP_SYS_ADMIN`** for overlay mounts used by server filesystems. Either grant the capability on the file:

   ```bash
   sudo setcap cap_sys_admin+ep /path/to/daemon
   ```

   or run the binary as **root** (for example `sudo ./daemon`). Without this, container provisioning can fail when mounting layers.

4. Run it:

   ```bash
   ./daemon --config /etc/sls/daemon/config.yml
   ```

## Create a node API key

The daemon authenticates to Protocube with an API key you generate on the controller.

::: code-group

```bash [Protocube in Docker]
docker exec -it SLS protocube create-api-key
```

```bash [Protocube native]
protocube create-api-key
```

:::

The default Protocube compose file sets `container_name: SLS`. If you changed it, substitute that name in `docker exec`.

Follow the interactive prompts and copy the issued secret. For scripting, use non-interactive flags on [`create-api-key`](/reference/cli#create-api-key) (scopes such as **`node`** when offered).

## Configure the daemon

Edit **`/etc/sls/daemon/config.yml`** on the node.

### Connect to Protocube

Under **`remote`**, set the URL this **daemon** can use to reach Protocube’s API and paste the token:

```yaml
remote:
  url: http://protocube.sls.net:5620
  token: sls_live_9y1Vli9h9ty_your_api_key
```

Use a real URL if you do not use the compose `extra_hosts` names (for example `http://10.0.0.5:5620` or `https://protocube.example.com`).

### Node API

Ensure the daemon’s HTTP API matches how Protocube and operators reach this node:

```yaml
api:
  url: http://daemon.sls.net:5585
  host: 0.0.0.0
  port: 5585
  tls:
    enabled: false
    cert: /etc/ssl/certs/sls.crt
    key: /etc/ssl/private/sls.key
```

Adjust **`url`** to the address Protocube should call (hostname or IP the controller can route to). Enable **`tls`** when you terminate TLS on the daemon.

Restart the daemon after changes (`docker compose restart` or restart the native process). Check logs to confirm it registers with Protocube.

## Next steps

- Load blueprints and software definitions: [Blueprint examples](./blueprints/examples/), [Software configurations](./software-configurations/introduction).
- If something fails to connect or authenticate, see [Troubleshooting](./troubleshooting/) ([API or connectivity](./troubleshooting/api-or-connectivity)).

For community help, use [Discord](https://discord.gg/BrH8GtyGSh) with versions, redacted config, and log snippets.
