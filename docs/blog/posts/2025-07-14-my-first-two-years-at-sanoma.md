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

## Fall 2023: Joining the team

In the Spring of 2023, I had grown a little frustrated about the state of product development in Silo AI and was open for new opportunities. I was contacted by a headhunter in May 2023, who told me that Sanoma Media Finland (SMF) was searching for a new lead developer in their news personalization team. I knew that SMF had values that aligned with mine (they had, for example, partnered with Helsinki Pride) and I was looking for a position that would feel more meaningful than consulting, so I accepted to join interviews.

I was interviewed three times, interviewers including my future manager Jyrki, personalization team lead Katriina, lead data scientist Max and the two lead developers in SMF, Miro and Janne. I liked everyone I met and I learned that SMF had both interesting data & AI related challenges as well as high quality standards for professional software development. I was not elected as the lead developer, but I was offered a position as a senior developer in the same personalization team. It was agreed that I would have lead-like responsibilities in everything related to data processing, which suited me well.

I joined the personalization team in August 2023. The team was responsible for running both news personalization in sites such as hs.fi and is.fi as well as developing a new real-time analytics (RTA) platform for newsrooms. The team included three consultants, two of them working on RTA. One of the two was developing the "backend" and the other was one was developing the frontend. The project had a large pressure to deliver a working RTA dashboard by the end of September 2023, because the contract with the previous SaaS product was ending at that time.

Unfortunately, the RTA project was at the brink of a collapse. The backend, running a real-time processing job on Managed Apache Flink in AWS, was crashing almost daily. As the newsrooms already relied on the dashboard, they constantly called the on-call, who got very frustrated about the quality issues in the project. One of these incidents escalated so badly that the backend developer left for sick leave and never returned to the company.

To make RTA great again, our team formed a task force to fix what was broken. We noticed quickly that the Flink job was far from production-ready. It did not have any CI/CD pipeline – instead, the developer manually copied JAR files to S3 to "deploy" new versions. There were no unit tests – all changes to the calculation job could only be verified by deploying the job to production. There was no monitoring, no alarms, no dashboards of any kind. There were no Flink snapshots, meaning that when the computation graph was changed, Flink started processing data again starting from the last midnight. The job had serious performance issues, so this backfill could take hours.

The project was not in a maintainable state. It had completely missed the important DevOps principle of thinking about the production environment as early as possible. Therefore, we explained the stakeholders that the backend computation had to be completely scrapped and written from scratch. Luckily, they understood the situation and gave us the time we needed. We created a temporary analytics dashboard in Databricks for the newsrooms and pulled the broken RTA project back to the development phase.

We started fixing the Flink job step-by-step with small pull requests that changed one thing at a time. In this way, we were able to understand the effect of every change on the system behaviour. We migrated every computation from [Flink SQL](https://nightlies.apache.org/flink/flink-docs-master/docs/dev/table/sql/overview/) to [DataStream API](https://nightlies.apache.org/flink/flink-docs-master/docs/dev/datastream/overview/), because the latter had much better support for [fault tolerance via state snapshots](https://nightlies.apache.org/flink/flink-docs-release-2.0/docs/learn-flink/fault_tolerance/) and thereby allowed us to update the job in production without re-computation. We created unit tests for every pipeline component using [`MiniClusterWithClientResource`](https://nightlies.apache.org/flink/flink-docs-master/docs/dev/datastream/testing/#junit-rule-miniclusterwithclientresource) that allows running a local Flink cluster for automated testing. We created a CI/CD pipeline in AWS for updating the Flink application in production. We created a custom CloudWatch dashboard that showed every Flink metric that we cared about. We created CloudWatch alarms with notifications, allowing us to report on and fix issues before newsrooms would notice them. We fixed performance issues by eliminating [data skew with salting](https://eng.lyft.com/gotchas-of-stream-processing-data-skewness-cfba58eb45d4) and [optimizing serialization](https://flink.apache.org/2020/04/15/flink-serialization-tuning-vol.-1-choosing-your-serializer-if-you-can/). We had multiple meetings with AWS Flink experts who helped us validate our assumptions and guided us in our endeavour.

In the fall 2023, I created 204 pull requests in the RTA repository. By December 2023, we had a completely re-written Flink computation job that was ready for production. There were still minor hiccups, but the number of production issues was close to zero. I gave a presentation in Sanoma Developer Community with the title "10 Mistakes We Made with Apache Flink", explaining everything we had learned about running a production-grade real-time analytics system in Flink.

This rewrite was a great opportunity for me to learn to work together with the other developers in the personalization team. We meticulously documented every issue in Confluence and created a step-by-step plan to issues one by one. We learned to communicate together and to write pull requests that were easy to review. We gained the stakeholders' trust by giving realistic time estimations and by focusing on building a production-grade system from the start.

## Spring 2024: New team, new habits

By the end of 2023, it had became clear that developing and maintaining the RTA dashboard was happening at the cost of news personalization. We had not improved personalization at all, which negatively impact our readers. It was therefore decided that teh personalization and analytics responsibilities would be split between two teams, creating a personalization team lead by the lead data scientist Max and a new analytics team lead by a new PO. I stayed in the personalization team and stopped contributing to the RTA product (which had stopped being a project and become a product).

Our first major task in the new team was to stabilize and rewrite the "most read" service, which is responsible for delivering the list of most read articles to our news sites. The existing implementation was done using Kinesis Analytics, which was deprecated and very unstable.

We started designing the new system by mapping the needs and listing all architecture alternatives with their pros and cons. As a team, we created architecture tradeoff analyzes and decision records for all choices that mattered. We compared, for example, Python and TypeScript for programming languages, Lambda and Flink for data processing, and DynamoDB, Aurora and Redis for data storage.

Once we had a plan on what to build, we split the development into multiple milestones. Each milestone was split into small tasks that we maintained in Jira or Confluence. We had learned from the RTA project that every component should be built together as a team instead of letting one developer build, say, the data processing while having other developer build the API. We had some challenges in splitting the development tasks between developers, mostly because some of the developers were used to working on larger tasks alone, but I think all-in-all we were very successful in splitting the work. Every piece in the system was built by at least two developers.

As we were building a business-critical system, we kept the DevOps principles in mind and minimized the risk of production issues at every step of the way. Every piece in the system was carefully unit-tested. We built an integration test to automatically verify that data flowed through the system as expected, all the way from data collection to the "most-read" API. We ran this test as part of the CI/CD pipeline and blocked deployments that failed the test. We implemented custom Datadog dashboard for the system and added custom metrics for the business metrics that mattered. We implemented canary release for every component, to ensure that if faulty components were deployed and any alarms triggered, changes would automatically be rolled back. At the code level, we made sure that exception was thrown for every unexpected situation, ensuring that we would notice such issues when they happened and be able to fix them as soon as possible.

Once the system was getting ready for production, we implemented [shadow launch](https://devops.com/what-is-a-shadow-deployment/) to test the system under realistic production load without the risk of affecting our users. After the shadow launch, we gradually moved traffic from the old system to the new system and continuously monitored that everything worked as expected.

The new system was very robust – there has not been a single production issue since. Later, we even removed the manual approval step in the deployment pipeline, letting all changes committed to the main branch to automatically move to production (assuming the tests pass, of course). Personally, I created ~150 pull requests in the repository.

In addition to revising the above service, we improved our personalization in many ways. We improved conversion rates by integrating the personalization service with the near-real-time sales data, letting us boost the visibility of articles that generated a lot of subscriptions. We improved our "MLOps" capabilities by adding Firehose+S3 logging for all our scoring service calls, which gave us direct visibility to the inputs and outputs of our machine learning components and thereby helped us debug many production issues. We also implemented server-side A/B testing, giving us the flexibility to run controlled A/B tests in the new mobile apps.

In the Spring of 2024, we also set up new ways of working for the team. We established biweekly retros, where we reflected on how things could be better. We created "deployment Mondays", where we would every week automatically create a ticket for deploying all our services to production. Deployment covered merging all unmerged dependency updates and checking Datadog for any uncaught errors or warnings. Our ten-ish services were divided evenly between the developers, giving every developer only a few services to update.

Through deployment Mondays, we also improved other aspects of maintaining our services. Together with the rest of the news and feature organization, we enabled automerge for dependency updates. This reduced the developer burden on deployment Mondays, because most dependency updates were already automatically merged. We created integration tests for all our services, helping developers rely on deployment pipelines and their test automation to ensure that services work as expected.

## Summer 2024: New features and old updates

- June 2024: New paid-rate algorithm to simplify the existing solution
- Tagging-tool improvements: Linters, formatting, unit tests, Datadog with custom tracing, removed error catching and sys.path hacks, integration tests, Poetry, pyright
  - Developer (consultant) had said that they do not believe in unit tests (!)
- Write a document about how our scoring system works, add shared evaluation scripts, learn about NumPyro and Bayesian inference, compare SVI and MCMC
- Presentations on software design, event-driven architecture, Datadog

## Fall 2024

- Add support for collecting audio events
- Implement personalized groups
- Remove manual approvals from pipelines
- Add user purchase propensities as a service, implement dynamic paid-rate
- Presentation on Google's approach to measuring engineering productivity and an introduction to Bayesian inference

## Spring 2025

- Hefaistos: New scoring system based on user-article vectors, Databricks + FastAPI
- Rewrite Glue Spark code for exporting GDPR data
- Create data integration for podcast metadata

## S2-2025

- Moved to the new team, promoted to lead developer
- Newsgathering automation
