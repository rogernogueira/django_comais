from django.urls import path
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'api/imagens', views.ImagemViewSet, basename='imagem')


urlpatterns = [
    path('', views.home, name='home'),
    path('index', views.index, name='index'),
    path('sobre', views.sobre, name='sobre'),
    path('download', views.download, name='download'),
    path('download_inscritos', views.download_inscritos, name='download_inscritos'),
    path('download_config', views.download_config, name='download_config'),
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
    
    # URLs para cursos
    path('cursos', views.listar_cursos, name='listar_cursos'),
    path('cursos/novo', views.criar_curso, name='criar_curso'),
    path('cursos/editar/<int:id>', views.editar_curso, name='editar_curso'),
    path('cursos/deletar/<int:id>', views.deletar_curso, name='deletar_curso'),
    path('cursos/<int:id>', views.detalhes_curso, name='curso-detail'),
    path('galeria', views.galeria, name='galeria'),
    path('galeria-moderna', views.galeria_moderna, name='galeria-moderna'),
    path('playground/regressaolinear', views.regressao_linear, name='regressao_linear'),
    path('playground/regressaologistica', views.regressao_logistica, name='regressao_logistica'),
    path('playground/svm', views.svm, name='svm'),
    path('playground/arvore', views.arvore, name='arvore'),
    path('playground/knn', views.knn, name='knn'),
    path('playground/nn', views.nn, name='nn'),
    path('playground/', views.painel, name='painel'),
    path('playground/kmeans', views.kmeans, name='kmeans'),
    path('playground/gd', views.gd, name='gd'),
    path('instrucoes', views.instrucoes, name='instrucoes'),
    path('cadastrar_termo', views.cadastrar_termo, name='cadastrar-termo'),    
    path('cadastrar_documento', views.cadastrar_documento, name='cadastrar_documento'),    
    path('gerencia_documentos', views.gerencia_documentos, name='gerencia_documentos'), 
    path('cadastra_tipo_documentos', views.cadastra_tipo_documentos, name='cadastra_tipo_documentos'), 
    path('editar_tipo_documento/<int:id>', views.editar_tipo_documento, name='editar_tipo_documento'),
    path('gerencia_tipo_documentos', views.gerencia_tipo_documentos, name='gerencia_tipo_documentos'), 
    path('tipo_documentos/deletar/<int:id>', views.deletar_tipo_documentos, name='deletar_tipo_documentos'), 
    path('api/gerar_documento/<int:id>', views.gerar_documento, name='gerar_documento'), 
    
    path('', include(router.urls)),
    path('api/gera_texto', views.GeraCampusView.as_view(), name='gera-texto'),
    path('api/tipo-documento/<int:id>/', views.tipo_documento, name='tipo-documento')

]
