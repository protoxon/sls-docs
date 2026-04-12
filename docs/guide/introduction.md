# ![SLS Standalone Logo](https://cdn.modrinth.com/data/cached_images/7115a8404f7d6a94fd7aab586d6c4de1e9b3846c.png)

**SLS** is a system for managing networks of **ephemeral game servers**, designed for games like **Minecraft, Hytale, Garry’s Mod, and Rust**. It lets you **spin up and tear down servers quickly**, with each server **fully isolated and reproducible**.

---

Servers are defined using [**Blueprints**](./blueprints/introduction), where you can specify everything from:

* Server version and resource limits
* Volumes mounts
* Config patches
* Custom configuration

From a single [Blueprint](./blueprints/introduction), you can create **as many server instances as needed**.

## Key Components

* [**Protocube**](./installing-protocube) – The **core controller** of SLS. Tracks all servers, provides an API for management, and routes requests to backend nodes.
* [**Daemon**](./installing-daemon) (nodes) – The **server control plane**. Runs on each physical machine, connects to Protocube, and manages servers inside Docker containers.
* [**S4J**](/reference/api/) – A **Java API wrapper** for the SLS API.
---

> SLS is ideal for networks that need **fast, consistent, and isolated server environments**. Whether you’re running **minigames**, **private worlds**, or **large server networks**, SLS gives you **full control** over how servers are **created, configured, and managed**.

## Features

* **Isolated & Reproducible Environments**
  Every server runs in its own Docker container and is created exactly as defined in its [Blueprint](./blueprints/introduction) ensuring consistency across every instance.

* **Zero-Copy Instancing (COW)**
  Avoid repeated file copying and reinstallations. SLS uses copy-on-write mounts to efficiently create new servers with minimal overhead.

* **Horizontal Scaling**
  Easily scale your network by adding more nodes. SLS automatically utilizes available resources across your infrastructure.

* **Real-Time Status & Events**
  Track server lifecycle states (starting, online, stopping) and subscribe to an event stream for real-time updates.

* **Built-in Load Distribution**
  Servers are automatically distributed across nodes to balance load and optimize resource usage.

* **Custom Software Support**
  Define and run your own server types using flexible [software configurations](./software-configurations/introduction).

* **HTTP API Control**
  Fully manage servers programmatically through a simple and powerful HTTP API.

## Demo

A live demo **Minecraft** network is available if you want to try SLS in action.

* **Server address:** `demo.protoxon.com`

This demo showcases how servers can be dynamically created and managed in a real environment.

The demo utilizes the [**vSLS**](./vsls) plugin.

## More Information

For full documentation, examples, and source code, view the **[SLS GitHub repository](https://github.com/jessefaler/SLS)**.
