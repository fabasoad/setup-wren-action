# Setup Wren CLI

![GitHub release](https://img.shields.io/github/v/release/fabasoad/setup-wren-action?include_prereleases) ![Unit Tests](https://github.com/fabasoad/setup-wren-action/workflows/Unit%20Tests/badge.svg) ![Functional Tests](https://github.com/fabasoad/setup-wren-action/workflows/Functional%20Tests/badge.svg) ![Security Tests](https://github.com/fabasoad/setup-wren-action/workflows/Security%20Tests/badge.svg) [![pre-commit.ci status](https://results.pre-commit.ci/badge/github/fabasoad/setup-wren-action/main.svg)](https://results.pre-commit.ci/latest/github/fabasoad/setup-wren-action/main) [![Total alerts](https://img.shields.io/lgtm/alerts/g/fabasoad/setup-wren-action.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/fabasoad/setup-wren-action/alerts/) [![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/fabasoad/setup-wren-action.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/fabasoad/setup-wren-action/context:javascript) [![Maintainability](https://api.codeclimate.com/v1/badges/e259e98506d3691ab916/maintainability)](https://codeclimate.com/github/fabasoad/setup-wren-action/maintainability) [![Test Coverage](https://api.codeclimate.com/v1/badges/b49fa7426cb26ac028a9/test_coverage)](https://codeclimate.com/github/fabasoad/setup-wren-action/test_coverage) [![Known Vulnerabilities](https://snyk.io/test/github/fabasoad/setup-wren-action/badge.svg?targetFile=package.json)](https://snyk.io/test/github/fabasoad/setup-wren-action?targetFile=package.json)

This action sets up a [Wren CLI](https://wren.io/cli/).

## Inputs

| Name    | Required | Description                                                                           | Default | Possible values  |
|---------|----------|---------------------------------------------------------------------------------------|---------|------------------|
| version | No       | wren version that can be found [here](https://github.com/wren-lang/wren-cli/releases) | `0.4.0` | `0.3.0`, `0.4.0` |

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
