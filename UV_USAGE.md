# Guia de Uso do UV para o Projeto Django COMAIS

Este projeto foi migrado para usar o **UV** como gerenciador de pacotes Python. O UV é extremamente rápido e eficiente para gerenciar dependências.

## Comandos Principais

### Ativar o Ambiente Virtual
```bash
.venv\Scripts\activate
```

### Sincronizar Dependências
```bash
uv sync
```

### Instalar Dependências de Desenvolvimento
```bash
uv sync --group dev
```

### Adicionar Nova Dependência
```bash
uv add nome_do_pacote
```

### Adicionar Dependência de Desenvolvimento
```bash
uv add --group dev nome_do_pacote
```

### Remover Dependência
```bash
uv remove nome_do_pacote
```

### Atualizar Dependências
```bash
uv sync --upgrade
```

### Executar Comandos Django
```bash
.venv\Scripts\python.exe manage.py [comando]
```

## Estrutura do Projeto

- **pyproject.toml**: Arquivo de configuração principal com dependências
- **uv.lock**: Arquivo de lock das versões das dependências
- **.venv/**: Ambiente virtual criado pelo UV

## Dependências Atuais

### Dependências Principais
- django>=5.2.2
- djangorestframework>=3.16.0
- django-cors-headers>=4.7.0
- django-tinymce>=4.1.0
- pillow>=11.2.1
- openai>=1.84.0
- agno>=1.5.8
- docxtpl>=0.20.0

### Dependências de Desenvolvimento
- taskipy>=1.14.1

## Comandos Taskipy Disponíveis

```bash
task gitadd        # git add .
task gitcommit     # git commit -m 'update'
task gitpush       # git push origin main
task deploy        # Deploy para produção
task pushd         # git add + commit + push + deploy
task psh           # git add + commit + push
```

## Migração Concluída

✅ Projeto migrado com sucesso para UV
✅ Ambiente virtual criado em `.venv/`
✅ Todas as dependências sincronizadas
✅ Projeto Django funcionando corretamente
✅ Comandos taskipy disponíveis

## Próximos Passos

1. Use `uv sync` sempre que atualizar dependências
2. Use `uv add` para adicionar novos pacotes
3. O ambiente virtual `.venv/` deve ser adicionado ao `.gitignore`
4. Para desenvolvimento, use `uv sync --group dev`
