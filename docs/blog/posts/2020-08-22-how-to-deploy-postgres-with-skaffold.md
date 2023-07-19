---
title: How to deploy Postgres on Kubernetes with Skaffold
published: true
description: Learn Kubernetes concepts such as ConfigMaps, Secrets, PersistentVolumes, PersistentVolumeClaims, StatefulSets, and Services
tags: devops,kubernetes,tutorial,skaffold
cover_image: https://dev-to-uploads.s3.amazonaws.com/i/0tpyw63lq1mti1jee6xt.jpg
series: How to develop Kubernetes-native applications with Skaffold
date: 2020-08-22
authors:
  - ksaaskil
categories:
  - Tutorials
  - Kubernetes
---

# How to deploy Postgres on Kubernetes with Skaffold

Hello again! In this part of the series, we'll finally get our hands dirty using [Skaffold](https://skaffold.dev/) to build, push and deploy applications on [Kubernetes](https://kubernetes.io/). We'll deploy a [Postgres](https://www.postgresql.org/) database on our local Minikube cluster. Along the way, we'll learn Kubernetes concepts such as [ConfigMaps](https://kubernetes.io/docs/concepts/configuration/configmap/), [Secrets](https://kubernetes.io/docs/concepts/configuration/secret/), [Persistent Volumes and Persistent Volume Claims](https://kubernetes.io/docs/concepts/storage/persistent-volumes/), [StatefulSets](https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/), and [Services](https://kubernetes.io/docs/concepts/services-networking/service/).

<!-- more -->

!!! warning

    **Update 2023**: This post is old. I recommend using [Tilt](https://tilt.dev/) instead of Skaffold. Proceed with caution.

At this point of the series, it's worth reminding why we're using Skaffold in the first place. The main reason is that we want to get rid of Docker Compose commonly used for kicking up the local development environment. At the end of the day, we want to deploy our app to Kubernetes using Kubernetes manifests instead of Docker Compose. We want to use the same Kubernetes manifests _both for local development as well as for deploying our app to production_. Here's where Skaffold enters the game. It takes care of, for example, hot reloading Docker images when developing locally: whenever your code changes, Skaffold re-builds images and re-deploys them to local Kubernetes. This is how we can build truly Kubernetes-native applications. Of course, Skaffold can do [much more](https://skaffold.dev/docs/) than hot reloading for local development.

In [Part 1](https://dev.to/ksaaskil/getting-started-with-local-development-on-kubernetes-with-skaffold-1plc), we installed all dependencies required for this tutorial. Most notably, we'll need a [Skaffold](https://skaffold.dev/docs/install/) installation and a Kubernetes cluster. I assume you're using [Minikube](https://kubernetes.io/docs/setup/learning-environment/minikube/), but you could also use other [local clusters](https://skaffold.dev/docs/environment/local-cluster/) such as [Docker Desktop](https://docs.docker.com/docker-for-mac/kubernetes/) or even a remote cluster.

You can find all code accompanying this series in [this GitHub repository](https://github.com/ksaaskil/django-postgres-skaffold-k8s).

## Configuring Skaffold

First we'll need to configure Skaffold by creating a [`skaffold.yaml`](https://skaffold.dev/docs/references/yaml/) file in our repository. I suggest you take a quick glance at the link to get an overview of Skaffold's configuration.

Like any resource definition in Kubernetes, `skaffold.yaml` has `apiVersion`, `kind`, and `metadata` fields. We therefore add the following to `skaffold.yaml`:

```yaml
# skaffold.yaml
apiVersion: skaffold/v2beta4
kind: Config
metadata:
  name: learning-local-kubernetes-development-with-skaffold
```

The meat of Skaffold is in `build` and `deploy` fields. For now, we assume there are no artifacts to build and add the following below the definition above:

```yaml
build:
  artifacts: []
```

In `deploy`, we tell Skaffold where to find the Kubernetes manifests and how to process them. We'll tell Skaffold to deploy with `kubectl`, look for manifests in a folder called `k8s/` and to use the `minikube` context for deployment with the following configuration:

```yaml
# skaffold.yaml
deploy:
  kubectl:
    manifests:
      - k8s/*.yaml
  kubeContext: minikube
```

Both `manifests` and `kubeContext` are set to above values by default, but I think it's always better to be explicit with such things. Instead of deploying bare Kubernetes manifests with [`kubectl`](https://kubernetes.io/docs/reference/kubectl/overview/), you could also tell Skaffold to process your manifests with [`kustomize`](https://kustomize.io/) or use [`helm`](https://helm.sh/) charts.

Instead of writing `skaffold.yaml` yourself, you can also use [`skaffold init`](https://skaffold.dev/docs/pipeline-stages/init/) command to auto-generate `build` and `deploy` config.

## Postgres deployment

### `ConfigMap` and `Secrets`

We'll put our Kubernetes manifest for the Postgres deployment in `k8s/postgres.yaml`. We'll first include non-confidential Postgres configuration data in a ConfigMap. By storing configuration in ConfigMap, we can easily re-use the configuration in other services using our Postgres cluster.

For Postgres, we'll need to define the Postgres user name and the database to use. We add these as configuration variables `POSTGRES_USER` and `POSTGRES_DB` in `k8s/postgres.yaml`:

```yaml
# k8s/postgres.yaml
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: postgres-configuration
data:
  POSTGRES_DB: "django-db"
  POSTGRES_USER: "postgres-user"
```

We'll see later how to use this configuration.

Postgres also wants us to configure the password that can be used to access the database. Such confidential data should be stored as [Kubernetes Secrets](https://kubernetes.io/docs/concepts/configuration/secret/). Kubernetes wants us to base64-encode our secrets, so we'll have to do that first. Assuming that we choose `"super-secret"` as our password, here's how to base64-encode:

```
$ echo -n "super-secret" | base64
c3VwZXItc2VjcmV0
# Or with Python:
$ python -c "import base64; print(base64.b64encode('super-secret'));"
c3VwZXItc2VjcmV0
```

For the purposes of this tutorial, I'll simply add the base64-encoded secret in `postgres.yaml`:

```yaml
# k8s/postgres.yaml
---
apiVersion: v1
kind: Secret
metadata:
  name: postgres-credentials
type: Opaque
data:
  # This should **not** be in version control
  password: c3VwZXItc2VjcmV0
```

In any real-world use, you probably wouldn't add secrets like this to version control. You would put the secrets in their own `secrets.yaml` file and keep it out of version control or read secrets at deployment time from services such as [Vault](https://www.vaultproject.io/).

At this point, we can see if our Skaffold deployment works by running `skaffold dev`. Skaffold should discover `postgres.yaml` and deploy our ConfigMap and Secret. If you then open Minikube dashboard with

```bash
$ minikube dashboard
```

you should find the ConfigMap and Secret in the created resources. If you modify your deployment manifests, Skaffold should automatically take care of updating the deployment so from now on, you can keep `skaffold dev` running in the background.

### Persistent volumes and volume claims

Next we'll setup volumes for our Postgres installation. This part is not required if you only use Postgres for local development with small data volumes. If you're deploying Postgres for production in Kubernetes, you need to think carefully where and how to persist data.

Persistent volume (PV) [documentation](https://kubernetes.io/docs/concepts/storage/persistent-volumes/) describe it as "a piece of storage in the cluster that has been provisioned by an administrator or dynamically provisioned using [Storage Classes](https://kubernetes.io/docs/concepts/storage/storage-classes/)." Storage classes can be used to provision storage on-demand from, say, [Amazon Elastic Block Store](https://aws.amazon.com/ebs/) or [Google Cloud Persistent Disk](https://cloud.google.com/persistent-disk). In this tutorial, we'll provision local storage upfront without storage classes.

In this tutorial, we'll provision storage from the host with _hostPath_ persistent volume. As the [docs explain](https://kubernetes.io/docs/tasks/configure-pod-container/configure-persistent-volume-storage/), "In a production cluster, you would instead provision a network resource like a Google Compute Engine persistent disk, an NFS share, or an Amazon Elastic Block Store volume."

Here's how to use _hostPath_ to provision storage from the single-node cluster's host:

```yaml
# k8s/postgres.yaml
---
apiVersion: v1
kind: PersistentVolume
metadata:
  name: postgres-pv
  labels:
    type: local
spec:
  storageClassName: manual
  capacity:
    storage: 1Gi
  accessModes:
    - ReadWriteOnce
  hostPath:
    path: /mnt1/postgres-data
```

We specify that a persistent volume called `postgres-pv` of 1 GB capacity should be provisioned at `/mnt1/postgres-data` on the cluster's node. Access mode is defined as `ReadWriteOnce`, meaning that the volume can be mounted by a single node for reading and writing.

Once we get Postgres running, we can ssh into your Minikube node with `minikube ssh` and execute `ls /mnt1/postgres-data` to browse the data stored by Postgres.

Now that we have provisioned storage, we need to create a _persistent volume claim_ to request access to it. Volume claims are similar to how pods request resources from nodes. Instead of requesting CPU or memory, volume claims request specific storage size ("5 GB") and specific access mode. Let's create a volume claim to request 500 MB from `postgres-pv` volume:

```yaml
# k8s/postgres.yaml
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: postgres-pvc
  labels:
    type: local
spec:
  storageClassName: manual
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 500Mi
  volumeName: postgres-pv
```

Now we can use this claim named `postgres-pvc` to mount the claimed storage to our Postgres pod.

### Stateful set

We're ready to declare how to deploy Postgres itself. Just for fun, we'll deploy Postgres using [StatefulSet](https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/). StatefulSet manages not only the deployment and scaling of pods but also "provides guarantees about the ordering and uniqueness of these pods". In particular, StatefulSet provides unique network identifiers, persistent storage, graceful deployment and scaling, and automated rolling updates. For example, if you were deploying [Apache Cassandra](https://cassandra.apache.org/), an open-source distributed database, on Kubernetes, StatefulSet would guarantee your pods would have stable identifiers such as `cassandra-1`, `cassandra-2`, etc. you could use to communicate between pods even after rescheduling. See [here](https://kubernetes.io/docs/tutorials/stateful-application/cassandra/) for an example how to deploy Cassandra on Kubernetes.

In our case of Postgres, we are dealing with a centralized, non-distributed database, so we'll only have one pod in our StatefulSet. However, StatefulSet is still a very useful and powerful concept for any stateful application.

We'll declare StatefulSet as follows:

```yaml
# k8s/postgres.yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: postgres-statefulset
spec:
  serviceName: "postgres"
  replicas: 1
  selector:
    matchLabels:
      app: postgres # has to match .spec.template.metadata.labels
  template: ...
```

As expected, we use `kind: StatefulSet`. In `spec`, we declare `serviceName` to be `postgres`. You can read [here](https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/#stable-network-id) how `serviceName` controls the DNS for pods in the StatefulSet. Do not confuse this with how you would use [Service](https://kubernetes.io/docs/concepts/services-networking/service/) to expose Postgres to other applications in the cluster or to the outside world. In the next section, we'll see how to use Service to expose the StatefulSet as a network service.

After `serviceName`, we set `replicas` equal to one as we're dealing with a non-replicated, centralized database. The `.spec.selector` field defines which pods belong to the StatefulSet.

The spec for pods in the StatefulSet is defined in `.spec.template` as follows:

```yaml
# k8s/postgres.yaml
...
spec:
  ...
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
        - name: postgres
          image: postgres:12
          envFrom:
            - configMapRef:
                name: postgres-configuration
          env:
            - name: POSTGRES_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: postgres-credentials
                  key: password
          ports:
            - containerPort: 5432
              name: postgresdb
          volumeMounts:
            - name: postgres-volume-mount
              mountPath: /var/lib/postgresql/data
          readinessProbe:
            exec:
              command:
                - bash
                - "-c"
                - "psql -U$POSTGRES_USER -d$POSTGRES_DB -c 'SELECT 1'"
            initialDelaySeconds: 15
            timeoutSeconds: 2
          livenessProbe:
            exec:
              command:
                - bash
                - "-c"
                - "psql -U$POSTGRES_USER -d$POSTGRES_DB -c 'SELECT 1'"
            initialDelaySeconds: 15
            timeoutSeconds: 2
      volumes:
        - name: postgres-volume-mount
          persistentVolumeClaim:
            claimName: postgres-pvc
```

We first set pod labels to `postgres` to match the selector in the StatefulSet. In `.spec.template.spec`, we define our pods to have a single container running `postgres:12` image from [DockerHub](https://hub.docker.com/_/postgres/). The pod uses environment variables from the `postgres-configuration` ConfigMap and `postgres-credentials` Secret, both of which we defined above. We then set the pod to expose port 5432. In `volumeMounts`, we mount a volume named `postgres-volume-mount` to `/var/lib/postgresql/data`, the folder used by Postgres for storing data. This volume is defined in `.spec.template.spec.volumes`, where we use the `postgres-pvc` volume claim defined above.

Finally, we also set `readinessProbe` as well as `livenessProbe` to let Kubernetes monitor the pod's health. You can read more about probes [here](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/).

### Service

Having declared our StatefulSet, we'll finally need to define a [Service](https://kubernetes.io/docs/concepts/services-networking/service/) to expose the StatefulSet as a network application to other applications. Compared to above, this is simple enough:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: postgres-service
spec:
  ports:
    - port: 5432
      name: postgres
  type: NodePort
  selector:
    app: postgres
```

In our service, we expose port 5432 from the pod as `NodePort`. You can read more about different options [here](https://kubernetes.io/docs/concepts/services-networking/service/#publishing-services-service-types). Choosing `NodePort` will let us contact the service from outside the cluster. In production, you of course very carefully want to consider if you want your database to be exposed outside of the cluster.

### Did it work?

If you had `skaffold dev --port-forward` running throughout this tutorial, you should now have Postgres running in your Minikube cluster. You can verify this by, for example, running `minikube dashboard` to browse the resources in Minikube and hopefully see everything glowing green. If anything went wrong, please let me know in the comments!

## Conclusion

That concludes the tutorial on how to get Postgres running on Kubernetes. In the next and final part, we'll finally deploy the Django application we built in Part 2, backed by Postgres. See you then!

