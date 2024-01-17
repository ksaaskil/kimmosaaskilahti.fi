# [kimmosaaskilahti.fi](https://kimmosaaskilahti.fi)

My home page made with [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/).

[![GitHub Actions](https://github.com/ksaaskil/kimmosaaskilahti.fi/actions/workflows/python.yml/badge.svg)](https://github.com/ksaaskil/kimmosaaskilahti.fi/actions/workflows/python.yml)
[![Netlify Status](https://api.netlify.com/api/v1/badges/2813de34-3363-4ca8-8136-e60c0088a8a6/deploy-status)](https://app.netlify.com/sites/jovial-chandrasekhar-6b410b/deploys)

## Usage

### Install dependencies

```sh
pip install -r requirements.txt
```

### Run development server

```sh
mkdocs serve
```

### Export static files

```sh
mkdocs build
```

## Development

Install development dependencies:

```sh
pip install -r requirements-dev.txt
```

Install pre-commit hooks:

```sh
pre-commit install
```

Run all files if needed:

```sh
pre-commit run --all-files
```

Create Python environment with Conda:

```sh
# Run this once
conda env create -f condaenv.yaml
conda activate kimmosaaskilahti.fi
```