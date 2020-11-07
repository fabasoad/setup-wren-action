# Setup {PROJECT_TITLE}
![GitHub release](https://img.shields.io/github/v/release/fabasoad/{PROJECT_NAME}?include_prereleases) ![CI (latest)](https://github.com/fabasoad/{PROJECT_NAME}/workflows/CI%20(latest)/badge.svg) ![CI (main)](https://github.com/fabasoad/{PROJECT_NAME}/workflows/CI%20(main)/badge.svg) ![YAML Lint](https://github.com/fabasoad/{PROJECT_NAME}/workflows/YAML%20Lint/badge.svg) [![Total alerts](https://img.shields.io/lgtm/alerts/g/fabasoad/{PROJECT_NAME}.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/fabasoad/{PROJECT_NAME}/alerts/) [![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/fabasoad/{PROJECT_NAME}.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/fabasoad/{PROJECT_NAME}/context:javascript) [![Maintainability](https://api.codeclimate.com/v1/badges/e259e98506d3691ab916/maintainability)](https://codeclimate.com/github/fabasoad/{PROJECT_NAME}/maintainability) [![Known Vulnerabilities](https://snyk.io/test/github/fabasoad/{PROJECT_NAME}/badge.svg?targetFile=package.json)](https://snyk.io/test/github/fabasoad/{PROJECT_NAME}?targetFile=package.json)

This action sets up a [{PROJECT_TITLE}]({PROJECT_URL}).

## Inputs
| Name    | Required | Description                                                     | Default | Possible values |
|---------|----------|-----------------------------------------------------------------|---------|-----------------|
| version | Yes      | {PROJECT_TITLE} version that can be found [here]({PROJECT_URL}) |         | &lt;String&gt;  |

## Example usage

### Workflow configuration

```yaml
name: Setup {PROJECT_TITLE}

on: push

jobs:
  setup:
    name: Setup
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v1
      - uses: fabasoad/{PROJECT_NAME}@main
        with:
          version: {PROJECT_VERSION}
      - name: Run script
        run: {EXAMPLE}
```

### Result
