# Setup Wren CLI

[![Stand With Ukraine](https://raw.githubusercontent.com/vshymanskyy/StandWithUkraine/main/badges/StandWithUkraine.svg)](https://stand-with-ukraine.pp.ua)
![GitHub release](https://img.shields.io/github/v/release/fabasoad/setup-wren-action?include_prereleases)
![functional-tests](https://github.com/fabasoad/setup-wren-action/actions/workflows/functional-tests.yml/badge.svg)
![security](https://github.com/fabasoad/setup-wren-action/actions/workflows/security.yml/badge.svg)
![linting](https://github.com/fabasoad/setup-wren-action/actions/workflows/linting.yml/badge.svg)

This action sets up a [Wren CLI](https://wren.io/cli/).

## Supported OS

<!-- prettier-ignore-start -->
| OS      |                    |
|---------|--------------------|
| Windows | :white_check_mark: |
| Linux   | :white_check_mark: |
| macOS   | :white_check_mark: |
<!-- prettier-ignore-end -->

## Prerequisites

None.

## Inputs

```yaml
- uses: fabasoad/setup-wren-action@v1
  with:
    # (Optional) wren CLI version. Defaults to the latest version.
    version: "0.4.0"
    # (Optional) If "false" skips installation if wren CLI is already installed.
    # If "true" installs wren CLI in any case. Defaults to "false".
    force: "false"
    # (Optional) GitHub token that is used to send requests to GitHub API such
    # as downloading asset. Defaults to the token provided by GitHub Actions
    # environment.
    github-token: "${{ github.token }}"
```

## Outputs

<!-- prettier-ignore-start -->
| Name      | Description                           | Example |
|-----------|---------------------------------------|---------|
| installed | Whether wren CLI was installed or not | `true`  |
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
      - uses: actions/checkout@v4
      - uses: fabasoad/setup-wren-action@v1
      - name: Run script
        run: wren_cli ./hello-world.wren
```

### Result

```shell
Run wren_cli ./hello-world.wren
Hello World!
```
