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

This is a recap of my first two years at Sanoma Media Finland.

<!-- more -->

## Joining the team

In the Spring of 2023, I had grown a little frustrated about the state of product development in Silo AI and was open for new opportunities. I was contacted by a Sanoma-affiliated headhunter in May 2023, who told me that their news personalization team for looking for a new lead developer. I knew that SMF had values that aligned with mine (they had, for example, partnered with Helsinki Pride) and I was looking for a position that would feel more meaningful than consulting, so I accepted to join interviews.

I was interviewed three times, interviewers including my future manager Jyrki, personalization team lead Katriina, lead data scientist Max and the two lead developers in SMF, Miro and Janne. I liked everyone I met and I learned that SMF had both interesting data & AI related challenges as well as high quality standards for professional software development. I was not elected as the lead developer, but I was offered a position as a senior developer in the same personalization team. It was agreed that I would have lead-like responsibilities in everything related to data processing, which suited me well.

I joined the personalization team in August 2023. The team was responsible for running both news personalization in sites such as hs.fi and is.fi as well as developing a new real-time analytics (RTA) platform for newsrooms. The team included three consultants, two of them working on RTA. One of the two was developing the "backend" and the other was one was developing the frontend. The project had a large pressure to deliver a working RTA dashboard by the end of September 2023, because the contract with the previous SaaS product was ending at that time.

Unfortunately, the RTA project was at the brink of a collapse. The backend, running a real-time processing job on Managed Apache Flink in AWS, was crashing almost daily. As the newsrooms already relied on the dashboard, they constantly called the on-call, who got very frustrated about the quality issues in the project. One of these incidents escalated so badly that the backend developer left for sick leave and never returned to the company.

To make RTA great again, our team formed a task force to fix what was broken. We noticed quickly that the Flink job was far from production-ready. It did not have any CI/CD pipeline – instead, the developer manually copied JAR files to S3 to "deploy" new versions. There were no unit tests – all changes to the calculation job could only be verified by deploying the job to production. There was no monitoring, no alarms, no dashboards of any kind. There were no Flink snapshots, meaning that when the computation graph was changed, Flink started processing data again starting from the last midnight. The job had serious performance issues, so this backfill could take hours.

The project was not in a maintainable state. It had completely missed the important DevOps principle of thinking about the production environment as early as possible. Therefore, we explained the stakeholders that the backend computation had to be completely scrapped and written from scratch. Luckily, they understood the situation and gave us the time we needed. We created a temporary analytics dashboard in Databricks for the newsrooms and pulled the broken RTA project back to the development phase.

We started fixing the Flink job step-by-step with small pull requests that changed one thing at a time. In this way, we were able to understand the effect of every change on the system behaviour. We migrated every computation from [Flink SQL](https://nightlies.apache.org/flink/flink-docs-master/docs/dev/table/sql/overview/) to [DataStream API](https://nightlies.apache.org/flink/flink-docs-master/docs/dev/datastream/overview/), because the latter had much better support for [fault tolerance via state snapshots](https://nightlies.apache.org/flink/flink-docs-release-2.0/docs/learn-flink/fault_tolerance/) and thereby allowed us to update the job in production without re-computation. We created unit tests for every pipeline component using [`MiniClusterWithClientResource`](https://nightlies.apache.org/flink/flink-docs-master/docs/dev/datastream/testing/#junit-rule-miniclusterwithclientresource) that allows running a local Flink cluster for automated testing. We created a CI/CD pipeline in AWS for updating the Flink application in production. We created a custom CloudWatch dashboard that showed every Flink metric that we cared about. We created CloudWatch alarms with notifications, allowing us to report on and fix issues before newsrooms would notice them. We fixed performance issues by eliminating [data skew with salting](https://eng.lyft.com/gotchas-of-stream-processing-data-skewness-cfba58eb45d4) and [optimizing serialization](https://flink.apache.org/2020/04/15/flink-serialization-tuning-vol.-1-choosing-your-serializer-if-you-can/). We had multiple meetings with AWS Flink experts who helped us validate our assumptions and guided us in our endeavour.

In the fall 2023, I created 204 pull requests in the RTA repository. By December 2023, we had a completely re-written Flink computation job that was ready for production. There were still minor hiccups, but the number of production issues was close to zero. I gave a presentation in Sanoma Developer Community with the title "10 Mistakes We Made with Apache Flink", explaining everything we had learned about running a production-grade real-time analytics system in Flink.

This rewrite was a great opportunity for me to learn to work together with the other developers in the personalization team. We meticulously documented every issue in Confluence and created a step-by-step plan to issues one by one. We learned to communicate together and to write pull requests that were easy to review. We gained the stakeholders' trust by giving realistic time estimations and by focusing on building a production-grade system from the start.

## New team

At the end of 2023, it had became clear that developing and maintaining the RTA dashboard was happening at the cost of news personalization. We had not improved personalization at all, which negatively impact our readers. It was therefore decided that teh personalization and analytics responsibilities would be split between two teams, creating a personalization team lead by the lead data scientist Max and a new analytics team lead by a new PO. I stayed in the personalization team and stopped contributing to the RTA product (which had stopped being a project and become a product).

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
