# Protocube Plugin API

::: warning
The Plugin API is experimental and currently in development; **functionality is limited at this time**.
:::

Protocube can load **Go plugins** (`.so` shared objects) and exposes a small API so you can add your own logic: HTTP routes on the Gin router, access to the blueprint registry, logging, and more.

## Plugin directory

Place compiled plugins in the **Protocube plugins directory** configured for your install. The default path is:

`/var/lib/sls/plugins`

Protocube walks this directory recursively and loads every file whose extension is **`.so`**.

## Building a plugin

Build your plugin module as a Go plugin (shared library):

```bash
go build -buildmode=plugin -o myplugin.so
```

Use the **same Go toolchain and compatible dependency versions** as the Protocube binary you run against; plugin ABI mismatches will fail at load time.

## Entry point

Each `.so` must export a package-level symbol named **`Plugin`** that implements the `Plugin` interface (see below). Protocube uses [`plugin.Open`](https://pkg.go.dev/plugin) and `Lookup("Plugin")` to retrieve it.

## `Plugin` interface and `SLS` context

The handler in Protocube passes a single context value into your plugin:

```go
type SLS struct {
	Logger            *log.Entry
	BlueprintRegistry *blueprint.Registry
	Router            *gin.Engine
	PluginsDir        string
	LoadBalancer      *balancer.Provider
}
```

```go
type Plugin interface {
	Name() string
	Authors() string
	Description() string
	Version() string

	OnEnable(sls *SLS) error
	OnDisable() error
}
```

On load, Protocube sets a logger field for your plugin name, calls `OnEnable(sls)`, and keeps the instance for later `OnDisable()` during shutdown.

## Loading behavior

- Only files ending in **`.so`** are considered.
- Each plugin must expose the **`Plugin`** symbol implementing the interface above.
- After a successful load, Protocube logs the plugin name, version, and authors, then runs `OnEnable`.
- On shutdown, `OnDisable` is called for each loaded plugin.

Implementation reference: [`protocube/plugins`](https://github.com/jessefaler/SLS/tree/main/protocube/plugins) in the [SLS repository](https://github.com/jessefaler/SLS).

## Minimal plugin

The following is a stripped-down skeleton you can copy as a starting point:

```go
package main

import (
	"protoxon.com/sls/protocube/plugins"
)

type MyPlugin struct{}

// Required: exported name "Plugin" for plugin.Lookup("Plugin").
var Plugin MyPlugin

const (
	name        = "MyPlugin"
	version     = "1.0.0"
	authors     = "Your name"
	description = "Short description of what this plugin does"
)

func (MyPlugin) Name() string        { return name }
func (MyPlugin) Version() string     { return version }
func (MyPlugin) Authors() string     { return authors }
func (MyPlugin) Description() string { return description }

func (MyPlugin) OnEnable(sls *plugins.SLS) error {
	sls.Logger.Infof("%s enabled", name)
	// Example: register routes on sls.Router, read data from sls.BlueprintRegistry, etc.
	return nil
}

func (MyPlugin) OnDisable() error {
	return nil
}
```

Adjust `module` path and imports to match your repo layout and the `protoxon.com/sls/...` modules you depend on.

## Full example: SlimePacks

For a complete example plugin (routing, config, updater, and resource-pack logic), see **[SlimePacks](https://github.com/jessefaler/SLS/tree/main/slimepacks)** in the SLS repository.
