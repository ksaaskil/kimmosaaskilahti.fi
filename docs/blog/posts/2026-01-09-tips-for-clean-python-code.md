---
title: Tips for clean Python code
draft: true
tags:
  - Philosophy
date: 2026-01-09
categories:
  - Software development
authors:
  - ksaaskil
---

# Tips for clean Python code

Recently I have written and reviewed a lot of Python code. In this blog post, I'd like to summarize some of my learnings.

<!-- more -->

There are many different ways to write good code in Python (or any language). Below, I would like to first summarize the principles that I believe lead to better Python code. By "better" I mean code that's easy to change, read, test and maintain. I will also present a simple example application to showcase the principles in practice. Note that the principles are not specific to Python, but I will use Python as an example how to implement them.

## Principles

### Make code to read like a good story

My first core belief about good code is that it should read like a good story. The code should be (on high level) as easy to read as a story about going for grocery shopping. There's a clear intent, setup, middle part and an ending.

Why does making the code read like a good story improve the design? One of the most important if not the most important ideas in computer science is [_problem decomposition_](https://www.youtube.com/watch?v=bmSAYlu0NcY): taking a complicated problem or system and chopping it up into pieces that you can build relatively independently. By writing code to read like a good story, we force ourselves to decompose the problem into small parts. If we decompose the problem well, the code will read like a good story, so I think the two principles are essentially equivalent.

As an example, consider an application for processing audio recordings. Suppose that when a user uploads a new recording to a site such as [xeno-canto.org](https://xeno-canto.org/), we want to launch a background process for the recording to enrich it with useful additional information such as the [spectrogram](https://en.wikipedia.org/wiki/Spectrogram). The spectrogram should be stored for future reference to a file storage.

The "story" about this application in pseudo-code might go something like this:

1. Read what recording should be processed
1. Download the recording
1. Enrich the recording (including possibly with multiple steps)
1. Write the results to storage

Turning this to code, I would expect the code to read something like this:

```python
recording_id = get_recording_id(...)
recording = download_recording(...)
enrichment = enrich_recording(...)
write_enrichment_result(...)
```

The [ellipsis literal](https://en.wikipedia.org/wiki/Spectrogram) `...` stands for all the so-far-unknown function arguments that are needed to make the code in practice. At this level, it's not necessary for me to know exactly how the code works under the hood, but the story is clear to me. If I wanted to change any part of the story, I would know where to do that.

The principle sounds simple enough, but in practice I often see (and myself write) code that does not read like a good story. I asked Claude Code to write an example of code for this use case that's not a good story, with this result:

```python
def process_recording(event, context):
    # Parse the SQS message
    if 'Records' in event and len(event['Records']) > 0:
        body = json.loads(event['Records'][0]['body'])
        recording_id = body.get('recording_id')
        if not recording_id:
            print("ERROR: No recording_id in message")
            return {'statusCode': 400, 'body': 'Missing recording_id'}
    else:
        return {'statusCode': 400, 'body': 'Invalid event'}

    # Download from S3
    s3_client = boto3.client('s3', region_name='eu-west-1')
    try:
        response = s3_client.get_object(Bucket='recordings-bucket-prod', Key=f'raw/{recording_id}.wav')
        audio_bytes = response['Body'].read()
        sample_rate, audio_data = wavfile.read(BytesIO(audio_bytes))
    except Exception as e:
        print(f"ERROR downloading from S3: {str(e)}")
        # Try downloading from xeno-canto API instead
        try:
            api_response = requests.get(f'https://xeno-canto.org/api/2/recordings?query=nr:{recording_id}', timeout=30)
            if api_response.status_code == 200:
                data = api_response.json()
                if data['recordings'] and len(data['recordings']) > 0:
                    audio_url = data['recordings'][0]['file']
                    audio_response = requests.get(audio_url, timeout=60)
                    audio_bytes = audio_response.content
                    sample_rate, audio_data = wavfile.read(BytesIO(audio_bytes))
                else:
                    return {'statusCode': 404, 'body': 'Recording not found'}
        except Exception as e2:
            print(f"ERROR from API: {str(e2)}")
            return {'statusCode': 500, 'body': 'Failed to download'}

    # Generate spectrogram
    if len(audio_data.shape) > 1:
        audio_data = np.mean(audio_data, axis=1)
    frequencies, times, spectrogram = signal.spectrogram(audio_data, sample_rate, nperseg=1024, noverlap=512)
    spectrogram_db = 10 * np.log10(spectrogram + 1e-10)

    # Upload to S3
    spectrogram_bytes = BytesIO()
    np.save(spectrogram_bytes, spectrogram_db)
    spectrogram_bytes.seek(0)
    try:
        s3_client.put_object(Bucket='recordings-bucket-prod', Key=f'spectrograms/{recording_id}.npy', Body=spectrogram_bytes.getvalue(), ContentType='application/octet-stream')
    except Exception as e:
        print(f"ERROR uploading to S3: {str(e)}")
        return {'statusCode': 500, 'body': 'Failed to upload'}

    # Update DynamoDB
    dynamodb = boto3.resource('dynamodb', region_name='eu-west-1')
    table = dynamodb.Table('recordings-metadata-prod')
    try:
        table.update_item(Key={'recording_id': recording_id}, UpdateExpression='SET spectrogram_url = :url, processing_status = :status, updated_at = :timestamp', ExpressionAttributeValues={':url': f's3://recordings-bucket-prod/spectrograms/{recording_id}.npy', ':status': 'completed', ':timestamp': int(time.time())})
    except Exception as e:
        print(f"ERROR updating DynamoDB: {str(e)}")

    return {'statusCode': 200, 'body': json.dumps({'recording_id': recording_id, 'status': 'completed'})}
```

There are obviously many issues in this code, the main one being that the implementation is completely inlined without extracting any functions. This buries the main flow under technical details, making the code hard to understand, difficult to unit-test and troublesome to change. In short, we have failed to decompose the problem.

I do not claim that this principle is invented by me or that it is anyhow revolutionary, but it helps me in my day-to-day work as a software developer and architect.

### Design for testability

Another main design principle for good code is that it should be easy to test. Easy-to-test code is easy to change and vice versa.

Take the example from above and assume we have make the main flow read like a good story:

```python
# handler.py
def process_recording(event, context):
    recording_id = parse_recording_id_from_event(event)
    recording = download_recording(recording_id)
    spectrogram = generate_spectrogram(recording)
    upload_spectrogram(recording_id, spectrogram)
    update_recording_metadata(recording_id)
    return success_response(recording_id)
```

Suppose that the `upload_spectrogram` function is implemented as follows:

```python
# handler.py

def upload_spectrogram(spectrogram: np.ndarray) -> None:
    # Convert to bytes
    spectrogram_bytes = BytesIO()
    np.save(spectrogram_bytes, spectrogram)
    spectrogram_bytes.seek(0)

    # Upload to S3
    s3_client = boto3.client('s3')
    try:
        s3_client.put_object(Bucket='recordings-bucket-prod', Key=f'spectrograms/{recording_id}.npy', Body=spectrogram_bytes.getvalue(), ContentType='application/octet-stream')
    except Exception as e:
        # TODO Handle exception
```

The main problem with this implementation is that it is not easy enough to unit-test. We don't want to make calls to S3 APIs from our tests, so writing a unit test for the function requires us to monkey-patch the call `s3_client = boto3.client('s3')` using `mock.patch()` decorator to replace the client with a mock implementation:

```python
# test_handler.py

@patch('handler.boto3.client')
def test_upload_spectrogram_uploads_to_s3(mock_boto3_client):
    mock_s3_client = Mock()
    mock_boto3_client.return_value = mock_s3_client

    spectrogram = make_spectrogram()
    upload_spectrogram(spectrogram)

    mock_s3_client.put_object.assert_called_once_with(...)
```

I do not like monkey-patching at all and I prefer to avoid it if possible (with the rare exception of mocking out environment variables). Monkey-patching is evil because it provides a quick escape hatch for bad (or missing) software design. I have seen unit tests that require five patched functions to work. Working with this code was very painful, because all the dependencies to external systems were hidden from plain sight, making it very difficult to change anything.

We can easily avoid monkey-patching in our function by making the S3 dependency explicit:

```python
# handler.py

def upload_spectrogram(spectrogram: np.ndarray, s3_client: Any) -> None:
    # Convert to bytes
    spectrogram_bytes = BytesIO()
    np.save(spectrogram_bytes, spectrogram)
    spectrogram_bytes.seek(0)

    # Upload to S3
    try:
        s3_client.put_object(Bucket='recordings-bucket-prod', Key=f'spectrograms/{recording_id}.npy', Body=spectrogram_bytes.getvalue(), ContentType='application/octet-stream')
    except Exception as e:
        # TODO Handle exception
```

Now anyone reading (or calling) this function knows that it depends on S3 client, which should be mocked out in tests. Unit-testing the function becomes trivial as we can replace `s3_client` call with a `MagicMock` in our unit tests:

```python
# test_handler.py

def test_upload_spectogram():
  spectogram = make_spectrogram()
  s3_client = mock.MagicMock()
  upload_spectrogram(spectrogram, s3_client)
  s3_client.put_object.assert_called_once_with(...)
```

The disadvantage of making the dependencies explicit is that we need to pass them around the codebase, which can sometimes lead to problems of its own. However, I believe that the pros of explicit dependency passing far exceed the cons.

It should be mentioned here that interactions with AWS infrastructure can easily be mocked out in unit tests using the [Moto](https://docs.getmoto.org/en/latest/index.html) library. Using Moto, we can wrap our test function in `@mock_aws` decorator and all calls to AWS are automatically mocked out. Typical unit test written with Moto would then be something like:

```python
@pytest.fixture(scope="function")
def s3_client():
    with mock_aws():
        conn = boto3.client("s3", region_name="us-east-1")
        yield conn

@pytest.fixture(scope="function")
def s3_bucket(s3_client):
    bucket_name = "recordings-bucket-local"  # Match this to what the code expects
    s3_client.create_bucket(Bucket=bucket_name)
    yield bucket_name

def test_upload_spectogram(s3_client, s3_bucket):
  spectogram = make_spectrogram()
  upload_spectrogram(spectrogram, s3_client)
  # Verify that object is found in (mocked) S3 bucket
  obj = s3_bucket.get_object(...)
  # Verify the contents
```

Here, we have created [pytest fixtures](https://docs.pytest.org/en/6.2.x/fixture.html) to pass mocked instances of S3 client and S3 bucket name to our test, making the dependencies explicit. Using Moto also helps us avoid testing implementation details: instead of asserting that a specific `put_object` call was made, we can simply read the object from mock S3 and verify that the expected object is found.

Using Moto library does not remove the need to make dependencies explicit. Explicit dependencies make the code easier to reason about and therefore easier to change and maintain. So even when using Moto, I prefer to write code where the S3 client (or any similar storage client of our own) is passed as an explicit dependency to all the functions that depend on it.

### Raise exceptions

### Avoid nesting

### Avoid unnecessary classes
