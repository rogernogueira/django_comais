
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.i18n import set_language
from django.views.static import serve
from django.urls import re_path


urlpatterns = [
    path('', include('website.urls')),
    path('membros/', include('django.contrib.auth.urls')),
    path('membros/', include('membros.urls')),
    path('admin/', admin.site.urls),
    path('tinymce/', include('tinymce.urls')),
    path('i18n/', include('django.conf.urls.i18n')),
    path('pdf/', include('pdf.urls')),
    # Serve arquivos HTML do diretório analisededados
    re_path(r'^analisededados/(?P<path>.*)$', serve, {
        'document_root': settings.BASE_DIR / 'analisededados',
    }),
]

admin.site.site_header = 'COMAIS'
admin.site.site_title = ''
admin.site.index_title = 'Administração do COMAIS'
