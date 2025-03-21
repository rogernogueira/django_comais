from rest_framework import serializers
from django.db import transaction
from django.contrib.auth.models import User
from .models import  Imagem
class ImagemSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()
    thumbnail_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Imagem
        fields = ['id', 'arquivo', 'thumbnail', 'usuario', 'data_criacao', 'url', 'thumbnail_url', 'tag']
        read_only_fields = ['id', 'thumbnail', 'usuario', 'data_criacao', 'url', 'thumbnail_url', 'tag']

    def get_url(self, obj):
        return obj.url

    def get_thumbnail_url(self, obj):
        if obj.thumbnail_url:
            return obj.thumbnail_url
        return None
