from django.urls import path

from . import views

urlpatterns = [
    path('', views.home, name='home'),
    
    path('index', views.index, name='index'),
    
    path('sobre', views.sobre, name='sobre'),
    path('download', views.download, name='download'),
    
    path('ocorrencias', views.ocorrencias, name='ocorrencias'),
    path('contato', views.contato, name='contato'),
    path('contatos', views.contatos, name='contato-list'),
    path('contatos/<id_contato>', views.show_contatos, name='show-contatos'),
    path('buscar', views.busca_contatos, name='buscar-contatos'),
    path('update_contatos_list', views.update_contatos_list, name='update-contatos-list'),
    path('update_contato/<id_contato>', views.update_contato, name='update-contato'),
    path('delete_contato/<id_contato>', views.delete_contato, name='delete-contato'),
    path('registro_ocorrencias', views.registro_ocorrencias, name='registro-ocorrencias'),
    path('projetos/<id_projeto>', views.show_projeto, name='show-projeto'),
    path('home', views.home, name='home'),
    path('perfil', views.update_perfil, name='perfil'),
    path('gerencia_publicacoes', views.gerencia_publicacoes, name='gerencia-publicacoes'),
    path('editar_publicacao/<id_publicacao>', views.editar_publicacao, name='editar-publicacao'),
    path('delete_publicacao/<id_publicacao>', views.delete_publicacao, name='delete-publicacao'),
    path('editar_projeto/<id_projeto>', views.editar_projeto, name='editar-projeto'),
    path('delete_projeto/<id_projeto>', views.delete_projeto, name='delete-projeto'),
    path('cadastrar_publicacao', views.cadastrar_publicacao, name='cadastrar-publicacao'),
    path('cadastrar_projeto', views.cadastrar_projeto, name='cadastrar-projeto'),
    path('gerencia_projetos', views.gerencia_projetos, name='gerencia-projetos'),
    path('gerar_relatorio/<id_relatorio>', views.gerar_relatorio, name='gerar-relatorio'),
    path('gerar_relatorio_final/<id_relatorio>', views.gerar_relatorio_final, name='gerar-relatorio-final'),
    path('gerencia_relatorios', views.gerencia_relatorios, name='gerencia-relatorios'),
    path('cadastrar_relatorio/<id_projeto_relatorio>', views.cadastrar_relatorio, name='cadastrar-relatorio'),
    path('editar_relatorio/<id_relatorio>', views.editar_relatorio, name='editar-relatorio'),
    path('cadastrar_projeto_relatorio', views.cadastrar_projeto_relatorio, name='cadastrar-projeto-relatorio'),
    path('editar_projeto_relatorio/<id_projeto_relatorio>', views.editar_projeto_relatorio, name='editar-projeto-relatorio'),
    path('deletar_projeto_relatorio/<id_projeto_relatorio>', views.deletar_projeto_relatorio, name='deletar-projeto-relatorio'),
    path('deletar_relatorio/<id_relatorio>', views.deletar_relatorio, name='deletar-relatorio'),
    path('cadastrar_relatorio_final/<id_projeto_relatorio>', views.cadastrar_relatorio_final, name='cadastrar-relatorio-final'),
]