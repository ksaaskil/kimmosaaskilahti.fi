# [kimmosaaskilahti.fi](https://kimmosaaskilahti.fi)

My home page made with [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/).

[![GitHub Actions](https://github.com/ksaaskil/kimmosaaskilahti.fi/actions/workflows/python.yml/badge.svg)](https://github.com/ksaaskil/kimmosaaskilahti.fi/actions/workflows/python.yml)

## Usage

### Install dependencies

Install [uv](https://docs.astral.sh/uv/) and run:

```sh
uv sync
```

### Run development server

```sh
uv run mkdocs serve
```

### Export static files

```sh
uv run mkdocs build
```

## Development

Install pre-commit hooks:

```sh
uv run pre-commit install
```

Run all files if needed:

```sh
uv run pre-commit run --all-files
```
