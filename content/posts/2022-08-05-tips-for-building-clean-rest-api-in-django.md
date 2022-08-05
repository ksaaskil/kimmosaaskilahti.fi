---
title: Tips for building a clean REST API in Django
published: true
description: Lessons learned from two years of developing and maintaining a Django backend
tags: 
canonical_url: https://kimmosaaskilahti.fi/blog/2022-08-05-tips-for-building-clean-rest-api-in-django/
---

Some two years ago I started developing a software application for training data annotation at Silo AI. The heart application of the application is a REST API built in [Django](https://www.djangoproject.com/). The API serves as the backend for a Vue front-end and Python SDK.

Before starting this project, I did not have any experience of using Django. In this post, I'd like to share some of the lessons learned and tips for creating a clean REST API in Django.

I highly recommend reading [_Tips for Building High-Quality Django Apps at Scale_](https://medium.com/@DoorDash/tips-for-building-high-quality-django-apps-at-scale-a5a25917b2b5) by DoorDash. Many of the tips below are inspired by the article and have proved to be invaluable for keeping the codebase maintainable.

## 