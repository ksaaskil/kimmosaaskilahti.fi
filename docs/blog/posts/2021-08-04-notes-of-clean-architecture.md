---
title: Notes of Clean Architecture
description: What are the SOLID principles and what makes a good architecture
tags:
  - Reading notes
date: 2021-08-04
canonical_url: https://kimmosaaskilahti.fi/blog/2021-08-04-notes-of-clean-architecture/
categories:
  - Software development
authors:
  - ksaaskil
---

# Notes of Clean Architecture

I recently finished reading [Clean Architecture](https://www.goodreads.com/book/show/18043011-clean-architecture) by Robert C. Martin. This book accompanied with [Clean Code](https://www.goodreads.com/book/show/3735293-clean-code) and [Clean Coder](https://www.goodreads.com/book/show/10284614-the-clean-coder) are very useful reading for any professional software developer, even though they are getting old and there are better books available out there. This post briefly summarizes Clean Architecture.

<!-- more -->

The book begins by discussing the **cost of a mess**. Making a mess is always slower than staying clean. Messy software slows down the development. A simple way to avoid making a mess is to practice test-driven development.

> "The only way to go fast is to go well."

Software is a competition of two values: behavior and architecture. Well-behaving program does what it's expected to do. Good architecture makes the program easy to change.

> Clean architecture is more important than behavior in the sense that a non-working program that's easy to change beats a working program that's impossible to change.

Behavior is often urgent but typically not that important. Architecture is always important but typically not that urgent.

The book describes three programming paradigms: structural programming, object-oriented (OO) programming, and functional programming (FP).

The most important aspect of OO programming is the power of _polymorphism_. It allows creating "plugin architectures" where a dependent module can be swapped with another one without changing anything in the depending modules. The [dependency inversion](https://en.wikipedia.org/wiki/Dependency_inversion_principle) principle is introduced here. It's probably the most important concept in the whole book and it appears again and again.

I was happy to find even a short discussion on FP as Bob Martin's book are typically very OO-heavy, even to the point where you think that OO is the best way to write clean code.

The book then moves on to presenting the [SOLID principles](https://en.wikipedia.org/wiki/SOLID) for designing clean components.

The first principle is single responsibility principle (SRP). This architectural principle is closely related to the Clean Code principle "A function should only do one thing". Similarly, a software module should only have one reason to change. The book phrases the principle in the form:

> "A module should be responsible to only one actor."

The point is to avoid the situation where changing the behavior for one stakeholder surprisingly breaks the behavior for another stakeholder. A module should only be used for one purpose.

The second principle is the open-closed principle (OCP). It says:

> "Software should be open for extension but closed for modification."

As far as I understand correctly, this principle is closely related to the ["Program against interfaces"](https://stackoverflow.com/questions/383947/what-does-it-mean-to-program-to-an-interface) principle. If a certain part of your module is "volatile" in the sense that users may want to swap that part with another implementation, your module should provide a simple way to do so by implementing an interface. Programming against interfaces ensures that your code depends on clean abstractions (instead of hard-coded but volatile logic) and remains open for extension.

The third principle is the [Liskov substitution principle](https://en.wikipedia.org/wiki/Liskov_substitution_principle). I would condense the principle in practical terms to "avoid [leaky abstractions](https://www.joelonsoftware.com/2002/11/11/the-law-of-leaky-abstractions/)". Any implementation of an interface should respect the abstraction and its contract. If you're implementing an interface for saving data to a remote storage, your implementation should not delete data as a side-effect. Otherwise, you run the risk of breaking any programs depending on the interface.

The fourth principle is the interface segregation principle. I understand this principle as saying that a single interface shouldn't have multiple purposes. Too big an interface should be split into smaller ones, each with a well-defined purpose.

The last and probably the most important principle of the five is the [dependency inversion principle](https://en.wikipedia.org/wiki/Dependency_inversion_principle). This principle solves the problem of depending on volatile code. You don't want to name, instantiate, or inherit from volatile classes. Dependency inversion principle solves the problem by introducing an interface that the volatile module implements and depends on, inverting the dependency. See the figures in the Wikipedia article linked above.

The book next moves on to components as "JAR files" and introduces principles such as the "reuse/release equivalence principle", "common closure principle" and "common reuse principle". The chapter also introduces "stability metrics" for heuristically measuring the stability or volatility of a module. I didn't find anything in this part of the book particularly interesting or useful, with the exception of the over-arching principle

> "Depend on the direction of stability."

The last part of the book talks about clean architecture.

> "A good architect maximizes the number of decisions not made."

Good architecture leaves as many options open as possible for as long as possible.

Good architecture supports (1) use cases and operation, (2) maintenance, (3) development, and (4) deployment. Minimizing the number of hard-coded dependencies keeps the architecture easy to change.

Good architecture is testable and independent of details such as frameworks, databases, UIs, and external agencies.

Good architecture is centered on the use-case. When you look at the architecture, it should scream its use-case.

See the [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html) in the author's blog. External details such as UI, database, or any other I/O depend on high-level policies (business rules), not the other way around. The architecture is very similar to [hexagonal architecture](https://netflixtechblog.com/ready-for-changes-with-hexagonal-architecture-b315ec967749).

Finally, the book talks about different ways to deploy components either as code-level packages, as separate processes, or as separate services (micro-services). The cons of micro-service architecture are the "independent deployment fallacy", the "independent development fallacy", and the fact that abstractions are simpler to define with code-level packages. With all the hype around micro-services, the bashing of micro-services was kind of a refreshing read.

The principles in this book are best applied carefully and in small doses. Don't go blowing up your well-working Django app to decouple the business rules from the database. Don't create an interface for every dependency. Carefully consider the pros and cons of added abstraction layers. See the book [Architecture Patterns with Python](https://www.oreilly.com/library/view/architecture-patterns-with/9781492052197/) how to gradually introduce hexagonal architecture into your Python code.

But do write tests to ensure your architecture remains clean.
