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

From 2020 to 2023, I was working as a software developer in a Finnish AI consulting company. I started as a senior software developer, working in an R&D team focused on developing internal tooling.

During my time in the company, I mostly worked on internal product development. I lead the development of an annotation tool used to create training data for machine learning models involving image and text. This tool was used both internally and also sold as a service to some of our clients.

Beside working on internal product development, I also contributed to a few client projects. At the end of year 2020, I joined half-time in a client project for a company that used gaming engines to generate synthetic training datasets for companies developing self-driving cars. My task in the project was to write a software that took raw synthetically-generated training data as input and produced visualizations of the data as output.

During the project, I learned a lot about large-scale image training datasets, but I was also unhappy about how mechanical the work felt: the software I created did involve any "smartness" but only converted data from one format to various types of pictures. Therefore, I regularly complained to my account owner that I wanted to work on something more challenging and interesting. In the Spring of 2021, we had finished the work that was in scope for the project and the project ended. I moved back to full-time internal product development.

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

Our first task in the client was to compare the various MLOps solutions available on the market. During the Summer of 2022, we performed small proofs-of-concept using plaforms such as Amazon Sagemaker, Iguazio (developer of MLRun) and Valohai. Because we did not work together with any of the teams that we were supposed to help, our proofs-of-concept were not based on real datasets or models used by the teams in their daily work. Instead, we worked with toy examples.

After we had evaluated different solutions (by filling a massive Excel file), the findings were finally presented to the teams. The architect presented the alternative tools and platforms that we had evaluated and what we had decided. As perhaps expected, reception from the teams was lukewarm.

In hindsight, this presentation was a good example of the problematic top-down culture of the organization. Instead of presenting the teams with our honest findings and asking for their feedback and input, we tried to _sell_ them the tools selected for adoption by the lead architect. Our presentation even hid some of the challenges we had faced during our evaluation, apparently to make the teams more eager to adopt the tools chosen for them.

While I liked evaluating different tools and platforms and I learned a lot about performing such evaluations, I also noticed that our boss did not trust us to do our work well. Even during their summer holiday, they expected us to meet them in an online meeting to report on our work. In short, they wanted to micromanage.
