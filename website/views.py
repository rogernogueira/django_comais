from django.db import close_old_connections
from django.shortcuts import redirect, render
from django.http import HttpResponseRedirect
from .models import Ocorrencia, Contato, Projeto, TipoProjeto, Colaborador,Publicacao 
from .forms import ContatoForm, OcorrenciaForm, ColaboradorForm, PublicacaoForm, ProjetoForm
from django.core.paginator import Paginator
from django.contrib.auth.decorators import login_required
from django.core.files.storage import FileSystemStorage



def  contato(request):
    submitted = False
    if request.method == 'POST':
        form = ContatoForm(request.POST)
        if form.is_valid():
            form.save()
            return HttpResponseRedirect('/contato?submitted=True')
    else:
        form = ContatoForm
        if 'submitted' in request.GET:
            submitted = True
        
    return render(request,'contato_form.html', {'form':form, 'submitted':submitted})

def index(request):
    return render(request,'index.html', {})

def contatos(request):
    contatos = Contato.objects.all()
    return render(request,'contatos_list.html', {'contatos':contatos})

def sobre(request):
    return render(request,'sobre.html', {})

def ocorrencias(request):
    ocorrencias = Ocorrencia.objects.all()
    return render(request,'ocorrencias_list.html', {'ocorrencias':ocorrencias})

def show_contatos(request,id_contato):
    contato = Contato.objects.get(id=id_contato)
    return render(request,'show_contato.html', {'contato':contato})

def show_projeto(request,id_projeto):
    projeto = Projeto.objects.get(id=id_projeto)
    return render(request,'show_projeto.html', {'projeto':projeto})

def busca_contatos(request):
    if request.method == 'POST':
        nome = request.POST['nome']
        contatos = Contato.objects.filter(nome__icontains=nome)
        return render(request,'busca_contatos.html', {'contatos':contatos, 'nome':nome})

def update_contatos_list(request):
    contatos = Contato.objects.all()
    p = Paginator(contatos, 2)
    page = request.GET.get('page')
    contatos = p.get_page(page)
    return render(request,'update_contatos_list.html', {'contatos':contatos})
    

def update_contato(request, id_contato):
    contato = Contato.objects.get(id=id_contato)
    form = ContatoForm(request.POST or None, instance=contato)
    if form.is_valid():
        form.save()
        return HttpResponseRedirect('/update_contatos_list')
    return render(request,'update_contato.html', {'form':form})

@login_required
def delete_contato(request, id_contato):
    contato = Contato.objects.get(id=id_contato)
    contato.delete()
    return HttpResponseRedirect('/update_contatos_list')    

def registro_ocorrencias(request):
    submitted = False
    if request.method == 'POST':
      form = OcorrenciaForm(request.POST)  
      if form.is_valid():
            form.save()
            return HttpResponseRedirect('/registro_ocorrencias?submitted=True')
    else:
        form = OcorrenciaForm
        if 'submitted' in request.GET:
            submitted = True
        
    return render(request,'registro_ocorrencia.html', {'form':form, 'submitted':submitted})
    
    
def home(request):
    tipos = TipoProjeto.objects.all()
    projetos = Projeto.objects.all()
    colaboradores = Colaborador.objects.all()
    submitted = False
    if request.method == 'POST':
        form = ContatoForm(request.POST)
        if form.is_valid():
            form.save()
            return HttpResponseRedirect('/home?submitted=True#contact')
    else:
        form = ContatoForm
        if 'submitted' in request.GET:
            submitted = True
    
    return render(request,'home.html', {'form':form, 'submitted':submitted, 'tipos':tipos, 'projetos':projetos, 'colaboradores':colaboradores})

@login_required
def update_perfil(request):
    try:
        colaborador = Colaborador.objects.get(user=request.user.id)
    except Colaborador.DoesNotExist:
        colaborador = Colaborador.objects.create(user=request.user)
    if request.method == 'POST':
        form = ColaboradorForm(request.POST or None, request.FILES or None, instance=colaborador)
        if form.is_valid():
            form.save()
            return HttpResponseRedirect('/perfil')
    
    form = ColaboradorForm(request.POST or None, instance=colaborador )    
    return render(request,'update_perfil.html', {'form':form, 'colaborador':colaborador})
     
    

@login_required
def gerencia_publicacoes(request):
    publicacoes = Publicacao.objects.filter(user=request.user)
    p = Paginator(publicacoes, 3)
    page = request.GET.get('page')
    publicacoes = p.get_page(page)
    return render(request,'gerencia_publicacoes.html', {'publicacoes':publicacoes})

@login_required
def gerencia_projetos(request):
    projetos = Projeto.objects.filter(user=request.user)
    p = Paginator(projetos, 3)
    page = request.GET.get('page')
    projetos = p.get_page(page)
    return render(request,'gerencia_projetos.html', {'projetos':projetos})

@login_required
def editar_publicacao(request, id_publicacao):
    if request.user.id == Publicacao.objects.get(id=id_publicacao).user.id:
        publicacao = Publicacao.objects.get(id=id_publicacao)
        if request.method == 'POST':
            form = PublicacaoForm(request.POST or None, request.FILES or None, instance=publicacao)
            if form.is_valid():
                form.save()
                return HttpResponseRedirect('/gerencia_publicacoes')
        form = PublicacaoForm(request.POST or None, instance=publicacao)
        return render(request,'editar_publicacao.html', {'form':form, 'publicacao':publicacao})
    else:
        return HttpResponseRedirect('/gerencia_publicacoes')

@login_required
def delete_publicacao(request,id_publicacao):
    if request.user.id == Publicacao.objects.get(id=id_publicacao).user.id:
        publicacao = Publicacao.objects.get(id=id_publicacao)
        publicacao.delete()
        return HttpResponseRedirect('/gerencia_publicacoes')
    else:
        return HttpResponseRedirect('/gerencia_publicacoes')

@login_required
def editar_projeto(request, id_projeto):
    if request.user.id == Projeto.objects.get(id=id_projeto).user.id:
        projeto = Projeto.objects.get(id=id_projeto)
        if request.method == 'POST':
            form = ProjetoForm(request.POST or None, request.FILES or None, instance=projeto)
            if form.is_valid():
                form.save()
                return HttpResponseRedirect('/gerencia_projetos')
        form = ProjetoForm(request.POST or None, instance=projeto)
        return render(request,'editar_projeto.html', {'form':form, 'projeto':projeto})
    else:
        return HttpResponseRedirect('/gerencia_projetos')

@login_required
def delete_projeto(request,id_projeto):
    if request.user.id == Projeto.objects.get(id=id_projeto).user.id:
        projeto = Projeto.objects.get(id=id_projeto)
        projeto.delete()
        return HttpResponseRedirect('/gerencia_projetos')
    else:
        return HttpResponseRedirect('/gerencia_projetos')

@login_required
def cadastrar_publicacao(request):
    submitted = False
    if request.method == 'POST':
      form = PublicacaoForm(request.POST ,request.FILES )  
      form.instance.user = request.user
      if form.is_valid():
            form.save(commit=False)
            form.user = request.user         
            form.save()
            return HttpResponseRedirect('/cadastrar_publicacao?submitted=True')
    else:
        form = PublicacaoForm()
        if 'submitted' in request.GET:
            submitted = True
        
    return render(request,'cadastrar_publicacao.html', {'form':form, 'submitted':submitted})

@login_required
def cadastrar_projeto(request):
    submitted = False
    if request.method == 'POST':
      form = ProjetoForm(request.POST,request.FILES)  
      form.instance.user = request.user
      if form.is_valid():
            form.save(commit=False)
            form.user = request.user         
            form.save()
            return HttpResponseRedirect('/cadastrar_projeto?submitted=True')
    else:
        form = ProjetoForm()
        if 'submitted' in request.GET:
            submitted = True
        
    return render(request,'cadastrar_projeto.html', {'form':form, 'submitted':submitted})