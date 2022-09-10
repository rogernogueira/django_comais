from calendar import month
from multiprocessing import context
from urllib import response
from django.db import close_old_connections
from django.shortcuts import redirect, render
from django.http import HttpResponseRedirect, FileResponse
from .models import Ocorrencia, Contato, Projeto, Relatorio, TipoProjeto, Colaborador,Publicacao, Relatorio, ProjetoRelatorio 
from .forms import ContatoForm, OcorrenciaForm, ColaboradorForm, PublicacaoForm, ProjetoForm, RelatorioForm, ProjetoRelatorioForm
from django.core.paginator import Paginator
from django.db.models import Max
from django.contrib.auth.decorators import login_required
from django.core.files.storage import FileSystemStorage
from django.core import serializers
from django.conf import settings
from django.utils.dateparse import parse_date
import datetime
import os
from docxtpl import DocxTemplate, RichText
import html2markdown
from django.contrib import messages
import re


def stripHTMLTags(html):
    text = html
    rules = [
        {r'>\s+': '>'},                                # Remove spaces after a tag opens or closes.
        {r'\s+': ' '},                                 # Replace consecutive spaces.
        {r'\s*<br\s*/?>\s*': '\n'},                    # Newline after a <br>.
        {r'</(div)\s*>\s*': '\n'},                     # Newline after </p> and </div> and <h1/>.
        {r'</(p|h\d)\s*>\s*': '\n\n'},                 # Newline after </p> and </div> and <h1/>.
        {r'<head>.*<\s*(/head|body)[^>]*>': ''},       # Remove <head> to </head>.
        {r'<a\s+href="([^"]+)"[^>]*>.*</a>': r'\1'},   # Show links instead of texts.
        {r'[ \t]*<[^<]*?/?>': ''},                     # Remove remaining tags.
        {r'^\s+': ''}                                  # Remove spaces at the beginning.
    ]
    for rule in rules:
        for (k, v) in rule.items():
            try:
                regex = re.compile(k)
                text = str(regex.sub(v, text))
            except:
                pass
    htmlspecial = {
        '&nbsp;': ' ', '&amp;': '&', '&quot;': '"',
        '&lt;': '<', '&gt;': '>'
    }
    for (k, v) in htmlspecial.items():
        text = text.replace(k, v)
    return text

def last_day_of_month(any_day):
    # The day 28 exists in every month. 4 days later, it's always next month
    next_month = any_day.replace(day=28) + datetime.timedelta(days=4)
    # subtracting the number of the current day brings us back one month
    return next_month - datetime.timedelta(days=next_month.day)


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
    contatos = Contato.objects.all().order_by('nome')
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
    publicacoes = Publicacao.objects.all().order_by('-ano')
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
    
    return render(request,'home.html', {'form':form, 'submitted':submitted, 'tipos':tipos, 'projetos':projetos, 
                  'colaboradores':colaboradores, 'publicacoes':publicacoes})

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
    publicacoes = Publicacao.objects.filter(user=request.user).order_by('-ano')
    p = Paginator(publicacoes, 3)
    page = request.GET.get('page')
    publicacoes = p.get_page(page)
    return render(request,'gerencia_publicacoes.html', {'publicacoes':publicacoes})

@login_required
def gerencia_projetos(request):
    projetos = Projeto.objects.filter(user=request.user).order_by("-id")
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
def editar_projeto_relatorio(request, id_projeto_relatorio):
    submitted=False
    projeto = ProjetoRelatorio.objects.get(id=id_projeto_relatorio)
    
    if request.user.id == projeto.user.id:
        if request.method == 'POST':
            form = ProjetoRelatorioForm(request.POST or None, request.FILES or None, instance=projeto)
            if form.is_valid():
                form.save()
                messages.success(request, "Projeto atualizado com sucesso" )
                return HttpResponseRedirect('/gerencia_relatorios')
        if 'submitted' in request.GET:
            submitted = True
        form = ProjetoRelatorioForm(request.POST or None, instance=projeto)    
        return render(request,'editar_projeto_relatorio.html', {'form':form, 'projeto':projeto, 'submitted':submitted})
    else:
        return HttpResponseRedirect('/gerencia_relatorios')



@login_required
def editar_relatorio(request, id_relatorio):
    submitted= False
    relatorio = Relatorio.objects.get(id=id_relatorio)
    if request.user.id == relatorio.projeto.user.id:
        if request.method == 'POST':
            form = RelatorioForm(request.POST or None, request.FILES or None, instance=relatorio)
            if form.is_valid():
                form.save()
                return HttpResponseRedirect(f'/editar_relatorio/{id_relatorio}?submitted=True')
        else:
            form = RelatorioForm(request.POST or None, instance=relatorio)
            
            if 'submitted' in request.GET:
                submitted = True
            return render(request,'editar_relatorio.html', {'form':form, 'relatorio':relatorio, 'submitted':submitted})
    else:
        return HttpResponseRedirect('/gerencia_relatorios')


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

@login_required
def gerar_relatorio(request, id_relatorio):
    month_name = {
            '1': 'janeiro',
            '2': 'fevereiro',
            '3': 'março',
            '4': 'abril',
            '5': 'maio',
            '6': 'junho',
            '7': 'julho',
            '8': 'agosto',
            '9': 'setembro',
            '10': 'outubro',
            '11': 'novembro',
            '12': 'dezembro'        
        }
    relatorio = Relatorio.objects.get(id=id_relatorio)
    print("cheguei aqui")
    doc = DocxTemplate(relatorio.projeto.template)
    vigencia_inicio =relatorio.projeto.vigencia_inicio
    
    contexto = {
        'titulo': relatorio.projeto.titulo,
        'nome': f'{relatorio.projeto.user.first_name} {relatorio.projeto.user.last_name}',
        'vigencia_inicio': relatorio.projeto.vigencia_inicio.strftime(settings.DATE_INPUT_FORMATS[0]),
        'vigencia_fim': relatorio.projeto.vigencia_fim.strftime(settings.DATE_INPUT_FORMATS[0]),
        'parcela': relatorio.parcela,
        'objetivo_proposto': RichText(html2markdown.convert(relatorio.projeto.objetivo_proposto)),
        'objetivo_proposto_obj':RichText(html2markdown.convert(relatorio.projeto.objetivo_proposto_obj)),
        'resultado':RichText(html2markdown.convert(stripHTMLTags(relatorio.resultado))),
        'informacao_adicional':RichText(html2markdown.convert(stripHTMLTags(relatorio.informacao_adicional))),
        'data_vigencia':f'{relatorio.data_vigencia.day} de {month_name[str(relatorio.data_vigencia.month)]} de {relatorio.data_vigencia.year}',
        'data_assinatura':relatorio.data_assinatura.strftime(settings.DATE_INPUT_FORMATS[0]),        
    }
    
    doc.render(contexto, autoescape=True)
    dir_docs = os.path.join(settings.MEDIA_ROOT, 'docs')
    file = f"{relatorio.parcela}-{month_name[str(relatorio.data_vigencia.month)]}-{relatorio.projeto.titulo[:40]}.docx"
    path = os.path.join(dir_docs, file)
    doc.save(path)
    relatorio.doc = 'docs' + '/' + file
    relatorio.save()
    return FileResponse(open(path, 'rb'), content_type='application/vnd.openxmlformats-officedocument.wordprocessingml.document')
    #return render(request,'gerar_relatorio.html', {'relatorio':relatorio})
    
@login_required
def gerencia_relatorios(request):
    projetos = ProjetoRelatorio.objects.filter(user=request.user).order_by('-vigencia_fim')
    p = Paginator(projetos, 3)
    page = request.GET.get('page')
    projetos = p.get_page(page)
    
    for projeto in projetos:
        projeto.qtd_relatorios = Relatorio.objects.filter(projeto=projeto).count()
        if  projeto.qtd_relatorios >0:
           projeto.ultima_parcela = Relatorio.objects.filter(projeto=projeto).order_by('-parcela').first().parcela
        else:
           projeto.ultima_parcela = "Não iniciado"
        projeto.relatorios = Relatorio.objects.filter(projeto=projeto)
            
    return render(request,'gerencia_relatorios.html', {'projetos':projetos})


@login_required
def cadastrar_relatorio(request, id_projeto_relatorio):
    #calculando mês anterior
    submitted= False
    mes, ano = (datetime.datetime.now().month-1,datetime.datetime.now().year) if datetime.datetime.now().month-1 > 0 else (12, datetime.datetime.now().year-1)
    data_anterior = datetime.datetime(ano, mes, 1)
    hoje=datetime.datetime.now().strftime('%Y-%m-%d')
    submitted = False
    ultimo_relatorio = Relatorio.objects.filter(projeto=id_projeto_relatorio).order_by('-parcela').first()
    projeto=ProjetoRelatorio.objects.get(id=id_projeto_relatorio)
    if request.method == 'POST':
      form = RelatorioForm(request.POST,request.FILES)  
      form.instance.projeto = projeto
      if form.is_valid():                   
            form.save()
            return HttpResponseRedirect(f'/cadastrar_relatorio/{id_projeto_relatorio}?submitted=True')
    else:
        if projeto.dia_entrega == 0:
            ultimo_dia_mes =last_day_of_month(data_anterior)
        else:
            ultimo_dia_mes = datetime.datetime(ano, mes,int(projeto.dia_entrega))
        if ultimo_relatorio:
            sugestao_parcela = ultimo_relatorio.parcela + 1
        else:
            sugestao_parcela =1
        form = RelatorioForm(data={
            'resultado': 'Adicionar os resultados obtidos mês anterior.',
            'parcela':sugestao_parcela, 
            'data_vigencia':ultimo_dia_mes,
            'data_assinatura':hoje,
            })
        if 'submitted' in request.GET:
            submitted = True
            id_relatorio = Relatorio.objects.filter(projeto=id_projeto_relatorio).last().id
        else:
            id_relatorio=''
    return render(request,'cadastrar_relatorio.html', {'form':form, 'submitted':submitted,
                                                       'id_relatorio': id_relatorio, 'ultimo_relatorio':ultimo_relatorio, 
                                                       'projeto':projeto})
     
@login_required
def cadastrar_projeto_relatorio(request):
    submitted = False
    if request.method == 'POST':
      form = ProjetoRelatorioForm(request.POST,request.FILES)  
      form.instance.user = request.user
      if form.is_valid():
            form.save(commit=False)
            form.user = request.user         
            form.save()
            return HttpResponseRedirect('/gerencia_relatorios?submitted=True')
      else:
          print(form.errors.as_json())  
    else:
        form = ProjetoRelatorioForm()
        if 'submitted' in request.GET:
            submitted = True 
    return render(request,'cadastrar_projeto_relatorio.html', {'form':form, 'submitted':submitted})
@login_required
def deletar_projeto_relatorio(request, id_projeto_relatorio):
    if request.user == ProjetoRelatorio.objects.get(id=id_projeto_relatorio).user:
        projeto_relatorio = ProjetoRelatorio.objects.get(id=id_projeto_relatorio)
        projeto_relatorio.delete()
        messages.success(request, 'Projeto excluído com sucesso!')
        return HttpResponseRedirect('/gerencia_relatorios')
    else:
        messages.warning(request, 'Você não tem permissão para excluir este projeto!')
@login_required
def deletar_relatorio(request, id_relatorio):
    relatorio = Relatorio.objects.get(id=id_relatorio)
    if request.user == relatorio.projeto.user:
        relatorio.delete()
        messages.success(request, 'Relatório excluído com sucesso!')
        return HttpResponseRedirect('/gerencia_relatorios')
    else:
        messages.warning(request, 'Você não tem permissão para excluir este projeto!')