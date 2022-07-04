from django.contrib import admin
from .models import Usuario, Ocorrencia,Servico, Historico, Contato
# Register your models here.

admin.site.register(Usuario)
admin.site.register(Ocorrencia)
admin.site.register(Servico)
admin.site.register(Historico)
admin.site.register(Contato)
