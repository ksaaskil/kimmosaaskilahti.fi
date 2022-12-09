---
title: Custom user authentication in Django, with tests
published: true
description: Understand how authentication works and how to customize it
tags: python,django,tutorial
series: Granular role-based access control in Django
date: 2021-04-18
canonical_url: https://kimmosaaskilahti.fi/blog/2021-04-18-django-custom-authentication/
---

In the [previous part](https://dev.to/ksaaskil/setting-up-django-rest-api-with-custom-user-model-and-tests-5b8f), we created a custom user model in Django. In this part, I'd like to show how to roll custom authentication. Neither custom user model nor custom authentication are required for the granular role-based access control, but I'd like this series to be a complete tour of authentication and authorization in Django. The code accompanying the series can be found in [GitHub](https://github.com/ksaaskil/django-rbac). So let's get started!

## Django authentication 101

Authentication is the process of figuring out who the user claims to be and verifying the claim. In Django's authentication system, the "low-level" approach to verifying the user identity is to call [`authenticate`](https://docs.djangoproject.com/en/3.2/topics/auth/default/#django.contrib.auth.authenticate) from `django.contrib.auth.authenticate`. This function checks the user identity against each [authentication backend](https://docs.djangoproject.com/en/3.2/topics/auth/customizing/#authentication-backends) configured in [`AUTHENTICATION_BACKENDS`](https://docs.djangoproject.com/en/3.2/ref/settings/#std:setting-AUTHENTICATION_BACKENDS) variable of `settings.py`.

By default, Django uses [`ModelBackend`](https://docs.djangoproject.com/en/3.2/ref/contrib/auth/#django.contrib.auth.backends.ModelBackend) as the only authentication backend. It's instructive to look into the implementation of `ModelBackend` in [GitHub](https://github.com/django/django/blob/main/django/contrib/auth/backends.py#L31):

```python
class ModelBackend(BaseBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        if username is None:
            username = kwargs.get(UserModel.USERNAME_FIELD)
        if username is None or password is None:
            return
        try:
            user = UserModel._default_manager.get_by_natural_key(username)
        except UserModel.DoesNotExist:
            # Run the default password hasher once to reduce the timing
            # difference between an existing and a nonexistent user (#20760).
            UserModel().set_password(password)
        else:
            if user.check_password(password) and self.user_can_authenticate(user):
                return user
    ...
```

The `ModelBackend` fetches the appropriate user from the backend using either the given `username` or the `USERNAME_FIELD` defined in user model. The backend then checks the password and also checks if the user can authenticate (checking if the user has `is_active` set to `True`). Quite simple, eh?

As we'll be authenticating our users with their username (e-mail) and password in this series, we could use the `ModelBackend`. However, it's instructive to write our own backend. Also, we'll get rid of all the unnecessary boilerplate in `ModelBackend` coming from Django's default permission system, which we won't need.

## Custom authentication backend

Every authentication backend in Django should have methods `authenticate()` and `get_user()`. The `authenticate()` method should check the credentials it gets and return a user object that matches those credentials if the credentials are valid. If the credentials are not valid, it should return `None`.

Here's a simple implementation of `CheckPasswordBackend`:

```python
# rbac/core/auth.py
import typing

from rbac.core.models import User
from rbac.core import services


class CheckPasswordBackend:
    def authenticate(
        self, request=None, email=None, password=None
    ) -> typing.Optional[User]:
        try:
            user = services.find_user_by_email(email=email)
        except Http404:
            return None

        return user if user.check_password(password) else None

    def get_user(self, user_id) -> typing.Optional[User]:
        try:
            return User.objects.get(id=user_id)
        except User.DoesNotExist:
            return None
```

We use `services.find_user_by_email` method created in the previous post for fetching the user by email. If the password matches, we return the corresponding user. And that's it! Let's set Django to use this backend for authentication:

```python
# rbac/settings.py
AUTHENTICATION_BACKENDS = ["rbac.core.auth.CheckPasswordBackend"]
```

Now, whenever we call `authenticate` from `django.contrib.auth`, we're essentially calling `authenticate()` from `CheckPasswordBackend`.

Why did we also define `get_user` above in `CheckPasswordBackend`? That's a very good question. The answer is that Django documentation says it should be implemented, but I have no idea why. Please drop a comment if you know!

So now we have a great new authentication backend, how do we actually use it? We write a view `auth/login` that allows users to login with their email and password. If the user identity is verified, we log them in by calling [`login()`](https://docs.djangoproject.com/en/3.2/topics/auth/default/#django.contrib.auth.login). This creates a session for the user and stores the `sessionid` in a cookie, allowing the user to perform authenticated requests.

Before implementing the `login` view, let's be responsible developers and write tests. 

### Tests

To test login, we need to create a sample user. We do that in a `pytest` fixture:

```python
# tests/test_views.py
import pytest

from rbac.core.services import create_user

TEST_USER_NAME = "Jane Doe"
TEST_USER_EMAIL = "jane@example.org"
TEST_USER_PASSWORD = "aösdkfjgösdgäs"


@pytest.fixture
def sample_user():
    user = create_user(
        name=TEST_USER_NAME, email=TEST_USER_EMAIL, password=TEST_USER_PASSWORD
    )
    return user
```

Now let's use this fixture in two tests. The first test verifies that logging in with invalid password returns 401:

```python
from django.test import Client

@pytest.mark.django_db
def test_login_fails_with_invalid_credentials(sample_user):
    client = Client()
    response = client.post(
        "/auth/login",
        dict(email=TEST_USER_EMAIL, password="wrong-password"),
        content_type="application/json",
    )
    assert response.status_code == 401
    assert "sessionid" not in client.cookies
```

We're using the [Django test client](https://docs.djangoproject.com/en/3.2/topics/testing/tools/#the-test-client) for making requests from tests without actually running the server.

The second test verifies that login succeeds with valid credentials:

```python
@pytest.mark.django_db
def test_login_succeeds_with_valid_credentials(sample_user):
    client = Client()
    assert "sessionid" not in client.cookies
    response = client.post(
        "/auth/login",
        dict(email=TEST_USER_EMAIL, password=TEST_USER_PASSWORD),
        content_type="application/json",
    )
    assert response.status_code == 200
    assert "sessionid" in client.cookies
```

At this point, we can start `pytest-watch` with the command `ptw -- tests/test_views.py` and code until the tests pass. If you haven't added `pytest-watch` to `requirements-dev.txt` yet, you should do it now.

### Login view

Let's now add the view for logging in a user. We expect users to post their email and password in a JSON request body. Here's how we parse the body, authenticate the user, and log them in:

```python
# rbac/core/auth.py
import json

from django.contrib.auth import authenticate, login
from django.http import HttpResponse
from django.views.decorators.http import require_http_methods

@require_http_methods(["POST"])
def login_view(request):
    body = json.loads(request.body.decode())
    user = authenticate(request, email=body["email"], password=body["password"])

    if user:
        login(request, user)
        return HttpResponse("OK")
    else:
        return HttpResponse("Unauthorized", status=401)
```

If the call to `authenticate` returns a valid user, we login the user, create a session and set the session cookie. Otherwise, we return 401.

Now we need to define the endpoint for our view:

```python
# rbac/core/auth.py
from django.urls.conf import re_path

urlpatterns = [
    re_path("^login$", login_view),
]
```

We also need to define a new route named `auth` in `rbac/urls.py`:

```python
# rbac/core/urls.py

from django.conf.urls import include, re_path
from rbac.core import views

urlpatterns = [
    re_path(r"^$", views.index),
    re_path(r"^auth/", include("rbac.core.auth")),
]
```

With all this done, your tests should pass with flying colors.

Congratulations, you should now have a much deeper understanding of how authentication works in Django! Please leave a comment how you liked the article. In the next parts, we'll work towards role-based access control. See you next time!
