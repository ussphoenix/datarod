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

from graphene_django.views import GraphQLView

from django.contrib import admin
from django.urls import include, path
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import redirect
from django.conf import settings

from api.schema import schema


from django.contrib.auth import logout


def logout_view(request):
    logout(request)
    return redirect(settings.LOGOUT_URL)


urlpatterns = [
    path("", include("social_django.urls", namespace="social")),
    path("logout", logout_view, name="logout"),
    path("admin/", admin.site.urls),
    path("django-rq/", include("django_rq.urls")),
    path("graphql", csrf_exempt(GraphQLView.as_view(graphiql=True, schema=schema))),
]
