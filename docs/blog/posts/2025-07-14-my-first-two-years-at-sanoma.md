---
title: My first two years at Sanoma Media Finland
draft: true
tags:
  - Philosophy
  - Career
date: 2025-07-14
categories:
  - Software development
authors:
  - ksaaskil
---

# My first two years at Sanoma Media Finland

This is a recap of my first two years at Sanoma Media Finland, where I joined as a software engineer in August 2025.

<!-- more -->

## Enter the team

- When joining, the team had both analytics and personalization responsibilities
- Atmosphere was very heavy, there was cursing and frustration in dailies. Dependency updates were closed. There was no CI/CD.
- Real-time analytics project was reaching its doom: its deadline to moving production was close but the project was far from production-ready
- I joined a few other developers in the team to form a task-force, where we re-wrote the whole streaming solution in the backend and stabilized it
- This was a period of intense learning and moderate pressure. Luckily stakeholders understood what needed to be done and we got the chance to fix things properly
- I learned a lot about Flink and prepared a presentation for the developer community about the 10 mistakes we made with Flink
- TODO: Count the number of real-time analytics pull requests
- Presentation about the new real-time analytics system

## New team

- In the start of 2024, the PO moved to another position and the personalization team was taken over by the lead data scientist.
- Real-time analytics was split to another new team, the "analytics team" but we stayed together as the "Data & AI" team
- In the new team, our first larger task was to rewrite the old "most read" system
- We learned teamwork: Created tech designs together, split tasks between developers at fine-grained level and ensured the system was production-grade from the start
- Learned how to build production-grade systems in AWS: CodePipeline, CodeDeploy, CloudWatch, Datadog, throwing exceptions, shadow launch
- System built on Lambda and DynamoDB has been very robust and has not had a single production issue to date
- We also improved our conversion rates by optimizing sales in personalization
- Improved MLOps by adding Firehose logging of all scoring calls. This helped us debug many production issues.
- Improved A/B testing capabilities

## Summer 2024: New features and old updates

- June 2024: New paid-rate algorithm
- DevOps updates: Automerge, CI/CD notifications,
- Tagging-tool improvements: Linters, formatting, unit tests, Datadog with custom tracing, removed error catching and sys.path hacks, integration tests, Poetry, pyright
- Write a document about how our scoring system works, add shared evaluation scripts, compare SVI and MCMC
- Presentation on software design
- Presentation on event-driven architecture
- Presentation on Datadog

## Fall 2024

- Add support for collecting audio events
- Personalized groups
- Remove manual approvals from pipelines
- User purchase propensities as a service, dynamic paid-rate
- Presentation on Google's approach to measuring engineering productivity
- Introduction to Bayesian inference

## Spring 2025

- Hefaistos: New scoring system based on user-article vectors, Databricks + FastAPI
- Rewrite Glue Spark code for exporting GDPR data
- Create data integration

## S2-2025

- Moved to the new team, promoted to lead developer
- Newsgathering automation
