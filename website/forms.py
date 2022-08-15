from django import forms
from django.forms import ModelForm
from .models import Contato, Ocorrencia, Projeto, Usuario, Servico, Historico, Colaborador, Publicacao
# create a form for the model Contato
class ContatoForm(ModelForm):
    class Meta:
        model = Contato
        fields = ('nome', 'email', 'telefone', 'cidade', 'mensagem')
        labels = {'nome':'Nome',
                  'email':'E-mail',
                  'telefone':'Telefone',
                  'cidade':'Cidade',
                  'mensagem': 'Mensagem'}
        widgets = {
            'nome': forms.TextInput(attrs={'class': 'form-control'}),
            'email': forms.EmailInput(attrs={'class': 'form-control'}),
            'telefone':forms.TextInput(attrs={'class': 'form-control'}),
            'cidade':forms.TextInput(attrs={'class': 'form-control'}),
            'mensagem':forms.Textarea(attrs={'class': 'form-control'}),
                    }
        
class ColaboradorForm(ModelForm):
    class Meta:
        model = Colaborador
        fields = ('name', 'url_latters', 'funcao', 'url_twitter', 'url_facebook','url_instagram','url_linkedin','foto',)
        labels = {
                  'name':'Nome',
                  'url_latters':'URL do latters',
                  'funcao':'Função',
                  'url_twitter':'URL twitter',
                  'url_facebook':'URL facebook',
                  'url_instagram':'URL Instagram',
                  'url_linkedin':'URL linkedin',
                  'foto':'Foto',
                  }
        widgets = {
            
            'name': forms.TextInput(attrs={'class': 'form-control'}),
            'url_latters': forms.TextInput(attrs={'class': 'form-control'}),
            'funcao': forms.TextInput(attrs={'class': 'form-control'}),
            'url_twitter':forms.TextInput(attrs={'class': 'form-control'}),
            'url_facebook':forms.TextInput(attrs={'class': 'form-control'}),
            'url_instagram':forms.TextInput(attrs={'class': 'form-control'}),
            'url_linkedin':forms.TextInput(attrs={'class': 'form-control'}),
            'foto':forms.FileInput( attrs={'class': 'form-control'})
            }
           
           
class OcorrenciaForm(ModelForm):
    class Meta:
        model = Ocorrencia
        fields = ('servico', 'solicitacao', 'descricao', 'solicitante', )
        labels = {'solicitacao':'Solicitação',
                  'descricao':'Descrição',
                  'solicitante':'Solicitante',
                  'servico': 'Serviço'
                  }
        widgets = {
            'servico': forms.SelectMultiple(attrs={'class': 'form-control'}),
            'solicitacao': forms.TextInput(attrs={'class': 'form-control'}),
            'solicitante':forms.Select(attrs={'class': 'form-select'}),
            'descricao':forms.Textarea(attrs={'class': 'form-control'}),
               }
class PublicacaoForm(ModelForm):
    class Meta:
        model = Publicacao
        exclude = [ 'user',]
        fields = ('titulo', 'resumo', 'ano', 'categoria','autores','artigo_upload')
        labels = {'titulo':'Título',
                  'resumo':'Resumo',
                  'ano':'Ano',
                  'autores': 'Autores',
                  'categoria':'Categoria',
                  'artigo_upload':'Artigo',
                  
                  }
        widgets = {
            
            
            'titulo': forms.TextInput(attrs={'class': 'form-control'}),
            'resumo':forms.Textarea(attrs={'class': 'form-control'}),
            'autores': forms.TextInput(attrs={'class': 'form-control'}),
            'ano':forms.TextInput(attrs={'class': 'form-control'}),
            'categoria':forms.SelectMultiple(attrs={'class': 'form-select'}),
            'artigo_upload':forms.FileInput( attrs={'class': 'form-control'}),
               }
                
class ProjetoForm(ModelForm):
    class Meta:
        model = Projeto
        exclude = [ 'user',]
        fields = ('name', 'client', 'title', 'type','date','url','description','image1','image2','image3')
        labels = {'name':'Nome',
                  'client':'Cliente',
                  'title':'Título',
                  'type': 'Tipo',
                  'date':'Data',
                  'url':'Link do Projeto',
                 'description':'Descrição',
                 'image1':'Imagem 1',
                 'image2':'Imagem 2',
                 'image3':'Imagem 3',
                  }
        widgets = {
            'name': forms.TextInput(attrs={'class': 'form-control'}),
            'title': forms.TextInput(attrs={'class': 'form-control'}),
            'client': forms.TextInput(attrs={'class': 'form-control'}),
            'type': forms.SelectMultiple(attrs={'class': 'form-select'}),
            'date':forms.DateInput(attrs={'class': 'form-control'}),
            'url':forms.URLInput(attrs={'class': 'form-control'}),
            'description':forms.Textarea(attrs={'class': 'form-control'}),
            'image1':forms.FileInput( attrs={'class': 'form-control'}),
            'image2':forms.FileInput( attrs={'class': 'form-control'}),
            'image3':forms.FileInput( attrs={'class': 'form-control'}),
               }
                