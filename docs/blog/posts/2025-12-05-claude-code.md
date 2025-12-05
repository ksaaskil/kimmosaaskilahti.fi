---
title: Tips for efficient coding with Claude Code
draft: true
tags:
  - AI
date: 2025-12-05
categories:
  - Software development
authors:
  - ksaaskil
---

# Tips for Efficient Coding with Claude Code

This Fall I have adopted Claude Code as my primary AI coding assistant. In this blog post, I'd like to share some of my learnings how to use the tool efficiently.

<!-- more -->

To get started with Claude Code, I recommend reading [Claude Code overview](https://code.claude.com/docs/en/overview) and Anthropic's blog post [_Claude Code: Best practices for agentic coding_](https://www.anthropic.com/engineering/claude-code-best-practices). They cover many of the tips presented below.

## Setup Claude

After installing Claude Code, run `claude` inside your code repository to start Claude Code in your terminal. Before doing anything else, I suggest setting up [`CLAUDE.md`](https://www.claude.com/blog/using-claude-md-files) and [`./claude/settings.json`](https://code.claude.com/docs/en/settings).

To create `CLAUDE.md`, first check that your repository README.md is up-to-date and contains all the relevant documentation and commands any human developer would need in order to perform tasks such as installing dependencies, formatting, linting, running unit tests, etc. Then you can ask Claude to explore the code base and create the `CLAUDE.md` file by running the `/init` command.

Carefully review the `CLAUDE.md` file that Claude proposes. It might be overly verbose and focus on aspects that you do not care about. Keep `CLAUDE.md` relatively short! The longer the file is, the larger Claude Code's context will become and the worse results you will get in daily coding. The file should explain, at least, the repository structure, code quality standards (briefly) and the most important commands to run for each language in the repository. You do not need to tell Claude the intricacies of the whole system architecture – you can explicitly explain those if the need arises.

Here's an example of one of my team's repositories for quality standards for Python and Git:

```md
## Quality Standards

### Python (v2)

- Use `uv` for dependency management
- Follow Ruff formatting and linting
- Type-check with Pyright
- Write unit tests with pytest
- Use SQLAlchemy for database models
- Use `logger = src.get_logger(__name__)` for logging
- Small try-except blocks; log with `logger.exception()` without including error in message
- Raise exceptions instead of swallowing them
- Add imports at top-level

### Git

- Keep commit messages concise and brief
- **Use `main` branch as the repository default branch against which pull requests are made**
- Create pull requests in draft mode
- Format the PR title as: `<TICKET_ID> Description in imperative format`.
  - Example title: `ABC-3795 Add notification analytics to analytics endpoint`
- In PR description, include concise summary explaining changes in functionality and the list of changes
```

There are similar quality standards setup also for TypeScript and Markdown files.

After quality standards, our `CLAUDE.md` explains the commands to run for various tasks:

````md
## Quality Check Commands

### Python

```bash
# Install dependencies
uv sync --locked --all-extras --dev

# Format code
uv run ruff format

# Fix linting issues
uv run ruff check --fix

# Type checking
uv run pyright

# Run unit tests
uv run pytest

# Start local database in the background
docker compose up db -d

# Run unit tests that do not require local database
uv run pytest -m "not db"
```
````

After setting up `CLAUDE.md`, I recommend setting up also the `.claude/settings.json` file. Typical file might look something as follows:

```json
{
  "env": {
    "CLAUDE_CODE_USE_BEDROCK": "1",
    "AWS_REGION": "eu-west-1",
    "AWS_PROFILE": "<AWS-PROFILE>",
    "MAX_THINKING_TOKENS": "1024",
    "CLAUDE_CODE_MAX_OUTPUT_TOKENS": "4096",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "eu.anthropic.claude-haiku-4-5-20251001-v1:0",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "eu.anthropic.claude-sonnet-4-5-20250929-v1:0",
    "ANTHROPIC_MODEL": "Sonnet"
  },
  "statusLine": {
    "type": "command",
    "command": "input=$(cat); printf \"\\033[36m(%s)\\033[0m %s in \\033[32m%s\\033[0m\" \"${AWS_PROFILE:-default}\" \"$(echo \"$input\" | jq -r '.model.display_name')\" \"$(basename \"$(echo \"$input\" | jq -r '.workspace.current_dir')\")\""
  },
  "permissions": {
    "allow": [
      "Bash(yarn --version)",
      "Bash(yarn install)",
      "Bash(yarn typecheck)",
      "Bash(yarn test)",
      "Bash(yarn lint)",
      "Bash(uv sync --locked --all-extras --dev)",
      "Bash(uv run pytest:*)",
      "Bash(uv run ruff format:*)",
      "Bash(uv run ruff check:*)",
      "Bash(uv run ruff check --fix:*)",
      "Bash(uv run pyright:*)",
      "Bash(gh pr view:*)"
    ],
    "deny": [],
    "ask": []
  }
}
```

In the `env` section, specify all the necessary environment variables you need to setup connection to the large language model. The example above is for Bedrock. The `statusLine` configures Claude Code to show the currently active AWS profile, model name and current working directory.

Under `permissions`, we can explicitly give Claude the permission to run specific commands without asking. Useful permitted commands include installing dependencies, type-checking, running unit-tests, formatting and linting. I have also given Claude the permission to view pull request details. Actively expand and modify the list of permitted and denied commands as you gain more confidence and experience about working with Claude Code.
