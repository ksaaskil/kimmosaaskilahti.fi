---
title: How I accidentally learned functional programming
path: /blog/2020-05-04-how-i-accidentally-learned-functional-programming
published: true
slug: how-i-accidentally-learned-functional-programming
date: 2020-04-05
description: By writing classes with too many responsibilities.
tags: functional, python
---

I had two courses in programming at the university, in Java and C. The Java course taught object-oriented programming: objects, classes, inheritance and all that.

After graduating as a physics major, I got my first job as an algorithm and software developer. My first algorithm was one that required loading some data at the application start-up. When the app was running, the algorithm would then get various inputs and, with the help of the data loaded at start-up, compute useful outputs from the inputs.

Having learned Java at the uni, I thought to myself: "I need to create a class for my algorithm, and it should have setters and getters for the data and the algorithm inputs." My first implementations of the algorithm then looked something like the following:

```python
algorithm = new Algorithm();
algorithm.add_data(data);
# Wait for an input event
algorithm.process(input);
output = algorithm.get_result();
# Wait for the next input
algorithm.process(input);
output = algorithm.get_result();
```

The `add_data` is essentially a setter for the data required by the algorithm, and `process` is a function that processes algorithm inputs into outputs and stores them to the internal state for later retrieval with the `get_result` method.

I honestly thought this was flexible design. With the `add_data` method, users of the class would be able to add more data to the algorithm at run-time. Also, the `process` function was very flexible in that it didn't return anything. Instead, it stored the algorithm output into the internal state and left it to the user to decide how they'd like to retrieve the output. Maybe they would like to get the algorithm result in pretty-printed form instead of "raw" format, so I could just add another `get_result_prettyprinted` method later on.

Of course, this is not good design. Any user of the `Algorithm` class would basically need a user guide to know which methods to call and in which order. It would also be really hard to cover all the different scenarios for what to do if the user called the methods in the wrong order.

Luckily I was surrounded by more experienced programmers who, through the wonders of code review, taught me better.

Let's first get rid of the `add_data` by loading the data in the constructor:

```python
algorithm = Algorithm(data)
algorithm.process(input)
output = algorithm.get_result()
```

Protest! What if we needed to add more data to the `Algorithm` at run-time, that's what the `add_data` is so good for! Well, we don't have that requirement and may never have, so why add it now? Second, even if we had to add more data to `Algorithm`, we could simply create a new `Algorithm` instance by combining the old and new data with something like `Algorithm(old_data + new_data)`.

Can we get rid of the `process` method? Of course:

```python
algorithm = Algorithm(data)
output = algorithm.compute(input)
```

We simply return the `output` from the `compute` function and get rid of the `process`. But what about my great plan about `Algorithm` class having multiple alternative methods for accessing the result in the format required by the user? Surely that would be useful!

Maybe it could, but **it's not the algorithm's job to do formatting**. If we need pretty-printing, it would be another class's or function's responsibility.

Can we trim the class even more? Well, some people say that classes with one method [should not be classes](https://www.youtube.com/watch?v=o9pEzgHorH0). Let's get rid of the class as well:

```python
from functools import partial

def algorithm(data, input):
  ...
  return output

output = algorithm(data, input)
# Or if you need the algorithm elsewhere
algo = partial(algorithm, data)
output = algo(data)
```

And there you have it, we've replaced the whole class with a [pure function](https://en.wikipedia.org/wiki/Pure_function) with no side-effects. I'd dare to say we ended up doing some functional programming by replacing the class with internal state with a pure function. The key point in all of the above is not, however, that we replaced the class with a function. The key point is that we trimmed our algorithm to a single responsibility.

My learning from the above is that there's a danger lurking in object-oriented designs: It's easy to end up with massive classes having too many responsibilities. Functional programming tends to, in my opinion, lead to more decoupled designs. This doesn't mean that one paradigm is better than the other. All I'm saying is: Be careful out there when writing classes.
