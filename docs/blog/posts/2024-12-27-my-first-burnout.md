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

This is a story of how I burned myself our a few years ago. Thanks to some of my great colleagues, I managed to get out of the pit relatively quickly and little long-term damage. I also learned a lot about myself.

<!-- more -->

From 2020 to 2023, I was working as a software developer in a Finnish AI consulting company. I started as a senior software developer, working in an R&D team focused on developing internal tooling. In the Spring of 2022, I was promoted to lead position.

During my time in the company, I mostly worked on internal product development. I lead the development of an annotation tool used to create training data for machine learning models involving image and text. This tool was used both internally and also sold as a service to some of our clients.

> For a year or so, I was also lucky to be part of an "MLOps team" building an MLOps platform using open-source tools. The plaform was a part of IML4E project and later [open-sourced](https://github.com/OSS-MLOPS-PLATFORM/oss-mlops-platform).

Beside working on internal product development, I also contributed to a few client projects. At the end of year 2020, I joined half-time in a client project for a company that used gaming engines to generate synthetic training datasets for companies developing self-driving cars. My task in the project was to write a software that took raw synthetically-generated training data as input and produced visualizations of the data as output.

During the project, I learned a lot about large-scale image training datasets, but I was also unhappy about how mechanical the work felt: the software I created did involve any "smartness" but only converted data from one format to various types of pictures. Therefore, I regularly complained to my account owner that I wanted to work on something more challenging and interesting. In the Spring of 2021, we had finished the work that was in scope for the project and the project ended. I moved back to full-time internal product development.

In the Spring of 2021, I joined a new internal R&D team. The team focused on building MLOps tooling that we could use internally for client projects and education and also as a platform or service sold to our clients. Partly based on the funding received from IML4E project, we went on to build a Kubernetes-based open-source MLOps platform that was later open-sourced.

Working in the MLOps team was great. I had a deep sense of belonging to a team and the team composition was excellent: There was both deep expertise about ML software development and a good understanding of the intricacies of client projects clients gained from various client projects. However, turning the team's outputs into something that could be monetized turned out to be difficult, and the team was slowly dispersed to work in various client projects: first half-time, then full-time.

In the Spring of 2022, I was promoted to lead software developer position. I moved back to developing the internal annotation platform. However, with the MLOps expertise gained from the MLOps team under my belt, I was considered to be a good fit to join a new client project involving MLOps.

The client was a Finnish technology company building both hardware and software. I was working directly under the lead solution architect of the company. Together with another engineer joining the project from our company, we formed a three-person team. I joined the company as half-time contributor: My time was split 50-50 between client work and leading the development of our internal R&D.

Within the client organization, there were various teams working independently on various projects. Each team had their own objectives and they worked mostly in silos without talking to other teams. There was no shared tooling used for generic data engineering tasks or for building ML solutions. Some teams had experimented with using MLOps tools such as Valohai to speed up their ML development, but adoption was only at proof-of-concept level. Our goal was to help the client to adopt such shared tooling and bring the data together to speed up the development of ML-based solutions and reduce the time-to-market. So far so good.
