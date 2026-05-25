"""Production settings — DJANGO_SETTINGS_MODULE=comais.settings.prod."""
import os

from django.core.exceptions import ImproperlyConfigured

from .base import *  # noqa: F401,F403

DEBUG = False

if not os.environ.get("DJANGO_SECRET_KEY"):
    raise ImproperlyConfigured("DJANGO_SECRET_KEY must be set in production.")

_hosts = os.environ.get("DJANGO_ALLOWED_HOSTS", "")
if not _hosts:
    raise ImproperlyConfigured(
        "DJANGO_ALLOWED_HOSTS must be set in production "
        "(comma-separated list of hostnames)."
    )
ALLOWED_HOSTS = [h.strip() for h in _hosts.split(",") if h.strip()]

if DATABASES["default"]["ENGINE"] != "django.db.backends.mysql":  # noqa: F405
    raise ImproperlyConfigured(
        "DB_NAME/DB_USER/DB_PASSWORD/DB_HOST env vars must be set in production."
    )

# --- CORS / CSRF for the SPA ---
# Same-origin via nginx makes these usually unnecessary; env vars allow
# split-domain deployments without code changes.
def _split_csv(name):
    raw = os.environ.get(name, "")
    return [item.strip() for item in raw.split(",") if item.strip()]

CSRF_TRUSTED_ORIGINS = _split_csv("DJANGO_CSRF_TRUSTED_ORIGINS")
CORS_ALLOWED_ORIGINS = _split_csv("DJANGO_CORS_ALLOWED_ORIGINS")

# --- Hardening (assumes TLS terminated by a reverse proxy) ---
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_HSTS_SECONDS = 60 * 60 * 24 * 30  # 30 days
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = False
X_FRAME_OPTIONS = "DENY"
