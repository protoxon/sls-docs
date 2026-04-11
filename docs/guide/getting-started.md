# Getting started

SLS is built around **Protocube** (the controller) and one or more **daemons** (nodes that run Docker workloads). Install Protocube first, then add a daemon on each machine that should host game servers.

| Step | Guide |
| --- | --- |
| 1. Protocube | [Installing Protocube](./installing-protocube) |
| 2. Daemon (per node) | [Installing the daemon](./installing-daemon) |

## Host requirements

The **daemon** expects a full Linux environment on the host (Docker, cgroups, mount behavior used for game servers). If you use Windows, run Protocube and daemons inside [Windows Subsystem for Linux (WSL)](https://learn.microsoft.com/en-us/windows/wsl/about), not only in a Windows-native shell.

- **Docker** — Install Docker Engine (or a compatible runtime) on that Linux environment.
- **WSL** — If you use Docker Desktop on Windows, prefer **Docker inside the same WSL distro** you use for SLS, or expect networking and socket paths to need extra care. A dedicated Linux VM or bare metal avoids those edge cases.

## Images and releases

- Protocube: `ghcr.io/jessefaler/sls/protocube:latest`
- Daemon: `ghcr.io/jessefaler/sls/daemon:latest`

Binaries and changelog: [SLS GitHub Releases](https://github.com/jessefaler/SLS/releases).

## Official Docker Compose files

Use **Protocube** on the controller host, then **Daemon (node)** on each node (each in its own directory and `docker compose` project).

<ComposeDownloads which="all" />

Sources: [`protocube/docker-compose.yml`](https://github.com/jessefaler/SLS/blob/main/protocube/docker-compose.yml), [`daemon/docker-compose.yml`](https://github.com/jessefaler/SLS/blob/main/daemon/docker-compose.yml).

## After installation

- Author or import [blueprints](./blueprints/examples/) and [software configurations](./software-configurations/introduction).
- Stuck? See [Troubleshooting](./troubleshooting/) or ask on [Discord](https://discord.gg/BrH8GtyGSh).
