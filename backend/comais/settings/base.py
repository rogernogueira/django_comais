"""Common Django settings for the COMAIS backend.

Loaded by both dev and prod. Environment-specific overrides belong in
``dev.py`` or ``prod.py`` — keep this file deterministic and free of secrets.
"""
import os
from pathlib import Path

from django.contrib.messages import constants as messages
from django.core.management.utils import get_random_secret_key
from dotenv import load_dotenv

# <repo>/backend/
BASE_DIR = Path(__file__).resolve().parent.parent.parent

load_dotenv(BASE_DIR / ".env")  # no-op if file is absent

# --- Security ---
SECRET_KEY = os.environ.get("DJANGO_SECRET_KEY") or get_random_secret_key()

DEBUG = False
ALLOWED_HOSTS = []

# --- Apps ---
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "website.apps.WebsiteConfig",
    "membros",
    "reset_migrations",
    "tinymce",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "comais.urls"
WSGI_APPLICATION = "comais.wsgi.application"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

# --- Database ---
# MySQL when env vars are set; otherwise SQLite for local-only work.
if os.environ.get("DB_NAME"):
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.mysql",
            "NAME": os.environ["DB_NAME"],
            "USER": os.environ["DB_USER"],
            "PASSWORD": os.environ["DB_PASSWORD"],
            "HOST": os.environ["DB_HOST"],
            "PORT": os.environ.get("DB_PORT", "3306"),
        }
    }
else:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": BASE_DIR / "db.sqlite3",
        }
    }

# --- Auth ---
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# --- i18n ---
LANGUAGE_CODE = "pt-br"
TIME_ZONE = "America/Sao_Paulo"
USE_I18N = True
USE_TZ = True
DATE_INPUT_FORMATS = ["%d/%m/%Y"]

# --- Static / Media ---
MEDIA_URL = "media/"
MEDIA_ROOT = BASE_DIR / "media"

STATIC_URL = "static/"
STATICFILES_DIRS = [BASE_DIR / "website" / "static"]

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# Bootstrap classes — legacy from Django templates; remove once SPA migration is done.
MESSAGE_TAGS = {
    messages.DEBUG: "alert-secondary",
    messages.INFO: "alert-info",
    messages.SUCCESS: "alert-success",
    messages.WARNING: "alert-warning",
    messages.ERROR: "alert-danger",
}
