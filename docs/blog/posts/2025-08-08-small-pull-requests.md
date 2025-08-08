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

Reading the post made me want to write about what I believe to be the most important principles of software development. If I had to pick one belief above all else, it would be this: _most good things in software development stem from small pull requests_.

What are pull requests? [Pull requests](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests) are a mechanism in version control providers such as [GitHub](https://github.com/) to propose changes to a codebase and integrate those changes to together, as explained in this definition from GitHub:

> _A pull request is a proposal to merge a set of changes from one branch into another. In a pull request, collaborators can review and discuss the proposed set of changes before they integrate the changes into the main codebase. Pull requests display the differences, or diffs, between the content in the source branch and the content in the target branch._

This post is split to three parts: why small pull requests are so good, what is needed to succeed with them, and finally, what the major challenges are in adopting them.

## Why small pull requests?

Small pull requests are so beneficial in software development, because they improve the development process at various levels. They improve the developer productivity, teamwork, project management and the overall software quality.

### Better teamwork

Small pull requests (PRs) are created more often than large ones. Therefore, developers writing small pull requests get faster feedback from their colleagues. Showing work to others early and often is [one of the most important traits](https://abseil.io/resources/swe-book/html/ch02.html) of good teamwork.

Smaller pull requests are easier and faster to review, which saves developers' time and reduces the back-and-forth in code review. Sometimes I hear that large pull requests are easier to review, because they give reviewers the "full picture". I think that's rarely the case. To give the full picture, developers in the team must communicate on daily basis so that everyone knows what others are working on. Pull request authors can also help reviewers understand the full context by clearly explaining in the PR description how the work at hand is related to previous and upcoming work.

Creating small pull requests improves communication in the team. When small units of work are made visible via pull requests, everyone in the team can understand how the development work is progressing. In the case of absences such as sick leaves, it is also easier for other developers to step in and take work over.

When the creation of small pull requests becomes a habit in the team, it also becomes easier to divide work between developers. Developers become more skilled at "simulating future" in their heads and planning their work step-by-step. When work is planned and executed like this, it becomes easier for other developers to contribute to features with their own small, targeted pull requests.

I believe that most of the [lone developer problem](https://evanhahn.com/the-lone-developer-problem/) stems from bad communication or planning. If the development philosophy is "start coding and see what happens", it is very difficult to work together. Teams working in this way end up sharing development responsibilities at higher levels such as per component–for example, one developer might work on the backend while the other works on the frontend. In my experience, this is suboptimal and often leads to worse-quality software in the long run.

Small pull requests improve knowledge sharing in the team. Large, difficult-to-review pull requests are reviewed or even read only by 1-2 developers in the team. Therefore, many of the business-critical features end up being only known by this small set of developers. Small pull requests are more easily reviewed also by developers who are not yet as familiar with the full system. Reviewing pull requests is a great way to get started with sharing knowledge about complex systems.

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
