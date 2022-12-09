---
title: Why I love learning functional programming
published: true
description: Yet another blog post on why learning functional programming is fun and useful
tags: learning,functional,python,haskell
series: Learning functional programming
thumbnail: reindeer
date: 2020-08-01
canonical_url: https://kimmosaaskilahti.fi/blog/2020-08-01-why-i-love-learning-fp/
---

This is the first part of a series on my journey in learning functional programming (FP). In this first part, I'd like to share why I spend time on learning functional programming in the first place.

At work, I mostly write imperative code and I still haven't written purely functional production software. However, I still spend time learning it every now and then, and here's why.

### It brings math to programming

The first reason I like functional programming is that it brings math back to programming.

At the university, I minored in math. I'll probably never have any practical use to the courses in topology, differential geometry or group theory, but I none of those courses were a waste of time. They all taught the power of abstraction, how to find and see the big concepts underlying seemingly unrelated problems.

In functional programming, you encounter abstractions like functors and monads all the time. Functional programming has roots deep in category theory, a branch of mathematics studying objects and their relationships. Category theory tells us, for example, that [monad is just a monoid in the category of endofunctors](https://stackoverflow.com/questions/3870088/a-monad-is-just-a-monoid-in-the-category-of-endofunctors-whats-the-problem). What the heck do those words even mean? I have no idea, but I must find out!

I've been learning category theory from the wonderful [Category Theory for Programmers](https://bartoszmilewski.com/2014/10/28/category-theory-for-programmers-the-preface/) blog posts. They're are an easy and accessible way to access category theory. Maybe some day I'll be able to pick up a serious textbook on category theory!

<!--In an [interesting talk](https://haskell.love/vitaly-bragilevsky/) on how to simplify learning Haskell, Vitaly Bragilevsky had the interesting point that there's actually nothing deep to understand in concepts like functors or monads. In Haskell, they're only type classes.-->

### It forces you to think differently

My second reason to learning functional programming is that it forces me to think differently.

Putting aside playing with [Basic](https://en.wikipedia.org/wiki/BASIC) in the 90s, I first learned programming at the university in Java and C. Programs were written using if-clauses and for-loops. Data was modified in-place with functions or method calls returning nothing.

If-clauses, for-loops and in-place mutations are easy for us humans to understand, because that's how we intuitively process data. If you're given a list of `N` skills that you need to learn unless I already know the skill, here's the algorithm:

0. Set `i=1`
1. Take the `i`'th skill from the list
1. Check if you know the skill. If you don't, learn the skill.
1. If `i=N`, exit. Otherwise, set `i = i+1` and go to `1`.

This is an imperative program, with one command after another modifying the program state (your skills). To us, world seems to be made of mutable objects. That's how computers also work, one statement after another modifying the program state.

Now, imagine you're told you need to write code for a program without a single if-clause or for-loop. You are also forbidden to mutate objects. What you're allowed to do is create new objects and write _pure_ or _referentially transparent_ functions. Referential transparency means that a function call can be replaced by its return value without any change in the program. For example, this function is not referentially transparent:

```python
def square(x):
    print(f"Computing the square of {x}")
    return x*x
```

You can't replace `square(x)` with `x*x` and expect the program to remain unchanged.

It goes without saying that such constraints force you to think differently about writing code. To me, that's a very good thing. Recently I've been writing code mostly in Python and JavaScript. While I love both languages for their flexibility and simple syntax, and there's always something new to learn in both of them, I don't think they offer that many chances for learning new _concepts_. Last time I learned something genuinely new about Python was when we wrote a [command-line tool](https://github.com/Meeshkan/meeshkan-client) making heavy use of [`asyncio`](https://docs.python.org/3/library/asyncio.html) or when I had to understand [generics](https://dev.to/meeshkan/covariance-and-contravariance-in-generic-types-3k63) in the `typing` module. Most of the time, the code consists of the same if-clauses and for-loops, possibly in some new framework.

With functional programming, programs will inevitably look different. Are they better? That's an ill-posed question, as there's no one best code for a particular task. It depends on factors like with whom you work and who will maintain the code. But I do think writing functional programs teaches me something fundamentally new about computing, and the more you know, the more likely it is that you can pick the best approach when new problems emerge.

Of course, my employer most likely wouldn't appreciate me spending the whole morning figuring out how to [make a HTTP call](https://dev.to/ksaaskil/using-fp-ts-for-http-requests-and-validation-131c) or spending the morning explaing my colleagues how data type [`Maybe`](https://hackage.haskell.org/package/base-4.14.0.0/docs/Data-Maybe.html) replaces `if`. That's one reason why FP is mostly a hobby to me at the moment. For me to be truly productive in writing purely functional programs, I would need to be surrounded by colleagues supporting me, with a team where knowledge about solving problems in a functional way would spread. In such a team, the cost of learning new concepts would also be lower as those new concepts might improve everybody's code base.

Above I referred to imperative programming as the "non-functional" way of coding. To see how that's not true, here's one excerpt of Scala code from the [Functional Programming in Scala](https://www.manning.com/books/functional-programming-in-scala) book ("the red book"):

```scala
val factorialREPL: IO[Unit] = sequence_(
    IO { println(helpstring) },
    doWhile { IO { readline } } { line =>
        when (line != "q") {
            for {
                n <- factorial(line.toInt)
                _ <- IO { println("factorial: " + n) }
            }
        } yield ()
    }
)
```

That's a purely functional program written in imperative fashion. Why's there a for-loop? It's Scala's [syntactic sugar](https://docs.scala-lang.org/tutorials/FAQ/yield.html) for composing functions such as `map`, `filter` and `flatMap`.

### FP is a logical conclusion to many ideas considered good programming style

The last reason to learn FP is that I think it pushes the boundaries of many ideas considered good programming style.

My first touch to functional programming came from attending [lectures](https://csd.cmu.edu/course-profiles/15-150-Principles-of-Functional-Programming) in functional programming at CMU, when I was a visiting researcher there. I attended maybe six lectures, where the lecturer wrote formal proofs showing that given recursive function calls would terminate with the expected result. It all seemed very theoretical to me and I thought I would not meet FP again.

However, as soon as I started in my first programming job, I was introduced to FP as more experienced programmers [told me](https://dev.to/ksaaskil/how-i-accidentally-learned-functional-programming-1g1m) to avoid writing code with implicit side effects and mutable state where possible. I didn't understand at the time that the ideas had anything to do with FP, but I can see now how many such ideas are built-in to FP.

As an example of how FP can help write cleaner code, let's say you have a function like this:

```ts
const containsFinnishLapphund: (jpegBase64: String) => boolean = ...
```

It checks if an image contains a [Finnish lapphund](https://www.youtube.com/watch?v=X0ejoDOmM6Q). The signature says the function takes a base64 encoded string and returns a boolean. Based on the signature, I expect this function to _not have implicit side effects_. Therefore, I can safely call the function for 100 images in parallel without worrying, for example, about race conditions, deadlocks or hitting rate limits of external APIs.

The key here is the word _implicit_. In the context of my TypeScript codebase, I do not mind if the function prints to console: my code would most likely already be interspersed with such logging statements. However, I would be very surprised if calling the function incremented a database counter or stored the image to Google storage. Such surprises could lead to hard-to-find bugs, let alone make testing a pain.

In non-functional languages, it's the developer's responsibility to write code that is not surprising. In Haskell, however, a type signature such as

```hs
containsFinnishLapphund :: String -> Bool
```

would make it _impossible_ for the implementation to have observable side effects such as storing the image somewhere. If the function insisted on making a network call or logging to console, it would need a type signature

```hs
containsFinnishLapphund :: String -> IO Bool
```

The `IO` typeclass here makes it explicit that the function is doing _something_ with the external world. What does it do? For that, you'll need to read the code or trust the function docstring saying it doesn't do anything other than print to console. But at least, it's not a surprise anymore.

Another example of an "FP idea" considered good programming style nowadays is declarative style. For example, most programmers would nowadays agree that to remove even elements from an array and square the rest, this

```js
const double = arr => arr.filter(v => v % 2 === 0).map(v => v * v)
```

is preferred to this:

```js
const double = arr => {
  const newArr = []
  for (const i = 0; i++; i < arr.length) {
    if (arr[i] % 2 === 0) {
      newArr.push(arr[i] * arr[i])
    }
  }
  return newArr
}
```

In functional languages, the former would be the default way of solving the problem. Again, this doesn't mean declarative style is better than imperative, but it does show that declarative style has its pros. In FP, the declarative style can be pushed even further with function composition and point-free style:

```hs
square :: Int -> Int
square num = num * num

isEven :: Int -> Bool
isEven n = n `mod` 2 == 0

double :: [Int] -> [Int]
double = map square . filter isEven
```

To me, code like this is elegant and beautiful. While function composition and point-free style take time to get used to, I find it worth the effort.

### Conclusion

That concludes the first part of the series. I love learning functional programming because it gives me reason to read math again, is forces me to think differently, and it pushes the boundaries of good programming style. Thanks for reading, please leave a comment if you have any!
