---
title: Tips for building a clean REST API in Django
description: Lessons learned from two years of developing and maintaining a Django backend
tags:
  - Python
  - Django
canonical_url: https://kimmosaaskilahti.fi/blog/2022-08-05-tips-for-building-clean-rest-api-in-django/
date: 2022-08-05
categories:
  - Software development
authors:
  - ksaaskil
---

# Tips for building a clean REST API in Django

Two and a half years ago we started developing a software application for creating training data for ML applications. The heart application of this annotation tool is a REST API built with [Django](https://www.djangoproject.com/). The API serves as the backend for a Vue front-end and a Python SDK.

<!-- more -->

Before starting the project, I personally did not have any experience of using Django. In this post, I'd like to share some of the lessons learned from creating and maintaining a REST API built with Django.

I highly recommend reading [_Tips for Building High-Quality Django Apps at Scale_](https://medium.com/@DoorDash/tips-for-building-high-quality-django-apps-at-scale-a5a25917b2b5) by DoorDash. Many of the tips below are inspired by the article and have proved to be invaluable for keeping the codebase maintainable.

!!! info "Additional information"

    If you're familiar with [domain-driven design](https://en.wikipedia.org/wiki/Domain-driven_design), some of the concepts below like services and repositories will sound familiar. This is no coincidence, because I'm a big fan of the book [_Architecture Patterns With Python_](https://www.oreilly.com/library/view/architecture-patterns-with/9781492052197/). However, the terms used here are not to directly related to domain-driven design. For example, the "service layer" mentioned below is a mix of the "service layer" and "domain services" discussed in the book. Similarly, the concepts of repositories are related but used a bit differently here.

## Designing the API

Putting effort into thinking about the interface between the backend and clients is a key for keeping the codebase maintainable and API operations re-usable across clients.

The recommended background reading for this section is [_RESTful API design_](https://docs.microsoft.com/en-us/azure/architecture/best-practices/api-design) by Microsoft. The tips discussed in this section are not specific to Django.

### Document your API with OpenAPI

Unless you're creating a very small API, you need to document your API. The industry standard is to use [OpenAPI specification](https://swagger.io/specification/), formerly known as Swagger.

When starting development, we searched for tools that could auto-generate the API documentation from code, similar to [FastAPI](https://fastapi.tiangolo.com/tutorial/first-steps/). We could not find anything for Django, so we decided to start maintaining `openapi.yaml` in the repository by hand.

In hind-sight, this turned out to be a good decision. We have many developers contributing to the codebase, with variable knowledge of API design or how the existing API is structured. Having a separate `openapi.yaml` allows us to have discussions about API design in pull requests before diving into technical implementation. This helps us, for example, to keep the database models decoupled from the REST API resources and keep pull requests smaller.

### Always return objects

When designing what to return from the API, always return objects that can be extended.

For example, consider an API operation `GET /users` returning the list of users and having another endpoint `GET /users/:id` for getting details about a single user by user ID. The minimal payload to return from the endpoint would be

```json
["user-id-1", "user-id-2", "user-id-3"]
```

This gets the job done but is impossible to extend without breaking the schema. For example, we might notice our API to be too chatty and want to add user names to the payload. The following structure is a step in the right direction:

```json
[
  { "id": "user-id-1", "name": "User 1" },
  { "id": "user-id-2", "name": "User 2" },
  { "id": "user-id-3", "name": "User 3" }
]
```

Now, we can extend our objects with more information freely without breaking existing clients.

But we can do better. What would happen if we had thousands of users and needed to add pagination? We could add pagination information to headers like in [GitHub](https://docs.github.com/en/rest/guides/traversing-with-pagination), but we want to retain the flexibility to add that information in the returned payload. In fact, that's what we do now in the API. This is possible if the returned payload contains separate key for every entity returned:

```json
{
  "users": [
    { "id": "user-id-1", "name": "User 1" },
    { "id": "user-id-2", "name": "User 2" },
    { "id": "user-id-3", "name": "User 3" }
  ],
  "pagination": {
    "page": 1,
    "prev": null,
    "next": "/users?page=2",
    "per_page": 3
  }
}
```

I have paid the price of using too strict payload formats before, having to update all clients when migrating to a more flexible format. Always keep extensibility in mind when designing.

Note that this does not apply to request payloads. For example, it's perfectly fine to use request payloads such as

```json
{
    "user_id": "user-id-1",
    "organization_id": "organization-id-1
}
```

The backend can easily query for more information if needed. It is also easier to keep the backend backward compatible than keeping clients forward compatible in case of breaking schema changes.

### Keep API resources decoupled from database models

This is so important that I'll explicitly mention the quote from the [best practices document](https://docs.microsoft.com/en-us/azure/architecture/best-practices/api-design) mentioned above:

> "_Avoid introducing dependencies between the web API and the underlying data sources. For example, if your data is stored in a relational database, the web API doesn't need to expose each table as a collection of resources. In fact, that's probably a poor design. Instead, think of the web API as an abstraction of the database. If necessary, introduce a mapping layer between the database and the web API. That way, client applications are isolated from changes to the underlying database scheme._"

For basic API resources such as `User`, you will have a corresponding database table `users` and Django model `User`. But keep in mind that not all API resources need to expose all four CRUD operations. Not all database models need to be exposed as API resources. Not all API resources correspond to some database table.

Separate the concerns between the API and the database. This gives you as an architect a lot of flexibility in both how you design your database and what resources you expose to the outside world.

## Defining the data and service layer

### Keep your models lean

When we first started developing the annotation tool, my only source of best practices for Django was [_Tips for Building High-Quality Django Apps at Scale_](https://medium.com/@DoorDash/tips-for-building-high-quality-django-apps-at-scale-a5a25917b2b5). The article recommended to avoid "fat models" that include business logic inside model methods. We have followed this approach and, based on my experience, it was a very good decision.

Getting the data layer right is a difficult task. There are lots of models in the data layer and the models may be coupled in complex ways. You can keep your model code much more readable by keeping the number of model methods to the minimum. Do not mix the data layer with the service layer (discussed below).

As a practical example, here is a slightly modified example from our codebase, the Django model for `AnnotationGuideline`:

```python
# models.py

class AnnotationGuideline(ModelBase):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    project = models.ForeignKey(
        Project, on_delete=models.SET_NULL, null=True, blank=False
    )
    version = models.PositiveIntegerField(null=False, blank=False)
    ui = models.ForeignKey(
        AnnotationUI, on_delete=models.SET_NULL, null=True, blank=False
    )
    text = models.CharField(max_length=1024, null=False, blank=True)

    @transaction.atomic
    def save(self, *args, **kwargs):
        # Custom save logic such as validation
        ...

    class Meta:
        db_table = "annotation_guidelines"
        indexes = [...]
```

Every model inherits from a custom abstract `ModelBase` model that adds fields such as `created_at` and `updated_at`. Models also include `id` field used as primary key. Using UUIDs for primary keys has worked very well for us.

The model includes two foreign keys, representing the project and annotation UI that the annotation guideline belongs to. We also keep an incremental `version` field to keep track of versions. This model also implements its own `save()` method to customize the saving logic. In this case, the `save()` function ensures that version number is always incremented by one (code not shown).

### Add a separate layer for business logic

If the business logic does not belong to models, where should it go? I recommend creating a separate module for "services". Under services, add all functions that you use to create, update or delete models in your data layer.

!!! info "Additional information"

    The pattern mentioned in the [_Tips for Building High-Quality Django Apps at Scale_](https://medium.com/@DoorDash/tips-for-building-high-quality-django-apps-at-scale-a5a25917b2b5) article under the section "_Avoid using the ORM as the main interface to your data_" is closely related.

Here's an example function used for creating new organizations:

```python
# services.py

def create_organization(creating_user_email: str, name: str):

    if not can_create_organization(user_email=creating_user_email):
        logger.warn(f"User {creating_user_email} prevented from creating organization")
        raise Forbidden()

    user = get_user(email=creating_user_email)
    new_organization = Organization.objects.create(name=name, created_by=user)

    add_member_to_organization(added_by=None, user=user, organization=new_organization)

    add_role_binding(
        user=user,
        created_by=user,
        target_obj=new_organization,
        organization=new_organization,
        role=roles.Admin,
    )
    return new_organization
```

The function takes two input arguments: the e-mail of the creating user and organization name. The function then takes care of the full business logic, including: (1) checking that the user can create organizations, (2) creating the organization, (3) adding the user as a member to the organization, and (4) making the user an administrator in the organization.

We can use this function whenever we want to create new organizations. Functions like this are usually called from Django HTTP views, but they might also be called from unit tests (to set up tests, for example) or from non-HTTP "views" like Kafka consumers.

Notice how the services pattern separates the concerns. If the business logic changes, we usually do not need to modify the data layer. The drawback is that it might sometimes be difficult to track where models are being managed, because these functions are outside of the models.

This pattern also helps us mentally avoid the coupling between the data layer and the user-facing entities exposed by the REST API. If we added all business logic in model methods, that would encourage a mental pattern where modifications in API entities would be mapped 1-to-1 to modifications in the data layer.

!!! info "Additional information"

    The service layer introduced in the book [_Architecture Patterns With Python_](https://www.oreilly.com/library/view/architecture-patterns-with/9781492052197/) is defined as the layer that _drives_ the application by running a bunch of simple steps like getting data, updating the domain model and persisting the changes. The actual business logic is contained in _domain services_. In our case, we do not have separate domain models containing business logic, so the service layer is responsible for both the "mundane tasks" and business logic.

## Writing views

In [Django views](https://docs.djangoproject.com/en/4.1/topics/http/views/), we respond to HTTP requests with HTTP responses. The request has a method like `POST` and targets a specific route such as `/organizations`. The request contains additional parameters either in a payload (typically encoded as JSON) or as query parameters. As response, the API sends a payload typically corresponding to some entity.

Let's say that the user wants to query all organizations that they belong to. This could be implemented by operation `GET /me/organizations`. The response could be a list of organizations such as

```json
{
  "organizations": [
    {
      "id": "f360a209-c9ac-43d3-9b9c-ad1a3cb5bd0b",
      "name": "Mega Corp."
    },
    {
      "id": "e4aa065d-9b6a-450c-ac6d-936e04f25448",
      "name": "Acme Corp."
    }
  ]
}
```

In this example, our view would first query the organizations to which the user belongs. These would be represented by Django models of type `Organization`. Then we need to _serialize_ the model to convert each of them to objects such as above that include fields `id` and `name`. I call these objects "transport" models, because they represent the models transported between the systems such as backend and frontend.

Note that the data model and the client-facing transport model may be closely related, but still very different. The data model could have fields such as `created_by` and `created_at` that are either never exposed to clients or are only returned in specific queries. The transport models returned from the API might have fields not present in the model directly, such as the number of members in the organization. How do we do the conversion from the list of Django models to such "transport" objects? My recommendation is to create modules for repositories and transports.

### Create a separate layer for transport objects

I recommend defining the transport models in their own module. Every model returned from the API then has a corresponding definition in this transport layer.

For the example above, we would add the following transport:

```python
# transports.py

@dataclass(frozen=True)
class CompactOrganization:
    id: str
    name: str
```

This model would correspond to the "compact" organization returned as part of list queries such as above.

!!! info "Additional information"

    To implement a query asking for more detailed organization information about an organization (most likely implemented in operation such as `GET /organizations/:organizationId`), we would add a separate model `Organization` that might include fields such as `created_by` and `created_at`:

    ```python
    # transports.py

    @dataclass(frozen=True)
    class Organization:
        id: str
        name: str
        created_by: CompactUser
        created_at: datetime
    ```

Dataclasses are great, because they work nicely together with Python typing and are very simple to serialize to JSON. To serialize, we would create a function `serialize_dataclass` like this:

```python
from dataclasses import asdict, is-dataclass

def serialize_dataclass(val: typing.Any):
    if not is_dataclass(val) or isinstance(val, type):
        raise ValidationError(f"Not a dataclass, got type: {type(val)}")
    return asdict(val)
```

Before we can write a view returning the list of organizations, we need to learn about _repositories_.

!!! tip

    [FastAPI](https://fastapi.tiangolo.com/) makes it very natural to create transport models using [`pydantic`](https://docs.pydantic.dev/). See the [tutorial](https://fastapi.tiangolo.com/tutorial/body/#create-your-data-model).

### Repositories

In domain-driven design, repositories are an abstraction over data storage, allowing one to decouple the domain model layer from the storage layer. This way, we can keep our models independent of implementation details (like the database), similarly to the [hexagonal architecture](https://netflixtechblog.com/ready-for-changes-with-hexagonal-architecture-b315ec967749). It also makes the system more testable by hiding away the complexity of interacting with a database.

In our case, we want to abstract away the complexities of the underlying data layer from our views. For example, a view responsible for fetching the list of organizations should not need to know whether we're reading them from Django or from some other source like a NoSQL database. The view should only interact with transport objects. We therefore introduce repositories as an abstraction layer for getting data.

As an example, here's a repository for `Organization` objects and a static method for fetching the list of organizations by user:

```python
# repositories.py

class Organizations:
    @staticmethod
    def _make_membership_queryset() -> QuerySet[models.OrganizationMembership]:
        return models.OrganizationMembership.objects.select_related(
            "organization"
        )

    @staticmethod
    def _make_transport(obj: models.Organization):
        return transports.CompactOrganization(
            id=obj.id,
            name=obj.name
        )

    @staticmethod
    def get_organizations_for_user(
        user_id: uuid.UUID
    ) -> typing.Sequence[transports.CompactOrganization]:
        queryset = Organizations._make_membership_queryset().filter(user_id=user_id)
        organizations = (obj.organization for obj in queryset)
        return [Organizations._make_transport(org) for org in organizations]
```

The static method `get_organizations_for_user` takes `user_id` as input argument and returns a list of `transports.CompactOrganization` objects. The helper method `_make_membership_queryset` sets up the [Django queryset](https://docs.djangoproject.com/en/4.1/topics/db/queries/#retrieving-objects) and uses [`select_related()`](https://docs.djangoproject.com/en/4.1/ref/models/querysets/#django.db.models.query.QuerySet.select_related) to follow the foreign key `organization` in the query. Optimizations like `select_related` and [`prefetch_related`](https://docs.djangoproject.com/en/4.1/ref/models/querysets/#prefetch-related) are very important for performance, to minimize the number of database queries. Django is very good at hiding away complexity such as querying the database, so it's very important that the code for building queries and the code for accessing properties are as closely located as possible. In the case above, it's easy to see that accessing the `organization` attribute of the membership object does not incur any performance penalty from extra database queries. If the "serialization" function was located in some other module, it would be hard to keep the queries and attribute access in sync.

Finally, the helper method `_make_transport` converts the Django models to transport objects. In this simple case, this method does not need to access any nested attributes of the model object. But if you need to access a nested attribute such as `obj.created_by.email`, ensure that the corresponding columns are already fetched as part of the original query.

### Putting it together

Here's an example of a view used for listing user's organizations:

```python
class MeOrganizations(LoginRequiredMixin, View):
    def get(self, request):
        # List of `transports.Organization` objects
        organizations = repositories.Organizations.get_organizations_for_user(
            user_id=request.user.id
        )
        return JsonResponse({"organizations": [serialize_dataclass(org) for org in organizations]})
```

In this example, the view function calls the function `repositories.Organizations.get_organizations_for_user` that returns a list of objects of type `transports.Organization]`. We then serialize them and return the response to the user encoded as JSON.

Note how the view never needs to interact with any Django models. We have decoupled views from the data layer by introducing the transport layer and repositories. For a view responsible for creating, updating or deleting Django models, we would use the service layer to ensure separate concerns.

<!--
## Testing

!!! warning

    This section is to be done.

### Test views for maximum coverage

### Adopt test-driven development
-->

## Frequently asked questions

### Why not use Django REST framework?

[Django REST framework](https://www.django-rest-framework.org/) is a great toolkit for building Web APIs. It is hugely popular and simplifies building REST APIs in Django, offering tooling for model serialization, registering routes and even adding support for authentication. In future projects, I would consider using it.

The main reason for not using the framework was to reduce the learning curve for me and other developers. Django itself is a huge framework with a lot to learn, and adopting another framework on top of this seemed like a risk.

We also wanted to keep maximum flexibility. We wanted to be able to customize how to implement features such as user authentication, role-based access control, and how to serve big data sets. Django REST framework probably can handle all this, but it seemed easier for us to build such custom features directly on top of vanilla Django.

Finally, it seemed that Django REST framework could encourage some bad practices such as exposing database models directly as API resources. As mentioned in the beginning of the article, we wanted to avoid falling into the trap of too tightly coupling data models to API resources.
