# Software configurations

Software configurations define how SLS runs a specific server application. 

Each blueprint references a specific software configuration by its ID, along with a particular version of that software.

## Download preconfigured software configurations

The [SLS repository](https://github.com/jessefaler/SLS) ships preconfigured software YAML under [`software/`](https://github.com/jessefaler/SLS/tree/main/software).

You can copy these into Protocube’s configured software directory (default `/var/lib/sls/software`) or use them as templates.

<SoftwareRepoList />

## In this section

| Page | What it covers |
| --- | --- |
| Introduction (this page) | Overview of software configuration files and where they live |
| [Configuring software](./configuring-software) | How to author a `software:` YAML file: images, mappings, install script, limits, configs |
| [Paper](./examples/paper) | Full Paper example: images, mappings, install script, limits, configs |
