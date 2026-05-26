from rest_framework import serializers

from website.models import Colaborador, Curso, Noticia, Parceiro, Projeto, TipoProjeto


class TipoProjetoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoProjeto
        fields = ["id", "type", "filter"]


class ProjetoListSerializer(serializers.ModelSerializer):
    type = TipoProjetoSerializer(many=True, read_only=True)

    class Meta:
        model = Projeto
        fields = [
            "id",
            "name",
            "client",
            "title",
            "type",
            "date",
            "url",
            "description",
            "image1",
        ]


class ProjetoDetailSerializer(serializers.ModelSerializer):
    type = TipoProjetoSerializer(many=True, read_only=True)

    class Meta:
        model = Projeto
        fields = [
            "id",
            "name",
            "client",
            "title",
            "type",
            "date",
            "url",
            "description",
            "image1",
            "image2",
            "image3",
        ]


class ParceiroSerializer(serializers.ModelSerializer):
    class Meta:
        model = Parceiro
        fields = ["id", "nome", "logo", "site"]


class CursoListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Curso
        fields = [
            "id",
            "titulo",
            "descricao",
            "carga_horaria",
            "data_inicio",
            "data_termino",
            "instrutor",
            "local",
        ]


class NoticiaListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Noticia
        fields = [
            "id",
            "titulo",
            "resumo",
            "imagem",
            "fonte_nome",
            "fonte_url",
            "data_publicacao",
        ]


class NoticiaDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Noticia
        fields = [
            "id",
            "titulo",
            "resumo",
            "conteudo",
            "imagem",
            "fonte_nome",
            "fonte_url",
            "data_publicacao",
            "data_criacao",
        ]


class ColaboradorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Colaborador
        fields = [
            "id",
            "name",
            "funcao",
            "url_latters",
            "url_twitter",
            "url_facebook",
            "url_instagram",
            "url_linkedin",
            "foto",
        ]


class CursoDetailSerializer(serializers.ModelSerializer):
    parceiros = ParceiroSerializer(many=True, read_only=True)

    class Meta:
        model = Curso
        fields = [
            "id",
            "titulo",
            "descricao",
            "carga_horaria",
            "data_inicio",
            "data_termino",
            "instrutor",
            "local",
            "parceiros",
            "data_criacao",
        ]
