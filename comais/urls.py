
from django.contrib import admin
from django.urls import path, include


urlpatterns = [
    path('', include('website.urls')),
    path('membros/', include('django.contrib.auth.urls')),
    path('membros/', include('membros.urls')),
    path('admin/', admin.site.urls),
    
]
admin.site.site_header = 'COMAIS'
admin.site.site_title = ''
admin.site.index_title = 'Administração do COMAIS'
