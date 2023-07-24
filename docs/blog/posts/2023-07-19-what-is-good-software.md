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

During the last three years, I've had the opportunity to conduct some 70 technical interviews. In all these interviews, I've asked candidates the same question: "_What is good software?_" In this post, I'd like to share some ideas of answers to this question.

<!-- more -->

Below, I will go through the broad categories of answers starting from "higher level" and proceeding towards "lower level". In my experience, more senior developers typically start their answers from higher level than more junior developers.

### Good software creates value

In general, the purpose of software is to create value to its users and the business. If the software does not create value to users or the business, it is bad software.

How can software fail to create value to its users? Most typically, the software fails to solve any real problem or meet the needs of its users. Following a development process such as Lean UX can reduce the probability of building something that no-one wants.

One could argue that value creation failing to create value is not a software issue but a product issue. This argument makes a lot of sense in companies, where software development teams have no control of product decisions. I have experience of working only in relatively small companies, where every software developer is essentially a product developer and every developer makes product decisions every day. In this case, the distinction between software and product does not really matter in my opinion.

### Good software has good user experience

Good software has happy users. Users are happy when the user experience (UX) is good. Google's [UX design course](https://www.coursera.org/professional-certificates/google-ux-design) defines good user experience as useful, usable, enjoyable and equitable. Useful software creates value to its users. Sofware is usable when users know how to use it and it works as expected. Enjoyable software feels good to use. Software is equitable, when it is usable for all groups of people in the target audience.

### Good software meets requirements

In many companies, stakeholders and customers set the requirements that the software is expected to meet. Good software should meet the requirements of its stakeholders.

Modern organizations have acknowledged that creating a big list of requirements upfront is a bad idea. Instead, the stakeholders and the development team should continuously work together to learn how to address the real needs of the users of the software. This avoids the common pitfalls of so-called "waterfall" projects, where little room is given for iterative learning and exploration.

### Good software is easy to change

Common idiom in software development says that it's better to have bad software that's easy to change than perfect software that's impossible to change. Good software flexibly adapts to change when the user and business requirements change.

The book _Pragmatic Programmer_ summarizes the essence of good design as _Good design is easy to change_. So-called best practices of software development are considered best practices, because they make the software easier to change. For example, loose coupling makes it easier to switch specific parts of the software without affecting other parts. Removing duplication makes it easier to change logic shared by multiple components.

### Good software is easy to maintain

Developers like to work with software that is easy to maintain. Most of developers' time is spent on creating cool new features and improving the user experience instead of fire-fighting production issues and fixing bugs.

Good logging and monitoring infrastructure makes it easier to discover and isolate production issues. Monitoring system may send an alert of a new potential issue before any bug reports from customers have started arriving.

When software is easy to maintain, bugs and small issues are fast to fix. Test automation gives confidence that the change did not introduce any regression. Release process is repeatable and straightforward, so a new version can be released in minutes or hours.

### Good software is tested

Writing tests serves multiple purposes to improve the quality of software.

The most obvious benefit is that test suites and test automation help to discover broken code. It is a lot more convenient to refactor code that has a good test suite. Test automation reduces the time spent on fire-fighting in production, because bugs and issues are discovered earlier on in the development cycle.

Tests also improve the design and architecture of software. When software is designed to be easy to test, it is more likely to be well-designed and easy to change. Tests crystallize the purpose of each component or module.

Finally, tests serve as the documentation of intent. Well-written tests can be read like a good story of how each piece of the software is supposed to work.

### Good software uses the right technology

Good software uses the proper tools and technology for the job at hand.

For example, the right choice of the programming language depends on multiple factors. For example, the skills of the development team, the availability of key libraries and the scalability requirements all may affect the decision.

When the business environment changes and requirements evolve, the choice of technology should also evolve. For example, it is perfectly valid to start building software by creating a monolith. Monolith can be fast to develop and simple to maintain. When the software grows, it might become justifiable to break the monolith into microservices. Each microservice might then be maintained by a different team, written in a different programming language and deployed independently of other microservices.

### Good software has clean code

Working with clean code is more enjoyable to developers than working with messy code.

Clean code is structured into properly-sized modules that each serve a clear purpose. Abstractions are well designed and each layer of abstraction is justifiable. Software is suitably configurable so that its behavior can be changed between different environments.

Good code reads like a story. Functions have a single responsibility and they delegate complex tasks to other functions. There are no surprises such as weird side effects.

### Good software is well documented

Good software is nice to get to know to. There is written documentation explaining how the software has been designed, how to run the system locally, how to release new versions and how to contribute to the codebase.

Comments in the code are used to explain _why_ code is written as it is. There might be warnings for new developers about fragile parts and links to specific issues in the ticketing system. Comments are not used to explain _how_ the code works, because the code mostly explains itself.

### Final words

Martin Fowler [divides](https://martinfowler.com/articles/is-quality-worth-cost.html) software quality attributes into external and internal attributes. External quality is directly visible to the users of the software, but they have no direct visibility to internal quality. The article goes on to make the point that while external quality is more important to users and stakeholders than internal quality, the two are tightly coupled. High internal quality is essential for high external quality in the long run.

The first three sections mentioned above (value creation, good UX, meeting requirements) serve the purpose of high external quality. The latter sections are more related to good developer experience, which is akin to high internal quality. Good developer experience improves the odds that the software keeps working as expected and it can be changed to meet the future needs of its users and stakeholders.

What do you think? Did I miss something? Let me know if you think something is wrong or missing!
