# vSLS

**vSLS** is a [Velocity](https://docs.papermc.io/velocity) plugin that lets you create and manage SLS servers from in-game commands. Allowing you to control and interact with your infrastructure directly from Minecraft.

Source and build instructions: [SLS `vsls` on GitHub](https://github.com/jessefaler/SLS/tree/main/vsls).

## Features

- Create and manage server instances
- Browse and inspect blueprints
- Monitor active servers and detailed instance info
- Manage nodes
- Simple matchmaking system: automatically creates servers when players queue for a blueprint via the join command

See **[Installing vSLS](./installation)** for requirements, download, and first-time configuration.

**[Configuring vSLS](./configuring)** documents `plugins/vsls/config.yml` and blueprint **`annotations.vsls`**.

## Permissions

Many administrative commands require:

```
sls.command.admin
```

To give this permission to players you will need a permissions plugin I recommend [LuckPerms](https://luckperms.net/download).

## Commands

Command documentation: **[vSLS commands](./commands)**.
