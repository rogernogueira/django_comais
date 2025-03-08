import os
import django
from django.core import serializers
from django.apps import apps

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'comais.settings')
django.setup()

# List of models to include
included_models = [
    'website.Curso',
    'website.Projeto',
    'website.ProjetoRelatorio',
    'website.Publicacao',
    'website.Relatorio',
    'website.RelatorioFinal',
    'website.Colaborador',
    'website.Contato',
    'website.Ocorrencia',
    'website.Historico'
]

data = []
for model_name in included_models:
    app_label, model_name = model_name.split('.')
    model = apps.get_model(app_label, model_name)
    
    try:
        # Handle required fields
        if model_name == 'ProjetoRelatorio':
            for obj in model.objects.all():
                if not obj.resultado_esperado:
                    obj.resultado_esperado = "Resultado não especificado"
                data.append(obj)
        else:
            data.extend(model.objects.all())
    except Exception as e:
        print(f"Error exporting {model_name}: {str(e)}")
        continue

with open('db_dump.json', 'w', encoding='utf-8') as f:
    serializers.serialize('json', data, stream=f, indent=2, use_natural_foreign_keys=True)
