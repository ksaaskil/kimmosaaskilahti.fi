---
title: The power of small pull requests
draft: false
tags:
  - Philosophy
date: 2025-09-26
categories:
  - Software development
authors:
  - ksaaskil
---

# The Power of Small Pull Requests

I have been working in professional software development for ten years now. During these years, I believe that the single most important development principle boosting the productivity of teams and individuals is to create small pull requests. This post explains why.

<!-- more -->

I recently came across a blog post named [_My programming beliefs as of July 2024_](https://evanhahn.com/programming-beliefs-as-of-july-2024/) by [Evan Hahn](https://evanhahn.com/). I very much liked the post and I agree with most of the beliefs mentioned therein: for example, focusing on testability, making invalid states unrepresentable and that simple opinions tend to be wrong.

Reading the post made me want to write about what I believe to be the most important principles of software development. And if I had to pick one belief above all else, it would be this: _most good things in software development stem from small pull requests_.

What are pull requests? [Pull requests](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests) are a mechanism in version control providers such as [GitHub](https://github.com/) to propose changes to a codebase and integrate those changes to together, as explained in this definition from GitHub:

> _A pull request is a proposal to merge a set of changes from one branch into another. In a pull request, collaborators can review and discuss the proposed set of changes before they integrate the changes into the main codebase. Pull requests display the differences, or diffs, between the content in the source branch and the content in the target branch._

This blog post focuses on explaining why I think small pull requests to be so valuable. In the next posts, I would like to expand on what is needed to succeed with them and, in my experience, what the major challenges are in adopting them.

Small pull requests improve the software development process at various levels. They improve the teamwork, individual developer productivity, project management and the overall software quality. Let us start with teamwork.

## Small pull requests encourage better teamwork

Small pull requests (PRs) are created more often than large ones. Therefore, developers writing small pull requests get faster feedback from their colleagues. Showing work to others early and often is [one of the most important traits](https://abseil.io/resources/swe-book/html/ch02.html) of good teamwork.

Smaller pull requests are easier and faster to review, which saves developers' time and reduces the back-and-forth in code review.

Sometimes I hear that large pull requests are easier to review, because they give reviewers the "full picture". I think that's rarely the case. To get the full picture, developers in the team should communicate frequently so that everyone knows what everyone else in the team is working on. Pull request authors can also help reviewers understand the context by clearly explaining in the pull request description how the work at hand is related to previous and upcoming work.

Creating small pull requests improves communication in the team. When small units of work are made visible via pull requests, everyone in the team can understand how the development work is progressing. In the case of absences such as sick leaves, it is also easier for other developers to step in and take work over.

When the creation of small pull requests becomes a habit in the team, it also becomes easier to divide work between developers. Developers become more skilled at "simulating future" in their heads and planning their work step-by-step. When work is planned and executed step-by-step, it becomes easier for other developers to contribute to features with their own small, targeted pull requests.

I believe that most of the [lone developer problem](https://evanhahn.com/the-lone-developer-problem/) stems from bad communication or planning. If the development philosophy is "start coding and see what happens", it is very difficult to work together. Teams working in this way end up dividing development responsibilities at levels such as per component. For example, one developer might work on the backend while the other works on the frontend. In my experience, this is suboptimal and often leads to worse-quality software in the long run.

Small pull requests improve knowledge sharing in the team. Large, difficult-to-review pull requests are often reviewed or even read only by 1-2 developers in the team. They might be so difficult to review and risky to approve that only the senior developers are willing to review them. Therefore, many of the business-critical features end up being only developed and read by this small set of developers. Small pull requests are more frequently reviewed also by developers who are not yet familiar with the full system. Reviewing pull requests is a great way to get started with sharing knowledge about complex systems.

## Small pull requests improve the development productivity

Software development team can be considered to be productive, if it can deliver high-quality software to users at a _sustainable_ pace, keeping up with their roadmap development plan while keeping their existing users and customers happy. How can small pull requests support productivity?

Productivity is intimately linked to how the team manages their work. Work is typically managed using a work management platform such as [Jira](https://www.atlassian.com/software/jira), where the team's work is made visible via stories, tasks, epics and bug reports. When the team's software needs to be changed somehow, a ticket is created in the team backlog. Developers pick tickets from the backlog, moving it across stages such as "In progress" and, finally to "Done".

The time taken from moving the ticket to in-progress and finishing it is called the cycle time. Cycle time is a common and useful metric to measure productivity, but it needs to be used with care.

First, cycle time does not measure the quality of the end result. Optimizing for short cycle time encourages sacrificing quality for speed, creating technical debt. In the long term, this technical debt will slow the team down.

When a developer tries to finish their tickets with short cycle time, they have tendency to either assume that the first idea that comes to their mind is the best solution, creating lower-quality software, or to take shortcuts to finish the work faster. Instead, developers should be encouraged to take the time needed to deeply understand the problems given to them and to find the best solution available. If there's some non-familiar technology involved, they should carefully study the documentation or ask their peers for more information. After they have a list of potential solutions available, they should ask their colleagues for advice and feedback.

Second, focusing on short-term velocity encourages developers to cram all their changes into one batch (pull request). This may seem productive, because creating one pull request lets them skip the overhead of creating many pull requests and decomposing the problem into multiple steps. While this practice is acceptable in small, simple tasks, it can be very detrimental to code quality and code review in larger tasks. Finishing development tasks in batches encourages creating large pull requests affecting multiple code components at a single time.

Another aspect of productivity beside cycle time is what the developers spend their time on. Productive teams spend most of their time building new features instead of fixing bugs or fire-fighting in production. Because small changes are less likely to break the software than large changes, small pull requests drastically reduce the risk of breaking changes. This saves the team's time from debugging, fixing and reverting production bugs.

If a buggy release is made, changes created via small pull requests are also easier to fix and revert than large changes. When changes are made incrementally, the software is always close to a working version.

Finally, creating small pull requests is aligned with the "fail early, fail fast, fail often" principle advocated by [Google](https://abseil.io/resources/swe-book/html/ch02.html). Every pull request is an opportunity for the developer to get feedback about their work from fellow developers. If the feature development starts to drift in the wrong direction, getting this feedback early on can save a huge amount of development time, again improving the team productivity. Developers creating small pull requests also spend less time waiting for pull request review, making them more productive.

## Small pull requests simplify project management

Developing in small iterations makes the project management smoother. Working in small pull requests forces developers to decompose the problem and to split the work into multiple phases. When work is split into phases like this, project managers have better visibility into what has been done and what still needs to be done to finish the feature. This makes it easier to estimate when the feature will be completed or if it will be delayed.

Since developers get faster feedback about their contributions via small pull requests, developers spend less time working on the wrong things. Small, targeted problems are solved faster than large problems.

## Small pull requests improve the code quality

Working in small pull requests improves the code quality in many ways. Perhaps most importantly, small pull requests allow the reviewers to focus on smaller details instead of letting bad choices slip through. This is very important in the long term to avoid the [broken windows](https://en.wikipedia.org/wiki/Broken_windows_theory) effect, where small hacks and shortcuts profilerate in the codebase because such hacks have been done before.

Pull request authors should be asked to refactor their code when needed, possibly splitting their pull requests to separate refactoring PRs. There is a much smaller barrier in asking this kind of splitting when working in small pull requests.

Writing small pull requests encourages the "microservice development" mindset. Microservices should be possible to deploy and verify independently from other services. When the developer only changes one service at a time (say, the web application backend) instead of multiple (say, the backend and the frontend simultaneously), they put more effort into unit-testing that service alone. Instead of relying on manual testing in development environments, they write more detailed unit tests verifying that the service alone works as expected. They will also do this in backwards-compatible way, which makes deployments much more robust. This drastically improves the code quality in the long term.

To maintain the microservice development mindset, the team should pay attention to only changing one component at a time when possible. Pull request authors should be asked to split large pull requests into smaller pieces, improving the code quality of each component affected by the change.

## Small pull requests support good software development practices

Modern software development practices such as [trunk-based development](https://www.atlassian.com/continuous-delivery/continuous-integration/trunk-based-development), [continuous integration](https://martinfowler.com/articles/continuousIntegration.html) and [DevOps](https://www.atlassian.com/devops) all encourage developers to take smaller steps to get faster feedback about their changes. In trunk-based development, developers make small pull requests to a single shared main branch instead of creating long-lived branches for new features or releases. Continuous integration asks developers to merge their work to the trunk on a daily basis, to integrate the developers' work together as soon as possible. DevOps helps teams to get early feedback about code changes, by "shifting left" in the developer workflow to catch bugs via automation and monitoring before they affect the end-users.

Small pull requests are aligned with all of these development practices. Small, fast pull requests allow the team to continuously integrate their work together, enabling automated pipelines to continously test the new versions as a whole. Automated testing and monitoring delivers early feedback to the developers, notifying them about bugs and inadvertent behaviour as soon as possible.

## Conclusion

In one of my earlier [posts](https://kimmosaaskilahti.fi/blog/2020/08/01/why-i-love-learning-functional-programming/), I said that most ideas considered as good programming style seem to stem from functional programming. This post extends the post to software development: most ideas considered as good software development practices seem to stem from small pull requests. Do you agree? Let me know!
