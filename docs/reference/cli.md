# Protocube CLI

Command-line flags and subcommands for the Protocube binary. Replace **`SLS`** with your container name when using Docker; on the host, run **`protocube`** directly.

## Global flags

<div class="cli-ref-global-flags">

| Flag | Type | Description |
| --- | --- | --- |
| `--config` | string | Change the path to the configuration file. |
| `--debug` | bool | Enable debug mode. When set, overrides `Debug` in the loaded config. |

</div>

::: code-group

```bash [Docker]
# Example: Pass commands in your docker compose file
services:
  protocube:
    command: ["--config", "/etc/sls/protocube/config.yml"]

# Example: Pass commands when running your compose file
docker compose run protocube --config /etc/sls/protocube/config.yml
```

```bash [Native]
protocube --config /path/to/config.yml
protocube --debug --config /path/to/config.yml
```

:::

## `version`

Prints the version and exits.

::: code-group

```bash [Docker]
docker exec SLS protocube version
```

```bash [Native]
protocube version
```

:::

## `create-api-key`

Creates an API key. Interactive by default; use **`--no-interactive`** with flags for scripts.

::: code-group

```bash [Docker]
docker exec -it SLS protocube create-api-key
```

```bash [Native]
protocube create-api-key
```

:::

**Aliases:** `ck`, `create-key`, `new-key`

| Flag | Required (non-interactive) | Description |
| --- | --- | --- |
| `--name` | Yes | Key name. |
| `--owner-id` | Yes | Owner UUID. |
| `--scopes` | No | Comma-separated scopes (e.g. `app:admin`, `node`). |
| `--description` | No | Description. |
| `--environment` | No | `live` or `test`. Default: `live`. |
| `--expires-in` | No | Expiration duration (e.g. `24h`, `168h`, `720h`). |
| `--metadata` | No | Metadata as `key=value` (repeat flag per pair). |
| `--no-interactive` | — | Non-interactive mode (requires `--name` and `--owner-id`). |

## `list-api-keys`

Lists API keys.

::: code-group

```bash [Docker]
docker exec SLS protocube list-api-keys
```

```bash [Native]
protocube list-api-keys
```

:::

**Aliases:** `list-keys`, `keys`, `lk`

## `show-api-key`

Shows one API key by ID.

::: code-group

```bash [Docker]
docker exec SLS protocube show-api-key --id <uuid>
```

```bash [Native]
protocube show-api-key --id <uuid>
```

:::

**Aliases:** `key-info`, `show-key`, `sk`

| Flag | Required | Description |
| --- | --- | --- |
| `--id` | Yes | API key ID (UUID). |

## `delete-api-key`

Deletes an API key by ID.

::: code-group

```bash [Docker]
docker exec SLS protocube delete-api-key --id <uuid>
```

```bash [Native]
protocube delete-api-key --id <uuid>
```

:::

**Aliases:** `del-key`, `remove-key`, `delete-key`, `dk`

| Flag | Required | Description |
| --- | --- | --- |
| `--id` | Yes | API key ID (UUID). |

<p class="cli-ref-muted-note">Changes can take up to 5 minutes to take effect. Restarting Protocube applies changes immediately.</p>

## `revoke-api-key`

Revokes an API key (does not delete it).

::: code-group

```bash [Docker]
docker exec SLS protocube revoke-api-key --id <uuid>
docker exec SLS protocube revoke-api-key --id <uuid> --reason "rotated"
```

```bash [Native]
protocube revoke-api-key --id <uuid>
protocube revoke-api-key --id <uuid> --reason "rotated"
```

:::

**Aliases:** `revoke-key`, `rk`

| Flag | Required | Description |
| --- | --- | --- |
| `--id` | Yes | API key ID (UUID). |
| `--reason` | No | Optional revocation reason. |

<p class="cli-ref-muted-note">Changes can take up to 5 minutes to take effect. Restarting Protocube applies changes immediately.</p>
