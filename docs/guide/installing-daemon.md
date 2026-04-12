
# Installing the Daemon

**Daemons** are node processes that connect to **Protocube** and manage game server workloads.
Install [Protocube](./installing-protocube) before setting up any daemon nodes.

* **Official Docker image:** `ghcr.io/jessefaler/sls/daemon:latest`
* **Native binaries:** [SLS GitHub Releases](https://github.com/jessefaler/SLS/releases)

---

## Before You Start

* Install Docker on the host that will run servers. The Daemon requires a full Linux environment; on Windows, use WSL (see [Getting Started](./getting-started)).

* Ensure Protocube and the Daemon can communicate. The default Compose setup uses internal hostnames (e.g., `protocube.sls.net`, `daemon.sls.net`) via `extra_hosts` inside containers.
  From the host system, you may need to use `127.0.0.1`, real DNS, or `/etc/hosts`, depending on your deployment.

---

# Installation Options

SLS supports two ways to run the Daemon:

* **Docker** — Recommended For Most deployments, production, and simple setup
* **Native binary**
---
# Option 1 — Run the Daemon with Docker (Recommended)

## Docker Compose

Download the official Compose file or view it on GitHub:
[`daemon/docker-compose.yml`](https://github.com/jessefaler/SLS/blob/main/daemon/docker-compose.yml)

<ComposeDownloads which="daemon" />

### Steps

1. Create a directory on the node machine and save the Compose file as `docker-compose.yml`.

2. Create required system directories:

   ```bash
   sudo mkdir -p /etc/sls/daemon /var/log/sls/daemon /tmp/sls/daemon
   ```

3. Start the Daemon:

   ```bash
   docker compose up -d
   ```

On first start, a default configuration file will be generated at:

```
/etc/sls/daemon/config.yml
```

You must then configure:

* A **node API key**
* The **Protocube connection settings**

See:

* [Create a node API key](#create-a-node-api-key)
* [Configure the Daemon](#configure-the-daemon)

---

# Option 2 — Run the Daemon from a Native Binary

## Steps

1. Download the appropriate **daemon binary** for your platform from
   [SLS Releases](https://github.com/jessefaler/SLS/releases)

2. Prepare required directories:

   ```bash
   chmod +x daemon
   sudo mkdir -p /etc/sls/daemon /var/lib/sls /var/log/sls/daemon /tmp/sls/daemon
   ```

3. The Daemon requires **`CAP_SYS_ADMIN`** for overlay filesystem mounts used by server instances.

   You may either grant the capability:

   ```bash
   sudo setcap cap_sys_admin+ep /path/to/daemon
   ```

   or run as root:

   ```bash
   sudo ./daemon
   ```

   Without this permission, server provisioning and mounts may fail.

4. Start the Daemon:

   ```bash
   ./daemon --config /etc/sls/daemon/config.yml
   ```

---

# Create a Node API Key

The Daemon authenticates to Protocube using an API key generated on the controller.

::: code-group

```bash [Protocube in Docker]
docker exec -it SLS protocube create-api-key
```

```bash [Protocube native]
protocube create-api-key
```

:::

> If you changed the default container name, replace `SLS` with your configured name in the `docker exec` command.

Follow the prompts and copy the generated token.

For more information on managing API keys see: [`create-api-key`](/reference/cli#create-api-key)

---

# Configure the Daemon

Edit:

```
/etc/sls/daemon/config.yml
```

---

## Protocube Connection

Configure how the Daemon connects to Protocube:

```yaml id="k9d2q0"
remote:
  url: http://protocube.sls.net:5620
  token: sls_live_9y1Vli9h9ty_your_api_key
```

> Replace the URL if you are not using Compose hostnames (e.g. use an IP or real domain).

---

## Daemon API Configuration

Configure how Protocube and external systems reach this Daemon:

```yaml id="p4x8a1"
api:
  url: http://daemon.sls.net:5585
  host: 0.0.0.0
  port: 5585
  tls:
    enabled: false
    cert: /etc/ssl/certs/sls.crt
    key: /etc/ssl/private/sls.key
```

* `url` — The address Protocube uses to reach this node
* Enable `tls` if terminating TLS directly on the Daemon

---

## Restart Daemon

After configuration changes, restart the Daemon:

* Docker:

  ```bash
  docker compose restart
  ```

* Native:

  ```bash
  pkill daemon && ./daemon --config /etc/sls/daemon/config.yml
  ```

Check logs to confirm the node successfully registers with Protocube.

---

# Next Steps

- Learn how to set up [**vSLS**](./vsls/installation) if you are using [**Velocity**](https://docs.papermc.io/velocity).

* Create Blueprints: [Blueprint examples](./blueprints/examples/)
* Configure software: [Software configurations](./software-configurations/introduction)
* Troubleshooting: [Troubleshooting guide](./troubleshooting/)

For help, join the community:
 [https://discord.gg/BrH8GtyGSh](https://discord.gg/BrH8GtyGSh)

---
