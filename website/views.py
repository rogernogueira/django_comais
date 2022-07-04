from django.shortcuts import render
from django.http import HttpResponseRedirect
from .models import Ocorrencia, Contato
from .forms import ContatoForm, OcorrenciaForm
from django.core.paginator import Paginator
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
    return render(request,'home.html', {})
