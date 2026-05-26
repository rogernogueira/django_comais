"""API URL configuration.

Mounted under /api/v1/ in comais.urls. Domain-specific routers (auth,
projetos, publicacoes, relatorios, etc.) will be added here as each
feature is migrated from Django templates to the React SPA.
"""
from django.urls import path
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.routers import DefaultRouter

from .views import (
    ColaboradorViewSet,
    CursoViewSet,
    NoticiaViewSet,
    ProjetoViewSet,
    TipoProjetoViewSet,
)


@api_view(["GET"])
@permission_classes([AllowAny])
def ping(request):
    """Liveness check. Useful for smoke-testing the API plumbing."""
    return Response({"status": "ok"})


app_name = "api"

router = DefaultRouter()
router.register(r"projetos", ProjetoViewSet, basename="projeto")
router.register(r"tipos-projeto", TipoProjetoViewSet, basename="tipo-projeto")
router.register(r"cursos", CursoViewSet, basename="curso")
router.register(r"colaboradores", ColaboradorViewSet, basename="colaborador")
router.register(r"noticias", NoticiaViewSet, basename="noticia")

urlpatterns = [
    path("ping/", ping, name="ping"),
    *router.urls,
]
