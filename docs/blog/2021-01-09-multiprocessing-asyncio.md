---
title: How to process CPU-intensive tasks from asynchronous stream
published: true
description: Avoid callbacks with asyncio.run_in_executor
tags: learning,python,asyncio,multiprocessing
thumbnail: reindeer
date: 2021-01-09
canonical_url: https://kimmosaaskilahti.fi/blog/2021-01-09-multiprocessing-asyncio/
---

Hi! In the [previous article](https://kimmosaaskilahti.fi/blog/2021-01-03-asyncio-workers/), we saw how to speed up I/O-bound tasks with multithreading without any callbacks. In this article, I'd like to share how to speed up compute-intensive (CPU-bound) tasks with [`ProcessPoolExecutor`](https://docs.python.org/3/library/concurrent.futures.html#concurrent.futures.ProcessPoolExecutor), again using [`asyncio`](https://docs.python.org/3/library/asyncio.html) high-level methods to keep the code readable and without a single callback.

The full example can be found in the [concurrency-examples](https://github.com/ksaaskil/concurrency-examples/blob/master/asyncio-futures/processes-queue.py) repository.

Let us assume we're processing events from an asynchronous event source, i.e., an _event stream_. The source could be, for example, a websocket or MQTT subscription. Let's further assume that the event source publishes messages about _once a second_ and that processing the event takes, on average, five seconds. If we processed the events in the main thread, the processing would obviously fall behind very quickly.

If we were reading from a shared queue such as [SQS](https://aws.amazon.com/sqs/), one solution would be to add at least five consumer applications. With five consumers in place, the processing would (barely) keep up with the event stream. But what if we cannot add any more consumer applications? For example, if we were reading from an MQTT topic, adding more consumers would lead to the same event being processed by each consumer, which is not what we want.

> Note: Shared subscription [is part of](https://stackoverflow.com/questions/35014975/using-mqtt-with-multiple-subscribers) the MQTT v5 spec. Similar effect could also be achieved by application-level code for checking if the instance should process the event.

Let's see what we can do to speed up the processing. We start by defining our event source as [asynchronous iterator](https://docs.python.org/3/library/typing.html#typing.AsyncIterator) (see the documentation for [`AsyncGenerator`](https://docs.python.org/3/library/typing.html#typing.AsyncGenerator) for examples):

```python
import asyncio
from dataclasses import dataclass
import time
import typing

@dataclass(frozen=True)
class SourceEvent:
    index: int

async def event_source(delay=1, finish_after=10) -> typing.AsyncIterator[SourceEvent]:
    """Asynchronous generator of events."""
    counter = 0
    while counter < finish_after:
        await asyncio.sleep(delay)
        counter += 1
        event = SourceEvent(index=counter)
        yield event
```

The event source yields a message of type `SourceEvent` once a second. The source exits after the given number of messages, ten by default. We're using [`asyncio.sleep`](https://docs.python.org/3/library/asyncio-task.html#asyncio.sleep) (see code [here](https://github.com/python/cpython/blob/master/Lib/asyncio/tasks.py#L597)) to avoid blocking the event loop while "waiting" for the next message. This means we can consume the source in the main thread without blocking other asynchronous tasks in the thread.

Our toy example of "cpu-intensive" processing is the function `process_event`:

```python
def process_event(event: SourceEvent):
    """Example of CPU-bound operation blocking the event loop."""
    time.sleep(5)
    result = event.index * event.index
    return result
```

This function sleeps for five seconds with [`time.sleep`](https://docs.python.org/3/library/time.html#time.sleep) after which it returns the square of `event.index`. The `time.sleep` mimics heavy CPU-intensive calculation, suspending the calling thread. It would be a bad idea to call this function from the main thread as all other processing would be stopped.

The entrypoint to our program is the [coroutine](https://docs.python.org/3/library/asyncio-task.html#coroutines) `main`:

```python
WORKER_PROCESSES = 5

async def main():
    loop = asyncio.get_running_loop()
    source = event_source()
    ...

if __name__ == "__main__":
    asyncio.run(main())
```

In the `main()` coroutine, we first get the running event loop so that we can execute tasks such as consuming the event stream in the loop. We also build the asynchronous stream with default arguments.

We'll use a [`ProcessPoolExecutor`](https://docs.python.org/3/library/concurrent.futures.html#concurrent.futures.ProcessPoolExecutor) with five worker processes (`WORKER_PROCESSES = 5`) to process the events. Each worker process reads events from a [`multiprocessing`](https://docs.python.org/3/library/multiprocessing.html) queue created with a [multiprocessing.Manager](https://docs.python.org/3/library/multiprocessing.html#multiprocessing-managers). Here's how it works:

```python
import concurrent.futures
import multiprocessing as mp

async def main():
    loop = asyncio.get_running_loop()
    source = event_source()

    with concurrent.futures.ProcessPoolExecutor(
        max_workers=WORKER_PROCESSES
    ) as pool, mp.Manager() as manager:
        q = manager.Queue()
        ...
```

The manager takes care of keeping the queue in sync between processes.

The next step is to read events from the source and push messages to the queue as they're received. For that, we'll define a helper coroutine `source_to_queue`:

```python
async def source_to_queue(source, queue):
    async for event in source:
        queue.put(event)
        print(f"{threading.current_thread().name}: Submitted to queue", event)
```

When started, the coroutine iterates over the asynchronous stream `source` and puts events to the queue when new events are received. Because reading the event source and pushing the events to queue is a non-blocking operation, we can use [`loop.create_task`](https://docs.python.org/3/library/asyncio-eventloop.html#asyncio.loop.create_task) to kick off `source_to_queue` in the main thread's event loop: 

```python
async def main():
    ...

    with concurrent.futures.ProcessPoolExecutor(
        max_workers=WORKER_PROCESSES
    ) as pool, mp.Manager() as manager:
        q = manager.Queue()  # type: ignore
        queue_push_task = loop.create_task(source_to_queue(source, queue=q))
        ...
```

The `queue_push_task` is an awaitable [`Task`](https://docs.python.org/3/library/asyncio-task.html#asyncio.Task) that runs in the main event loop. Now that messages are going to the queue as they're received, we still need to start the worker processes for consuming events from the queue:

```python
def worker(queue, process_event_):
    while True:
        event = queue.get()
        if event is None:
            print(f"PID {mp.current_process().pid}: Got None, exiting queue")
            return
        print(f"PID {mp.current_process().pid}: Starting processing", event)
        process_event_(event)
        print(f"PID {mp.current_process().pid}: Finished processing", event)

async def main():
    ...

    with ...:
        ...
        queue_push_task = loop.create_task(source_to_queue(source, queue=q))
        worker_fs = [
            loop.run_in_executor(pool, worker, q, process_event)
            for _ in range(WORKER_PROCESSES)
        ]
        await queue_push_task
```

Every process runs the `worker` function that takes events from the queue and processes them with the given function. Value `None` is used as the sentinel value to tell the processes to stop reading from the queue.

The workers are created with [`loop.run_in_executor`](https://docs.python.org/3/library/asyncio-eventloop.html#asyncio.loop.run_in_executor) that returns an [`asyncio.future`](https://docs.python.org/3/library/asyncio-future.html#asyncio.Future) object for each worker. These futures can be awaited, unlike the [`concurrent.futures.Future`](https://docs.python.org/3/library/concurrent.futures.html#concurrent.futures.Future).

After the workers are started, we wait for the `queue_push_task` to finish, which happens after the `event_source` iterator finishes (after ten messages).

The final touch is to stop down the workers once the event source is exhausted by sending `None` to the queue as many times as there are workers:

```python
async def main():
    ...
    with ...:
        ...
        await queue_push_task
        print(
            f"{threading.current_thread().name}: Source finished, pushing None to queue..."
        )
        for _ in range(WORKER_PROCESSES):
            q.put(None)
        await asyncio.gather(*worker_fs)
```

We then use [`asyncio.gather`](https://docs.python.org/3/library/asyncio-task.html#asyncio.gather) to wait for all workers to finish.

That's it! Now let's see the output when we run the process:

```bash
$ python processes-queue.py
MainThread: Submitted to queue SourceEvent(index=1)
PID 6773: Starting processing SourceEvent(index=1)
MainThread: Submitted to queue SourceEvent(index=2)
PID 6775: Starting processing SourceEvent(index=2)
MainThread: Submitted to queue SourceEvent(index=3)
PID 6774: Starting processing SourceEvent(index=3)
MainThread: Submitted to queue SourceEvent(index=4)
PID 6776: Starting processing SourceEvent(index=4)
MainThread: Submitted to queue SourceEvent(index=5)
PID 6777: Starting processing SourceEvent(index=5)
PID 6773: Finished processing SourceEvent(index=1)
MainThread: Submitted to queue SourceEvent(index=6)
PID 6773: Starting processing SourceEvent(index=6)
PID 6775: Finished processing SourceEvent(index=2)
MainThread: Submitted to queue SourceEvent(index=7)
PID 6775: Starting processing SourceEvent(index=7)
PID 6774: Finished processing SourceEvent(index=3)
MainThread: Submitted to queue SourceEvent(index=8)
PID 6774: Starting processing SourceEvent(index=8)
PID 6776: Finished processing SourceEvent(index=4)
MainThread: Submitted to queue SourceEvent(index=9)
PID 6776: Starting processing SourceEvent(index=9)
PID 6777: Finished processing SourceEvent(index=5)
MainThread: Submitted to queue SourceEvent(index=10)
MainThread: Source finished, pushing None to queue...
PID 6777: Starting processing SourceEvent(index=10)
PID 6773: Finished processing SourceEvent(index=6)
PID 6773: Got None, exiting queue
PID 6775: Finished processing SourceEvent(index=7)
PID 6775: Got None, exiting queue
PID 6774: Finished processing SourceEvent(index=8)
PID 6774: Got None, exiting queue
PID 6776: Finished processing SourceEvent(index=9)
PID 6776: Got None, exiting queue
PID 6777: Finished processing SourceEvent(index=10)
PID 6777: Got None, exiting queue
```

See how the first event is only processed after the fifth event is received. After that, the workers do not fall behind more but stay five events "late".

That's it for the article, I'm very happy to hear questions and comments. Thank you for reading!
