# Configuration

## Host Mounts and Allowed Mounts {#host-mounts-and-allowed-mounts}

To mount explicit host paths into a server container, they must be declared in the daemon configuration. The daemon only allows bind mounts from paths listed in `allowed_mounts`, ensuring host filesystem access is explicitly controlled and restricted.

Any host path that needs to be exposed to containers must be added to this allowlist.

```yaml
allowed_mounts:
  - /path/on/host
  - /var/lib/data
```
