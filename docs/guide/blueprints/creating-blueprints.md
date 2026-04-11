# Creating blueprints

Blueprints are YAML files that define how a server should run, including the software and version, container image, resource limits, configuration patches, filesystem layout, and environment variables.

For background, see [Blueprints introduction](./introduction). For software definitions (images, mappings, install scripts), see [Configuring software](../software-configurations/configuring-software) and the [Paper example](../software-configurations/examples/paper).

## Create a blueprint file

Create a YAML file in **Protocube’s configured blueprints directory**. The default path is:

`/var/lib/sls/blueprints`

## `blueprint`

Metadata for the Blueprint.

```yaml
blueprint:
  id: "blueprint"           # Unique slug ID
  name: "Blueprint Name"    # Human-readable name
  type: "game"              # Arbitrary grouping tag
```

- **`id`** — Unique slug used to reference this Blueprint.
- **`name`** — Display name.
- **`type`** — Grouping label for your own organization or tooling.

## `server`

Runtime configuration: which [software configuration](../software-configurations/configuring-software) and version to use, optional Docker image key, resource limits, and config patches applied at startup.

### `software` and `version`

- **`software`** — ID of the [software configuration](../software-configurations/introduction) this Blueprint uses when creating an instance.
- **`version`** — The version of software to use.

```yaml
server:
  software: "platform"
  version: "1.0.0"
```

### `image`

**Optional if mappings are defined in your software configuration.**

`image` is the Docker container image to use when running the server. The value is the image ID (key) you defined in that software configuration’s `images` map.

```yaml
server:
  image: "java_25"
```

Example `image` in a software configuration:

```yaml
images:
  "java_25": "ghcr.io/protoxon/images:java_25"
```

For more information, see [Software: images](../software-configurations/configuring-software#id-and-name).

If your software configuration defines [mappings](../software-configurations/configuring-software#mappings-optional), `image` is optional: SLS will pick the image automatically from the `version` you set.

### `limits`

Resource limits for the server container:

| Field          | Description                                                                                                                                                                                                         |
|----------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `memory_limit` | Total memory in **mebibytes** the server may use on the host.                                                                                                                                                       |
| `swap`         | Additional swap space for the container.                                                                                                                                                                            |
| `io_weight`    | The relative weight for IO operations in a container. This is relative to other<br/>containers on the system and should be a value between 10 and 1000.                                                             |
| `cpu_limit`    | The percentage of CPU that this instance is allowed to consume relative to<br/>the host. A value of 200% represents complete utilization of two cores. This<br/>should be a value between 1 and THREAD_COUNT * 100. |
| `disk_space`   | The amount of disk space in **megabytes** that a server is allowed to use.                                                                                                                                          |
| `threads`      | Which CPU threads the Docker instance may use.                                                                                                                                                                      |
| `oom_disabled` | Terminates the server if it breaches the memory limits. <br/>Enabling OOM killer may cause server processes to exit unexpectedly.                                                                                   |

```yaml
server:
  limits:
    memory_limit: 4096
    swap: 1024
    io_weight: 500
    cpu_limit: 200
    disk_space: 5120
    threads: ""
    oom_disabled: false
```

### `configs`

`configs` define configuration patches that are applied when your server starts. They let you set specific config values for your blueprint. For more examples, see [Config Patch Examples](/guide/blueprints/examples/config-patches).

```yaml
  configs:
    server.properties:
      parser: properties
      find:
        motd: "Blueprint Server"
```

## `state`

`state` describes filesystem layout and environment: SLS-managed volumes, optional explicit host mounts, file copies into the server tree, and environment variables.

### `volumes` {#volumes}

Volumes are directories managed by SLS that can be mounted into server containers.

By default, they are stored at `/var/lib/sls/volumes`.

They make it easy to add custom folders to your server environment.

Each volume entry uses:

- **`name`** — A unique name for the volume.
* **`source`** — Path on the host, relative to the volumes directory.
- **`target`** — Mount point inside the container.
- **`mode`** — One of `cow`, `rw`, or `ro`:
  - **`cow`** (default) — Copy-on-write volume.

    > Recommended for most use cases. Multiple servers can share the same base files without conflicts. Only modified files are written per instance, while unchanged data is shared. Directories are automatically merged when multiple volumes target the same path.
  - **`rw`** — Read/write bind mount.
  - **`ro`** — Read-only bind mount.

```yaml
state:
  volumes:
    # Example server world state
    - name: "world"
      source: "worlds/world"     # Resolved to /sls/volumes/worlds/world
      target: "/world"           # Mount point inside the container
      mode: cow                  # cow | ro | rw (default: cow)

    # You can also use a shorthand format if you prefer:
    # name:source:target[:mode]
    - world:worlds/world:/world:cow
```

### `mounts` {#mounts}

**Explicit host mounts** bind paths on the host directly into the container. They must be listed in the daemon’s `allowed_mounts`. See [Host Mounts and Allowed Mounts](/reference/configuration#host-mounts-and-allowed-mounts) for how to configure the daemon.

These mounts are attached at the root of the container filesystem (`/`). If you want to mount into the server’s files, use **`/home/container`** (or a path under it) as the mount target.

```yaml
state:
  mounts:
    - /host/path:/home/container:ro
```

### `copy` {#copy}

Copy files into the server filesystem when the instance is created. Destinations are always relative to the server filesystem.

Paths inside the SLS folder can always be used as sources. Sources outside the SLS folder must be allowed in the daemon configuration; see [Host Mounts and Allowed Mounts](/reference/configuration#host-mounts-and-allowed-mounts).

```yaml
state:
  copy:
    - sls/files/config.yml:plugins/config.yml
```

### `env` {#env}

Environment variables for the server process.

```yaml
state:
  env:
    VAR: "var"
    ENABLE_FEATURE_X: "true"
```

## `save`

Whether instances created from this Blueprint persist after shutdown.

- **`false`** (default) — Instances are treated as **ephemeral**: when the server stops, the instance and non-persistent volume state are removed.
- **`true`** — The server instance is kept after shutdown, including its filesystem state and allocations, and can be restarted later.

## `annotations`

Annotations are arbitrary key/value metadata intended for external systems.

They allow you to attach custom data to a Blueprint that can be retrieved via the API and interpreted by your own tooling or services.

```yaml
annotations:
  maintainer: "Maintainer"
  tags: ["game", "example"]
```
