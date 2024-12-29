---
title: How I suffered my first burnout as software developer
draft: true
tags:
  - Philosophy
  - Career
date: 2024-12-27
categories:
  - Software development
authors:
  - ksaaskil
---

# How I suffered my first burnout as software developer

This is a story of how I burned myself out for the first time in my working career. Thanks to some of my great colleagues, I managed to get out of the pit relatively quickly and little long-term damage. I also learned a lot about myself.

<!-- more -->

## Background

From 2020 to 2023, I was working as a software developer in a Finnish AI consulting company. I started as a senior software developer, working in an R&D team focused on developing internal tooling.

During my time in the company, I mostly worked on internal product development. I lead the development of an annotation tool used to create training data for machine learning models involving image and text. This tool was used both internally and also sold as a service to some of our clients.

Beside working on internal product development, I also contributed to a few client projects. At the end of year 2020, I joined half-time in a client project for a company that used gaming engines to generate synthetic training datasets for companies developing self-driving cars. My task in the project was to write a software that took raw synthetically-generated training data as input and produced visualizations of the data as output.

During the project, I learned a lot about large-scale image training datasets, but I was also unhappy about how mechanical the work felt: the software I created did involve any "smartness" but only converted data from one format to various types of pictures. Therefore, I regularly complained to my account owner that I wanted to work on something more challenging and interesting. In the Spring of 2021, we had finished the work that was in scope for the project and the project ended. I moved back to full-time internal product development.

## Enter MLOps

In the Spring of 2021, I joined a new internal R&D team focused on building MLOps tooling that we could use internally for client projects and education and also as a platform or service sold to our clients. Working together within the European IML4E project, we went on to build a Kubernetes-based open-source MLOps platform that was later open-sourced.

Working in the MLOps team was a great experience. I felt a deep sense of belonging to a team and the team composition was excellent. There was both deep expertise about ML software development as well as deep understanding of the intricacies of the various challenges faced in earlier client projects. However, turning the team's outputs into something that could be monetized turned out to be difficult, and the team was slowly dispersed to work in various client projects: first part-time, later full-time.

In the Spring of 2022, I was promoted to lead software developer position. I moved back to developing the internal annotation platform. However, I had gained considerable experience of MLOps during my time in the internal team and I was considered to be a good fit to join a new client project involving MLOps.

## The client

The client was a Finnish technology company building both hardware and software. I was working directly under the lead solution architect of the client company. Together with another engineer joining the project from our consulting company, we formed a three-person team. I will refer to the lead solution architect as "the boss" below.

Within the client organization, there were various teams working independently on various projects. Each team had their own objectives. They worked mostly in silos without collaborating with other teams. There was no shared tooling used for generic data engineering tasks nor for building ML solutions. Some teams had experimented with using MLOps tools such as Valohai pipelines to speed up their ML development, but adoption was only at proof-of-concept level.

Our goal in the project was to help the client to find and adopt suitable shared tooling to speed up the development of ML-based solutions. Another challenge was to bring the data collected within the company to a single centralized location to reduce duplicate data collection and enable new data-driven use cases.

I joined the project as a half-time contributor, so my time was split 50-50 between working for the client and leading the development of our internal R&D tooling. Apart from working at the client office every Wednesday, we did not agree on any clear time bounds when I would work for the client during my working week. I would be responsible for allocating my time so that at the end of each week, 50% of my working time would have been spent on client work.

The client organization did not accept using our own software or email accounts for the client work. Instead, we got our own Microsoft email accounts within the client domain. We were also expected to use client-approved software for all working tasks. This meant that we needed to install client administration software on our computer and only use tools such as Outlook for reading our email. Except for daily meetings, e-mail was the primary method of communication with our boss.

The lead solution architect of the company (our boss) was not part of any team within the client organization. Their goal was, I believe, to supervise the development work performed by the teams and to help and direct them to use efficient tools to build high-quality solutions faster. However, each team had their own project owner responsible for delivering their season objectives in time. Because reaching these objectives was the primary goal of each team, there was noticeable tension between teams working on their own objectives and listening to what our boss wanted them to do.

## Summer

Our first task in the client was to compare the various MLOps solutions available on the market. During the Summer of 2022, we performed small proofs-of-concept using plaforms such as Amazon Sagemaker, Iguazio (developer of MLRun) and Valohai. Because we did not work together with any of the teams that we were supposed to help, our proofs-of-concept were not based on real datasets or models used by the teams in their daily work. Instead, we worked with toy examples.

After we had evaluated different solutions (by filling a massive Excel file), the findings were finally presented to the teams. The architect presented the alternative tools and platforms that we had evaluated and what we had decided. As perhaps expected, reception from the teams was lukewarm.

In hindsight, this presentation was a good example of the problematic top-down culture of the organization. Instead of presenting the teams with our honest findings and asking for their feedback and input, we tried to _sell_ them the tools selected for adoption by the lead architect. Our presentation even hid some of the challenges we had faced during our evaluation, apparently to make the teams more eager to adopt the tools chosen for them.

During this evaluation period, I noticed that our boss did not trust us to do our work well. They wanted to micromanage the work. Even during their summer holiday, they expected us to meet them in an online meeting to report on our work a few times a week.

## Autumn

After the MLOps tooling evaluation, our focus moved to data engineering. Teams in the company already used tools such as Dask and xarray to manage and process their datasets. Our architect was determined to build a data lake for them. Data stored as xarray datasets was to be accessed via Intake using a Dask-capable computing platform provided for them. For the compute platform, we talked with services such as SaturnCloud and Coiled.

We built an internal demo using SaturnCloud. The purpose of the demo was to show the teams how easily they could use SaturnCloud to access company-wide datasets using Intake and Dask. Preparing for the internal demo made the top-down culture visible. Before the demo, our boss made clear that there was no room for technical difficulties in the demo. We were expected to show the teams a 100 % working solutions with as many features as possible. If there were some unsolved challenges, those were not to be mentioned.

For example, one of the challenges we faced with SaturnCloud was how to scaleably handle authentication for all the teams within the company. Our boss wanted us to try and solve the problem as soon as possible, even before the demo as possible. This was before we had a single team to adopt SaturnCloud. I guess our boss wanted the solution to be perfect, because otherwise the teams might choose to not adopt it.

In hindsight, this is a perfect example of what internal platform teams should not do. Platform teams should help teams solve their problems so that the teams can deliver better-quality solutions faster. Platform team is not supposed to tell other teams what they must or must not do. If they do, they will receive pushback.

One part of the demo was to convince teams of the benefits of using Amazon S3 as the data storage for their training datasets. At the time, some teams were pulling their training data from internal REST APIs, and our boss told them that using S3 would be better than using an API. One of the developers commented that S3 is an API as well. Lead architect responded with a taste of contempt and frustration: "C'mon guys. S3 is _not_ an API. S3 is a cloud object storage". Silence fell and discussion ended.

Of course, they were both right. S3 is a special kind of API designed for practically infinitely scalable data storage and retrieval. There were clear benefits in using S3 for analytical tasks such as machine learning. However, our boss failed to communicate those benefits clearly and respectfully. That was one of the moments when I realized that our work would turn out to be futile: teams would not be pushed to using something new only because they were told to do so.

Micromanagement from our boss got worse during the autumn. I was getting more and more stressed about juggling emails and meeting invites received in two different emails and finding my way to meetings stored in two different calendars. We had no scheduled daily meetings with our boss – instead, he would send meeting invites every day at a few hours' short notice.

One time, I forgot to check the client's email in the morning. Unaware of the invite sent by our boss for a meeting at 10 am, I missed the meeting. I felt terrible about it. After this incident, our boss wanted us to start to report them at hour-level precision when we had worked for them and what we had done at that time.

I have always been a conscientious worker. I take my work seriously and want to do my work well. I think about work problems outside working hours and always seek to improve my skills so as to do my work as well as possible. However, I'm also not a robot. The fact that our boss visibly demonstrated their mistrust in me and my skills was a hard blow to my self-esteem.

## My last task

One of my last tasks during the Autumn was to pull data from internal message broker (Kafka) to our "data lake" in S3. I was lacking credentials to connect to Kafka, so I was told to connect one of the employees in the client organization for credentials. I waited for weeks to get their time and attention to finally get the credentials – this was corporation bureauracy at its worst.

As part of building data ingestion from Kafka to S3, I needed to build infrastructure in AWS. Client organization was mostly using click-ops and at the time – they had not adopted infrastructure as code (IaaC). Since we wanted to adopt IaaC, I asked my boss if they had preferred tools for building the infrastructure, like Terraform, AWS CDK or Pulumi. They said that any tool would be OK for them.

I decided to use AWS CDK, as that was the infrastructure as code tool recommended by AWS at the time. AWS CDK allows declaring infrastructure using common programming languages such as TypeScript or Python. The code is compiled (or transpiled?) to CloudFormation templates. At the time, AWS CDK was relatively new, but declaring infrastructure as TypeScript code seemed to have clear benefits compared to using purely declarative languages based on configuration files. Examples of such languages include the HashiCorp Configuration Language (HCL) used by Terraform.

I went on to build the first parts of the required infrastructure using AWS CDK. After a few days of work, I presented my work so far to our boss. He looked at the AWS CDK code for a few seconds and said to me: "This is wrong. Infrastructure should not be defined with code. It must be defined with configuration files. You should have used Terraform."

I was too tired to fight back. In hindsight, I think he did not even know what AWS CDK was. Maybe he thought that I was building infrastructure using imperative commands with AWS SDK.

## The crash
