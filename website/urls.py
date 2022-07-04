from django.urls import path

from . import views

urlpatterns = [
    path('', views.home, name='home'),
    
    path('index', views.index, name='index'),
    
    path('sobre', views.sobre, name='sobre'),
    path('ocorrencias', views.ocorrencias, name='ocorrencias'),
    path('contato', views.contato, name='contato'),
    path('contatos', views.contatos, name='contato-list'),
    path('contatos/<id_contato>', views.show_contatos, name='show-contatos'),
    path('buscar', views.busca_contatos, name='buscar-contatos'),
    path('update_contatos_list', views.update_contatos_list, name='update-contatos-list'),
    path('update_contato/<id_contato>', views.update_contato, name='update-contato'),
    path('delete_contato/<id_contato>', views.delete_contato, name='delete-contato'),
    path('registro_ocorrencias', views.registro_ocorrencias, name='registro-ocorrencias'),
    path('home', views.home, name='home'),
]