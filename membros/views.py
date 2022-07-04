from django import forms
from django.shortcuts import render, redirect
# from django.contrib.auth.decorators import login_required
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.forms import UserCreationForm
from django.contrib import messages
from .forms import RegisterUserForm
from django.forms import ModelForm

# Create your views here.
def login_user(request):  
    if request.method=='POST':
        username = request.POST['username']
        password = request.POST['password']
        print('username: ', username)
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            messages.add_message(request, messages.SUCCESS, 'Bem vindo!')
            return redirect('home')
        else:
            messages.add_message(request, messages.WARNING, 'Usuário ou senha inválidos')
            return redirect('login-user')
    return render(request,'auth/login.html', {})

def logout_user(request):
    logout(request)
    messages.add_message(request, messages.SUCCESS, 'Logout realizado com sucesso!')
    return render(request,'index.html', {})

def register_user(request):
    if request.method == 'POST':  
        
        form = RegisterUserForm(request.POST)  
        if form.is_valid():  
            form.save()  
            messages.add_message(request, messages.SUCCESS, 'Usuário Registrado com sucesso!')
            return redirect('index')
        else:
            messages.add_message(request, messages.WARNING, 'Erro ao registrar usuário!')
    else:  
        form = RegisterUserForm()
    return render(request, 'auth/register_user.html', {'form': form})