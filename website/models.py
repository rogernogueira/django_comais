from pydoc import describe
from re import template
import django.utils
from django.db import models
from django.db.models import UniqueConstraint, BaseConstraint
from django.utils import timezone
from django.contrib.auth.models import User
import datetime
from django.core.files.storage import default_storage
from django.db.models.signals import post_delete
from django.dispatch import receiver
from tinymce import models as tinymce_models
from django.conf import settings
from textwrap import dedent
from datetime import datetime

# configure timezone
from datetime import datetime, date
from typing import Optional
from pydantic import BaseModel, Field, field_validator, model_validator

class dados_termo(BaseModel):
    titulo: str = Field(..., min_length=5, max_length=255, description="Título do projeto")
    vigencia_inicio: Optional[date] = Field(None, description="Data de início da vigência")
    vigencia_fim: Optional[date] = Field(None, description="Data de fim da vigência")
    numero_parcelas: Optional[int] = Field(None, gt=0, le=100, description="Número de parcelas entre 1 e 100")
    objetivo_proposto: Optional[str] = Field(None, description="Objetivo proposto")
    resultado_esperado: Optional[str] = Field(None, description="Resultados esperados")
    objetivo_proposto_obj: Optional[str] = Field(None, description="Objetivos propostos")

    @field_validator('vigencia_inicio', 'vigencia_fim', mode='before')
    @classmethod
    def parse_date(cls, value):
        if not value:
            return None
        if isinstance(value, date):
            return value

        formatos = ["%Y-%m-%d", "%d/%m/%Y", "%m/%Y", "%m-%Y"]
        for fmt in formatos:
            try:
                dt = datetime.strptime(value, fmt)
                return dt.replace(day=1).date() if '%d' not in fmt else dt.date()
            except ValueError:
                continue
        raise ValueError(f"Data inválida: '{value}'. Use formatos como YYYY-MM-DD, DD/MM/AAAA ou MM/AAAA.")

    @field_validator('objetivo_proposto', 'resultado_esperado', 'objetivo_proposto_obj', mode='before')
    @classmethod
    def texto_minimo(cls, v):
        if v is None:
            return None
        v = v.strip()
        if len(v) < 10:
            raise ValueError("O campo deve conter pelo menos 10 caracteres.")
        return v

    @model_validator(mode='after')
    def validar_periodo(self):
        if self.vigencia_inicio and self.vigencia_fim and self.vigencia_fim < self.vigencia_inicio:
            raise ValueError("A data de fim da vigência deve ser posterior à de início.")
        return self

STATUS_CHOICES = [('Aguardando', 'Aguardando'),
                  ('Em andamento', 'Em andamento'),
                  ('Concluído', 'Concluído'),
                  ('Cancelado', 'Cancelado'),
                  ]
class TipoDocumento(models.Model):
    nome = models.CharField(max_length=100, unique=True)
    descricao = models.TextField(blank=True)
    obrigatorio = models.BooleanField(default=True)
    ativo = models.BooleanField(default=True)
    declaracao = models.BooleanField(default=False,blank=True, null=True, help_text="Indica se o tipo de documento é uma declaração ou plano de trabalho")
    template = models.FileField(upload_to='templates/', blank=True, null=True, help_text="Template para o tipo de documento")
    def __str__(self):
        return self.nome
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
    matricula = models.CharField('matricula',max_length=100, null=True, blank=True)
    cpf = models.CharField('cpf',max_length=100, null=True, blank=True)
    foto = models.ImageField('foto', upload_to='images/', blank=True, null=True, default='images/default.png')
    post_date = models.DateTimeField('Data do Post',  default=django.utils.timezone.now)
    
    def __str__(self):
        return self.name
class DocumentosColaborador(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, default=None)
    descricao = models.TextField('Descrição', blank=True, null=True)
    arquivo = models.FileField(upload_to='documentos/', blank=True, null=True)
    post_date = models.DateTimeField('Data do Post',  default=django.utils.timezone.now)
    tipo_documento = models.ForeignKey(TipoDocumento, on_delete=models.PROTECT, verbose_name='Tipo de Documento')
    
    def __str__(self):
        return f"Documento de {self.user.username} - {self.tipo_documento.nome}"
    
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
    
class TermoOutorga(models.Model):
    arquivo = models.FileField(upload_to='termos/', blank=True, null=True)
    nome = models.CharField(max_length=255, blank=True)
    data_upload = models.DateTimeField(auto_now_add=True)
    titulo = models.CharField('Título do projeto',max_length=250, blank=True, null=True)
    vigencia_inicio = models.DateField('Início da vigência',blank=True, null=True)
    vigencia_fim = models.DateField('Fim da vigência',blank=True, null=True)
    numero_parcelas = models.IntegerField('Número de parcelas',blank=True, null=True)
    objetivo_proposto = models.TextField('Objetivo proposto',blank=True, null=True)
    resultado_esperado = models.TextField('Resultados esperados ',blank=True, null=True)
    objetivo_proposto_obj = models.TextField('Objetivos propostos',blank=True, null=True)
    valor_parcela = models.DecimalField('Valor da parcela', decimal_places=10, max_digits=20  ,blank=True, null=True)
    def save(self, *args, **kwargs):
        created = not self.pk
        super().save(*args, **kwargs)  # Save first to get file path
        if created:
            

            self.extract_data( )
    def extract_data(self):
        from agno.agent import Agent
        from agno.models.deepseek import DeepSeek
        import pymupdf4llm
        from datetime import datetime

        file = self.arquivo.path
        md_text = pymupdf4llm.to_markdown(file)

        agent_extract = Agent(
            model=DeepSeek(),
            description="Você é um assistente de IA que extrai dados de um termo de outorga. Você deve extrair os seguintes dados: titulo, vigencia_inicio, vigencia_fim, numero_parcelas, objetivo_proposto, resultado_esperado, objetivo_proposto_obj. Retorne os dados em formato JSON.",
            response_model=dados_termo,
            instructions=dedent("""\
                Você deve extrair os seguintes dados:
                - titulo
                - vigencia_inicio
                - vigencia_fim
                - numero_parcelas
                - objetivo_proposto
                - resultado_esperado
                - objetivo_proposto_obj
                
                Caso não consiga extrair algum dado, retorne como null.
            """),
            use_json_mode=True,
        )

        try:
            result = agent_extract.run(md_text).content
        except Exception as e:
            # Log ou print opcional para depuração
            print(f"Erro ao extrair dados do PDF: {e}")
            return  # ou definir campos default

        def parse_date_safe(value):
            if not value:
                return None

            if isinstance(value, date):
                return value  # já está pronto

            if isinstance(value, datetime):
                return value.date()

            if isinstance(value, str):
                formatos = ["%Y-%m-%d", "%d/%m/%Y", "%m/%Y", "%m-%Y"]
                for fmt in formatos:
                    try:
                        dt = datetime.strptime(value, fmt)
                        return dt.replace(day=1).date() if '%d' not in fmt else dt.date()
                    except ValueError:
                        continue
            return None

        # Preenchimento seguro dos campos
        self.titulo = result.titulo or ""
        self.vigencia_inicio = parse_date_safe(result.vigencia_inicio)
        self.vigencia_fim = parse_date_safe(result.vigencia_fim)
        self.numero_parcelas = result.numero_parcelas or 0
        self.objetivo_proposto = result.objetivo_proposto or ""
        self.resultado_esperado = result.resultado_esperado or ""
        self.objetivo_proposto_obj = result.objetivo_proposto_obj or ""

        self.save(update_fields=[
            'titulo', 'vigencia_inicio', 'vigencia_fim', 'numero_parcelas',
            'objetivo_proposto', 'resultado_esperado', 'objetivo_proposto_obj',
        ])




    def __str__(self):
        return self.titulo if self.titulo else "Termo sem nome"

class ProjetoRelatorio(models.Model):
    titulo = models.CharField('Título',max_length=250)
    user=models.ForeignKey(User, on_delete=models.CASCADE, default=None)
    vigencia_inicio = models.DateField('Início da vigência', )
    vigencia_fim = models.DateField('FIM da vigência', )
    numero_parcelas = models.IntegerField('Número de parcelas',default=12)
    objetivo_proposto = models.TextField('Objetivo proposto')
    resultado_esperado = models.TextField('Resultados esperados ')
    objetivo_proposto_obj = models.TextField('Objetivos propostos')
    dia_entrega = models.IntegerField('Dia do mês da entrega', default=0)
    template = models.FileField(upload_to='templates/', blank=True, null=True)
    termo_outorga = models.ForeignKey(TermoOutorga, on_delete=models.SET_NULL, blank=True, null=True)
    
    status=models.CharField('Status',max_length=100, choices=STATUS_CHOICES, default='Em elaboração')
    data_criacao = models.DateTimeField('Data de criação',  default=django.utils.timezone.now)
    template_default = models.BooleanField('Usar template padrão', default=False)
    
    
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


class Imagem(models.Model):
    arquivo = models.ImageField(upload_to='imagens/',default='imagens/default.png')
    thumbnail = models.ImageField(upload_to='thumbnails/', null=True, blank=True)
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    data_criacao = models.DateTimeField(auto_now_add=True, null=True)
    tag = models.CharField(max_length=200, blank=True, null=True)

    def save(self, *args, **kwargs):
        created = not self.pk
        super().save(*args, **kwargs)  # Save first to get file path
        if created:
            self.create_thumbnail()

    def create_thumbnail(self):
        from PIL import Image
        from io import BytesIO
        from django.core.files.base import ContentFile
        import os
        import logging

        logger = logging.getLogger(__name__)
        print("gerando thumbnail")
        try:
            max_width = 400
            max_height = 400
            
            # Processa a imagem e cria o thumbnail em um único bloco with
            with Image.open(self.arquivo) as image:
                width, height = image.size
                
                # Calcula as novas dimensões mantendo a proporção
                if width > height:
                    ratio = max_width / float(width)
                    new_height = int(float(height) * float(ratio))
                    new_width = max_width
                else:
                    ratio = max_height / float(height)
                    new_width = int(float(width) * float(ratio))
                    new_height = max_height
                    
                # Redimensiona a imagem
                image.thumbnail((new_width, new_height), Image.LANCZOS)
                
                # Prepara o nome do arquivo do thumbnail
                thumb_name, thumb_extension = os.path.splitext(self.arquivo.name)
                thumb_name = thumb_name.split('/')[-1]
                thumb_extension = thumb_extension.lower()
                thumb_filename = thumb_name + '_thumb' + thumb_extension
                
                # Determina o formato da imagem
                if thumb_extension in ['.jpg', '.jpeg']:
                    FTYPE = 'JPEG'
                    quality = 85
                elif thumb_extension == '.gif':
                    FTYPE = 'GIF'
                    quality = 75
                elif thumb_extension == '.png':
                    FTYPE = 'PNG'
                    quality = 9
                elif thumb_extension == '.webp':
                    FTYPE = 'WEBP'
                    quality = 80
                else:
                    logger.error(f'Formato de imagem não suportado: {thumb_extension}')
                    return False

                # Cria o thumbnail em memória com gerenciamento de contexto
                with BytesIO() as temp_thumb:
                    image.save(temp_thumb, FTYPE, quality=quality)
                    temp_thumb.seek(0)
                    
                    # Salva o thumbnail
                    self.thumbnail.save(
                        thumb_filename, 
                        ContentFile(temp_thumb.read()), 
                        save=False
                    )

            logger.info(f'Thumbnail criado com sucesso: {thumb_filename}')
            return True
            
        except Exception as e:
            logger.error(f'Erro ao criar thumbnail: {str(e)}')
            return False

    def __str__(self):
        return self.arquivo.name



@receiver(post_delete, sender=Imagem)
def delete_imagem_files(sender, instance, **kwargs):
    """Signal para deletar os arquivos físicos quando uma Imagem for deletada"""
    if instance.arquivo:
        file_path = instance.arquivo.path
        if default_storage.exists(file_path):
            default_storage.delete(file_path)
    if instance.thumbnail:
        thumb_path = instance.thumbnail.path
        if default_storage.exists(thumb_path):
            default_storage.delete(thumb_path)
