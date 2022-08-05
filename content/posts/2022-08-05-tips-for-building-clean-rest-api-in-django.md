---
title: Tips for building a clean REST API in Django
published: true
description: Lessons learned from two years of developing and maintaining a Django backend
tags: 
canonical_url: https://kimmosaaskilahti.fi/blog/2022-08-05-tips-for-building-clean-rest-api-in-django/
---

Some two years ago I started developing a software application for training data annotation at Silo AI. The heart application of the application is a REST API built in [Django](https://www.djangoproject.com/). The API serves as the backend for a Vue front-end and Python SDK.

Before starting this project, I did not have any experience of using Django. In this post, I'd like to share some of the lessons learned and tips for creating a clean REST API in Django.

I highly recommend reading [_Tips for Building High-Quality Django Apps at Scale_](https://medium.com/@DoorDash/tips-for-building-high-quality-django-apps-at-scale-a5a25917b2b5) by DoorDash. Many of the tips below are inspired by the article and have proved to be invaluable for keeping the codebase maintainable.

## API design

Let's start from discussing API design. Putting effort into thinking about how the backend interfaces with clients is a key for keeping the codebase maintainable and API operations re-usable across clients.

The recommended background reading for this section is [RESTful API design](https://docs.microsoft.com/en-us/azure/architecture/best-practices/api-design) by Microsoft. The tips discussed in this section are not specific to Django.

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

We have paid heavy price for too strict payload. Always keep extensibility in mind when designing.

Note that this does not apply to request payloads. For example, it's perfectly fine to use request payloads such as 

```json
{
    "user_id": "user-id-1",
    "organization_id": "organization-id-1
}
```

The backend can easily query for more information if needed. It is also easier to keep the backend backward compatible than keeping clients forward compatible in case of breaking schema changes.

### Keep API resources decoupled from database models

### Pagination

## Structuring code

### Transports

### Services

### Repositories

### Queries and serialization need to be close

## Testing


## Frequently asked questions

### Why not use Django REST framework?

