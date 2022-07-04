from django import forms
from django.forms import ModelForm
from .models import Contato, Ocorrencia, Usuario, Servico, Historico
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
                