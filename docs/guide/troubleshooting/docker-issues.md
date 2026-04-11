# Docker issues

## `failed to configure docker environment` / `invalid pool request: Pool overlaps with other one on this address space`

Example error:

```
failed to configure docker environment error=Error response from daemon: invalid pool request: Pool overlaps with other one on this address space
```

### What it means

The subnet configured in your daemon config file cannot be created because there is already an existing Docker network using an overlapping subnet range.

### Fix

#### 1) Try removing unused Docker networks

```bash
docker network prune
```

#### 2) If the issue persists, change your network configuration

Locate your Docker network configuration in your daemon config file. It will look similar to this:

```yaml
interface: 172.28.0.1
interfaces:
  v4:
    subnet: 172.28.0.0/16
    gateway: 172.28.0.1
  v6:
    subnet: fdba:17c8:6c94::/64
    gateway: fdba:17c8:6c94::1011
```

Update the IPv4 `subnet` and `interface` to a range that does not overlap with any existing Docker networks.

- The `interface` IP must be within the configured subnet.

### Checking existing networks

To view your current Docker networks and their subnets, run:

```bash
docker network ls
docker network inspect bridge
```

---

If you are still stuck, ask in the [Discord](https://discord.gg/BrH8GtyGSh) **help** channels.

