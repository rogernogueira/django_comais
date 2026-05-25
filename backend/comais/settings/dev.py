"""Development settings — local machine only."""
from .base import *  # noqa: F401,F403

DEBUG = True

ALLOWED_HOSTS = ["localhost", "127.0.0.1", "0.0.0.0"]

# Vite dev server runs at :5173 and proxies /api to Django on :8000.
# Browser sees same-origin, but Origin/Referer headers carry :5173, so
# Django must trust that origin for CSRF and (defensively) for CORS.
_VITE_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
CORS_ALLOWED_ORIGINS = _VITE_ORIGINS
CSRF_TRUSTED_ORIGINS = _VITE_ORIGINS
