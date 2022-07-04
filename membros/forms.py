from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
# create a form for the model Contato

class RegisterUserForm(UserCreationForm):
    username: forms.TextInput(attrs={'class': 'form-control'})
    first_name = forms.TextInput(attrs={'class': 'form-control'})
    email =  forms.EmailInput(attrs={'class': 'form-control'})
    password1 = forms.CharField( widget=forms.PasswordInput(attrs={'class': 'form-control'}))
    password2 = forms.CharField(widget=forms.PasswordInput(attrs={'class': 'form-control'}))
    class Meta:
        model = User
        fields = ('first_name','email','username', 'password1', 'password2', )
        labels = {'first_name':'Nome',
                   'username':'Usuário',
                  'email':'E-mail',
                  'password1':'Senha',
                  'password2':'Confirmação de senha',
                  }
        widgets = {
            'first_name' :forms.TextInput(attrs={'class': 'form-control'}),
            'username': forms.TextInput(attrs={'class': 'form-control'}),
            'email': forms.EmailInput(attrs={'class': 'form-control'}),
            'password1':forms.PasswordInput(attrs={'class': 'form-control'}),
            'password2':forms.PasswordInput(attrs={'class': 'form-control'}),            
                    }
        
   