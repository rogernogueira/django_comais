from rest_framework import viewsets

from website.models import Colaborador, Curso, Noticia, Projeto, TipoProjeto

from .serializers import (
    ColaboradorSerializer,
    CursoDetailSerializer,
    CursoListSerializer,
    NoticiaDetailSerializer,
    NoticiaListSerializer,
    ProjetoDetailSerializer,
    ProjetoListSerializer,
    TipoProjetoSerializer,
)


class TipoProjetoViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = TipoProjeto.objects.all().order_by("type")
    serializer_class = TipoProjetoSerializer


class ProjetoViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Projeto.objects.all().prefetch_related("type").order_by("-date")
    filterset_fields = ["type"]
    search_fields = ["name", "title", "description", "client"]
    ordering_fields = ["date", "name"]
    ordering = ["-date"]

    def get_serializer_class(self):
        if self.action == "retrieve":
            return ProjetoDetailSerializer
        return ProjetoListSerializer


class NoticiaViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Noticia.objects.all().order_by("-data_publicacao", "-data_criacao")
    search_fields = ["titulo", "resumo", "conteudo", "fonte_nome"]
    ordering_fields = ["data_publicacao", "data_criacao", "titulo"]

    def get_serializer_class(self):
        if self.action == "retrieve":
            return NoticiaDetailSerializer
        return NoticiaListSerializer


class ColaboradorViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Colaborador.objects.all().order_by("name")
    serializer_class = ColaboradorSerializer
    search_fields = ["name", "funcao"]
    ordering_fields = ["name", "post_date"]


class CursoViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Curso.objects.all().prefetch_related("parceiros").order_by("-data_inicio")
    search_fields = ["titulo", "descricao", "instrutor", "local"]
    ordering_fields = ["data_inicio", "data_termino", "titulo", "carga_horaria"]

    def get_serializer_class(self):
        if self.action == "retrieve":
            return CursoDetailSerializer
        return CursoListSerializer
