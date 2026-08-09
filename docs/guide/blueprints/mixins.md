# Mixins

Mixins are reusable configuration overlays that blueprints can pull in with [`includes`](./creating-blueprints#includes). Use them for shared plugins, limits, volumes, env vars, and other settings you do not want to copy into every blueprint.

A mixin is not a full blueprint. Fields are optional overlays. Completeness (`server.software`, `server.version`, image resolution, and so on) is validated on the **composed blueprint** after includes are applied.

## Create a mixin file

Place YAML under Protocube’s blueprints directory (default `/var/lib/sls/blueprints`). A `mixins/` subdirectory is conventional but not required — any `.yml` / `.yaml` under the blueprints root is discovered.

Files are classified by top-level key:

- `mixin:` → mixin
- `blueprint:` → blueprint
- both or neither → skipped

Mixin IDs must be unique across the whole tree.

## `mixin`

```yaml
mixin:
  id: shared_plugins
  description: Common plugins for minigames
```

- **`id`** — Unique slug referenced by blueprint `includes` (and by other mixins via `extends`).
- **`description`** — Optional human-readable note.

## `extends`

Mixins can inherit from other mixins. Parents are applied left-to-right, then the mixin itself; later values win.

```yaml
mixin:
  id: paper_minigame
  description: Paper base plus shared plugins

extends:
  - paper_base
  - shared_plugins

server:
  limits:
    memory_limit: 2048
```

## Overlay fields

A mixin may define any of:

| Field | Notes |
|-------|--------|
| `server` | Partial overlay: software, version, image, path, limits, configs |
| `state` | volumes, mounts, copy, env |
| `annotations` | Arbitrary key/value metadata |

`save` is blueprint-only and is never taken from a mixin.

### Example

```yaml
mixin:
  id: shared_plugins
  description: Shared plugin jars for arcade games

state:
  copy:
    - files/SharedCore.jar:plugins/SharedCore.jar
    - files/AntiCheat.jar:plugins/AntiCheat.jar

  env:
    SHARED_CORE: "true"
```

## How merging works

When a blueprint lists mixins under `includes`:

1. Each mixin’s `extends` chain is flattened (parents first, then self).
2. Included mixins are merged left-to-right.
3. The blueprint’s own `server`, `state`, and `annotations` are merged on top.

**Precedence:** earlier includes → later includes → blueprint fields win.

Merge details:

| Field | Behavior |
|-------|----------|
| `server` scalars (`software`, `version`, `image`, `path`) | Non-empty overlay replaces |
| `server.limits` | Field-wise merge |
| `server.configs` | Merged by filename key; overlay wins |
| `state.volumes` | Same `name` replaces; new names append |
| `state.mounts` / `state.copy` | Append |
| `state.env` / `annotations` | Key overlay (later wins) |

## Using mixins from a blueprint

```yaml
blueprint:
  id: arcade
  name: Arcade
  type: minigame

includes:
  - shared_plugins
  - default_limits

server:
  software: paper
  version: "1.20.4"
```

See [`includes` on Creating blueprints](./creating-blueprints#includes) for field details.

::: tip Bulk-edit includes with bpctl
Need to add or remove the same mixin across many blueprints? Use [bpctl](https://github.com/SL-Network/bpctl) to rewrite only the `includes` field in place:

```bash
bpctl includes add shared_plugins --type minigame
bpctl includes add shared_plugins --software paper --version '>=1.18 <=1.20.4'
bpctl includes remove default_limits -p ./blueprints
bpctl includes add shared_plugins -n   # dry-run
```

Filters (`--type`, `--software`, `--version`, `-p`) can be combined. Everything else in each file stays unchanged.
:::

## Inspecting resolved mixins

After load, Protocube (and vSLS) expose **resolved** mixins — `extends` chains are already flattened. In-game:

```text
/sls mixin <mixin_id>
```

Blueprint inspection similarly shows the result after `includes` are applied:

```text
/sls blueprint <blueprint_id>
```

See [vSLS commands](../vsls/commands#mixin).
