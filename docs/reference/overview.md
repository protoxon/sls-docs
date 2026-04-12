# Reference overview

This section holds documentation for parts of the SLS system.

## Protocube HTTP API

Documentation for the Protocube application API:

- [SLS API](/reference/api/) — authentication, errors, and endpoints

Implementation source: [`protocube/api/router/`](https://github.com/jessefaler/SLS/tree/main/protocube/api/router) in the [SLS repository](https://github.com/jessefaler/SLS).

## Protocube plugin API

Extend Protocube with **Go plugins** (`.so` files): routes, blueprint registry access, and more — see [Plugin API](./plugin-api).

## Configuration

Daemon / Protocube `config.yml` [Configuration](./configuration).

## CLI

Protocube binary: global flags (`--config`, `--debug`), `version`, and API key subcommands: [CLI](./cli).