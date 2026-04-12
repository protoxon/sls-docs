# Installing vSLS

[vSLS](/guide/vsls/) is installed on your **Velocity** proxy as a normal plugin JAR. Complete [Installing Protocube](/guide/installing-protocube) and [Installing the daemon](/guide/installing-daemon) (or equivalent) before wiring the plugin to your API.

## Requirements

- **Java 17+**
- A running **SLS** stack:
  - **Protocube**
  - **A Daemon instance**
  - Valid **API URL** and **API key** in vSLS `config.yml`
- **Velocity 3.x**
- **PacketEvents** installed on the proxy

## Steps

1. Download the latest **vSLS** JAR from [SLS Releases](https://github.com/jessefaler/SLS/releases).
2. Place the `.jar` in the Velocity **`plugins`** folder.
3. Restart the proxy and edit `plugins/vsls/config.yml`

## Next steps

- [vSLS overview](/guide/vsls/) — features, permissions, and links
- [Configuring vSLS](/guide/vsls/configuring) — `config.yml` and blueprint annotations
- [vSLS commands](/guide/vsls/commands) — `/sls` command reference
