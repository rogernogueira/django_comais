from pydoc import describe
from re import template
import django.utils
from django.db import models
from django.db.models import UniqueConstraint, BaseConstraint
from django.utils import timezone
from django.contrib.auth.models import User
import datetime

from tinymce import models as tinymce_models
from django.conf import settings

# configure timezone





STATUS_CHOICES = [('Aguardando', 'Aguardando'),
                  ('Em andamento', 'Em andamento'),
                  ('Concluído', 'Concluído'),
                  ('Cancelado', 'Cancelado'),
                  ]
class Servico(models.Model):
    nome = models.CharField(max_length=100)
    descricao = models.TextField()
    prioridade = models.IntegerField()
    def __str__(self):  
        return self.nome     
 
class Usuario(models.Model):
    nome = models.CharField('Nome',max_length=100)
    email = models.EmailField('Email',max_length=100)
    telefone = models.CharField('Telefone',max_length=100)
    def __str__(self):
        return self.nome  

class Contato(models.Model):
    nome = models.CharField('Nome',max_length=100)
    email = models.EmailField('Email',max_length=100)
    telefone = models.CharField('Telefone',max_length=100)
    cidade = models.CharField('Cidade',max_length=100)
    mensagem = models.TextField('Mensagem') 
    status = models.IntegerField('Status',default=0)
    
    def __str__(self):
        return self.nome  
      

class Ocorrencia(models.Model):
    solicitacao = models.CharField("Solicitação", max_length=120)
    tipo = models.CharField('Tipo da Solicitação ',max_length=100, blank=True, null=True)
    data_abertura = models.DateTimeField('Data da Abertura', auto_now_add=True)
    data_atendimento = models.DateTimeField('Data do Atendimento',  null=True, blank=True)
    data_encerramento = models.DateTimeField('Data do Encerramento',  null=True, blank=True )
    descricao = models.TextField('Descrição',blank=True, null=True)
    solicitante = models.ForeignKey(User, blank=True,null=True, on_delete=models.SET_NULL, related_name="solicitante")
    servico = models.ManyToManyField(Servico )
    atendente = models.ForeignKey(User,blank=True, null=True, on_delete=models.SET_NULL, related_name='atendente')
    def __str__(self):
        return self.solicitacao  
    

class TipoProjeto(models.Model):
    type = models.CharField(max_length=100)
    filter = models.CharField(max_length=30, blank=True, null=True, default='.filter-outros')
    def __str__(self) :
        return self.type
        
class Projeto(models.Model):
    name = models.CharField('Nome',max_length=100)
    client = models.CharField('Cliente',max_length=100, null=True, blank=True)
    title = models.CharField('Título',max_length=100)
    type = models.ManyToManyField(TipoProjeto)
    date = models.DateField('Data')
    url = models.URLField('URL',max_length=100)
    description = models.TextField('Descrição', blank=True, null=True)
    image1 = models.ImageField('Imagem 1', upload_to='images/', blank=True, null=True)
    image2 = models.ImageField('Imagem 2', upload_to='images/', blank=True, null=True)
    image3 = models.ImageField('Imagem 3', upload_to='images/', blank=True, null=True)
    user = models.ForeignKey(User, blank=True,null=True, on_delete=models.SET_NULL, related_name="user")
    
    def __str__(self):
        return self.name

class Colaborador(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, default=None)
    name = models.CharField('Nome',max_length=100)
    url_latters = models.URLField('URL',max_length=100)
    funcao = models.CharField('Função',max_length=100)
    url_twitter = models.URLField('URL twitter',max_length=100, null=True, blank=True)
    url_facebook = models.URLField('URL facebook',max_length=100, null=True, blank=True)
    url_instagram  = models.URLField('URL Instagram',max_length=100, null=True, blank=True)
    url_linkedin = models.URLField('URL linkedin',max_length=100, null=True, blank=True)
    foto = models.ImageField('foto', upload_to='images/', blank=True, null=True, default='images/default.png')
    post_date = models.DateTimeField('Data do Post',  default=django.utils.timezone.now)
    
    def __str__(self):
        return self.name
class Categoria_publicacao(models.Model):
    name = models.CharField(max_length=100)
 
    def __str__(self):
        return self.name        

class Publicacao(models.Model):
    user=models.ForeignKey(User, on_delete=models.CASCADE, default=None)
    titulo = models.CharField('Título',max_length=100)
    resumo = models.TextField('Resumo')
    ano = models.IntegerField('Ano')
    #categoria = models.CharField('Categoria',max_length=100)
    autores = models.CharField('Autores',max_length=100)
    artigo_upload = models.FileField(upload_to='artigos/', blank=True, null=True)
    post_date = models.DateTimeField('Data do Post',  default=django.utils.timezone.now)
    #categoria = models.ForeignKey(Categoria_publicacao, on_delete=models.SET_NULL,  null=True, blank=True)
    categoria = models.ManyToManyField(Categoria_publicacao)
    def __str__(self):
        return self.titulo
    
    
      
class Historico(models.Model):
    date = models.DateTimeField('Data',auto_now_add=True)
    usuario = models.ForeignKey(Usuario,on_delete=models.CASCADE)
    descricao = models.TextField("Descrição")
    ocorrencia = models.ForeignKey(Ocorrencia, on_delete=models.CASCADE)
    
    def __str__(self):
        return self.descricao
    
class ProjetoRelatorio(models.Model):
    titulo = models.CharField('Título',max_length=250)
    user=models.ForeignKey(User, on_delete=models.CASCADE, default=None)
    vigencia_inicio = models.DateField('Início da vigência ', )
    vigencia_fim = models.DateField('FIM da vigência ', )
    numero_parcelas = models.IntegerField('Número de parcelas',default=12)
    objetivo_proposto = models.TextField('Objetivo proposto')
    resultado_esperado = models.TextField('Resultados esperados ')
    objetivo_proposto_obj = models.TextField('Objetivos propostos')
    dia_entrega = models.IntegerField('Dia do mês da entrega', default=0)
    template = models.FileField(upload_to='templates/', blank=True, null=True)
    status=models.CharField('Status',max_length=100, choices=STATUS_CHOICES, default='Em elaboração')
    data_criacao = models.DateTimeField('Data de criação',  default=django.utils.timezone.now)
    template_default = models.BooleanField('Usar template padrão', default=False)
    
    def __str__(self):
        return self.titulo
    
class Relatorio(models.Model):
    projeto = models.ForeignKey(ProjetoRelatorio, on_delete=models.CASCADE)
    resultado = tinymce_models.HTMLField()
    informacao_adicional = models.TextField('Informações adicionais', blank=True, null=True)
    data_vigencia = models.DateField('Data de vigencia', blank=True, null=True )
    data_assinatura = models.DateField('Data de assinatura', blank=True, null=True )
    parcela=models.IntegerField('Parcela',default=1)
    assinatura = models.FileField(upload_to='assinaturas/', blank=True, null=True)
    doc = models.FileField(upload_to='docs/', blank=True, null=True)
    
    
    class Meta:
            constraints = [UniqueConstraint(fields=['projeto', 'parcela'], name='unica_parcela', violation_error_message='Já existe um relatório para esta parcela')]
            
    def __str__(self):
        return str(self.parcela) + ' - ' + str(self.data_vigencia) +' - ' + self.projeto.titulo 
    
class RelatorioFinal(models.Model):
    projeto = models.ForeignKey(ProjetoRelatorio, on_delete=models.CASCADE)
    objetivos_principais  = tinymce_models.HTMLField()
    principais_obstaculos  = tinymce_models.HTMLField()
    resultados_esperados_alcancados  = tinymce_models.HTMLField()
    informacao_adicional  = tinymce_models.HTMLField()
    conclusoes  = tinymce_models.HTMLField()
    data_vigencia = models.DateField('Data de vigencia', blank=True, null=True )
    data_assinatura = models.DateField('Data de assinatura', blank=True, null=True )
    assinatura = models.FileField(upload_to='assinaturas/', blank=True, null=True)
    doc = models.FileField(upload_to='docs/', blank=True, null=True)
    def __str__(self):
        return 'Relatorio Conclusivo - ' + str(self.data_vigencia) +' - ' + self.projeto.titulo 
    
    
class Templates(models.Model):
    nome = models.CharField('Título',max_length=250)
    descricao = models.TextField('Descrição')
    template = models.FileField(upload_to='templates/', blank=True, null=True)
    def __str__(self):
        return self.nome

class Parceiro(models.Model):
    nome = models.CharField('Nome', max_length=200)
    logo = models.ImageField('Logo', upload_to='parceiros/', blank=True, null=True)
    site = models.URLField('Site', blank=True, null=True)
    
    def __str__(self):
        return self.nome

class Curso(models.Model):
    titulo = models.CharField('Título', max_length=300)
    descricao = models.TextField('Descrição')
    carga_horaria = models.IntegerField('Carga Horária')
    data_inicio = models.DateField('Data de Início')
    data_termino = models.DateField('Data de Término')
    instrutor = models.CharField('Instrutor', max_length=100)
    local = models.CharField('Local', max_length=100)
    parceiros = models.ManyToManyField(Parceiro, blank=True)
    data_criacao = models.DateTimeField('Data de Criação',  default=django.utils.timezone.now)
    
    def __str__(self):
        return self.titulo
