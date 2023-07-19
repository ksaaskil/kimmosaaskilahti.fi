---
title: Getting started with local development on Kubernetes with Skaffold
published: true
description: First part of the tutorial on creating and running a Django application backed by Postgres on local Kubernetes
tags: python,kubernetes,tutorial
series: How to develop Kubernetes-native applications with Skaffold
cover_image: https://dev-to-uploads.s3.amazonaws.com/i/1pq5nioxw7qj9h9nrkwd.jpg
date: 2020-06-14
authors:
  - ksaaskil
categories:
  - Tutorials
  - Kubernetes
---

# Getting started with local development on Kubernetes with Skaffold

Containerization has been a revolution in software development. Technologies such as Docker allow developers package their software and all its dependencies in containers runnable in any computing environment, be it your local desktop, public cloud or your company's datacenter. This has drastically accelerated deploying software.

<!-- more -->

!!! warning

    **Update 2023**: This post is old. I recommend using [Tilt](https://tilt.dev/) instead of Skaffold. Proceed with caution.

Containers are often deployed in container orchestration platforms such as [Kubernetes](https://kubernetes.io/). However, when locally developing services, I have used tools such as [Docker Compose](https://docs.docker.com/compose/) to run multiple related containers with a single command. This is great, but it feels a bit 2010s: My service has its own Kubernetes manifest describing how the service should be deployed, so why can't I use that for local development as well?

Enter [Skaffold](https://skaffold.dev/), a command-line tool for continuous development on Kubernetes. The tool was [open-sourced](https://github.com/GoogleContainerTools/skaffold) by Google in 2018. Skaffold watches your code and, detecting changes, it handles building, pushing and deploying the application to your local Kubernetes installation. You can even use Skaffold to build your CI/CD pipeline, handling the deployment all the way from local workstation to the production cluster.

In this series of articles, we'll learn how to develop a Kubernetes-native web application. We'll use [Django](https://www.djangoproject.com/) to build our web application, connect it to [Postgres](https://www.postgresql.org/) database, and write Kubernetes manifests to continuously develop the application on a local Minikube cluster. We'll learn Kubernetes concepts such as [deployments](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/), [services](https://kubernetes.io/docs/concepts/services-networking/service/), [ConfigMaps](https://kubernetes.io/docs/concepts/configuration/configmap/), [Secrets](https://kubernetes.io/docs/concepts/configuration/secret/), [Persistent Volumes](https://kubernetes.io/docs/concepts/storage/persistent-volumes/), and [Jobs](https://kubernetes.io/docs/concepts/workloads/controllers/job/).

In this first part of this series, we'll install all the requirements. After you've completed the first part, you can clone the [accompanying repository](https://github.com/ksaaskil/django-postgres-skaffold-k8s) and run

```bash
$ skaffold dev
```

in the root of the repository to deploy the application to your local Minikube cluster. In the next part(s) of the series, we'll build the repository step-by-step.

## Prerequisites

### `kubectl`

First, we'll need `kubectl` to interact with our Kubernetes cluster. The exact details will vary depending on your platform, so follow the instructions [here](https://kubernetes.io/docs/tasks/tools/install-kubectl/) to install `kubectl` on your own machine.

On [macOS](https://kubernetes.io/docs/tasks/tools/install-kubectl/#install-kubectl-on-macos), `kubectl` can be installed as follows:

My commands:

```bash
$ cd ~/bin
$ curl -LO "https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/darwin/amd64/kubectl"
$ chmod +x kubectl
```

Here I download the `kubectl` executable in the `bin/` folder in my home directory. I have added this folder to my `$PATH` with `export PATH=$PATH:~/bin` in my `~/.bash_profile`, so I can execute the binary anywhere with the `kubectl` command. You can put the binary anywhere in your `$PATH`, say, in `/usr/local/bin/kubectl`.

After installation, check that it works:

```bash
$ kubectl version --client
```

### Minikube

> Note that Docker Desktop includes a stand-alone Kubernetes server. If you wish to use that instead of Minikube, you can: see the instructions [here](https://skaffold.dev/docs/environment/local-cluster/) how to use Docker Desktop with Skaffold.

The next step is to [install Minikube](https://kubernetes.io/docs/tasks/tools/install-minikube/). Again, the exact details vary on the platform. First, you may need to [install a Hypervisor](https://kubernetes.io/docs/tasks/tools/install-minikube/#install-a-hypervisor). I had [`hyperkit`](https://github.com/moby/hyperkit) installed on my machine already by [Docker Desktop](https://www.docker.com/products/docker-desktop), which I confirmed by running

```bash
$ hyperkit -h
```

Alternatively, you can install [VirtualBox](https://www.virtualbox.org/wiki/Downloads).

After ensuring a Hypervisor is installed, you can install `minikube` as stand-alone executable as follows:

```bash
$ cd ~/bin
$ curl -Lo minikube https://storage.googleapis.com/minikube/releases/latest/minikube-darwin-amd64 \
$ chmod +x minikube
```

After this, you can bravely try and start your local Minikube cluster with:

```bash
$ minikube start
```

Note that running this command for the first time requires downloading big disk images, so be patient. If everything goes well, the cluster starts and you can enter the following command to access the Kubernetes dashboard:

```bash
$ minikube dashboard
```

If anything goes wrong, you can try and explicitly specify the driver as instructed [here](https://kubernetes.io/docs/tasks/tools/install-minikube/#confirm-installation).

### Skaffold

Next, we'll need to [install Skaffold](https://skaffold.dev/docs/install/). For macOS, I installed the stand-alone binary with:

```bash
$ cd ~/bin
$ curl -Lo skaffold https://storage.googleapis.com/skaffold/releases/latest/skaffold-darwin-amd64
$ chmod +x skaffold
```

To verify your installation, run:

```bash
$ skaffold
```

### `django-admin`

If you want to follow along building the repository, you'll need [`django-admin`](https://docs.djangoproject.com/en/3.0/ref/django-admin/) to bootstrap the Django application. Note that this step is optional: we only need to install Django to create the project boilerplate. If you don't want to install Python 3 and Django on your own machine, feel free to copy the code from [the accompanying repository](https://github.com/ksaaskil/django-postgres-skaffold-k8s/tree/master/src/store).

Installing Django requires, first of all, a working installation of [Python 3](https://www.python.org/), so make sure you have that available.

Our Django project will live in `src/store`, so create that folde and `cd` into it:

```bash
$ mkdir -p src/store
$ cd src/store
```

Create `requirements.txt` and include `django`:

```bash
# src/store/requirements.txt
django
```

Now activate your [virtual environment](https://docs.python.org/3/tutorial/venv.html) and install Django:

```bash
$ pip install -r requirements.txt
```

Now, you should be able to find `django-admin` in your `PATH`. We'll use that to bootstrap the project in the next part.

## Conclusion

This concludes the first part! If you followed through this far, you can try and run

```bash
$ skaffold dev
```

in the accompanying repository to deploy the application to your local Kubernetes cluster. In the next part of the series, we'll build the application and get to the fun stuff: writing Kubernetes manifests. See you then!