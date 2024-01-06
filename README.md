# Setup Wren CLI

[![Stand With Ukraine](https://raw.githubusercontent.com/vshymanskyy/StandWithUkraine/main/badges/StandWithUkraine.svg)](https://stand-with-ukraine.pp.ua)
![GitHub release](https://img.shields.io/github/v/release/fabasoad/setup-wren-action?include_prereleases)
![functional-tests](https://github.com/fabasoad/setup-wren-action/actions/workflows/functional-tests.yml/badge.svg)
![security](https://github.com/fabasoad/setup-wren-action/actions/workflows/security.yml/badge.svg)
![linting](https://github.com/fabasoad/setup-wren-action/actions/workflows/linting.yml/badge.svg)

This action sets up a [Wren CLI](https://wren.io/cli/).

## Prerequisites

The following tools have to be installed for successful work of this GitHub action:

- Linux, macOS: [wget](https://www.gnu.org/software/wget/), [unzip](https://linux.die.net/man/1/unzip).
- Windows: [pwsh](https://github.com/PowerShell/PowerShell)

## Inputs

<!-- prettier-ignore-start -->
| Name    | Required | Description                                                                           | Default | Possible values  |
|---------|----------|---------------------------------------------------------------------------------------|---------|------------------|
| version | No       | wren version that can be found [here](https://github.com/wren-lang/wren-cli/releases) | `0.4.0` | `0.3.0`, `0.4.0` |
<!-- prettier-ignore-end -->

## Example usage

Let's try to run `hello-world.wren` file with the following content:

```java
System.print("Hello World!")
```

### Workflow configuration

```yaml
name: Setup Wren CLI

on: push

jobs:
  setup:
    name: Setup
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@main
      - uses: fabasoad/setup-wren-action@main
      - name: Run script
        run: wren_cli ./hello-world.wren
```

### Result

```shell
Run wren_cli ./hello-world.wren
Hello World!
```
