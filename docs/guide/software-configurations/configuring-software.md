# Configuring software

It is recommended to check whether your desired software configuration already exists in the [SLS `software` directory on GitHub](https://github.com/jessefaler/SLS/tree/main/software) before creating your own from scratch.

For a full example, see the [Paper example](./examples/paper).

## Create a software configuration file

Create a YAML file in **Protocube’s configured software directory**. The default path is:

`/var/lib/sls/software`

Each file defines a top-level `software:` block.

## `id` and `name`

Set a unique identifier and a human-readable name:

```yaml
  id: 'paper'
  name: 'Paper'
```

## `images`

Configure Docker images that blueprints can use for this software. Keys are arbitrary labels; values are image references (for example `registry/repo:tag`):

```yaml
  images:
    "java_25": "ghcr.io/protoxon/images:java_25"
    "java_21": "ghcr.io/protoxon/images:java_21"
```

Add one entry per runtime variant you want to support. The [Paper example](./examples/paper) lists a full set of Java images.

## `mappings` (optional)

If you omit `mappings`, blueprints must specify which image to use (for example with `server.image`).

Mappings tie a **server or game version** to an **image key** from `images`. Each list item maps one image key to a **comparator expression** over versions.

Supported comparators: `>`, `>=`, `<`, `<=`, `==`, and `=`. A bare version means equality (for example `1.18` behaves like `==1.18`). You can combine ranges, such as `">=1.18 <=1.20.4"`.

Examples of comparator strings: `"<=1.16.5"`, `">=1.17"`, `">=1.18 <=1.20.4"`.

```yaml
  mappings:
    - java_21: ">=1.20.5 <=1.21.11"
    - java_25: ">=1.21.12"
    - default: java_21
```

## `invocation`

The command run to **start** the server inside the container:

```yaml
  invocation: "java -Xms128M -XX:MaxRAMPercentage=95.0 -jar server.jar"
```

## `stop-command`

Sent to the server console to request a **graceful stop**:

```yaml
  stop-command: "stop"
```

## `online-signal`

Console text that indicates the server has **finished starting** and is fully online. SLS watches for this substring in the log output:

```yaml
  online-signal: ")! For help, type"
```

## `install-script` (optional)

The **`install-script`** block is optional. If you **omit** it, SLS does not run an automated install for this software you must **manually install the base server files on each node** (in the layout your deployment expects under the configured servers directory).

When present, the install script runs **once per software version** on a node to download and prepare shared server files. Those files live under your configured **servers** directory (default **`/var/lib/sls/servers`**) and are **reused** for every instance that uses the same software version.

The script should fetch required artifacts and **warm up** the server so later instances start quickly.

Review the [scripts in `SLS/software`](https://github.com/jessefaler/SLS/tree/main/software) for complete implementations.

Minimal structure:

```yaml
  install-script:
    entrypoint: bash
    script: "#!/bin/bash\necho \"hello\""
    skip_scripts: false
```

- **`entrypoint`** - how the script is executed.
- **`script`** - the install script body.
- **`skip_scripts`** - when `true`, the script is not ran, and it is assumed the server files already exist on the node.

## `limits`

Default resource limits for blueprints using this software (blueprint `server.limits` can override individual fields):

```yaml
  # Default limits
  limits:
    memory_limit: 4096
    swap: 0
    io_weight: 500
    cpu_limit: 0
    disk_space: 8192
    threads: ""
    oom_disabled: true
```

## `configs`

Optional **config patches** applied at startup:

```yaml
  # Config patch to set the server ip and port
  configs:
    server.properties:
      parser: properties
      find:
        server-ip: "0.0.0.0"
        server-port: "{{server.build.default.port}}"
        query.port: "{{server.build.default.port}}"
```

For the blueprint oriented overview of patching, see [Config patches](../blueprints/examples/config-patches).
