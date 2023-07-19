---
title: Run your first Kubeflow pipeline
published: true
description: Setup local cluster, install KFP and run a pipeline
tags: tutorial,mlops,kubeflow,machinelearning
date: 2021-11-20
categories:
  - Tutorials
authors:
  - ksaaskil
---

# Run your first Kubeflow pipeline

Recently I've been learning MLOps. There's a lot to learn, as shown by [this](https://github.com/visenger/awesome-mlops) and [this](https://github.com/kelvins/awesome-mlops) repository listing MLOps references and tools, respectively.

<!-- more -->

One of most exciting tools is [Kubeflow](https://www.kubeflow.org/). The project is described as follows:

> _The Kubeflow project is dedicated to making deployments of machine learning (ML) workflows on Kubernetes simple, portable and scalable. Our goal is not to recreate other services, but to provide a straightforward way to deploy best-of-breed open-source systems for ML to diverse infrastructures. Anywhere you are running Kubernetes, you should be able to run Kubeflow._

Kubeflow has multiple components: [central dashboard](https://www.kubeflow.org/docs/components/central-dash/), [Kubeflow Notebooks](https://www.kubeflow.org/docs/components/notebooks/) to manage Jupyter notebooks, [Kubeflow Pipelines](https://www.kubeflow.org/docs/components/pipelines/) for building and deploying portable, scalable machine learning (ML) workflows based on Docker containers, [KF Serving](https://www.kubeflow.org/docs/components/kfserving/) for model serving (apparently superseded by [KServe](https://github.com/kserve/kserve)), [Katib](https://www.kubeflow.org/docs/components/katib/) for hyperparameter tuning and model search, and [training operators](https://www.kubeflow.org/docs/components/training/) such as [TFJob](https://www.kubeflow.org/docs/components/training/tftraining/) for training TF models on Kubernetes.

That's all great, but how to get started? Considering the number of components, installing Kubeflow seems like a formidable task. Indeed, the [official documentation](https://www.kubeflow.org/docs/started/installing-kubeflow/) doesn't even say how to install Kubeflow on a local Kubernetes cluster running on, say, Minikube. Therefore, the easiest way to try it out seems to be use managed services like Google Cloud.

However, [installing and trying out Kubeflow Pipelines](https://www.kubeflow.org/docs/components/pipelines/installation/overview/) (KFP) is a lot simpler. In this post, we'll create a local cluster with [`kind`](https://kind.sigs.k8s.io/), install KFP as described [here](https://www.kubeflow.org/docs/components/pipelines/installation/localcluster-deployment/) and run our first pipeline.

The code for this example can be found in [this repository](https://github.com/ksaaskil/kubeflow-learn).

## Setting up local cluster

First, you need to ensure you have [`kubectl`](https://kubernetes.io/docs/reference/kubectl/overview/) installed. Follow the [documentation](https://kubernetes.io/docs/tasks/tools/). You also need to have [Docker](https://www.docker.com/products/docker-desktop).

Next, [install `kind`](https://kind.sigs.k8s.io/docs/user/quick-start/#installation). On macOS, the executable can be installed with:

```bash
# Download
curl -Lo ./kind https://kind.sigs.k8s.io/dl/v0.11.1/kind-darwin-amd64
# Add permission to execute
chmod +x ./kind
# Move to a folder in your PATH
mv ./kind ~/bin/kind
```

[Create a Kubernetes cluster](https://kind.sigs.k8s.io/docs/user/quick-start/#creating-a-cluster):

```bash
kind create cluster --name kind
```

Once installed, set the `kubectl` context to point to your local cluster.

```bash
kubectl config use-context kind-kind
```

Ensure that `kubectl` is correctly setup:

```
$ kubectl get pods
No resources found in default namespace.
```

## Setup Kubernetes dashboard

> This step is optional but useful if you want to browse the Kubernetes resources through UI.

Follow the instructions in [Istio documentation](https://istio.io/latest/docs/setup/platform-setup/kind/) to setup Kubernetes dashboard:

```bash
$ kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v2.1.0/aio/deploy/recommended.yaml
$ kubectl create clusterrolebinding default-admin --clusterrole cluster-admin --serviceaccount=default:default
$ token=$(kubectl get secrets -o jsonpath="{.items[?(@.metadata.annotations['kubernetes\.io/service-account\.name']=='default')].data.token}"|base64 --decode)
$ kubectl proxy
```

Login to dashboard with the token: [http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/](http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/).

## Setup Kubeflow pipelines

Follow the instructions [here](https://www.kubeflow.org/docs/components/pipelines/installation/localcluster-deployment/) for deploying Kubeflow on `kind` cluster:

```bash
export PIPELINE_VERSION=1.7.1
kubectl apply -k "github.com/kubeflow/pipelines/manifests/kustomize/cluster-scoped-resources?ref=$PIPELINE_VERSION"
kubectl wait --for condition=established --timeout=60s crd/applications.app.k8s.io
kubectl apply -k "github.com/kubeflow/pipelines/manifests/kustomize/env/platform-agnostic-pns?ref=$PIPELINE_VERSION"
```

Once the resources have been created, start Kubeflow Pipelines dashboard:

```bash
$ kubectl port-forward -n kubeflow svc/ml-pipeline-ui 8080:80
```

and navigate to [`http://localhost:8080`](http://localhost:8080).

In the Kubernetes dashboard, you can find Kubeflow resources under the `Kubeflow` namespace.

## Define pipeline

> See the [tutorial](https://www.kubeflow.org/docs/components/pipelines/sdk/v2/build-pipeline/).

Install the [Kubeflow Pipelines Python SDK](https://www.kubeflow.org/docs/components/pipelines/sdk/sdk-overview/) by defining `requirements.txt`:

```
# requirements.txt
kfp
```

and install:

```bash
pip install -r requirements.txt
```

Define `pipeline.py` and add the first component:

```python
# pipeline.py
import kfp
from kfp.v2 import dsl
from kfp.v2.dsl import component
from kfp.v2.dsl import (
    Input,
    Output,
    Artifact,
    Dataset,
)

web_downloader_op = kfp.components.load_component_from_url(
'https://raw.githubusercontent.com/kubeflow/pipelines/master/components/web/Download/component-sdk-v2.yaml')
```

Kubeflow pipeline components are defined with YAML files. This `web_downloader_op` component definition can be found [here](https://raw.githubusercontent.com/kubeflow/pipelines/master/components/web/Download/component-sdk-v2.yaml). The component downloads data from the specified URL to the given location.

Next, we add a Python function-based component that handles the archive downloaded by the first component:

```python
# pipeline.py

@component(
    packages_to_install=["pandas==1.1.4"], 
    output_component_file="component.yaml"
)
def merge_csv(tar_data: Input[Artifact], output_csv: Output[Dataset]):
    import glob
    import pandas as pd
    import tarfile

    tarfile.open(name=tar_data.path, mode="r|gz").extractall("data")
    df = pd.concat(
        [pd.read_csv(csv_file, header=None) for csv_file in glob.glob("data/*.csv")]
    )
    df.to_csv(output_csv.path, index=False, header=False)
```

The function opens an archive and merges all CSV files into a single Pandas dataframe.

Note how the input `tar_data` has been defined as an _artifact_:

> _Artifacts represent large or complex data structures like datasets or models, and are passed into components as a reference to a file path._
>
> _If you have large amounts of string data to pass to your component, such as a JSON file, annotate that input or output as a type of Artifact, such as Dataset, to let Kubeflow Pipelines know to pass this to your component as a file._

Another option is to define component inputs as _parameters_:

> _Parameters typically represent settings that affect the behavior of your pipeline. Parameters are passed into your component by value, and can be of any of the following types: int, double, float, or str. Since parameters are passed by value, the quantity of data passed in a parameter must be appropriate to pass as a command-line argument._

Components return their outputs as files, annotated here with `Output[Dataset]`.

Note that Python function-based components require stand-alone Python functions. Therefore, we need to import `glob`, `pandas` and `tarfile` inside the function. We also need to explicitly specify which packages to install.

Finally, we define our pipeline using the two components:

```python
# pipeline.py

@dsl.pipeline(name="my-pipeline")
def my_pipeline(url: str):
    web_downloader_task = web_downloader_op(url=url)
    merge_csv_task = merge_csv(tar_data=web_downloader_task.outputs["data"])
```

## Compile

To compile the Python function-based component into `component.yaml` and the pipeline into `pipeline.yaml`, add the following and run the script:

```python
# pipeline.py

def compile():
    kfp.compiler.Compiler(mode=kfp.dsl.PipelineExecutionMode.V2_COMPATIBLE).compile(
        pipeline_func=my_pipeline, package_path="pipeline.yaml"
    )

def run():
  pass

def main():
  compile()
  run()

if __name __ == '__main__':
  main()
```

The script outputs `component.yaml` and `pipeline.yaml` containing the component definition and the pipeline definition, respectively.

## Run the pipeline

Modify the `run` function defined as follows to run the pipeline locally:

```python
# pipeline.py

def run():
    client = kfp.Client(host="http://127.0.0.1:8080/pipeline")

    client.create_run_from_pipeline_func(
        my_pipeline,
        mode=kfp.dsl.PipelineExecutionMode.V2_COMPATIBLE,
        arguments={
            "url": "https://storage.googleapis.com/ml-pipeline-playground/iris-csv-files.tar.gz"
        },
    )
```

Run the script and navigate to the KFP dashboard to see your run being executed.

## References

- [MLOps Community](https://mlops.community/)
- [Awesome MLOps](https://github.com/visenger/awesome-mlops): An awesome list of references for MLOps
- [Awesome MLOps](https://github.com/kelvins/awesome-mlops): Curated list of awesome MLOps tools