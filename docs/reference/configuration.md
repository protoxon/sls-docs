# Configuration

## Blueprint Sources {#blueprint-sources}

Protocube can sync blueprints (and mixins) from git repositories into the local blueprints directory before they are loaded. Configure this in Protocube’s `config.yml` (default path `/etc/sls/protocube/config.yml`) under the top-level `blueprint` key.

Remote sources are cloned into a cache under `system.blueprints`, then the chosen repository subdirectory is mirrored into `dest`. After sync, Protocube loads YAML from `system.blueprints` as usual (startup and blueprint reload). Local files that were never synced from a source are left alone.

```yaml
system:
  blueprints: "/var/lib/sls/blueprints"

blueprint:
  sources:
    - type: git
      url: "https://github.com/org/sls-blueprints.git"
      ref: "main"
      path: "."
      dest: "."
      update_on_reload: true
```

### Fields

| Field | Description |
|-------|-------------|
| `type` | Source type. Currently only `git` is supported. |
| `url` | Git repository URL (`https` or `ssh`). |
| `ref` | Branch, tag, or commit to check out. Defaults to `main`. |
| `path` | Subdirectory inside the repository to sync. Defaults to `.` (repository root). |
| `dest` | Path relative to `system.blueprints` where files are written. Defaults to `.`. |
| `auth.token` | Optional inline token for private **HTTPS** remotes. Prefer the `GITHUB_TOKEN` environment variable instead so secrets are not stored in config. SSH remotes use normal SSH credentials (`ssh-agent`) instead. |
| `update_on_reload` | When `true` (default), this source is refreshed on blueprint reload as well as startup. Set to `false` to sync only at startup. |

### Multiple sources

List multiple entries under `sources`. Each is synced in order. Use different `dest` values to keep packs separate:

```yaml
blueprint:
  sources:
    - type: git
      url: "https://github.com/org/shared-blueprints.git"
      ref: "v1.2.0"
      dest: "shared"
    - type: git
      url: "https://github.com/org/seasonal-events.git"
      ref: "main"
      path: "blueprints"
      dest: "events"
```

That lands under `system.blueprints` as `shared/…` and `events/…`, alongside any local YAML you keep there.

If two sources share the same `dest`, later sources overwrite the same relative filenames. Prefer distinct `dest` values unless you intentionally want an overlay. Blueprint and mixin **IDs** must still be unique across the whole tree; duplicates are skipped at load time.

### Private repositories

For HTTPS remotes, set `GITHUB_TOKEN` in the environment (preferred). Protocube always reads this variable for HTTPS auth:

```bash
export GITHUB_TOKEN=ghp_...
```

```yaml
blueprint:
  sources:
    - type: git
      url: "https://github.com/org/private-blueprints.git"
      ref: "main"
      dest: "private"
```

You can also put a token inline with `auth.token` (used only when `GITHUB_TOKEN` is unset):

```yaml
blueprint:
  sources:
    - type: git
      url: "https://github.com/org/private-blueprints.git"
      ref: "main"
      dest: "private"
      auth:
        token: "ghp_..."
```

## Host Mounts and Allowed Mounts {#host-mounts-and-allowed-mounts}

To mount explicit host paths into a server container, they must be declared in the daemon configuration. The daemon only allows bind mounts from paths listed in `allowed_mounts`, ensuring host filesystem access is explicitly controlled and restricted.

Any host path that needs to be exposed to containers must be added to this allowlist.

```yaml
allowed_mounts:
  - /path/on/host
  - /var/lib/data
```
