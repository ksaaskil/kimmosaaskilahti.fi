---
title: Deploy Django on Kubernetes with Skaffold, for development and production
description: Learn Kubernetes concepts such as deployments, services, and jobs
tags:
  - Django
  - Kubernetes
  - Skaffold
series: How to develop Kubernetes-native applications with Skaffold
date: 2021-04-21
authors:
  - ksaaskil
categories:
  - Tutorials
  - Software development
---

# Deploy Django on Kubernetes with Skaffold, for development and production

In this article, we'll see how to deploy the Django application built in [Part 2](https://dev.to/ksaaskil/setting-up-django-app-with-postgres-database-and-health-check-2cpd) of this series to local Kubernetes cluster. We'll be using [Skaffold](https://skaffold.dev/) for the deployment. Skaffold offers support for multiple [profiles](https://skaffold.dev/docs/environment/profiles/), making it useful both local development with hot code reloading as well as production deployments.

<!-- more -->

!!! warning

    **Update 2023**: This post is old. I recommend using [Tilt](https://tilt.dev/) instead of Skaffold. Proceed with caution.

Our Django application has a single view at `/status` endpoint. Calling the endpoint checks the connection to the Postgres database. We created the Kubernetes deployment for the database in [Part 3](https://dev.to/ksaaskil/how-to-deploy-postgres-on-kubernetes-with-skaffold-32fl).

The accompanying code for this article can be found in [this GitHub repository](https://github.com/ksaaskil/django-postgres-skaffold-k8s).

### Dockerfiles

Let's start by containerizing our Django application. In Part 2, we created the following `Dockerfile` for the Django app:

```dockerfile
# src/store/Dockerfile
FROM python:3

ENV PYTHONUNBUFFERED 1

RUN mkdir /store
WORKDIR /store

COPY requirements.txt /store
RUN pip install -r requirements.txt

COPY . /store

RUN python manage.py collectstatic --noinput
CMD ["gunicorn", "store.wsgi"]
```

We use [Gunicorn](https://gunicorn.org/) server for serving the Django application as instructed in [Django documentation](https://docs.djangoproject.com/en/3.1/howto/deployment/wsgi/gunicorn/).

Now we want to tell Skaffold to build this Docker image. Let's modify the `skaffold.yaml` we created in Part 3 as follows:

```yaml
# skaffold.yaml
apiVersion: skaffold/v2beta4
kind: Config
metadata:
  name: learning-local-kubernetes-development-with-skaffold
build:
  artifacts:
    - image: django-store
      context: src/store
deploy:
  kubectl:
    manifests:
      - k8s/*.yaml
  kubeContext: minikube # Default
```

The important part here is the list of `artifacts` under `build`. We name the Docker image for our Django application as `django-store` and use `src/store` as its build context. Run `skaffold build` and Skaffold should build the Docker image.

Before deployments, you should set [`kubeContext`](https://skaffold.dev/docs/environment/kube-context/) in `skaffold.yaml` to point to the Kubernetes cluster you want to use. If you're using Docker Desktop, you'd use `kubeContext: docker-for-desktop`. When deploying to production, you should override the `kubeContext` with a suitable Skaffold profile.

Before moving to Kubernetes deployments, we need to add a reverse proxy before our Gunicorn server. We use an [nginx](https://nginx.org/en/) proxy server with custom `nginx.conf`. In production usage, you'd probably use something like [NGINX Ingress Controller](https://kubernetes.github.io/ingress-nginx/) instead.

Here's the Dockerfile for our reverse proxy:

```dockerfile
# src/store/Dockerfile.nginx
FROM nginx:1.16.1
COPY nginx.conf /etc/nginx/nginx.conf
```

You can find an example `nginx.conf` in the [repository](https://github.com/ksaaskil/django-postgres-skaffold-k8s/blob/master/src/store/nginx.conf). See also [Part 2](https://dev.to/ksaaskil/setting-up-django-app-with-postgres-database-and-health-check-2cpd) of this series if you need a reminder.

Let's add this Dockerfile also to the list of artifacts to build:

```yaml
# skaffold.yaml
---
build:
  artifacts:
    - image: django-store
      context: src/store
    - image: django-store-nginx
      context: src/store
      docker:
        dockerfile: Dockerfile.nginx
```

We use the same build context as before but a different `Dockerfile`. Again you can run `skaffold build` and you should see Skaffold now building two images (unless found locally already).

### Deployment

We'll be adding our deployment configuration to `k8s/store.yaml`. Remember how we configured `skaffold.yaml` to search for manifests in the `k8s/` folder:

```yaml
# skaffold.yaml
---
deploy:
  kubectl:
    manifests:
      - k8s/*.yaml
```

Let's first create a [Kubernetes deployment](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/) for our Django application. Deployments are a declarative way to manage [pods](https://kubernetes.io/docs/concepts/workloads/pods/) and [replica sets](https://kubernetes.io/docs/concepts/workloads/controllers/replicaset/). We want to specify that Kubernetes should always have one pod running for our application. If the pod crashes, Kubernetes automatically restarts the pod for us.

Here's the full configuration for the deployment:

```yaml
# k8s/store.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: store-deployment
spec:
  replicas: 1
  selector:
    matchLabels:
      app: store
  template:
    metadata:
      labels:
        app: store
    spec:
      containers:
        - name: store
          image: django-store
          ports:
            - containerPort: 8000
          env:
            - name: POSTGRES_HOST
              value: "postgres-service"
            - name: POSTGRES_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: postgres-credentials
                  key: password
          envFrom:
            - configMapRef:
                name: postgres-configuration
        - name: store-nginx
          image: django-store-nginx
          ports:
            - containerPort: 8080
```

We name our deployment `store-deployment` by specifying `.metadata.name` field. The `.spec.replicas` field says we want the deployment to have one running replica. The `.spec.selector` tells the deployment how to find which pods to manage as part of the deployment: we tell it to watch for pods with label `app: store`. The deployed pods are given this `app:store` label in `.spec.template.metadata.labels` field.

The `.spec.template.spec.containers` defines the two containers running in the pod. The first container is running the `django-store` image, with Gunicorn as entrypoint. The second container is running nginx, routing requests to `django-store` container. The two containers are exposing ports 8000 and 8080, respectively. Remember, this second container would most likely be unnecessary in your production deployment if you were using something like NGINX Ingress Controller as the main entrypoint to your cluster.

The environment variable `POSTGRES_HOST` is set to point to `postgres-service`, the [Service](https://kubernetes.io/docs/concepts/services-networking/service/) we created in the previous part to expose the Postgres database. The variable `POSTGRES_PASSWORD` is read from the [Kubernetes secret](https://kubernetes.io/docs/concepts/configuration/secret/) `postgres-credentials` and its data named `password`. This secret was created as follows in the previous part:

```yaml
# k8s/postgres.yaml
---
apiVersion: v1
kind: Secret
metadata:
  name: postgres-credentials
type: Opaque
data:
  # This should not be in version control in real deployments
  password: c3VwZXItc2VjcmV0
---
```

The variables `POSTGRES_DB` and `POSTGRES_USER` are filled by reading from the [ConfigMap](https://kubernetes.io/docs/concepts/configuration/configmap/) named `postgres-configuration` we also created:

```yaml
# k8s/postgres.yaml
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: postgres-configuration
  labels:
    app: postgres
data:
  POSTGRES_DB: "django-db"
  POSTGRES_USER: "postgres-user"
---
```

### Service

Now we must expose our application as Kubernetes Service. This is reasonably simple:

```yaml
# k8s/store.yaml
---
apiVersion: v1
kind: Service
metadata:
  name: django-store-service
spec:
  ports:
    - port: 8080
      targetPort: 8080
  type: NodePort
  selector:
    app: store
---
```

This service named `django-store-service` exposes port 8080. It routes requests to port `8080` in the `app: store` pod. This port is served by the NGINX container in the deployment we created above.

### Django migrations

We run Django's [database migrations](https://docs.djangoproject.com/en/3.1/topics/migrations/) as [Kubernetes jobs](https://kubernetes.io/docs/concepts/workloads/controllers/job/). We'll simply include the migration job in `store.yaml` as follows:

```yaml
# k8s/store.yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: django-migrations-job
spec:
  backoffLimit: 10
  template:
    spec:
      containers:
        - name: django-migration
          image: django-store
          command: ["python", "manage.py", "migrate"]
          env:
            - name: POSTGRES_HOST
              value: "postgres-service"
            - name: POSTGRES_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: postgres-credentials
                  key: password
          envFrom:
            - configMapRef:
                name: postgres-configuration
      restartPolicy: Never
```

This job is tried ten times before failing. It's very common the first job fails because the service may not be ready. That's fine as Kubernetes will take care of retries.

### Conclusion

Now we have everything ready to deploy the application to our Kubernetes cluster! Let's make a one-off deployment with `skaffold run`:

```bash
$ skaffold run --tail --port-forward
```

The `--tail` argument allows us to watch the logs and `--port-forward` exposes all services in the cluster. Once the application becomes available, you can make a request to `localhost:8080`:

```bash
$ curl http://localhost:8080/status/
{"message": "OK"}
```

Congratulations, you've deployed Django on Kubernetes!

For development and hot reloading of code, use `skaffold dev`:

```bash
$ skaffold dev --port-forward
```

Whenever you change the code in your application, Skaffold will re-build the Docker image and re-deploy it to the cluster. No more messing with Docker Compose and volume mounts, you've built a true Kubernetes-native application! See the full list of Skaffold's commands [here](https://skaffold.dev/docs/references/cli/).

Please leave a comment if you have any questions or thoughts on this article! Thanks for reading, see you next time!
