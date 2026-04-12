# Getting started

SLS is composed of a central controller (Protocube) and one or more worker nodes (Daemons) responsible for running containerized game server workloads. Protocube should be installed first, followed by a Daemon on each host node.

| Step                 | Guide                                          |
|----------------------|------------------------------------------------|
| 1. Protocube         | [Installing Protocube](./installing-protocube) |
| 2. Daemon (per node) | [Installing the daemon](./installing-daemon)   |

## Host requirements

The **daemon** expects a full Linux environment on the host. If you use Windows, run Protocube and daemons inside [Windows Subsystem for Linux (WSL)](https://learn.microsoft.com/en-us/windows/wsl/about).

- **Docker** — Install Docker Engine on that Linux environment.
> **WSL for Windows** — If you are using Windows, run SLS inside [Windows Subsystem for Linux (WSL)](https://learn.microsoft.com/en-us/windows/wsl/about) to provide a compatible Linux environment.

## Ways to Run SLS

There are two main ways to run SLS:

1. **Docker (recommended)** — Use the official Docker images and Docker Compose files
2. **Native binaries** — Run compiled binaries from the [SLS Releases](https://github.com/jessefaler/SLS/releases) page

For setup instructions, see [Installing Protocube](./installing-protocube) and [Installing the Daemon](./installing-daemon).

## Images and releases

- Protocube: `ghcr.io/jessefaler/sls/protocube:latest`
- Daemon: `ghcr.io/jessefaler/sls/daemon:latest`

Binaries and changelog: [SLS GitHub Releases](https://github.com/jessefaler/SLS/releases).

## Official Docker Compose files

These are official Docker Compose files for running Protocube and the Daemon in Docker.

<ComposeDownloads which="all" />

Sources: [`protocube/docker-compose.yml`](https://github.com/jessefaler/SLS/blob/main/protocube/docker-compose.yml), [`daemon/docker-compose.yml`](https://github.com/jessefaler/SLS/blob/main/daemon/docker-compose.yml).

## After installation

- Learn how to set up [**vSLS**](./vsls) if you are using [**Velocity**](https://docs.papermc.io/velocity).
- Learn how to create [blueprints](./blueprints/examples/) and [software configurations](./software-configurations/introduction).
- Stuck? See [Troubleshooting](./troubleshooting/) or ask on [Discord](https://discord.gg/BrH8GtyGSh).
