# Configuring vSLS

vSLS reads settings from two places:

1. **`config.yml`** in the Velocity **`plugins/vsls`** folder (API, queues, lifecycle).
2. **`annotations.vsls`** on each blueprint (matchmaking, on-join commands, instance limits).

After editing `config.yml`, restart the proxy or use [`/sls reload config`](./commands#reload) where appropriate.

## Plugin `config.yml` {#plugin-config-yml}

On first start vSLS creates a default config at:

`plugins/vsls/config.yml`

Set **`api.url`** and **`api.key`** 

For creating an API key, see [`create-api-key`](/reference/cli#create-api-key) in the CLI reference.

### Reference

| Key                        | Type              | Description                                                                                                                              |
|----------------------------|-------------------|------------------------------------------------------------------------------------------------------------------------------------------|
| `api.url`                  | string            | Base URL of **Protocube** (SLS controller API).                                                                                          |
| `api.key`                  | string            | **Protocube API key** used to authenticate vSLS.                                                                                         |
| `queue.timeout`            | integer (seconds) | How long a matchmaking **queue** may stay open before vSLS **force-closes** it.                                                          |
| `lifecycle.enabled`        | boolean           | When `true`, vSLS **tracks empty servers** and can stop them automatically.                                                              |
| `lifecycle.check_interval` | integer (minutes) | How often to **scan** registered servers for lifecycle actions.                                                                          |
| `lifecycle.stop_delay`     | integer (seconds) | After a server becomes **empty**, how long to wait before **stopping** it (when lifecycle is enabled and the blueprint allows stopping). |

### Example

```yaml
api:
  url: "" # URL to SLS Protocube (e.g. https://protocube.example:5620)
  key: "" # Protocube API key

queue:
  timeout: 120 # Seconds before forcefully closing a queue

# Automatically stop empty servers
lifecycle:
  enabled: true       # Enable lifecycle management
  check_interval: 2   # Minutes between checks on all servers
  stop_delay: 20      # Seconds to wait after a server is empty before stopping
```

---

## Blueprint annotations (`annotations.vsls`) {#annotations-vsls}

Blueprints may include an [`annotations`](../blueprints/creating-blueprints#annotations) map. vSLS reads the nested key **`vsls`**. Those values apply to instances created from that blueprint (matchmaking, join hooks, and lifecycle hints).

### Reference

| Key                      | Type    | Description                                                                                                                                                           |
|--------------------------|---------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `dont-stop-when-empty`   | boolean | Default `false`. If `true`, vSLS **does not** stop the server when it becomes empty (overrides default empty-server behavior when lifecycle would otherwise stop it). |
| `max-instances`          | integer | Optional cap on **how many running instances** of this blueprint may exist at once (for example `1` for a single shared world).                                       |
| `on-join`                | list    | Commands to run on the **game server** when a player connects. Each entry is an object with **`run`**: a console line to execute.                                     |
| `matchmaking`            | object  | Optional block used when this blueprint is registered for **matchmaking**.                                                                                            |
| `matchmaking.maxPlayers` | integer | Maximum players **per provisioned instance**.                                                                                                                         |

### `on-join` and `{PLAYER_NAME}`

Each `on-join` item should look like `- run: "<command>"`. The placeholder **`{PLAYER_NAME}`** is replaced with the joining player’s username before the line is sent to the server console.

### Example

```yaml
annotations:

  # Matchmaking, lifecycle hints, and commands when a player joins.

  vsls:
    # Keep the server running when nobody is online.
    dont-stop-when-empty: true

    # At most one concurrent instance of this blueprint.
    max-instances: 1

    on-join:
      - run: "say hello {PLAYER_NAME}"
      - run: "playsound minecraft:block.note_block.bell ambient {PLAYER_NAME} ~ ~ ~ 1000 0"

    matchmaking:
      # Controls the number of players per instance. Setting this to 1 will create a new instance for every player that joins.
      # Omit to allow unlimited players
      maxPlayers: 1
```

For a full example blueprint with these annotations see: [vSLS blueprint example](../blueprints/examples/vsls).
