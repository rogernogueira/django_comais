from pathlib import Path
import os
from django.contrib.messages import constants as messages
from django.core.management.utils import get_random_secret_key
from dotenv import load_dotenv

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

if os.getenv("DJANGO_DEV") == 'True':
    load_dotenv('.env.dev')
else:
    load_dotenv(os.path.join(BASE_DIR, '.env.prod'))
    # Configurações de segurança para trabalhar com https no reverso
    SECURE_PROXY_SSL_HEADER = os.getenv("DJANGO_SECURE_PROXY_SSL_HEADER").split(',')
    CSRF_TRUSTED_ORIGINS = os.getenv("DJANGO_CSRF_TRUSTED_ORIGINS").split(',')
    WSGI_APPLICATION = os.getenv('DJANGO_WSGI_APPLICATION')
    DEVELOPMENT_MODE = os.getenv('DJANGO_DEVELOPMENT_MODE')

# SECRET_KEY = 'django-insecure-a4-ae9xcxx3#^14oyl33+--nic!3wnkra8re&b7&_a-ymz(f7m'
SECRET_KEY = os.getenv("DJANGO_SECRET_KEY") or get_random_secret_key()
# SECURITY WARNING: don't run with debug turned on in production!

DEBUG = bool(os.getenv("DJANGO_DEBUG"))
DATE_INPUT_FORMATS = ['%d/%m/%Y']
ALLOWED_HOSTS = os.getenv("DJANGO_ALLOWED_HOSTS").split(',')

# Debug prints to verify environment variables
print("DJANGO_DB_ENGINE:", os.getenv('DJANGO_DB_ENGINE'))
print("DJANGO_DB_NAME:", os.getenv('DJANGO_DB_NAME'))
print("DJANGO_DB_USER:", os.getenv('DJANGO_DB_USER'))
print("DJANGO_DB_PASSWORD:", os.getenv('DJANGO_DB_PASSWORD'))
print("DJANGO_DB_HOST:", os.getenv('DJANGO_DB_HOST'))
print("DJANGO_DB_PORT:", os.getenv('DJANGO_DB_PORT'))

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'website.apps.WebsiteConfig',
    'membros',
    'tinymce',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'comais.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# Database
# https://docs.djangoproject.com/en/4.0/ref/settings/#databases
if os.getenv("DJANGO_DEV") == 'True':
    DATABASES = {
        'default': {
            'ENGINE': os.getenv('DJANGO_DB_ENGINE'),
            'NAME': BASE_DIR / os.getenv('DJANGO_DB_NAME'),
        }
    }
else:
    DATABASES = {
        'default': {
            'ENGINE': os.getenv('DJANGO_DB_ENGINE'),
            'NAME': os.getenv('DJANGO_DB_NAME'),
            'USER': os.getenv('DJANGO_DB_USER'),
            'PASSWORD': os.getenv('DJANGO_DB_PASSWORD'),
            'HOST': os.getenv('DJANGO_DB_HOST'),
            'PORT': os.getenv('DJANGO_DB_PORT'),
        }
    }

# Password validation
# https://docs.djangoproject.com/en/4.0/ref/settings/#auth-password-validators
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
# https://docs.djangoproject.com/en/4.0/topics/i18n/
LANGUAGE_CODE = 'pt-br'

TIME_ZONE = 'America/Sao_Paulo'

USE_I18N = True

USE_TZ = True
MEDIA_URL = 'media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# Static files (CSS, JavaScript, Images)
STATIC_URL = 'static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

STATICFILES_DIRS = [
    os.path.join(BASE_DIR, "website/static/"), 
    os.path.join(BASE_DIR, "website/static/website"),
]

STATICFILES_FINDERS = [
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
]

# Default primary key field type
# https://docs.djangoproject.com/en/4.0/ref/settings/#default-auto-field
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
MESSAGE_TAGS = {
    messages.DEBUG: 'alert-secondary',
    messages.INFO: 'alert-info',
    messages.SUCCESS: 'alert-success',
    messages.WARNING: 'alert-warning',
    messages.ERROR: 'alert-danger',
}
