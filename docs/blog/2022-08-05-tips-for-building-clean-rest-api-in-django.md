---
title: Tips for building a clean REST API in Django
published: true
description: Lessons learned from two years of developing and maintaining a Django backend
tags: 
canonical_url: https://kimmosaaskilahti.fi/blog/2022-08-05-tips-for-building-clean-rest-api-in-django/
---

> This article is work in progress  🚧

Some two years ago I started developing a software application for training data annotation at Silo AI. The heart application of the application is a REST API built in [Django](https://www.djangoproject.com/). The API serves as the backend for a Vue front-end and Python SDK.

Before starting this project, I did not have any experience of using Django. In this post, I'd like to share some of the lessons learned and tips for creating a clean REST API in Django.

I highly recommend reading [_Tips for Building High-Quality Django Apps at Scale_](https://medium.com/@DoorDash/tips-for-building-high-quality-django-apps-at-scale-a5a25917b2b5) by DoorDash. Many of the tips below are inspired by the article and have proved to be invaluable for keeping the codebase maintainable.

## API design

Let's start from discussing API design. Putting effort into thinking about how the backend interfaces with clients is a key for keeping the codebase maintainable and API operations re-usable across clients.

The recommended background reading for this section is [_RESTful API design_](https://docs.microsoft.com/en-us/azure/architecture/best-practices/api-design) by Microsoft. The tips discussed in this section are not specific to Django.

### Keep an OpenAPI specification

Unless you're creating a very small API, you need to document your API. The industry standard is to use [OpenAPI specification](https://swagger.io/specification/), formerly known as Swagger.

When starting development, I searched for tools that could auto-generate the API documentation from code, similar to [FastAPI](https://fastapi.tiangolo.com/tutorial/first-steps/). I could not find anything for Django, so I decided to start maintaining `openapi.yaml` in the repository by hand.

In hind-sight, this turned out to be a good decision. We have many developers contributing to the codebase, with variable knowledge of API design or how the existing API is structured. Having a separate `openapi.yaml` allows us to have discussions about API design in pull requests before diving into technical implementation. This helps us, for example, to keep the database models decoupled from the REST API resources and keep pull requests smaller.

### Always return objects

When designing what to return from the API, always return objects that can be extended.

For example, consider an API operation `GET /users` returning the list of users and having another endpoint `GET /users/:id` for getting details about a single user by user ID. The minimal payload to return from the endpoint would be

```json
[
    "user-id-1",
    "user-id-2",
    "user-id-3"
]
```

This gets the job done but is impossible to extend without breaking the schema. For example, we might notice our API to be too chatty and want to add user names to the payload. The following structure is a step in the right direction:

```json
[
    { "id": "user-id-1", "name": "User 1"},
    { "id": "user-id-2", "name": "User 2"},
    { "id": "user-id-3", "name": "User 3"}
]
```

Now, we can extend our objects with more information freely without breaking existing clients.

But we can do better. What would happen if we had thousands of users and needed to add pagination? We could add pagination information to headers like in [GitHub](https://docs.github.com/en/rest/guides/traversing-with-pagination), but we want to retain the flexibility to add that information in the returned payload. In fact, that's what we do now in the API. This is possible if the returned payload contains separate key for every entity returned:

```json
{
    "users": [
        { "id": "user-id-1", "name": "User 1"},
        { "id": "user-id-2", "name": "User 2"},
        { "id": "user-id-3", "name": "User 3"}
    ],
    "pagination": {
        "page": 1,
        "prev": null,
        "next": "/users?page=2",
        "per_page": 3,
    }
}
```

We have paid the price of using too strict payload formats and having to update all clients when migrating to a more flexible format. Always keep extensibility in mind when designing.

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

> Avoid introducing dependencies between the web API and the underlying data sources. For example, if your data is stored in a relational database, the web API doesn't need to expose each table as a collection of resources. In fact, that's probably a poor design. Instead, think of the web API as an abstraction of the database. If necessary, introduce a mapping layer between the database and the web API. That way, client applications are isolated from changes to the underlying database scheme.

For basic API resources such as `User`, you will have a corresponding database table `users` and Django model `User`. But keep in mind that not all API resources need to expose all four CRUD operations. Not all database models need to be exposed as API resources. Not all API resources correspond to some database table.

Separate the concerns between the API and the database. This gives you as an architect a lot of flexibility in both how you design your database and what resources you expose to the outside world.

## Structuring code

### Models

When I first started developing the annotation tool, my only source of best practices for Django was [_Tips for Building High-Quality Django Apps at Scale_](https://medium.com/@DoorDash/tips-for-building-high-quality-django-apps-at-scale-a5a25917b2b5). The article recommended to avoid "fat models" that include business logic inside model methods. We have followed this approach and, based on my experience, it was a very good decision.

Getting the data models right is a difficult task. There are lots of them and they may be coupled in complex ways. You can keep the models much more readable by keeping the number of model methods as small as possible. Most importantly, keep business logic out of the models.

As a practical example, here is a slightly modified example from our codebase, the Django model for `AnnotationGuideline`:

```python
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

### Services

If the business logic does not belong to models, where should it go? I recommend creating a separate module named "services" or "control".

Here's an example from our `services.py`, a function used for creating new organizations:

```python
def create_organization(creating_user_email: str, name: str):
    """Create new organization. Add the creating user to the organization.

    Args:
        name (str): Organization name

    Returns:
        Organization: Created organization
    """

    if not can_create_organization(user_email=creating_user_email):
        logger.warn(f"User {creating_user_email} prevented from creating organization")
        raise Forbidden()

    user = get_user(email=creating_user_email)
    new_organization = Organization.objects.create(name=name, created_by=user)

    add_member_to_organization(added_by=None, user=user, organization=new_organization)
    # Add admin role to user in organization
    add_role_binding(
        user=user,
        created_by=user,
        target_obj=new_organization,
        organization=new_organization,
        role=roles.Admin,
    )
    return new_organization
```

The function takes the e-mail of the creating user and organization name as input arguments. The function includes business logic such as (1) checking that the user can create organizations, (2) creating the organization, (3) adding the user as a member to the organization, and (4) making the user an administrator in the organization.

### Transports

### Repositories

## Testing

### Test views for maximum coverage

### Adopt test-driven development

## Frequently asked questions

### Why not use Django REST framework?

[Django REST framework](https://www.django-rest-framework.org/) is a great toolkit for building Web APIs. It is hugely popular and simplifies building REST APIs in Django, offering tooling for model serialization, registering routes and even adding support for authentication. In future projects, I would consider using it.

The main reason for not using the framework was to reduce the learning curve for me and other developers. Django itself is a huge framework with a lot to learn, and adopting another framework on top of this seemed like a risk.

We also wanted to keep maximum flexibility. We wanted to be able to customize how to implement features such as user authentication, role-based access control, and how to serve  big data sets. Django REST framework probably can handle all this, but it seemed easier for us to build such custom features directly on top of vanilla Django.

Finally, it seemed that Django REST framework could encourage some bad practices such as exposing database models directly as API resources. As mentioned in the beginning of the article, we wanted to avoid falling into the trap of too tightly coupling data models to API resources.
