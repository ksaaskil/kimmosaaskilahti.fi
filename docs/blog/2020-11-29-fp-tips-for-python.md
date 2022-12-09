---
title: Functional programming tips to power up your Python code
published: true
description: List comprehensions, frozen dataclasses, etc.
tags: learning,functional,python
series: Learning functional programming
thumbnail: reindeer
date: 2020-11-29
canonical_url: https://kimmosaaskilahti.fi/blog/2020-11-29-fp-tips-for-python/
---

Hi! In this post, I'd like to present my favorite functional programming techniques (FP) for Python. I'm a big fan of FP as I've found that by following FP principles I can write code that is more readable and easier to debug. Python is not a functional programming language (and it never will be), but I think there are still many things we can learn from languages such as Haskell that are beneficial also in Python.

### Use list comprehensions

The first technique is to use [list comprehensions](https://docs.python.org/3/tutorial/datastructures.html#list-comprehensions) to create lists and to perform operations such as `map` and `filter` on lists. 

In Haskell, we would use list comprehensions as follows:

```haskell
ghci> [x*2 | x <- [1..10], x*2 >= 12] 
[12,14,16,18,20]
```

Here we're traversing the list `[1..10]` by filtering values by `x*2 >= 12` and mapping with `x*2`.

In Python, we would achieve the same with

```python
>>> [2*x for x in range(1, 11) if 2*x >= 12]
[12, 14, 16, 18, 20]
```

The more "imperative" version of the above would be:

```python
a = []
for i in range(1, 11):
  val = 2*x
  if val >= 12:
    a.append(val)
print(a)
```

One can also perform `flatmap`-like operations with nested list comprehensions:

```python
>>> xss = [[1, 2], [3, 4], [5, 6]]
>>> [2*x for xs in xss for x in xs]
[2, 4, 6, 8, 10, 12]
```

One problem I often face with list comprehensions in Python is that there's no `let` construct. This construct would be useful for improving code readability and to avoid re-computing intermediate values by binding them to variables. For example, in Haskell you could do:

```hs
ghci> [y | x <- [1..50], let y=x*x, y `mod` 5 == 0]
[25,100,225,400,625,900,1225,1600,2025,2500]
```

Here we avoid computing `x*x` twice for every element by binding the value to variable `y`.

In Python, we could write

```python
>>> [x*x for x in range(1, 51) if x*x % 5 == 0]
[25, 100, 225, 400, 625, 900, 1225, 1600, 2025, 2500]
```

but this would compute `x*x` twice for every element. We can circumvent this by using an [auxiliary one-element tuple](https://stackoverflow.com/a/33562793/10561443) as follows:


```python
>>> [y for x in range(1, 51) for y in (x*x,) if y % 5 == 0]
[25, 100, 225, 400, 625, 900, 1225, 1600, 2025, 2500]
```

It's not as readable as in Haskell, but sometimes it feels like the best choice. We can make the construct more readable by splitting it into multiple lines:

```python
ys = [x_squared for x in range(1, 51)
                for x_squared in (x*x,)  # let x_squared = x*x
                if x_squared % 5 == 0]
```

### Use generator expressions and `itertools`

In Haskell, expressions are evaluted lazily so it's completely natural to work with e.g. lists containing all integers. Such infinite lists are never supposed to be evaluated in full, but the values are created only when they are actually needed.

Python has excellent support for such "iterators" via [generator expressions and functions](https://wiki.python.org/moin/Generators). The [`itertools`](https://docs.python.org/3/library/itertools.html) package contains many useful functions for working with iterators.

As an example, let's consider the [first problem](https://projecteuler.net/problem=1) in Project Euler. Sharing solutions of Project Euler problems publicly is strongly discouraged, but since the internet already is full of answers for the first problem, I'll make an exception here. Here's the problem:

> If we list all the natural numbers below 10 that are multiples of 3 or 5, we get 3, 5, 6 and 9. The sum of these multiples is 23. Find the sum of all the multiples of 3 or 5 below 1000.

We could solve this with iterators as follows:

```python
>>> from itertools import count, takewhile
>>> ints = count(1)  # Iterator of all integers
>>> multiples = (val for val in ints if val % 3 == 0 or val % 5 == 0)  # All integers that are multiples of 3 or five
>>> multiples_below_1000 = takewhile(lambda val: val < 1000, multiples)  # All such integers below 1000
>>> sum(multiples_below_1000)  # Sum of all such values, this is the evaluation step
233168
```

This isn't the most efficient solution to the problem in Python, but I find it very easy to read and reason about.

### Use frozen dataclasses

In pure functional languages such as Haskell, one cannot mutate objects in-place. Instead, one must compose a program out of pure functions that do not mutate their inputs. Code becomes essentially a pipeline, where immutable data structures flow from one transformation to the next. This kind of thinking is also encouraged in the wonderful [_Pragmatic Programmer_](https://pragprog.com/titles/tpp20/the-pragmatic-programmer-20th-anniversary-edition/) book:

> "Thinking of code as a series of (nested) transformations can be a liberating approach to programming. It takes a while to get used to, but once you've developed the habit you'll find your code becomes cleaner, your functions shorter, and your designs flatter. Give it a try."

Now, it does not make much sense to try to write purely functional programs with Python, but I think the idea of favoring "transformative" code with immutable objects is a good idea. Using immutable objects also eliminates one whole class of potential bugs.

For plain datastructures, Python's built-in [dataclasses](https://docs.python.org/3/library/dataclasses.html) are a good choice for immutable containers. With `frozen=True`, we can ensure the properties in our dataclasses cannot be mutated after their creation:

```python
from dataclasses import dataclass

@dataclass(frozen=True)
class Doggie:
  name: str
  age: int
```

If we want to change a `Doggie`'s name, we can use `replace`:

```python
from dataclasses import replace

def change_doggie_name(doggie: Doggie, new_name: str) -> Doggie:
  return replace(doggie, name=new_name)
```

Creating a new object every time will incur a performance penalty, so it's up to you to decide if the overhead is too large for your program. 

It's important to remember that frozen dataclasses aren't truly mutable, as we can still mutate all mutable data structures within our class:

```python
@dataclass(frozen=True)
class Doggie:
  name: str
  age: int
  attributes: dict

doggie = Doggie(name="Ben", age=10, attributes={})
doggie.attributes["color"] = "brown"  # In-place mutation
```

We can avoid this by using frozen dataclasses as properties:

```python
@dataclass(frozen=True)
class DoggieAttributes:
  color: str

@dataclass(frozen=True)
class Doggie:
  name: str
  age: int
  attributes: DoggieAttributes

doggie.attributes.color = "black"  # NOT ALLOWED
```

Changing a doggie's name can then be achieved by chaining `replace` calls:

```python
black_doggie = replace(doggie, attributes=replace(doggie.attributes, color="black"))
```

With deeply nested structures, using `replace` can become tedious. In functional programming languages, this problem of "mutating" deeply nested structures is elegantly handled by [optics libraries](https://medium.com/@gcanti/introduction-to-optics-lenses-and-prisms-3230e73bfcfe) such as [`lens`](https://hackage.haskell.org/package/lens) in Haskell. Python has its own [`lenses`](https://pypi.org/project/lenses/) package, but I haven't found it to be that useful out there in the real world: without the power of static type checking, overuse of lenses can result in very cryptic code.

With that said, most data structures I've encountered are at most two to three levels deep and using `replace` isn't an issue, especially when using helper functions such as

```python
def change_doggie_color(doggie: Doggie, new_color: str):
  return replace(doggie, 
                 attributes=replace(doggie.attributes, 
                                    color=new_color))
```

### Use immutable lists or dictionaries

Continuing on the topic of immutability, we still need to work with mutable lists and dictionaries in Python code. Just because they are mutable, that doesn't mean we need to mutate them. Whenever I find myself trying to mutate a list in-place with `l.append(value)` or a dictionary with `d["key"] = value`, I stop and think if it's really necessary. Such an operation would not be available in pure functional languages such as Haskell, so it's definitely possible to write code without mutating objects in-place. Could I avoid it here?

If I'm creating a new list or dictionary, maybe I could use list or dictionary comprehensions instead. If I need to add a value to an existing list, it may be better to simply create a whole new new object with the help of positional expansion:

```python
new_list = [*old_list, value]
```

Similarly, instead of adding a key to an existing dictionary, maybe I can just create a new dictionary with keyword expansion:

```python
new_dict = { **old_dict, "key": value }
```

One advantage in treating our lists as read-only is that if we use Python's [`typing`](https://docs.python.org/3/library/typing.html) system (we should!) for static type checking, we can use the read-only [`typing.Sequence`](https://docs.python.org/3/library/typing.html#typing.Sequence) type for our lists instead of the mutable [`typing.List`](https://docs.python.org/3/library/typing.html#typing.Sequence) type. Because `typing.Sequence[T]` is a read-only collection for values of type `T`, it's [covariant](https://kimmosaaskilahti.fi/blog/2020-02-10-covariance-and-contravariance-in-generic-types/) in `T`:

>`typing.Sequence[A] <: typing.Sequence[B] if A <: B`

This means that we can use `typing.Sequence[A]` where-ever `typing.Sequence[B]` is expected, as long as `A` is a subtype of `B`. For similar reasons, it's better to use the read-only [`typing.Mapping`](https://docs.python.org/3/library/typing.html#typing.Mapping) for dictionaries instead of [`typing.Dict`](https://docs.python.org/3/library/typing.html#typing.Mapping).

It's up to you to decide if creating new objects instead of mutating existing ones is the right solution for your program. In performance-critical cases, it's most likely better to simply mutate lists in-place instead of suffering the overhead of creating new objects. Similarly, if creating the list includes side-effects such as writing to a database, it's better to avoid list comprehensions for readability's sake.

### Use type union instead of inheritance

The [_Pragmatic Programmer_](https://pragprog.com/titles/tpp20/the-pragmatic-programmer-20th-anniversary-edition/) book has an interesting paragraph on inheritance:

> "Do you program in an object-oriented language? Do you use inheritance? If so, stop! It probably isn't what you want to do."

How to avoid inheritance in Python? Let's assume you'd like to work with objects of type `Doggie` and `Cat`. Both `Doggie` and `Cat` have a `say()` method and you want to put such animals in containers such as (immutable) lists. The classic Programming 101 solution would be to create a super-class `Animal` and inherit `Doggie` and `Cat` from `Animal`:

```python
import abc

class Animal:
  def say(self) -> str:
    raise NotImplementedError()

class Doggie(Animal):
  def say(self) -> str:
    return "Woof!"

class Cat(Animal):
  def say(self) -> str:
    return "Meow!"
```

Now we get classic polymorphism:

```python
import typing

def all_animals_say(animals: typing.Sequence[Animal]):
  for animal in animals:
    animal.say()
```

However, we can achieve the same without any of the problems of inheritance by using a [_type union_](https://docs.python.org/3/library/typing.html#typing.Union):

```python
BetterAnimal = typing.Union[Doggie, Cat]

def all_better_animals_say(animals: typing.Sequence[BetterAnimal]):
    for animal in animals:
        print(animal.say())
```

If any class within the `BetterAnimal` doesn't have the `say()` method of proper type, the type-checker will complain.

Type unions only cover one class of use cases for inheritance, so don't expect you can always get rid of inheritance via type unions. The above example also wasn't a good example of "bad inheritance", as we could have made `Animal` an "interface" by turning it into an abstract class with abstract methods and without any hard-coded behaviour. The point I'm trying to make is: always stop to think before using inheritance.

## Conclusion

This concludes my list of functional programming tips for Python. If you have any other tips, comments or questions, please leave a comment! Thanks for reading!
