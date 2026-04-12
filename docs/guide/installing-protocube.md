# Installing Protocube

**Protocube** is the SLS control plane it tracks instances and coordinates **nodes** (daemons). Install it once before you add nodes. For shared prerequisites (Linux, WSL, Docker), read [Getting started](./getting-started) first.

Official image: `ghcr.io/jessefaler/sls/protocube:latest`  
Binaries and release notes: [SLS GitHub Releases](https://github.com/jessefaler/SLS/releases).

## Docker Compose file

Download the official compose definition or open it on GitHub: [`protocube/docker-compose.yml`](https://github.com/jessefaler/SLS/blob/main/protocube/docker-compose.yml).

<ComposeDownloads which="protocube" />

## Run Protocube with Docker (recommended)

1. Save the Compose file as `docker-compose.yml` in an empty directory (download it above or copy it from GitHub).

2. Start the stack:

   ```bash
   docker compose up -d
   ```

By default, Protocube listens on port `5620`, which is mapped to the host in the Compose file.

The Compose configuration also sets `extra_hosts` so hostnames like `protocube.sls.net` and `daemon.sls.net` resolve **inside containers**. If you need to use these hostnames from the **host system** or from native binaries, you may need to add matching entries to your `/etc/hosts` file.

On first start Protocube will create a default config under **`/etc/sls/protocube/`**. Continue with [Configuring Protocube](#configuring-protocube).

## Run Protocube from a release binary

1. Open [SLS Releases](https://github.com/jessefaler/SLS/releases) and download the **protocube** asset for your OS and CPU architecture.
2. Install it on your `PATH` or run it from a fixed location:

   ```bash
   chmod +x protocube
   sudo mkdir -p /etc/sls/protocube /var/lib/sls /var/log/sls/protocube /tmp/sls/protocube
   ```

3. Start Protocube:

   ::: code-group

   ```bash [First run]
   ./protocube
   ```

   ```bash [Custom config]
   ./protocube --config /etc/sls/protocube/config.yml
   ```

   :::

If no config exists yet the process will create a default config at **`/etc/sls/protocube/`**

## Configuring Protocube

Protocube reads **`/etc/sls/protocube/config.yml`** by default (or the path you pass with `--config`). There you set blueprint and software roots, API listen address, TLS, and related options. See [Configuration](/reference/configuration) as that reference page grows.

When Protocube is running, continue with [Installing the daemon](./installing-daemon) on each host that should run game servers.

## Protocube CLI and API Keys

For Protocube CLI commands and instructions on creating API keys, see [CLI Reference](/reference/cli).