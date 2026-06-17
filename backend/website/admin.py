from django.contrib import admin
from django.utils.html import format_html
from .models import Usuario, Ocorrencia,Servico, Historico, Contato, TipoProjeto, \
      Projeto, Publicacao, Colaborador, Categoria_publicacao, ProjetoRelatorio, Relatorio, \
      RelatorioFinal, Templates, GaleriaFoto
# Register your models here.

admin.site.register(Usuario)
admin.site.register(Ocorrencia)
admin.site.register(Servico)
admin.site.register(Historico)
admin.site.register(Contato)
admin.site.register(TipoProjeto)
admin.site.register(Projeto)
admin.site.register(Colaborador)
admin.site.register(ProjetoRelatorio)
admin.site.register(Relatorio)
admin.site.register(RelatorioFinal)
admin.site.register(Templates)


admin.site.register(Publicacao)
admin.site.register(Categoria_publicacao)


@admin.register(GaleriaFoto)
class GaleriaFotoAdmin(admin.ModelAdmin):
    list_display = ('miniatura', 'titulo', 'categoria', 'data', 'destaque', 'ordem')
    list_display_links = ('miniatura', 'titulo')
    list_editable = ('destaque', 'ordem')
    list_filter = ('categoria', 'destaque')
    search_fields = ('titulo', 'descricao', 'categoria')
    date_hierarchy = 'data'

    @admin.display(description='Imagem')
    def miniatura(self, obj):
        if obj.imagem:
            return format_html(
                '<img src="{}" style="height:48px;width:64px;object-fit:cover;border-radius:4px" />',
                obj.imagem.url,
            )
        return '—'

#test colaborador