---
title: What is good software?
published: true
description: Lessons learned from 70 technical interviews
canonical_url: https://kimmosaaskilahti.fi/blog/2023/07/19/what-is-good-software/
tags:
  - Philosophy
date: 2023-07-19
categories:
  - Software development
authors:
  - ksaaskil
---

# What is good software?

During the last three years, I've had the opportunity to conduct 70 technical interviews. In all these interviews, I've asked candidates the same question: "_What is good software?_" In this post, I'd like to share common answers to this question.

<!-- more -->

Below, I will go through the broad categories of answers starting from "high level" and proceeding towards "low level". In my experience, more senior developers typically start their answers from higher level than more junior developers.

<!--In my experience, the answer to the question "_What is good software?_" tells something about the seniority level of the candidate. While there is no right or wrong answer to the question, I've found that senior developers tend to approch the question at higher level than more junior developers.

Martin Fowler [divides](https://martinfowler.com/articles/is-quality-worth-cost.html) software quality attributes into external and internal attributes. The distinction is that users of the software can directly see external quality but have no direct visibility to internal quality. Below, I will group the categories into these two categories.-->

<!--## External quality-->

### Good software creates value

In general, the purpose of software is to create value to its users and the business. If the software does not create value to users or the business, it is bad software.

How can software fail to create value to its users? Most typically, the software fails to solve any real problem or meet the needs of its users. Following a development process such as Lean UX can reduce the probability of building something that no-one wants.

!!! question "Is it not a product issue if the product does not create value?"

    This argument makes sense in many companies, where software development teams have no control of product decisions. I have experience of working only in relatively small companies, where every software developer is essentially a product developer and every developer makes product decisions every day. In this case, the distinction between software and product does not really matter.

### Good software has good user experience

Good software has happy users. Users are happy when the user experience (UX) is good. Google's [UX design course](https://www.coursera.org/professional-certificates/google-ux-design) defines good user experience as useful, usable, enjoyable and equitable. Software is useful creates value. Usable software is reliable and easy to use. Enjoyability means that the software actually feels good to use. Equitable software is usable for all types of people in the target group.

### Good software meets requirements

In many companies, stakeholders and customers set the requirements that the software is expected to meet. Good software meets the requirements set by its stakeholders.

Modern organizations have acknowledged that creating a big list of requirements upfront is a bad idea. Instead, stakeholders and the development team should work together to learn how to address the real needs of the users of the software. This avoids the common pitfalls of so-called "waterfall" projects, where little room is given for iterative learning and exploration.

### Good software is easy to change

Common idiom in software development says that it's better to have bad software that's easy to change than perfect software that's impossible to change. Good software adapts to change when the user and business requirements change. When changes are made, new version of the software can be released with confidence.

The book _Pragmatic Programmer_ summarizes the essence of good design as _Good design is easy to change_. So-called best practices of software development are considered best practices, because they make the software easier to change. For example, loose coupling makes it easier to switch specific parts of the software without affecting other parts. Removing duplication makes it easier to change logic shared by multiple components.

### Good software is easy to maintain

Developers like software that is easy to maintain. Most of their time is spent on creating cool new features and improving the user experience instead of fire-fighting and fixing bugs.

Good logging and monitoring infrastructure makes it easier to discover and isolate production issues. Monitoring system may send an alert of a new potential issue before any bug reports from customers have started arriving. Bugs are fast to fix: test automation and structured release process give the development team confidence that the change did not introduce any other regression. Release process is straightforward: a new version can be deployed in minutes or hours.

### Good software is tested

Writing tests serves multiple purposes to improve the quality of software.

The most obvious benefit is that test suites and test automation help to discover broken code. It is much easier to refactor code that is properly tested. A team leveraging test automation spends less time fire-fighting in production, because bugs and issues are discovered earlier in the development cycle.

Tests can also improve software design and architecture. When software is designed to be easy to test, it is more likely to be designed well and also easy to change.

Finally, tests serve as documentation of intent. Well-written tests tell a story of how each piece of software has been designed to work.

### Good software uses the right technology

Good software uses proper tools and technology to serve its needs.

For example, the choice of the programming language has been done by considering multiple aspects. Skills of the development team, availability of libraries and scalability requirements all affect the decision.

When the business environment changes and requirements evolve, the choice of technology also evolves. For example, it is a perfectly valid choice to start by building an easy-to-maintain monolith. When the software grows, breaking it down into microservices might be justifiable. Each microservice might then be written in a different language, maintained by a different team and deployed independently.

### Good software has clean code

The definition of clean code varies from one developer to another, but in general, working with clean code is more enjoyable than working with messy code.

Clean code is structured into properly-sized modules that each serve a clear purpose. Abstractions are well designed and each layer of abstraction is justifiable. Software is configurable so that its behavior can be properly changed between multiple environments.

Good code reads like a good story. Functions have a single responsibility: they delegate complex tasks to other functions. There are no surprises such as weird side effects: the less WTF moments, the better.

### Good software is well documented

Good software is nice to get to know to. There is documentation explaining how the software has been designed, how to run the system locally, how to release new versions and how to contribute to the codebase.

Comments in the code explain _why_ code is written as it is. There might be warnings for new developers and links to specific issues. Comments are typically not used to explain _how_ the code works: the code mostly explains itself.
