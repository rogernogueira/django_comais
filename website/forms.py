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
    novo_termo = forms.FileField(
        label='Novo Termo de Outorga',
        required=False,
        widget=forms.FileInput(attrs={'class': 'form-control'})
    )
    
    class Meta:
        model = ProjetoRelatorio
        exclude = [ 'user',]
        fields = ('termo_outorga', 'novo_termo', 'titulo','status', 'vigencia_inicio', 'vigencia_fim',
                  'numero_parcelas','objetivo_proposto','objetivo_proposto_obj',
                  'resultado_esperado','dia_entrega','template_default','template')

        labels = {'termo_outorga':'Termo de outorga existente',
                 'novo_termo':'Ou enviar novo termo',
                 'titulo':'Titulo do projeto',
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
            'termo_outorga': forms.Select(attrs={'class': 'form-control'}),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if 'termo_outorga' in self.data:
            try:
                termo_id = int(self.data.get('termo_outorga'))
                termo = TermoOutorga.objects.get(id=termo_id)
                self.initial['titulo'] = termo.nome
            except (ValueError, TermoOutorga.DoesNotExist):
                pass

    def call_deepseek_api(self, termo_file):
        """Chama API Deepseek para extrair informações do termo"""
        import requests
        import os
        from django.conf import settings
        import magic
        
        # Verifica se o arquivo é markdown
        file_path = os.path.join(settings.MEDIA_ROOT, termo_file.name)
        mime = magic.Magic(mime=True)
        file_type = mime.from_file(file_path)
        
        if not file_type.startswith('text/') and not termo_file.name.lower().endswith('.md'):
            raise forms.ValidationError("O arquivo deve ser um documento Markdown (.md)")
        
        # Lê o conteúdo do arquivo
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                termo_content = f.read()
        except Exception as e:
            raise forms.ValidationError(f"Erro ao ler arquivo: {str(e)}")
        
        # Configuração da chamada à API
        url = "https://api.deepseek.com/v1/analyze"
        headers = {
            "Authorization": f"Bearer {settings.DEEPSEEK_API_KEY}",
            "Content-Type": "application/json"
        }
        prompt = """Extraia as seguintes informações do termo de outorga em formato JSON:
        {
            'titulo': 'Título do projeto',
            'vigencia_inicio': 'Data de início no formato YYYY-MM-DD',
            'vigencia_fim': 'Data de término no formato YYYY-MM-DD',
            'numero_parcelas': 'Número de parcelas (inteiro)'
        }"""
        
        payload = {
            "document": termo_content,
            "prompt": prompt
        }
        
        try:
            response = requests.post(url, json=payload, headers=headers, timeout=30)
            response.raise_for_status()
            api_data = response.json()
            
            # Valida os dados retornados
            required_fields = ['titulo', 'vigencia_inicio', 'vigencia_fim', 'numero_parcelas']
            if not all(field in api_data for field in required_fields):
                raise forms.ValidationError("A API não retornou todos os campos necessários")
                
            return api_data
        except requests.exceptions.RequestException as e:
            raise forms.ValidationError(f"Erro na comunicação com a API Deepseek: {str(e)}")
        except ValueError as e:
            raise forms.ValidationError(f"Resposta inválida da API: {str(e)}")

    def clean(self):
        cleaned_data = super().clean()
        termo_outorga = cleaned_data.get('termo_outorga')
        novo_termo = cleaned_data.get('novo_termo')
        
        if novo_termo and termo_outorga:
            raise forms.ValidationError("Escolha apenas uma opção: termo existente ou novo upload")
            
        if novo_termo:
            try:
                # Cria novo TermoOutorga automaticamente
                termo = TermoOutorga(arquivo=novo_termo)
                termo.save()
                cleaned_data['termo_outorga'] = termo
                cleaned_data['termo_path'] = termo.arquivo.name
                
                # Chama API Deepseek para extrair informações
                api_data = self.call_deepseek_api(termo.arquivo)
                
                # Valida e converte os dados da API
                from datetime import datetime
                try:
                    vigencia_inicio = datetime.strptime(api_data['vigencia_inicio'], '%Y-%m-%d').date()
                    vigencia_fim = datetime.strptime(api_data['vigencia_fim'], '%Y-%m-%d').date()
                    numero_parcelas = int(api_data['numero_parcelas'])
                except (ValueError, KeyError) as e:
                    raise forms.ValidationError(f"Dados inválidos retornados pela API: {str(e)}")
                
                # Valida consistência das datas
                if vigencia_inicio >= vigencia_fim:
                    raise forms.ValidationError("Data de início deve ser anterior à data de término")
                
                if numero_parcelas <= 0:
                    raise forms.ValidationError("Número de parcelas deve ser maior que zero")
                
                # Preenche campos com dados validados
                cleaned_data.update({
                    'titulo': api_data['titulo'],
                    'vigencia_inicio': vigencia_inicio,
                    'vigencia_fim': vigencia_fim,
                    'numero_parcelas': numero_parcelas
                })
                
                # Atualiza campos no formulário
                self.initial.update({
                    'titulo': cleaned_data['titulo'],
                    'vigencia_inicio': cleaned_data['vigencia_inicio'],
                    'vigencia_fim': cleaned_data['vigencia_fim'],
                    'numero_parcelas': cleaned_data['numero_parcelas']
                })
                
                if any(field in self.data for field in ['titulo', 'vigencia_inicio', 'vigencia_fim', 'numero_parcelas']):
                    self.data = self.data.copy()
                    self.data.update({
                        'titulo': cleaned_data['titulo'],
                        'vigencia_inicio': cleaned_data['vigencia_inicio'],
                        'vigencia_fim': cleaned_data['vigencia_fim'],
                        'numero_parcelas': cleaned_data['numero_parcelas']
                    })
                    
            except Exception as e:
                if hasattr(termo, 'arquivo') and termo.arquivo:
                    termo.arquivo.delete()
                if hasattr(termo, 'id'):
                    termo.delete()
                raise forms.ValidationError(f"Erro ao processar termo: {str(e)}")
                
        elif termo_outorga:
            cleaned_data['titulo'] = termo_outorga.nome
            cleaned_data['termo_path'] = termo_outorga.arquivo.name
            
            # Atualiza o campo título no formulário
            self.initial['titulo'] = termo_outorga.nome
            if 'titulo' in self.data:
                self.data = self.data.copy()
                self.data['titulo'] = termo_outorga.nome
            
        return cleaned_data
