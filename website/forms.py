from django import forms
from django.forms import ModelForm, ValidationError
from django.db.models import BaseConstraint

from django.contrib import messages
from django.urls import reverse
from .models import Contato, Ocorrencia, Projeto, Usuario, Servico,\
    Historico, Colaborador, Publicacao, Relatorio, ProjetoRelatorio, RelatorioFinal, Curso
# create a form for the model Contato

class CursoForm(ModelForm):
    class Meta:
        model = Curso
        fields = ('titulo', 'descricao', 'carga_horaria', 'data_inicio', 'data_termino', 'instrutor', 'local', 'parceiros')
        labels = {
            'titulo': 'titulo do Curso',
            'descricao': 'Descrição',
            'carga_horaria': 'Carga Horária',
            'data_inicio': 'Data de Início',
            'data_termino': 'Data de Término', 
            'instrutor': 'Instrutores',
            'local':'Tipo de Curso',
            'parceiros': 'Parceiros'
        }
        widgets = {
            'titulo': forms.TextInput(attrs={'class': 'form-control'}),
            'descricao': forms.Textarea(attrs={'class': 'form-control', 'rows': 3}),
            'carga_horaria': forms.NumberInput(attrs={'class': 'form-control'}),
            'data_inicio': forms.DateInput(attrs={'class': 'form-control', 'type': 'date'}),
            'data_termino': forms.DateInput(attrs={'class': 'form-control', 'type': 'date'}), 
            'instrutor': forms.TextInput(attrs={'class': 'form-control'}),
            'local': forms.TextInput(attrs={'class': 'form-control'}),
            'parceiros': forms.SelectMultiple(attrs={'class': 'form-control'}),
        }

from tinymce.widgets import TinyMCE
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
            'description':TinyMCE(attrs={'cols': 40, 'rows': 30, 'class': 'form-control'}),
            'image1':forms.FileInput( attrs={'class': 'form-control'}),
            'image2':forms.FileInput( attrs={'class': 'form-control'}),
            'image3':forms.FileInput( attrs={'class': 'form-control'}),
               }
        
class RelatorioForm(ModelForm):
    class Meta:
        model = Relatorio
        fields = ('resultado', 'informacao_adicional', 'data_vigencia', 'data_assinatura','parcela')
        exclude = [ 'projeto']
        labels = {'resultado':'Resultados',
                  'informacao_adicional': 'Informações adicionais',
                  'data_vigencia': 'Data do relatório',
                  'data_assinatura': 'Data da entrega',
                  'parcela':'Parcela',
                  }
        widgets = {
                    'resultado': TinyMCE(attrs={'cols': 80, 'rows': 30, 'class': 'form-control', 'id':'mytextarea'}),
                    'informacao_adicional':  TinyMCE(attrs={'cols': 80, 'rows': 30, 'class': 'form-control'}),
                    'data_vigencia': forms.DateInput(format=('%Y-%m-%d'),attrs={'class': 'form-control', 'type':'date'}),
                    'data_assinatura': forms.DateInput(format=('%Y-%m-%d'),attrs={'class': 'form-control', 'type':'date'}),
                    'parcela': forms.TextInput(attrs={'class': 'form-control'}),
        }
    def check_rules_new(self, *args, **kwargs):
        valid = True
        if not self.is_valid():
            self.adicionar_error('Por favor, verifique os dados informados')
            return False
        relatorio =  super(RelatorioForm, self).save(commit=False)
        parcela = relatorio.parcela
        id_projeto = relatorio.projeto.id
        if Relatorio.objects.filter(parcela=parcela, projeto=id_projeto).exists():
            self.adicionar_error('Já existe um relatório para esta parcela')
            valid = False
        if relatorio.data_vigencia > relatorio.data_assinatura:
            self.adicionar_error('A data de vigência não pode ser maior que a data de assinatura')
            valid = False
        
        if relatorio.parcela > relatorio.projeto.numero_parcelas:
            self.adicionar_error('Parcela não prevista no projeto')
            valid = False
        return valid
    
    def check_rules_update(self, id_relatorio, *args, **kwargs):
        valid = True
        relatorio =  super(RelatorioForm, self).save(commit=False)
        if not self.is_valid():
            self.adicionar_error('Por favor, verifique os dados informados')
            valid = False
        parcela = relatorio.parcela
        id_projeto = relatorio.projeto.id
        
        if Relatorio.objects.get(id=id_relatorio).parcela!= parcela:
            if Relatorio.objects.filter(parcela=parcela, projeto=id_projeto).exists():
                self.adicionar_error('Já existe um relatório para esta parcela')
                valid = False
        
        if relatorio.data_vigencia > relatorio.data_assinatura:
            self.adicionar_error('A data de vigência não pode ser maior que a data de assinatura')
            valid = False
        
        if relatorio.parcela > relatorio.projeto.numero_parcelas:
            self.adicionar_error('Parcela não prevista no projeto')
            valid = False
        return valid
        
    
    def adicionar_error(self, message):
            errors = self._errors.setdefault(forms.forms.NON_FIELD_ERRORS, forms.utils.ErrorList())
            errors.append(message)
 
        
class RelatorioFinalForm(ModelForm):
    class Meta:
        model = RelatorioFinal
        fields = ('objetivos_principais', 'principais_obstaculos',
                  'resultados_esperados_alcancados','informacao_adicional', 
                  'conclusoes', 'data_vigencia', 'data_assinatura')
        
        exclude = [ 'projeto']
        labels = {
                    'objetivos_principais':'Objetivos Principais resultados alcançados',
                    'principal_obstaculos':'Principais obstáculos ou dificuldades encontradas',
                    'resultados_esperados_alcancados':'Satisfação entre resultados esperados e os resultados alcançados',
                    'informacao_adicional': 'Informações adicionais',
                    'conclusoes': 'Conclusões',
                    'data_vigencia': 'Data do relatório',
                    'data_assinatura': 'Data da entrega',
                  }
        widgets = {
                    'objetivos_principais': TinyMCE(attrs={'cols': 80, 'rows': 30, 'class': 'form-control'}),
                    'principal_obstaculos': TinyMCE(attrs={'cols': 80, 'rows': 30, 'class': 'form-control'}),
                    'resultados_esperados_alcancados': TinyMCE(attrs={'cols': 80, 'rows': 30, 'class': 'form-control'}),
                    'informacao_adicional': TinyMCE(attrs={'cols': 80, 'rows': 30, 'class': 'form-control'}),
                    'conclusoes': TinyMCE(attrs={'cols': 80, 'rows': 30, 'class': 'form-control'}),
                    'data_vigencia': forms.DateInput(format=('%Y-%m-%d'),attrs={'class': 'form-control', 'type':'date'}),
                    'data_assinatura': forms.DateInput(format=('%Y-%m-%d'),attrs={'class': 'form-control', 'type':'date'}),
        }


    def check_rules(self, *args, **kwargs):
        valid = True
        
     
        if not self.is_valid():
            self.adicionar_error("Por favor, verifique os dados informados")
            return False
        
        relatorio =  super(RelatorioFinalForm, self).save(commit=False)
            
        if relatorio.data_vigencia > relatorio.data_assinatura:
            self.adicionar_error("A data de vigência não pode ser maior que a data de assinatura")
            valid = False
        return valid
 
    def adicionar_error(self, message):
            errors = self._errors.setdefault(forms.forms.NON_FIELD_ERRORS, forms.utils.ErrorList())
            errors.append(message)
 

class ProjetoRelatorioForm(ModelForm):
    class Meta:
        model = ProjetoRelatorio
        exclude = [ 'user',]
        fields = ('titulo','status', 'vigencia_inicio', 'vigencia_fim',
                  'numero_parcelas','objetivo_proposto','objetivo_proposto_obj',
                  'resultado_esperado','dia_entrega','template_default','template')

        labels = {'titulo':'Titulo do projeto',
                  'status':'Status',
                  'vigencia_inicio':'Data de início',
                  'vigencia_fim':'Data de término',
                  'numero_parcelas': 'Quantidade de parcelas',
                  'objetivo_proposto':'Objetivo proposto',
                  'objetivo_proposto_obj':'Observações do objetivo proposto',
                  'resultado_esperado':'Resultados esperados',
                  'dia_entrega':'Sugestão de dia do mês do relatório, 0 para ultimo dia do mês',
                  'template_default':'Usar template padrão',
                  'template':'Modelo de relatório',
                                   }
        widgets = {
            'titulo': forms.TextInput(attrs={'class': 'form-control'}),
            'status': forms.Select(attrs={'class': 'form-control'}),
            'vigencia_inicio': forms.DateInput(format=('%Y-%m-%d'),attrs={'class': 'form-control', 'type':'date'}),
            'vigencia_fim': forms.DateInput(format=('%Y-%m-%d'),attrs={'class': 'form-control', 'type':'date'}),
            'numero_parcelas':forms.TextInput(attrs={'class': 'form-control'}),
            'objetivo_proposto':TinyMCE(attrs={'cols': 40, 'rows': 30, 'class': 'form-control'}),
            'objetivo_proposto_obj':TinyMCE(attrs={'cols': 40, 'rows': 30, 'class': 'form-control'}),
            'resultado_esperado':TinyMCE(attrs={'cols': 40, 'rows': 30, 'class': 'form-control'}),
            'dia_entrega':forms.TextInput( attrs={'class': 'form-control'}),
            'template_default':forms.CheckboxInput( ),
            'template':forms.FileInput( attrs={'class': 'form-control'}),
        }
