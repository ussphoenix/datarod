"""
URL configuration for datarod project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from graphene_file_upload.django import FileUploadGraphQLView
from social_core.actions import do_auth
from social_django.utils import psa

from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.contrib.auth import REDIRECT_FIELD_NAME, logout
from django.shortcuts import redirect
from django.urls import include, path
from django.views.decorators.cache import never_cache
from django.views.decorators.csrf import csrf_exempt

from api.schema import schema


def logout_view(request):
    logout(request)
    return redirect(settings.LOGOUT_URL)


# social-auth-app-django 6.x makes its login-begin view POST-only
# re-expose it as GET-capable so our SPA can start OAuth with a plain redirect
@never_cache
@psa("social:complete")
def social_begin(request, backend):
    return do_auth(request.backend, redirect_name=REDIRECT_FIELD_NAME)


urlpatterns = [
    path(
        "backend/",
        include(
            [
                # override social-auth's POST-only view with a GET-capable one
                path("login/<str:backend>/", social_begin, name="social_begin"),
                path("", include("social_django.urls", namespace="social")),
                path("logout", logout_view, name="logout"),
                path("admin/", admin.site.urls),
                path("django-rq/", include("django_rq.urls")),
                path(
                    "graphql",
                    csrf_exempt(
                        FileUploadGraphQLView.as_view(graphiql=True, schema=schema)
                    ),
                ),
            ]
        ),
    ),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
