---
title: How to succeed with small pull requests
draft: true
tags:
  - Philosophy
date: 2025-09-26
categories:
  - Software development
authors:
  - ksaaskil
---

# How to succeed with small pull requests

<!-- more -->

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
