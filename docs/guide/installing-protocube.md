# Installing Protocube

**Protocube** is the SLS control plane: it tracks instances and coordinates **nodes** (daemons). Install it once before you add nodes. For shared prerequisites (Linux, WSL, Docker), read [Getting started](./getting-started) first.

Official image: `ghcr.io/jessefaler/sls/protocube:latest`  
Binaries and release notes: [SLS GitHub Releases](https://github.com/jessefaler/SLS/releases).

## Docker Compose file

Download the official compose definition or open it on GitHub: [`protocube/docker-compose.yml`](https://github.com/jessefaler/SLS/blob/main/protocube/docker-compose.yml).

<ComposeDownloads which="protocube" />

## Run Protocube with Docker (recommended)

1. Save the compose file as `docker-compose.yml` in an empty directory (use the download above, or copy from GitHub).
2. Create the host paths the file bind-mounts (adjust ownership to the user that runs Docker if you do not run as root):

   ```bash
   sudo mkdir -p /etc/sls/protocube /var/lib/sls /var/log/sls/protocube /tmp/sls/protocube
   ```

3. Start the stack:

   ```bash
   docker compose up -d
   ```

The stack maps **`5620`** → Protocube. The compose file sets `extra_hosts` so names like `protocube.sls.net` and `daemon.sls.net` resolve **inside** containers; your **host** may still need matching entries in `/etc/hosts` if you use those hostnames from the host or from native binaries.

On first start, Protocube should materialize a default config under **`/etc/sls/protocube/`** on the host (via the volume mount). Continue with [Configuring Protocube](#configuring-protocube).

## Run Protocube from a release binary

1. Open [SLS Releases](https://github.com/jessefaler/SLS/releases) and download the **protocube** asset for your OS and CPU architecture.
2. Install it on your `PATH` or run it from a fixed location:

   ```bash
   chmod +x protocube
   sudo mkdir -p /etc/sls/protocube /var/lib/sls /var/log/sls/protocube /tmp/sls/protocube
   ```

3. Start Protocube (optional explicit config path):

   ::: code-group

   ```bash [First run]
   ./protocube
   ```

   ```bash [Custom config]
   ./protocube --config /etc/sls/protocube/config.yml
   ```

   :::

If no config exists yet, the process typically writes defaults under **`/etc/sls/protocube/`** — confirm on your version; otherwise create `config.yml` from the project’s examples.

Useful commands: [`protocube version`](/reference/cli#version), [`create-api-key`](/reference/cli#create-api-key), and the rest of the [CLI](/reference/cli).

## Configuring Protocube

Protocube reads **`/etc/sls/protocube/config.yml`** by default (or the path you pass with `--config`). There you set blueprint and software roots, API listen address, TLS, and related options. See [Configuration](/reference/configuration) as that reference page grows.

When Protocube is running, continue with [Installing the daemon](./installing-daemon) on each host that should run game servers.
