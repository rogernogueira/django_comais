from textwrap import dedent
from calendar import month
from django.http import JsonResponse
from urllib import response
from django.db import close_old_connections
from django.shortcuts import redirect, render
from django.http import HttpResponseRedirect, FileResponse
from .models import Ocorrencia, Contato, Projeto, Relatorio, TipoProjeto, Colaborador,Publicacao,\
Relatorio, ProjetoRelatorio , RelatorioFinal, Templates, Curso, Imagem, TermoOutorga,\
DocumentosColaborador, TipoDocumento
from .forms import ContatoForm, OcorrenciaForm, ColaboradorForm, PublicacaoForm,\
ProjetoForm, RelatorioForm, ProjetoRelatorioForm, RelatorioFinalForm, CursoForm, \
TermoOutorgaForm, DocumentosColaboradorForm, TipoDocumentoForm
from django.core.paginator import Paginator
from django.db.models import Max, BaseConstraint
from django.contrib.auth.decorators import login_required
from django.core.files.storage import FileSystemStorage
from django.core import serializers
from .serializers import ImagemSerializer, DadosCampoSerializer
from django.core.exceptions import ValidationError
from django.conf import settings
from django.utils.dateparse import parse_date
import datetime
from rest_framework import generics, permissions, viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
import os
from docxtpl import DocxTemplate, RichText
import html2markdown
from django.contrib import messages
import re
from agno.agent import Agent
from agno.models.deepseek import DeepSeek



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

def regressao_linear(request):
    return render(request, 'playground/RegressaoLinear.html')
def regressao_logistica(request):
    return render(request, 'playground/regressaologistica.html')
def svm(request):
    return render(request, 'playground/svm.html')
def arvore(request):
    return render(request, 'playground/arvore.html')
def knn(request):
    return render(request, 'playground/knn.html')
def kmeans(request):
    return render(request, 'playground/kmeans.html')
def nn(request):
    return render(request, 'playground/nn.html')
def gd(request):
    return render(request, 'playground/gd.html')
def painel(request):
    return render(request, 'playground/painel.html')

def instrucoes(request):
    return render(request, 'instrucoes.html')
def  contato(request):
    if request.method == 'POST':
        form = ContatoForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, 'Sua manifestação foi enviado com sucesso, obrigado pelo contato!')

            return HttpResponseRedirect('/#contato')
    else:        
        return render(request,'contato_form.html', {'form':form})

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
        messages.success(request, 'Contato atualizado com sucesso!')
        return HttpResponseRedirect('/update_contatos_list')
    return render(request,'update_contato.html', {'form':form})

def download(request):
    filepath = os.path.join(settings.MEDIA_ROOT, 'docs', 'edital.pdf')
    path = open(filepath, 'rb')
    # Set the mime type
    response = FileResponse(path)
    return response
            
def download_inscritos(request):
    filepath = os.path.join(settings.MEDIA_ROOT, 'docs', 'inscritos.pdf')
    path = open(filepath, 'rb')
    # Set the mime type
    response = FileResponse(path)
    return response

def download_config(request):
    filepath = os.path.join(settings.MEDIA_ROOT, 'docs', 'config.pdf')
    path = open(filepath, 'rb')
    # Set the mime type
    response = FileResponse(path)
    return response

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
            messages.success(request, 'Ocorrência registrada com sucesso!')
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
            messages.success(request, 'Sua manifestação foi enviado com sucesso, obrigado pelo contato!')
            return HttpResponseRedirect('/#contact')
    else:
        form = ContatoForm
        if 'submitted' in request.GET:
            submitted = True
    
    cursos = Curso.objects.all()
    return render(request,'home.html', {'form':form, 'submitted':submitted, 'tipos':tipos, 'projetos':projetos, 
                  'colaboradores':colaboradores, 'publicacoes':publicacoes, 'cursos':cursos})

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
            messages.success(request, 'Perfil atualizado com sucesso!')
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
                messages.success(request, 'Publicação atualizada com sucesso!')
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
        messages.success(request, 'Publicação excluída com sucesso!')
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
                messages.success(request, 'Projeto atualizado com sucesso!')
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
            if form.check_rules_update(id_relatorio):
                form.save()
                messages.success(request, "Relatório atualizado com sucesso" )
                return HttpResponseRedirect(f'/editar_relatorio/{id_relatorio}?submitted=True')
            else:
                return render(request,'editar_relatorio.html', {'form':form, 'relatorio':relatorio, 'submitted':submitted})
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
        messages.success(request, 'Projeto excluído com sucesso!')
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
            messages.success(request, 'Publicação cadastrada com sucesso!')
            return HttpResponseRedirect('/cadastrar_publicacao?submitted=True')
    else:
        form = PublicacaoForm()
        if 'submitted' in request.GET:
            submitted = True
        
    return render(request,'cadastrar_publicacao.html', {'form':form, 'submitted':submitted})
@login_required
def cadastrar_termo(request):
    submitted = False
    if request.method == 'POST':
      form = TermoOutorgaForm(request.POST ,request.FILES ) 
      if form.is_valid():
            form.save(commit=False)        
            form.save()
            form.instance
            messages.success(request, 'Termo cadastrado com sucesso!')
    
            return HttpResponseRedirect(f'/cadastrar_projeto_relatorio?id_termo={form.instance.id}', )
    else:
        form =TermoOutorgaForm()
        if 'submitted' in request.GET:
            submitted = True
        
    return render(request,'pre_cadastro_projeto_relatorio.html', {'form':form, 'submitted':submitted})

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
            messages.success(request, 'Projeto salvo com sucesso!')
            return HttpResponseRedirect('/cadastrar_projeto?submitted=True')
    else:
        form = ProjetoForm()
        if 'submitted' in request.GET:
            submitted = True
        
    return render(request,'cadastrar_projeto.html', {'form':form,  'submitted':submitted})

@login_required
def gerar_relatorio(request, id_relatorio):
    relatorio = Relatorio.objects.get(id=id_relatorio)  
    
    
    if not relatorio.projeto.template_default:
        if not os.path.exists(relatorio.projeto.template.path):
            messages.error(request, 'Template não encontrado!')
            return HttpResponseRedirect('/gerencia_relatorios')
        template = relatorio.projeto.template
    else:
        template = Templates.objects.get(nome='RTP').template
    if request.user.id == relatorio.projeto.user.id:
        doc = DocxTemplate(template)
        vigencia_inicio =relatorio.projeto.vigencia_inicio
        contexto = {
            'titulo': relatorio.projeto.titulo,
            'nome': f'{relatorio.projeto.user.first_name} {relatorio.projeto.user.last_name}',
            'vigencia_inicio': relatorio.projeto.vigencia_inicio.strftime(settings.DATE_INPUT_FORMATS[0]),
            'vigencia_fim': relatorio.projeto.vigencia_fim.strftime(settings.DATE_INPUT_FORMATS[0]),
            'parcela': relatorio.parcela,
            'objetivo_proposto': RichText(html2markdown.convert(stripHTMLTags(relatorio.projeto.objetivo_proposto))),
            'objetivo_proposto_obj':RichText(html2markdown.convert(stripHTMLTags(relatorio.projeto.objetivo_proposto_obj))),
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
        messages.success(request, 'Relatório gerado com sucesso!')
        
    return FileResponse(open(path, 'rb'), content_type='application/vnd.openxmlformats-officedocument.wordprocessingml.document')
    return HttpResponseRedirect('/gerencia_relatorios')

# Views para Cursos
@login_required
def listar_cursos(request):
    cursos = Curso.objects.all()
    return render(request, 'cursos/listar.html', {'cursos': cursos})

@login_required    
def criar_curso(request):
    if request.method == 'POST':
        form = CursoForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, 'Curso criado com sucesso!')
            return redirect('listar_cursos')
    else:
        form = CursoForm()
    return render(request, 'cursos/form.html', {'form': form})

@login_required
def editar_curso(request, id):
    curso = Curso.objects.get(id=id)
    if request.method == 'POST':
        form = CursoForm(request.POST, instance=curso)
        if form.is_valid():
            form.save()
            messages.success(request, 'Curso atualizado com sucesso!')
            return redirect('listar_cursos')
    else:
        form = CursoForm(instance=curso)
    return render(request, 'cursos/form.html', {'form': form})

@login_required    
def deletar_curso(request, id):
    curso = Curso.objects.get(id=id)
    curso.delete()
    messages.success(request, 'Curso removido com sucesso!')
    return redirect('listar_cursos')

def detalhes_curso(request, id):
    curso = Curso.objects.get(id=id)
    return render(request, 'cursos/detalhes.html', {'curso': curso})

def galeria(request):
    imagens = Imagem.objects.all().order_by('-data_criacao')
    p = Paginator(imagens, 12)
    page = request.GET.get('page')
    imagens = p.get_page(page)
    return render(request, 'galeria.html', {'imagens': imagens})

def galeria_moderna(request):
    imagens = Imagem.objects.all().order_by('-data_criacao')
    p = Paginator(imagens, 12)
    page = request.GET.get('page')
    imagens = p.get_page(page)
    return render(request, 'galeria_moderna.html', {'imagens': imagens})

def galeria_moderna(request):
    imagens = Imagem.objects.all().order_by('-data_criacao')
    p = Paginator(imagens, 12)
    page = request.GET.get('page')
    imagens = p.get_page(page)
    return render(request, 'galeria.html', {'imagens': imagens})
    
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
           projeto.percentual= f'{projeto.qtd_relatorios/projeto.numero_parcelas*100:.2f}'
        else:
           projeto.ultima_parcela = "Não iniciado"
           projeto.percentual=0
        try:
            relatorio_final = RelatorioFinal.objects.get(projeto=projeto)
            if relatorio_final.doc:
                projeto.relatorio_final = relatorio_final.doc
        except RelatorioFinal.DoesNotExist:
            relatorio_final = None   
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
    id_relatorio=''
    if request.method == 'POST':
      form = RelatorioForm(request.POST,request.FILES)  
      form.instance.projeto = projeto    
      if form.check_rules_new():
            form.save()    
            messages.success(request, 'Relatório salvo com sucesso!')
            return HttpResponseRedirect(f'/cadastrar_relatorio/{id_projeto_relatorio}?submitted=True')
    else: 
        if 'submitted' in request.GET:
            submitted = True
            id_relatorio = Relatorio.objects.filter(projeto=id_projeto_relatorio).last().id
            form=''
            ultimo_relatorio=''
            
        else:
            id_relatorio=''
            if projeto.dia_entrega == 0:
                ultimo_dia_mes =last_day_of_month(data_anterior)
            else:
                ultimo_dia_mes = datetime.datetime(ano, mes,int(projeto.dia_entrega))
            if ultimo_relatorio:
                sugestao_parcela = ultimo_relatorio.parcela + 1
            else:
                sugestao_parcela =1
            form = RelatorioForm(initial={
                
                'parcela':sugestao_parcela, 
                'data_vigencia':ultimo_dia_mes,
                'data_assinatura':hoje,
                })
       
    return render(request,'cadastrar_relatorio.html', {'form':form, 'submitted':submitted,
                                                       'id_relatorio': id_relatorio, 'ultimo_relatorio':ultimo_relatorio, 
                                                       'projeto':projeto})
     
@login_required
def cadastrar_projeto_relatorio(request):
    submitted = False
    if request.method == 'POST':
        form = ProjetoRelatorioForm(request.POST, request.FILES)
        form.instance.user = request.user
        if form.is_valid():
            projeto = form.save(commit=False)
            projeto.user = request.user
            projeto.save()
            messages.success(request, 'Projeto cadastrado com sucesso!')
            return HttpResponseRedirect('/gerencia_relatorios?submitted=True')
    else:
        form = ProjetoRelatorioForm()
        if 'submitted' in request.GET:
            submitted = True 
        id_termo = request.GET.get('id_termo')
        if id_termo:
            termo = TermoOutorga.objects.get(id=id_termo)
            form = ProjetoRelatorioForm(initial={
                'titulo': termo.titulo,
                'vigencia_inicio': termo.vigencia_inicio,
                'vigencia_fim': termo.vigencia_fim,
                'numero_parcelas': termo.numero_parcelas,
                'objetivo_proposto':termo.objetivo_proposto, 
                'objetivo_proposto_obj': termo.objetivo_proposto_obj,
                'resultado_esperado': termo.resultado_esperado,
                'termo_outorga': termo,
            })
    return render(request,'cadastrar_projeto_relatorio.html', {'form':form, 'submitted':submitted })


@login_required
def cadastrar_documento(request):
    submitted = False
    if request.method == 'POST':
        form = DocumentosColaboradorForm(request.POST, request.FILES)
        form.instance.user = request.user
        if form.is_valid():
            documento = form.save(commit=False)
            documento.user = request.user
            documento.save()
            messages.success(request, 'Documento cadastrado com sucesso!')
            return HttpResponseRedirect('/gerencia_documentos?submitted=True')
    else:
        form = DocumentosColaboradorForm()
        if 'submitted' in request.GET:
            submitted = True 
       
    return render(request,'cadastrar_documento.html', {'form':form, 'submitted':submitted })

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
        

@login_required
def cadastrar_relatorio_final(request, id_projeto_relatorio):
    submitted= False
    id_relatorio=''
 
    if not RelatorioFinal.objects.filter(projeto=id_projeto_relatorio).exists():
        mes, ano = (datetime.datetime.now().month-1,datetime.datetime.now().year) if datetime.datetime.now().month-1 > 0 else (12, datetime.datetime.now().year-1)
        data_anterior = datetime.datetime(ano, mes, 1)
        hoje=datetime.datetime.now().strftime('%Y-%m-%d')
        submitted = False
        ultimo_relatorio = Relatorio.objects.filter(projeto=id_projeto_relatorio).order_by('-parcela').first()
        projeto=ProjetoRelatorio.objects.get(id=id_projeto_relatorio)
        if request.method == 'POST':
            form = RelatorioFinalForm(request.POST,request.FILES)  
            form.instance.projeto = projeto
            
            if form.check_rules():                   
                form.save() 
                messages.success(request, 'Relatório final cadastrado com sucesso!')
                return HttpResponseRedirect(f'/cadastrar_relatorio_final/{id_projeto_relatorio}?submitted=True')
        else:
            if projeto.dia_entrega == 0:
                ultimo_dia_mes =last_day_of_month(data_anterior)
            else:
                ultimo_dia_mes = datetime.datetime(ano, mes,int(projeto.dia_entrega))
            
            form = RelatorioFinalForm(initial={
                'data_vigencia':ultimo_dia_mes,
                'data_assinatura':hoje,
                })
            if 'submitted' in request.GET:
                submitted = True
                id_relatorio = RelatorioFinal.objects.get(projeto=id_projeto_relatorio).id
            else:
                id_relatorio=''
        return render(request,'cadastrar_relatorio_final.html', {'form':form, 'submitted':submitted,
                                                        'id_relatorio': id_relatorio, 'ultimo_relatorio':ultimo_relatorio, 
                                                            'projeto':projeto})
    else:
        relatorio = RelatorioFinal.objects.get(projeto=id_projeto_relatorio)
        if request.user.id == relatorio.projeto.user.id:
            if request.method == 'POST':
                form = RelatorioFinalForm(request.POST or None, request.FILES or None, instance=relatorio)
                if form.check_rules():
                    form.save()
                    messages.success(request, 'Relatório final atualizado com sucesso!')
                    return HttpResponseRedirect(f'/cadastrar_relatorio_final/{id_projeto_relatorio}?submitted=True')
            else:
                form = RelatorioFinalForm(request.POST or None, instance=relatorio)
                if 'submitted' in request.GET:
                    submitted = True
                id_relatorio = RelatorioFinal.objects.get(projeto=id_projeto_relatorio).id
                ultimo_relatorio = Relatorio.objects.filter(projeto=id_projeto_relatorio).order_by('-parcela').first()
                projeto=ProjetoRelatorio.objects.get(id=id_projeto_relatorio)
                return render(request,'cadastrar_relatorio_final.html', {'form':form, 'submitted':submitted,
                                                        'id_relatorio': id_relatorio, 'ultimo_relatorio':ultimo_relatorio, 
                                                            'projeto':projeto})
        else:
            return HttpResponseRedirect('/gerencia_relatorios')

def gerar_relatorio_final(request, id_relatorio):   
    relatorio = RelatorioFinal.objects.get(id=id_relatorio)
    if request.user.id == relatorio.projeto.user.id:
        template = Templates.objects.get(nome='Relatório Final')
        doc = DocxTemplate(template.template)
      
        contexto = {
            'titulo': relatorio.projeto.titulo,
            'nome': relatorio.projeto.user.first_name+' '+ relatorio.projeto.user.last_name,
            'vigencia_inicio': relatorio.projeto.vigencia_inicio.strftime(settings.DATE_INPUT_FORMATS[0]),
            'vigencia_fim': relatorio.projeto.vigencia_fim.strftime(settings.DATE_INPUT_FORMATS[0]),
            'dia': relatorio.data_vigencia.day,
            'mes': month_name[str(relatorio.data_vigencia.month)],
            'ano': str(relatorio.data_vigencia.year)[2:],
            'dia_entrega': relatorio.data_assinatura.day,
            'mes_entrega': relatorio.data_assinatura.month,
            'ano_entrega': relatorio.data_assinatura.year,
            'objetivos_principais': RichText(html2markdown.convert(relatorio.objetivos_principais)),
            'principais_obstaculos': RichText(html2markdown.convert(relatorio.principais_obstaculos)),
            'resultados_esperados_alcancados':RichText(html2markdown.convert(relatorio.resultados_esperados_alcancados)),
            'informacao_adicional':RichText(html2markdown.convert(relatorio.informacao_adicional)),
            'conclusoes':RichText(html2markdown.convert(relatorio.conclusoes)),
            }
        doc.render(contexto, autoescape=True)
        dir_docs = os.path.join(settings.MEDIA_ROOT, 'docs')
        file = f"Relatorio_final - {relatorio.projeto.titulo[:40]}.docx"
        path = os.path.join(dir_docs, file)
        doc.save(path)
        relatorio.doc = 'docs' + '/' + file
        relatorio.save()
        messages.success(request, 'Relatório Final gerado com sucesso!')
        
        return FileResponse(open(path, 'rb'), content_type='application/vnd.openxmlformats-officedocument.wordprocessingml.document')
    return HttpResponseRedirect('/gerencia_relatorios')

class ImagemViewSet(viewsets.ModelViewSet):
    serializer_class = ImagemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Imagem.objects.filter(usuario=self.request.user)
    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)

@login_required
def cadastra_tipo_documentos(request):
    if request.method == 'POST':
        form = TipoDocumentoForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, 'Tipo de documento cadastrado com sucesso!')
            return HttpResponseRedirect('/gerencia_tipo_documentos')
    else:
        form = TipoDocumentoForm()
    return render(request, 'cadastrar_tipo_documento.html', {'form': form})

@login_required
def deletar_tipo_documentos(request, id):
    try:
        tipo_documento = TipoDocumento.objects.get(id=id)
        tipo_documento.delete()
        messages.success(request, 'Tipo de documento excluído com sucesso!')
    except TipoDocumento.DoesNotExist:
            messages.error(request, 'Tipo de documento não encontrado.')
    return HttpResponseRedirect('/gerencia_tipo_documentos')

@login_required
def editar_tipo_documento(request, id):
    try:
        tipo_documento = TipoDocumento.objects.get(id=id)
    except TipoDocumento.DoesNotExist:
        messages.error(request, 'Tipo de documento não encontrado.')
        return HttpResponseRedirect('/gerencia_tipo_documentos')

    if request.method == 'POST':
        form = TipoDocumentoForm(request.POST, request.FILES, instance=tipo_documento)
        if form.is_valid():
            form.save()
            messages.success(request, 'Tipo de documento atualizado com sucesso!')
            return HttpResponseRedirect('/gerencia_tipo_documentos')
    else:
        form = TipoDocumentoForm(instance=tipo_documento)

    return render(request, 'editar_tipo_documento.html', {'form': form, 'tipo_documento': tipo_documento})

    
@login_required
def gerencia_tipo_documentos(request):
    tipos_documentos = TipoDocumento.objects.all()
    todos_tipos = TipoDocumento.objects.all()
    p = Paginator(tipos_documentos, 4)
    page = request.GET.get('page')
    tipos_documentos = p.get_page(page)
    return render(request, 'gerencia_tipo_documentos.html', {'tipos_documentos': tipos_documentos, 'todos_tipos': todos_tipos})


@login_required
def gerencia_documentos(request):
    # Obter todos os tipos de documentos existentes para o usuário ANTES da paginação
    tipos_documentos = TipoDocumento.objects.all()
    
    # Paginar os documentos
    documentos = DocumentosColaborador.objects.filter(user=request.user).order_by('-post_date')
    
    ids_cadastrados = [doc.tipo_documento.id for doc in documentos]
    p = Paginator(documentos, 4)
    page = request.GET.get('page')
    documentos = p.get_page(page)
    
    return render(request, 'gerencia_documentos.html', {
        'documentos': documentos,
        'tipos_documentos': tipos_documentos,
        'ids_cadastrados': ids_cadastrados ,
    })

class GeraCampusView(APIView):
    def post(self, request):
        # Verificar se o texto foi enviado
        texto = request.data.get('texto')
        data = request.data.get('data')
        exemplo = request.data.get('exemplo')
       
        
        if not texto:
            return Response(
                {'error': 'Nenhum texto enviado'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Configurar o agente de IA
        agent_extract = Agent(
            model=DeepSeek(),
            description="Você é um assistente de IA que gera textos para projetos de pesquisa e extensão.",
            instructions=dedent(f"""\
                                
            Com base no exemplo: {exemplo}
            Siga as instruções: {texto}
            Gere um novo texto considerando:
           
            - Data do relatório: {data}
        
            """),
            use_json_mode=True,
        )

        try:
            # Processar o texto com o agente
            resultado = agent_extract.run(texto)
            return Response({
                'texto_gerado': resultado.content,
                'status': 'sucesso'
            })
        except Exception as e:
            return Response(
                {'error': f'Erro ao processar o texto: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

def tipo_documento(request, id):
    print(id)
    tipo_documento = TipoDocumento.objects.get(id=id)
    return JsonResponse({
        'id': tipo_documento.id,
        'nome': tipo_documento.nome,
        'declaracao': tipo_documento.declaracao, 
        'template': tipo_documento.template.url if tipo_documento.template else None,
    })

@login_required
def gerar_documento(request, id):
    colaborador = Colaborador.objects.get(user=request.user)  # Garante que o usuário é um colaborador

    try:
        tipo_documento = TipoDocumento.objects.get(id=id)
    except TipoDocumento.DoesNotExist:
        messages.error(request, 'Tipo de documento não encontrado!')
        return HttpResponseRedirect('/gerencia_tipo_documentos')

    if not tipo_documento.template:
        messages.error(request, 'Template não encontrado!')
        return HttpResponseRedirect('/gerencia_tipo_documentos')

    # Carrega o template DOCX
    doc = DocxTemplate(tipo_documento.template)

    # Preenche o contexto com os dados necessários
    hoje = datetime.datetime.now()
    context = {
        'nome': colaborador.name,
        'data': hoje.strftime('%d/%m/%Y'),
        'matricula': colaborador.matricula,
        'cpf': colaborador.cpf,
        'dia': hoje.strftime('%d'),
        'mes': month_name[str(hoje.month)],
        'ano': hoje.strftime('%Y'),
    }

    # Renderiza o template
    doc.render(context)

    # Define caminho de salvamento
    dir_docs = os.path.join(settings.MEDIA_ROOT, 'docs')
    os.makedirs(dir_docs, exist_ok=True)  # Garante que o diretório existe

    file_name = f"{tipo_documento.nome.replace(' ', '_')}_{request.user.id}.docx"
    file_path = os.path.join(dir_docs, file_name)
    
    # Salva o arquivo
    doc.save(file_path)

    # Retorna o arquivo gerado para download
    return FileResponse(open(file_path, 'rb'), as_attachment=True, filename=file_name)