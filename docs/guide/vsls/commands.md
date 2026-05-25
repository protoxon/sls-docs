# vSLS commands

Reference for the in-game **`/sls`** command tree. Unless noted, arguments are case-sensitive and must match the server or blueprint identifiers returned by the plugin.

## Table of contents

- [Info](#info)
- [List](#list)
- [Create](#create)
- [Start](#start)
- [Join](#join)
- [Find](#find)
- [System](#system)
- [Node](#node)
- [Console](#console)
- [Blueprint](#blueprint)
- [Debug](#debug)
- [Delete](#delete)
- [Logs](#logs)
- [Reload](#reload)
- [Stop](#stop)
- [Kill](#kill)
- [Dequeue](#dequeue)
- [Status](#status)
- [Stats](#stats)
- [Version](#version)
- [General notes](#general-notes)

---

## Info

**Permission:** `sls.command.admin` (required for server-specific details)

**Description:** Shows active servers and player counts, or detailed information for one server.

**Usage:**

```
/sls info
/sls info <server>
```

**Details:**

- `/sls info` — Lists active servers with player counts.
- `/sls info <server>` — Detailed view, including:
  - Player count (hover for player names)
  - Status, blueprint id, blueprint type
  - Server software and version
  - Resource stats: CPU, memory (current / max and %), network in/out, uptime

---

## List

**Permission:** None

**Description:** Lists every server vSLS knows about. Each line shows display name, status (by name color), and player count. Hover the name for the composite id; hover the player count for names on that server.

**Usage:**

```
/sls list
```

---

## Create

**Permission:** `sls.command.admin`

**Description:** Provisions a new server from a blueprint and starts it. Optional `key=value` flags override node, resources, software/image, and config patches.

**Usage:**

```
/sls create <blueprint_type> <blueprint_id>
/sls create <blueprint_type> <blueprint_id> <flags...>
```

**Arguments:**

| Argument | Meaning |
|----------|---------|
| `blueprint_type` | Blueprint type (for example `minigame`, `adventure`, `pvp`). |
| `blueprint_id` | Specific blueprint id. |
| `flags...` | Optional space-separated overrides, each `--name=value` (see table below). |

**Override flags:**

| Flag | Value | Effect |
|------|--------|--------|
| `--node=` | Node id | Create on this node; short ids resolve against the API node list. |
| `--save=` | `true` / `false` | Enable or disable saving for the instance. |
| `--cpu=` | Integer | CPU limit (percentage of CPU the instance may use). |
| `--memory=` | Integer | Memory limit in **mebibytes (MiB)**. |
| `--swap=` | Integer | Extra swap for the container. |
| `--io_weight=` | Integer | Relative I/O weight. |
| `--disk_space=` | Integer | Disk allowance in **megabytes (MB)**. |
| `--threads=` | String | CPU threads the Docker instance may use. |
| `--oom_disabled=` | `true` / `false` | If `true`, disables the OOM killer for the container. |
| `--software=` | String | Software id to run. |
| `--version=` | String | Software version. |
| `--image=` | String | Container image. |
| `--seed=` | String | Patches `server.properties`: `level-seed`. |
| `--view-distance=` | String | Patches `server.properties`: `view-distance`. |
| `--enable-command-block=` | String | Patches `server.properties`: `enable-command-block` (`true` / `false`). |

**Details:**

- Tab completion for blueprint types and ids; after the id, completion can suggest flags, node ids, and boolean values where applicable.
- `--seed`, `--view-distance`, and `--enable-command-block` are merged into one config patch.
- On success, the created server’s composite id is shown; failures print a reason.

---

## Start

**Permission:** `sls.command.admin`

**Description:** Starts an existing server. Most useful when saving is enabled and the instance already exists (or was created earlier).

**Usage:**

```
/sls start <blueprint_type> <blueprint_id>
```

**Arguments:**

| Argument | Meaning |
|----------|---------|
| `blueprint_type` | Blueprint type. |
| `blueprint_id` | Blueprint id. |

**Details:**

- If the server does not exist yet, the command can create it, then start it.
- Tab completion for types and ids.
- Success output includes the server id.

---

## Join

**Permission:** `sls.command.admin` to connect **other** players; joining **yourself** does not require admin.

**Description:** Creates the server if needed, starts it, waits until status is **ready**, then moves the chosen player(s) to it. Or connect to the server a player is already on.

**Usage:**

```
/sls join <blueprint_type> <blueprint_id>
/sls join <blueprint_type> <blueprint_id> [all | local | <player>]
/sls join player <player>
/sls join player <player> --force
```

**Arguments:**

| Argument | Meaning |
|----------|---------|
| `blueprint_type`, `blueprint_id` | Same as **Create**. |
| *(none)* | Connects the command sender. |
| `all` | Everyone on the proxy. |
| `local` | Everyone on the same backend server as the sender. |
| `<player>` | One player by username. |
| `player <player>` | Connects the sender to the vSLS server that player is on. Respects blueprint `matchmaking.maxPlayers` for normal players. |
| `--force` | Admin only (`sls.command.admin`). Bypasses blueprint capacity for `join player`. |

**Details:**

- If an admin joins a player on a server already at `matchmaking.maxPlayers`, vSLS shows a warning with a **Join Anyway** option that runs `join player` with `--force` instead of blocking silently.

---

## Find

**Permission:** None

**Description:** Shows which vSLS server a player is currently on.

**Usage:**

```
/sls find <player>
```

---

## System

**Permission:** `sls.command.admin`

**Description:** Prints Protocube version and host information (CPU threads, memory, kernel, OS).

**Usage:**

```
/sls system
```

---

## Node

**Permission:** `sls.command.admin`

**Description:** Inspects a daemon node and optionally reads or changes its **drained** flag. Drained nodes are excluded from provisioning: when drained is `true`, the load balancer does not start new servers on that node.

**Usage:**

```
/sls node <id>
/sls node <id> drained
/sls node <id> drained <true | false>
```

**Arguments:**

| Argument | Meaning |
|----------|---------|
| `id` | Node identifier. You may use a short id; it is resolved against the API’s node list (tab completion suggests shortened ids). |
| `drained` | Literal keyword. With no further argument, prints whether the node is currently drained (`true` or `false`). |
| `true` or `false` | Optional, after `drained`: updates the node’s drained state on the API. |

**Details:**

- `/sls node <id>` prints detailed information for the node, including:
  - **Node metadata:** name, location, URL, current drained flag, daemon version
  - **System:** architecture, CPU threads, memory, kernel version, operating system and OS type
  - **Docker:** engine version; when available, cgroup driver/version, container counts (total, running, paused, stopped), storage driver/filesystem, and runc version. If Docker details are missing, the command indicates that they are unavailable.
- `/sls node <id> drained` displays only the drained state.
- `/sls node <id> drained <true | false>` sets the drained state and confirms the value that was sent.

---

## Console

**Permission:** `sls.command.admin`

**Description:** Runs a line on a server console and tries to print captured output.

**Usage:**

```
/sls console <server> <command>
```

**Arguments:**

| Argument | Meaning |
|----------|---------|
| `server` | Target server id. |
| `command` | Console line (arguments allowed). Leading `/` is stripped. |

**Details:**

- Output is gathered by sampling logs with increasing delays (for example 100 ms / 8 lines, 800 ms / 12 lines, 3000 ms / 25 lines).
- Errors are highlighted; if nothing is captured, you may see a “no output” style message.
- Works with both legacy (`>command`) and newer console formats.

---

## Blueprint

**Permission:** `sls.command.admin`

**Description:** Pretty-prints one blueprint (YAML-like layout with colored keys/values).

**Usage:**

```
/sls blueprint <blueprint_id>
```

**Details:**

- Covers metadata, server block, resources, patches, volumes, annotations, and other fields the API returns.

---

## Debug

**Permission:** None (player-only)

**Description:** Toggles extra debug messages for the executing player.

**Usage:**

```
/sls debug
```

**Details:**

- Not for console senders (players only).
- Toggles on/off per player.

---

## Delete

**Permission:** `sls.command.admin`

**Description:** Permanently removes one server or every server vSLS tracks.

**Usage:**

```
/sls delete <server>
/sls delete all
```

**Details:**

- Fetches server metadata from the API before deletion.
- Per-server results are reported.

---

## Logs

**Permission:** `sls.command.admin`

**Description:** Shows recent console log lines for a server.

**Usage:**

```
/sls logs <server>
/sls logs <server> <lines>
```

**Arguments:**

| Argument | Meaning |
|----------|---------|
| `server` | Server id. |
| `lines` | Optional line count (must be a valid number when present). |

**Details:**

- Framed output; optional grey styling for readability.

---

## Reload

**Permission:** `sls.command.admin`

**Description:** Reloads vSLS config and/or asks Protocube to reload blueprints or software definitions.

**Usage:**

```
/sls reload
/sls reload all
/sls reload config
/sls reload blueprints
/sls reload software
```

**Modes:**

| Mode | Behavior |
|------|-----------|
| *(none)* or `all` | Config + blueprints + software (same as “everything”). |
| `config` | vSLS plugin config only. |
| `blueprints` | API reload on Protocube, then refetch and refresh the local blueprint registry. |
| `software` | API request to reload software configuration on Protocube. |

**Details:**

- Blueprint reload typically prints how many blueprints loaded.
- Errors include failure reasons from the API or plugin.

---

## Stop

**Permission:** `sls.command.admin`

**Description:** Graceful shutdown for one server or all servers.

**Usage:**

```
/sls stop <server>
/sls stop all
/sls stop <server> force
/sls stop all force
```

**Arguments:**

| Argument | Meaning |
|----------|---------|
| `force` | Unregister from vSLS even if shutdown fails. |

**Details:**

- Without `force`, a failed shutdown can leave the server registered.
- `all` with no running servers prints an appropriate message.

---

## Kill

**Permission:** `sls.command.admin`

**Description:** Force-terminates a server (or all). Not a clean save; use **Stop** when you need a graceful exit.

**Usage:**

```
/sls kill <server>
/sls kill all
/sls kill <server> force
/sls kill all force
```

**Details:**

- Same `force` semantics as **Stop** for unregistering on partial failure.

---

## Dequeue

**Permission:** `sls.command.admin` to dequeue **others**; dequeuing **yourself** needs no admin node.

**Description:** Removes the sender or selected players from matchmaking queues.

**Usage:**

```
/sls dequeue
/sls dequeue [all | local | <player>]
```

**Details:**

- Tab completion for player names where applicable.
- Feedback includes the server/queue context when relevant.

---

## Status

**Permission:** `sls.command.admin`

**Description:** Shows a server’s lifecycle status from cache or from the node.

**Usage:**

```
/sls status <server>
/sls status <server> remote
```

**Details:**

- Without `remote`: last known status in vSLS.
- With `remote`: status fetched via the API from the daemon.
- Typical values include `offline`, `starting`, `running`, `stopping`.

---

## Stats

**Permission:** `sls.command.admin`

**Description:** Resource snapshot for one server (CPU, memory, network, uptime) with human-readable units.

**Usage:**

```
/sls stats <server>
```

---

## Version

**Permission:** None

**Description:** Prints vSLS version and author metadata.

**Usage:**

```
/sls version
```

---

## General notes

- Commands that need `sls.command.admin` fail with a permission error if the sender lacks it.
- Server ids must match exactly (case-sensitive).
- Tab completion is available for commands.
