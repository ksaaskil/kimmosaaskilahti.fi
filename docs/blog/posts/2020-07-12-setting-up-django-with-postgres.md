---
title: Setting up Django app with Postgres database and health check
description: Second part of the tutorial on developing a Django application backed by Postgres on local Kubernetes
cover_image: https://dev-to-uploads.s3.amazonaws.com/i/m1sf6hythxk4cl0z780y.jpg
series: How to develop Kubernetes-native applications with Skaffold
date: 2020-07-12
authors:
  - ksaaskil
categories:
  - Tutorials
tags:
  - Python
  - Kubernetes
  - Django
---

# Setting up Django app with Postgres database and health check

In [Part 1](https://dev.to/ksaaskil/getting-started-with-local-development-on-kubernetes-with-skaffold-1plc) of this series, we installed all tools required for developing our Django application on local Kubernetes with [Skaffold](https://skaffold.dev/). In this part, we'll create the Django application. In the next part, we'll finally get to the fun part: defining Kubernetes manifests and Skaffold configuration file.

<!-- more -->

Since this tutorial is not about Django but about Skaffold and Kubernetes, I'll move quickly in this part. If you have any questions, please add them in the comments and I'll do my best to answer! As before, you can find all code in the [accompanying GitHub repository](https://github.com/ksaaskil/django-postgres-skaffold-k8s).

## Creating Django project

We'll create a Django project named `store` in `src/store` with the `startproject` command of `django-admin`:

```bash
# In the root of repository
$ cd src
$ mkdir store
$ cd store
$ django-admin startproject store .
```

Add the following to `requirements.txt`:

```txt
# src/store/requirements.txt
django
gunicorn
psycopg2
```

Here, [`gunicorn`](https://gunicorn.org/) is used for serving the application and [`psycopg2`](https://pypi.org/project/psycopg2/) is the Postgres driver.

Now, let's create an app that we'll use for status-checking:

```bash
# Inside src/store
$ python manage.py startapp status
```

This creates the `status/` folder in `src/store`. Add the following to `store/urls.py`:

```python
# src/store/store/urls.py
from django.urls import path, include

urlpatterns = [path("status/", include("status.urls"))]
```

This will boostrap the `status` app to `status/` endpoint.

Define a view in the root of `status/` path:

```python
# src/store/status/urls.py
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
]
```

In `status/views.py`, add a view that returns 200 for successful database connection and 500 otherwise:

```python
# src/store/status/views.py
from django.db import connection
from django.http import JsonResponse

def index(request):
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
        return JsonResponse({ "message": "OK"}, status=200)
    except Exception as ex:
        return JsonResponse({ "error": str(ex) }, status=500)

```

We check if the database cursor can execute a `SELECT 1` statement and return an error for any exception.

With this, we have created a Django application with `status/` endpoint that checks the database connection. Now we still need to setup [Postgres](https://www.postgresql.org/).

### Setting up Postgres

To setup Postgres, modify `src/store/settings.py` as follows:

```python
# src/store/settings.py
import os

# Keep everything else as-is

POSTGRES_CONFIG = {
    "username": os.environ.get("POSTGRES_USER", "postgres"),
    "db_name": os.environ.get("POSTGRES_DB", "store"),
    "host": os.environ.get("POSTGRES_HOST", "127.0.0.1"),
    "password": os.environ.get("POSTGRES_PASSWORD", ""),
    "port": os.environ.get("POSTGRES_PORT", 5432),
}

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": POSTGRES_CONFIG["db_name"],
        "USER": POSTGRES_CONFIG["username"],
        "PASSWORD": POSTGRES_CONFIG["password"],
        "HOST": POSTGRES_CONFIG["host"],
        "PORT": POSTGRES_CONFIG["port"],
    }
}
```

Here we read the Postgres settings from environment variables and set sane defaults.

### Dockerfile

To deploy the application to Kubernetes, we'll need to create a `Dockerfile`:

```Dockerfile
# src/store/Dockerfile
FROM python:3
ENV PYTHONUNBUFFERED 1
RUN mkdir /store
WORKDIR /store
COPY . /store/
RUN pip install -r requirements.txt
CMD ["gunicorn", "store.wsgi"]
```

We use `gunicorn` for serving the app, starting from `store/wsgi.py` created by the `django-admin startproject` command.

### Nginx

In any production environment, we need to run Django behind a reverse proxy or ingress, so we'll create an [nginx](https://nginx.org/en/) proxy. Add the following to `Dockerfile.nginx`:

```Dockerfile
# src/store/Dockerfile.nginx
FROM nginx:1.16.1
COPY nginx.conf /etc/nginx/nginx.conf
```

Add the following setup from [gunicorn documentation](https://docs.gunicorn.org/en/latest/deploy.html#nginx-configuration) to `nginx.conf`:

```nginx
# src/store/nginx.conf
# https://docs.gunicorn.org/en/latest/deploy.html#nginx-configuration
user nobody nogroup;
# 'user nobody nobody;' for systems with 'nobody' as a group instead
error_log  /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 1024; # increase if you have lots of clients
    accept_mutex off; # set to 'on' if nginx worker_processes > 1
}
http {
    upstream store {
        server localhost:8000;
    }

    server {
        listen 8080;

        location / {
            proxy_pass http://store;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header Host $host;
            proxy_redirect off;
        }
    }
}
```

Here we simply hard-code the proxy to forward requests to `localhost:8000`, where our Django app will be running. In production usage, we would read the address from environment variables at deploy time.

## Conclusion

This concludes Part 2 of our tutorial for local development on Skaffold. In the next part, we'll get to deploying our application and database on Minikube with Skaffold. See you then!
