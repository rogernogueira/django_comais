import markdown as md
from django import template
from markdown.extensions import fenced_code, codehilite, tables
from django.template.defaultfilters import stringfilter

register = template.Library()
@register.filter()
@stringfilter
def markdown(value):
    """Converts Markdown text to HTML."""
    return md.markdown(value, extensions=["fenced_code", "codehilite", "tables"])