---
title: The power of small pull requests
draft: true
tags:
  - Philosophy
date: 2025-08-08
categories:
  - Software development
authors:
  - ksaaskil
---

# The Power of Small Pull Requests

I have been working in professional software development for ten years. During these years, I have learned that the single most important development principle is to create small pull requests. This post explains why.

<!-- more -->

I recently came across a blog post named [_My programming beliefs as of July 2024_](https://evanhahn.com/programming-beliefs-as-of-july-2024/) by [Evan Hahn](https://evanhahn.com/). I very much liked the post and I can agree with most of the beliefs mentioned therein: focusing on testability, making invalid states unrepresentable and that simple opinions tend to be wrong, for example.

If I had to pick one programming belief that I believe in, it would be that _most good things in software development stem from small pull requests_.

[Pull requests](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests) are a mechanism in version control providers such as [GitHub](https://github.com/) to propose changes to a codebase and integrate those changes to together, as explained in this definition from GitHub:

> _A pull request is a proposal to merge a set of changes from one branch into another. In a pull request, collaborators can review and discuss the proposed set of changes before they integrate the changes into the main codebase. Pull requests display the differences, or diffs, between the content in the source branch and the content in the target branch._

### Better teamwork

Small pull requests (PRs) are created more often than large ones. Therefore, developers get faster feedback from their colleagues. Showing work to others is one of the most important traits of [good teamwork](https://abseil.io/resources/swe-book/html/ch02.html).

Smaller pull requests are also easier and faster to review, which saves developers' time and reduces the back-and-forth in code review. Sometimes I hear that large pull requests are easier to review, because they give the "full picture". I think that's rarely the case, as long as developers communicate frequently enough. If the pull request author clearly explains, say, in the PR description how the work at hand is related to previous and upcoming work, reviewers can understand the pull request in larger context and review it more carefully.

Creating small pull requests improves communication in the team. When small work increments are made visible, everyone can understand the progress better. In the case of absence such as sick leaves, it is easier for other developers to step in and take work over.

When creating small pull requests becomes a habit in the team, it also becomes easier to divide work between developers in large features. Developers get better at "simulating future" in their heads and planning their work step-by-step. When work is done step-by-step, it becomes easier for other developers to contribute with small, targeted pull requests.

I believe that most of the [lone developer problem](https://evanhahn.com/the-lone-developer-problem/) stems from bad planning or the complete lack of it. If the development philosophy is "start coding and see what happens", it is very difficult to work together. Teams working in this way end up sharing responsibilities per component such as "you do the backend, I do the frontend", which, in my experience, often leads to worse-quality software in the long run.

Small pull requests improve knowledge sharing in the team. My experience is that large, more-difficult-to-review pull requests are reviewed or even read only by 1-2 developers in the team. Therefore, many of the business-critical features end up being only familiar to this small set of developers. Small pull requests are more easily reviewed also by developers, who do not yet understand the system as well. Reviewing small pull requests is a great way to improve the overall knowledge of the system.

### Better developer productivity

- The goal is not to finish tickets faster. The goal is to have stable and predictable pace of development, with high attention on quality at every step of the way.
- Better measure of progress is the number of finished pull requests

### Better project management

### Better software quality

- Small pull request -> easier to focus on smaller details instead of letting things slip through

## Handbook for practical development

Make backend-frontend changes step by step:

1. API code changes (possibly preced by OpenAPI changes)
1. Frontend code changes

If API changes require database changes, commit them step-by-step:

1. Database changes
1. API changes

Make backend infrastructure changes step-by-step:

1. Backend code changes (with feature flags)
1. Backend infrastructure changes with disabled feature flags
1. Enable feature flags

## Notes

<figure markdown>
  ![Slide 1](./images/small-pull-requests-1.jpg){ width="200", loading=lazy }
</figure>

<figure markdown>
  ![Slide 2](./images/small-pull-requests-2.jpg){ width="200", loading=lazy }
</figure>

<figure markdown>
  ![Slide 3](./images/small-pull-requests-3.jpg){ width="200", loading=lazy }
</figure>
