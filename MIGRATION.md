# Migração COMAIS — Frontend para React + Backend para API REST

Documento de referência do plano e do progresso da migração do COMAIS de
**Django templates + Bootstrap** para **Django (REST API) + React SPA**
(Vite + TypeScript + Tailwind + shadcn/ui).

> Última atualização: 2026-05-25
> Branch ativa: `main`

---

## 1. Objetivo

Separar o sistema em duas camadas:

- **Backend** — Django como serviço REST puro (DRF), preservando models,
  admin, auth e a geração de relatórios `.docx`.
- **Frontend** — React SPA independente, consumindo a API via HTTP. Substitui
  os ~30 templates Django + Bootstrap por componentes shadcn/ui sobre Tailwind.

Mantemos:
- Modelos Django (zero migrations destrutivas)
- Admin Django (continua respondendo em `/admin/`)
- Geração de `.docx` (`docxtpl` + `python-docx` no backend)
- Autenticação Django (`django.contrib.auth`) — sem custom User

---

## 2. Decisões de arquitetura

| Tópico | Escolha | Por quê |
|---|---|---|
| Topologia | Monorepo, deploy separado | `backend/` + `frontend/` no mesmo repo; nginx roteia em produção |
| Autenticação | Session cookies + CSRF | Mantém compatibilidade com `/admin`, sem refresh tokens, integra com `django.contrib.auth` sem mudanças |
| Linguagem frontend | TypeScript | Tipos podem ser gerados do OpenAPI do DRF; shadcn é TS-first |
| Gerenciador Python | `uv` | Lockfile reprodutível, instalação rápida, gerencia Python automaticamente |
| Loader de env | `python-dotenv` (minimalista) | Carrega `.env` se existir; código continua usando `os.environ` direto |
| Dev cross-origin | Vite proxy | `vite.config.ts` proxia `/api/*` para Django; browser vê same-origin → CORS desnecessário no fluxo normal |

---

## 3. Topologia de deploy

### Produção (alvo)

```
browser ──► nginx :443
              ├─ /api/*    ──► gunicorn :8000  (Django)
              ├─ /admin/*  ──► gunicorn :8000  (Django)
              ├─ /media/*  ──► arquivos no disco
              └─ /*        ──► /var/www/frontend/dist/  (React build)

→ Same-origin: cookies sessionid + csrftoken funcionam nativos.
```

### Desenvolvimento (estado atual)

```
browser ──► vite :5173
              ├─ /api/*  ──[proxy]──► django runserver :8000
              └─ /*      ──► HMR React

→ Vite proxy = same-origin do ponto de vista do browser.
```

---

## 4. Stack

### Backend (`backend/`)

| Pacote | Versão | Papel |
|---|---|---|
| `django` | 4.1.1 | framework |
| `djangorestframework` | 3.15.1 | API REST |
| `django-cors-headers` | 4.5.0 | CORS (dev/staging defensivo) |
| `drf-spectacular` | 0.29.0 | OpenAPI schema + Swagger UI |
| `django-filter` | 23.5 | filtros de queryset |
| `django-tinymce` | 3.5.0 | editor rico (legado — sai com o SPA) |
| `django-reset-migrations` | 0.4.0 | utilitário de migrations |
| `docxtpl` | 0.16.4 | geração de relatórios `.docx` |
| `html2markdown` | 0.1.7 | converte HTML do TinyMCE p/ markdown no `.docx` |
| `mysqlclient` | 2.1.1 | driver MySQL |
| `pillow` | 9.2.0 | `ImageField` |
| `python-dotenv` | 1.2.2 | carrega `backend/.env` |

Transitivas (`python-docx`, `docxcompose`, `lxml`, `bs4`, `Jinja2`, etc.)
ficam pinadas em `backend/uv.lock`.

### Frontend (a ser criado no passo 6)

Plano: Vite 5 + React 18 + TS + Tailwind 3 + shadcn/ui + react-router 6 +
TanStack Query 5 + axios + react-hook-form + zod + Tiptap (substitui TinyMCE)
+ TanStack Table + sonner + date-fns + embla-carousel.

---

## 5. Estrutura atual do repo

```
e:\django_comais\
├── .git/
├── .gitignore                     ← inclui frontend/* e backend/.env
├── MIGRATION.md                   ← este arquivo
└── backend/
    ├── .python-version            (3.10.4)
    ├── .env.example               ← modelo p/ backend/.env (gitignored)
    ├── .venv/                     ← criado pelo uv
    ├── pyproject.toml             ← deps + uv config
    ├── uv.lock                    ← versões resolvidas
    ├── manage.py                  ← aponta p/ comais.settings.dev
    ├── db.sqlite3                 ← fallback local (não usado se DB_* setado)
    ├── archive/                   ← backups antigos (12 arquivos)
    ├── media/                     ← uploads
    ├── api/                       ← NOVO: camada REST
    │   ├── __init__.py
    │   ├── apps.py
    │   └── urls.py                ← /api/v1/ping/ + futuros viewsets
    ├── comais/
    │   ├── __init__.py
    │   ├── asgi.py                ← aponta p/ comais.settings.prod
    │   ├── wsgi.py                ← aponta p/ comais.settings.prod
    │   ├── urls.py                ← /api/v1/, /api/schema/, /api/docs/, /admin/, legado
    │   └── settings/
    │       ├── __init__.py
    │       ├── base.py            ← compartilhado, lê env vars
    │       ├── dev.py             ← DEBUG=True, ALLOWED_HOSTS local
    │       └── prod.py            ← DEBUG=False, hardened
    ├── website/                   ← app legado (CRUDs, templates, migrations)
    └── membros/                   ← app de auth legado (será reduzido)
```

---

## 6. Progresso por commit

| # | Commit | Descrição |
|---|---|---|
| 0 | `b2197e4` | (anterior) Último commit antes da migração |
| 1 | `4ec14fd` | **chore**: remove bare-repo leftovers and editor backup — limpa 17+ paths de lixo git acidentalmente versionado |
| 2 | `0bae05b` | **chore**: reorganize repo into backend/ subdirectory — 348 renames preservando history; cria `backend/archive/` para backups antigos |
| 3 | `a607c7e` | **chore**: migrate backend from pip/requirements.txt to uv — `pyproject.toml` + `uv.lock`; remove `requirements.txt`; deleta venv antigo |
| 4 | `e5d080b` | **refactor(settings)**: split comais.settings into base/dev/prod package — segredos saem do código, vão p/ env vars; SQLite fallback em dev |
| 5 | `b3f8f32` | **feat(api)**: add DRF, CORS, drf-spectacular, django-filter and api app — endpoints REST live, schema + Swagger funcionando |

---

## 7. Workflow de desenvolvimento

### Setup inicial em uma máquina nova

```powershell
git clone <repo>
cd <repo>\backend

# uv instala Python 3.10 e cria backend/.venv automaticamente
uv sync

# opcional: criar .env (se for usar MySQL e/ou setar SECRET_KEY)
Copy-Item .env.example .env
# editar backend/.env

uv run python manage.py migrate
uv run python manage.py createsuperuser
uv run python manage.py runserver
```

### Comandos do dia a dia

```powershell
cd backend

uv sync                                # sincroniza venv com uv.lock
uv run python manage.py runserver      # roda dev server :8000
uv run python manage.py shell          # shell Django
uv run python manage.py migrate
uv run python manage.py makemigrations
uv run python manage.py check
uv run python manage.py createsuperuser

uv add <pacote>                        # adiciona dep (atualiza pyproject + lock)
uv remove <pacote>
uv lock --upgrade                      # atualiza todas as deps no lock
```

### Endpoints existentes hoje

| Rota | O que faz |
|---|---|
| `GET /api/v1/ping/` | Liveness check — retorna `{"status": "ok"}` |
| `GET /api/schema/` | OpenAPI 3 schema (YAML/JSON) |
| `GET /api/docs/` | Swagger UI interativo |
| `/admin/` | Django admin |
| `/` e demais | Templates Django legados (serão removidos página por página) |

---

## 8. Variáveis de ambiente

Definidas em `backend/.env` (gitignored), exportadas no shell, ou no
gerenciador de processos da produção.

| Var | Obrigatória em | Default | Notas |
|---|---|---|---|
| `DJANGO_SECRET_KEY` | prod | random key em dev | Em prod, `prod.py` falha se ausente |
| `DJANGO_ALLOWED_HOSTS` | prod | `[]` | CSV. Em dev, `dev.py` força `localhost,127.0.0.1,0.0.0.0` |
| `DJANGO_CSRF_TRUSTED_ORIGINS` | prod (se split-domain) | `[]` | CSV. URLs com `https://`. Dev já tem Vite. |
| `DJANGO_CORS_ALLOWED_ORIGINS` | prod (se split-domain) | `[]` | CSV. Em normal nginx same-origin, fica vazio. |
| `DB_NAME` | prod | — | Se ausente, dev usa SQLite em `backend/db.sqlite3` |
| `DB_USER` | prod | — | |
| `DB_PASSWORD` | prod | — | |
| `DB_HOST` | prod | — | |
| `DB_PORT` | não | `3306` | |

`DJANGO_SETTINGS_MODULE` é fixado em `comais.settings.dev` por `manage.py` e
em `comais.settings.prod` por `wsgi.py`/`asgi.py`. Pode ser sobrescrita por
variável de ambiente.

---

## 9. Pontos de atenção pendentes

### 🔴 Senha do MySQL no histórico git

A senha de produção do MySQL DigitalOcean foi commitada em plaintext em
`backend/comais/settings.py` (antes do split). Foi removida do código atual
no commit `e5d080b`, mas **permanece nos blobs históricos**.

→ **Rotação manual obrigatória** no painel DigitalOcean. Limpar history
(`git filter-repo` / BFG) é opcional mas só faz sentido se o remote permitir
force push e ninguém tiver clones com a versão antiga.

### 🟡 Pylance no VSCode

Os avisos "Import could not be resolved" no IDE acontecem porque o VSCode
não está apontado para `backend/.venv`. Resolver:

```
Ctrl+Shift+P → Python: Select Interpreter
→ e:\django_comais\backend\.venv\Scripts\python.exe
```

### 🟡 VIRTUAL_ENV antiga na sessão

O shell pode ter `VIRTUAL_ENV=e:\django_comais\venv` apontando para um diretório
que não existe mais. Cada `uv` reclama disso. Resolver: abrir novo terminal
ou `Remove-Item Env:VIRTUAL_ENV`.

### 🟡 `.gitignore` tem `*settings.py`

Regra antiga ignora qualquer arquivo terminado em `settings.py`. Não afeta
os arquivos atuais (`base.py`, `dev.py`, `prod.py`), mas pode confundir
no futuro. Limpar quando conveniente.

---

## 10. Próximos passos do plano

| # | Passo | Entrega esperada |
|---|---|---|
| **4** | **`api/auth/`** — endpoints de autenticação | `POST /api/v1/auth/login/`, `/logout/`, `/register/`, `GET /me/`, `GET /csrf/` |
| **5** | **Viewsets de domínio** | `projetos/`, `publicacoes/`, `contatos/`, `ocorrencias/`, `colaboradores/`, `relatorios/` — com serializers, paginação, `IsOwnerOrReadOnly` |
| **5b** | **Endpoint `gerar_relatorio`** | Migrar `website.views.gerar_relatorio` para `@action(detail=True)` do `RelatorioViewSet`, retornando FileResponse `.docx` |
| **6** | **Bootstrap do frontend** | `frontend/` com Vite + React + TS + Tailwind + shadcn init; `vite.config.ts` com proxy; `lib/api.ts` (axios + CSRF) |
| **7** | **Auth no SPA** | `AppShell`, `Navbar`, `LoginPage`, `RegisterPage`, `ProtectedRoute`, hook `useMe()` |
| **8** | **Migração por feature** (3–4 semanas) | Cada domínio do passo 5 ganha sua página React, na ordem: home → projetos → publicações → contatos → perfil → **relatórios** (último por ser o mais complexo, com Tiptap e download de `.docx`) |
| **9** | **Limpeza** | Remover templates Django migrados, `django-tinymce`, vendor JS (Swiper, AOS, GLightbox), Bootstrap |
| **10** | **Deploy** | nginx config, `vite build`, scripts de prod, rotação da senha do MySQL |

---

## 11. Estimativa total

Da posição atual (após passo 3) até paridade funcional completa:

- Passo 4: ~1 dia
- Passo 5 + 5b: ~1 semana
- Passo 6 + 7: ~2 dias
- Passo 8: 3–4 semanas (uma pessoa em tempo integral)
- Passo 9 + 10: ~3 dias

**Total realista: 5–6 semanas** com uma pessoa dedicada.
