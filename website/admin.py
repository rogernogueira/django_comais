from django.contrib import admin
from .models import Usuario, Ocorrencia,Servico, Historico, Contato, TipoProjeto, Projeto, Publicacao, Colaborador, Categoria_publicacao
# Register your models here.

admin.site.register(Usuario)
admin.site.register(Ocorrencia)
admin.site.register(Servico)
admin.site.register(Historico)
admin.site.register(Contato)
admin.site.register(TipoProjeto)
admin.site.register(Projeto)
admin.site.register(Colaborador)

admin.site.register(Publicacao)
admin.site.register(Categoria_publicacao)

#test colaborador