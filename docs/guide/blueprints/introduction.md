# Blueprints

A Blueprint is a declarative configuration file that defines the full runtime specification for how a game server should be run.

SLS uses Blueprints to create server instances. You provide a Blueprint ID, and SLS provisions the server based on that definition.

Because Blueprints are fully declarative and reproducible, a single Blueprint can be used to create unlimited identical server instances. Each instance will behave consistently and remain isolated from others, making scaling and deployment predictable across the system.

## What a Blueprint defines

- What server software to use
- Which version to run
- How much CPU, RAM, and disk it can use
- What Docker image to run it in
- What files and folders the server needs
- What environment variables and configs to apply
- What should happen when the server starts or stops

For examples see [Blueprint examples](./examples/).

## In this section

| Page                                         | What it covers                                                                                      |
|----------------------------------------------|-----------------------------------------------------------------------------------------------------|
| Introduction (this page)                     | What Blueprints are and how SLS uses them                                                           |
| [Creating blueprints](./creating-blueprints) | How to author a Blueprint YAML file: metadata, `includes`, `server`, `state`, persistence, annotations |
| [Mixins](./mixins)                           | Reusable overlays composed into blueprints via `includes`                                           |
| [Examples overview](./examples/)             | Block Hunt, vSLS, plugins, volumes, config patches, and more                                        |
