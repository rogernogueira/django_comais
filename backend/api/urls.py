"""API URL configuration.

Mounted under /api/v1/ in comais.urls. Domain-specific routers (auth,
projetos, publicacoes, relatorios, etc.) will be added here as each
feature is migrated from Django templates to the React SPA.
"""
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.urls import path


@api_view(["GET"])
@permission_classes([AllowAny])
def ping(request):
    """Liveness check. Useful for smoke-testing the API plumbing."""
    return Response({"status": "ok"})


app_name = "api"

urlpatterns = [
    path("ping/", ping, name="ping"),
]
