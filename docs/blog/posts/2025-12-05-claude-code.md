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

I have recently adopted Claude Code as my primary AI coding assistant. In this blog post, I'd like to share some of my learnings on how to use the tool efficiently.

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

After setting up `CLAUDE.md`, I recommend setting up also the `.claude/settings.json` file. Typical file for Bedrock users might look something as follows:

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

In the `env` section, specify all the necessary environment variables you need to setup connection to the large language model. You can also add [`statusLine`](https://code.claude.com/docs/en/statusline) to configure Claude Code to show, say, the currently active AWS profile, model name and the current working directory in the terminal window.

Under `permissions`, configure Claude with permissions to run specific commands without asking. Useful permitted commands include, for example, installing dependencies, type-checking, running unit-tests, formatting and linting.

Actively expand and modify both `CLAUDE.md` and `settings.json` as you gain more confidence and experience about working with Claude Code.

## Use the plan mode

Okay, you're ready to start coding now. I highly recommend using [the plan mode](https://code.claude.com/docs/en/common-workflows#use-plan-mode-for-safe-code-analysis) for all but the simplest tasks. Press `Shift+Tab` twice to activate the plan mode.

Here's an example prompt I recently used in the plan mode:

> I want to explore the proper number of clusters using different embedding cluster valuers. I want to use the silhouette analysis similar to https://scikit-learn.org/stable/auto_examples/cluster/plot_kmeans_silhouette_analysis.html.
>
> Create new file tools/model_selection_pipeline/explore_clustering.py that can be executed as a script using given train_file. The script should run over cluster numbers from 10 to 100 on steps of 10 and provide the average silhouette scores. The script should also provide helpful images about clustering to make it easier to understand how many clusters we need for classification.

After giving Claude this task to plan, it started exploring the codebase and came up with a reasonably good plan. I was not completely happy with the plan, though, so I asked to Claude to modify the plan. After a few iterations, I accepted the plan and gave Claude the permission to implement the plan. The final result was exactly what I wanted.

It is very useful to give Claude as much context as possible already in the prompt. If you know already what files Claude should be looking at or modifying, add them to Claude's context with `@<path-to-file>`. This reduces frustration and saves both time and money.

Always take small steps. Personally, I do not recommend asking Claude to complete big tasks in one go even in the planning mode. Split the large task into smaller milestones using _your_ expertise as a software developer.

For example, If the feature you're building requires modifications in the backend, frontend and infrastructure code, you can split the task into one milestone per component. Implement each milestone via the plan mode, adding unit tests and other necessary quality assurance along the way. Remember to [keep pull requests small](./2025-09-26-power-of-small-pull-requests.md) even when working with Claude!

## Use Git working trees

As you gain more experience about working with Claude, you will notice that you're able to work on multiple tasks in the background. At this point, using [Git working trees](https://git-scm.com/docs/git-worktree) becomes very helpful. Using git working trees is also documented as a recommended workflow in [Claude Code common workflows](https://code.claude.com/docs/en/common-workflows#run-parallel-claude-code-sessions-with-git-worktrees).

Git working trees enable working on multiple features simultaneously in the same repository. Each working tree is an isolated workspace with its own feature branch. To start working in a new working tree, first create a new terminal window, create the working tree with the `git worktree add` command (shortcut `gwta` in the oh-my-zsh Git plugin) and navigate to the new folder. Start Claude inside the new folder and give it any time-consuming planning or implementation task. Claude can then freely work on the codebase in isolation without affecting other working trees.

Enable terminal notifications to get a notification when Claude Code is waiting for your input. Claude may get stuck at any point, waiting for additional information or permissions to run some commands.

## Use Claude to create Git commits and pull requests

You can tell Claude simply to "commit" and it will know what to do, asking for your permission to add files to Git index and then create a new Git commit with a descriptive message. The commit messages are usually very descriptive, sometimes even too verbose. Modify `CLAUDE.md` to your liking. You can also tell Claude to "push" to push the branch to GitHub.

Claude can also create pull requests. If you're working on GitHub, install the [GitHub CLI](https://cli.github.com/) and log in. Tell Claude to create a pull request and it will ask for permission to run `gh pr create` command with a very descriptive description. Update the Git section in your `CLAUDE.md` to tell Claude how to create pull requests as you like them. For example, you probably want all pull requests to be created in the draft mode.

You can also tell Claude "commit push pr" and it will perform all three steps.

## Use Claude to fix "papercuts"

Recent [blog post](https://www.anthropic.com/research/how-ai-is-transforming-work-at-anthropic) by Anthropic contained very interesting insights on how Claude Code is used for engineering at Anthropic. One of the observations in the post said:

> Claude fixes a lot of “papercuts”. 8.6% of Claude Code tasks involve fixing minor issues that improve quality of life, like refactoring code for maintainability (that is, “fixing papercuts”) that people say would typically be deprioritized. These small fixes could add up to larger productivity and efficiency gains.

My experience supports this observation. I have used Claude Code to fix many minor issues that would not have been prioritized by the team. Using Git working trees, I can work on minor issues in the background and simultaneously work on something "more important" in the foreground. In the long run, I believe the fixing of papercuts with Claude greatly improves the overall health of the codebase.

As an example, I recently used Claude Code to implement daily Slack notifications about our services' usage statistics and customer feedback. This was a nice-to-have feature that probably would not have been prioritized in the team's cycle planning. With Claude Code, I was able to implement the feature in the background with relatively little effort. The reception to this feature has been very positive. Developers, product managers and stakeholders alike enjoy these daily notifications as they turn complex statistics into simple and easy-to-understand summaries and make them available without extra effort.

## Create new skills using the skill-creator skill

Anthropic recently introduced [agent skills](https://code.claude.com/docs/en/skills) for Claude.
According to the docs, "skills are modular capabilities that extend Claude’s functionality through organized folders containing instructions, scripts, and resources."

To create new skills in Claude Code, I recommend using the [`skill-creator`](https://github.com/anthropics/skills/tree/main/skills/skill-creator) skill from Anthropic. The skill can be installed using the `/plugin` command as explained in the repository [`README.md`](https://github.com/anthropics/skills/tree/main). Invoke the skill with `/skill-creator` and explain Claude what skill you want to build. The skill provides guidance for creating new effective skills and I recommend using the `skill-creator` skill always when updating your own skills.

As an example, I recently created a skill for developing the machine learning models in one of our code repositories. Using the skill, I can tell Claude Code to run machine learning experiments, try new model architectures, evaluate models and analyze datasets without me having to explicitly tell Claude how to achieve these tasks.

We also have a dedicated resource inside the skill for creating [model cards](https://modelcards.withgoogle.com/). When we ask Claude to create a new model card for given experiment, the skill reads the resource to know how to create the model card in the format we expect.

## Conclusion

Do you have any tips or tricks for working with Claude Code? Let me know and thank you for reading!
