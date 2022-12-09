---
title: How to speed up I/O-intensive tasks with multithreading and asyncio
published: true
description: Avoid callbacks with asyncio like a boss
tags: learning,python,asyncio
thumbnail: reindeer
date: 2021-01-03
canonical_url: https://kimmosaaskilahti.fi/blog/2021-01-03-asyncio-workers/
---

Recently I had to perform a batch processing task where a thousands of images were downloaded from S3, the images were processed and then uploaded to a new bucket in S3. As the processing was relatively lightweight, most of the computation time was spent on downloading and uploading images, that is, I/O. Such I/O bound tasks are a great fit for multithreading (CPU-bound tasks better fit multiprocessing, with all its quirks related to serialization). In this post, I'd like to share a small example how to run tasks in a thread pool.

We'll use [`ThreadPoolExecutor`](https://docs.python.org/3/library/concurrent.futures.html#concurrent.futures.ThreadPoolExecutor) to execute tasks in a configurable number of worker threads. One option would be to submit tasks to the pool with `executor.submit()`. This method returns a [`concurrent.futures.Future`](https://docs.python.org/3/library/concurrent.futures.html#concurrent.futures.Future) object, to which one can add callbacks with [`add_done_callback()`](https://docs.python.org/3/library/concurrent.futures.html#concurrent.futures.Future.add_done_callback). However, callbacks are evil and it's best to avoid them if possible.

With [`asyncio`](https://docs.python.org/3/library/asyncio.html), we can instead use _awaitable_ [`asyncio.future`](https://docs.python.org/3/library/asyncio-future.html#asyncio.Future) objects and avoid callbacks.

Our toy task is defined as follows:

```python
def execute_hello(ind):
    print(f"Thread {threading.current_thread().name}: Starting task: {ind}...")
    time.sleep(1)
    print(f"Thread {threading.current_thread().name}: Finished task {ind}!")
    return ind
```

The task will sleep one second between printing informative messages to the standard output. It takes an integer argument so we can keep track of which task is executing.

The entrypoint to our program looks as follows:

```python
import asyncio

def execute_hello(ind):
    ...

async def main(tasks=20):
    ...

if __name__ == "__main__":
    asyncio.run(main())
```

The [`asyncio.run`](https://docs.python.org/3.7/library/asyncio-task.html#asyncio.run) function executes the coroutine `main` by starting an event loop. Note that you need Python > 3.7 to use `asyncio.run`.

In the coroutine, we'll declare the [`ThreadPoolExecutor`](https://docs.python.org/3/library/concurrent.futures.html#threadpoolexecutor) with, for example, four worker threads:

```python

MAX_WORKERS = 4

async def main(tasks=20):
    with concurrent.futures.ThreadPoolExecutor(max_workers=MAX_WORKERS) as pool:
        ...
```

Using `ThreadPoolExecutor` as context manager ensures that the pool is shutdown when the context manager exits.

Now that we have the pool, we can submit tasks to it. Instead of using `pool.submit`, we'll use [`loop.run_in_executor()`](https://docs.python.org/3/library/asyncio-eventloop.html#asyncio.loop.run_in_executor) from `asyncio`:

```python
async def main(tasks=20):
    with concurrent.futures.ThreadPoolExecutor(max_workers=MAX_WORKERS) as pool:
        loop = asyncio.get_running_loop()
        futures = [
            loop.run_in_executor(pool, execute_hello, task)
            for task in range(tasks)
        ]
```

Function [`asyncio.get_running_loop()`](https://docs.python.org/3.7/library/asyncio-eventloop.html#asyncio.get_running_loop) returns the running event loop. We then create a future for each of the 20 tasks we want to run using `loop.run_in_executor(pool, execute_hello, task)`. 

So far, so good. If we now execute the script, we can see that the pool executes four tasks at a time and takes around five seconds to complete as expected. However, we're still missing any clean-up code and error handling.

To gather the results from the tasks, we'll use [`asyncio.gather`](https://docs.python.org/3.7/library/asyncio-task.html#asyncio.gather). This function can be used to await for multiple awaitables to finish and add error handling like this:

```python
async def main(tasks=20):
    with concurrent.futures.ThreadPoolExecutor(max_workers=MAX_WORKERS) as pool:
        loop = asyncio.get_running_loop()
        futures = [
            loop.run_in_executor(pool, execute_hello, task)
            for task in range(tasks)
        ]
        try:
            results = await asyncio.gather(*futures, return_exceptions=False)
        except Exception as ex:
            print("Caught error executing task", ex)
            raise
    print(f"Finished processing, got results: {results}")
```

When our script now finishes, it prints the result from every task in order:

```
Finished processing, got results: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]
```

Let's now test our error handling by modifying the task as follows:

```python
def execute_hello(ind):
    print(f"Thread {threading.current_thread().name}: Starting task: {ind}...")

    time.sleep(1)

    if ind == 2:
        print("BOOM!")
        raise Exception("Boom!")

    print(f"Thread {threading.current_thread().name}: Finished task {ind}!")
    return ind
```

If we now run the script, we notice that the execution continues until all tasks are run even though the third task in the first batch fails. This may or may not be what we want. In my case, I needed to avoid running new tasks after any single task failed. This can be accomplished by setting the global `_shutdown` variable to `True` when the first task fails and skipping performing work in any remaining tasks if `_shutdown` is `True`:

```python

_shutdown = False

def execute_hello(ind):
    if _shutdown:
        print(f"Thread {threading.current_thread().name}: Skipping task {ind} as shutdown was requested")
        return None
    ...

async def main(tasks=20):
    global _shutdown
    with concurrent.futures.ThreadPoolExecutor(max_workers=MAX_WORKERS) as pool:
        loop = asyncio.get_running_loop()
        futures = [
            loop.run_in_executor(pool, execute_hello, task)
            for task in range(tasks)
        ]
        try:
            results = await asyncio.gather(*futures, return_exceptions=False)
        except Exception as ex:
            print("Caught error executing task", ex)
            _shutdown = True
            raise
    print(f"Finished processing, got results: {results}")
```

Now any tasks that hadn't been started at the time of the first exception are skipped. Any tasks that had been started are still awaited to finish.

If you have any questions or comments, please leave one!
