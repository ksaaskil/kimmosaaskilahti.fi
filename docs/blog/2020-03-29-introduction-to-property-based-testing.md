---
title: Introduction to property-based testing
published: true
date: 2020-03-29
slug: introduction-to-property-based-testing
path: /blog/introduction-to-property-based-testing
description: Verify assumptions about your code.
tags: testing, functional, property-based
---

Property-based testing is a testing paradigm supporting regular example-based unit tests. In the [Pragmatic Programmer](https://en.wikipedia.org/wiki/The_Pragmatic_Programmer) book, the authors recommend to use property-based testing for verifying assumptions about their code. It forces you to think about the actual preconditions, postconditions and invariants of your code instead of implicitly coming up with such rules through hard-coded examples.

I recently gave a presentation at work about property-based testing. You can find the slides at [ksaaskil.github.io/introduction-to-property-based-testing/](https://ksaaskil.github.io/introduction-to-property-based-testing/) and the accompanying code in [github.com/ksaaskil/introduction-to-property-based-testing](https://github.com/ksaaskil/introduction-to-property-based-testing). The presentation also contains some material about testing stateful systems, an intriguing but complex topic.

Most of the contents in the presentation come from the [Property-Based Testing with PropEr, Erlang, and Elixir](https://propertesting.com/) book. It's an awesome book and I highly recommend it! Don't be put off if you don't know Erlang or Elixir: the code samples are very readable (well at least the Elixir ones are) and you may learn a beautiful new language. I know I love Elixir now!

Thanks for reading, as always I appreciate any feedback.
