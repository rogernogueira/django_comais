# Generated by Django 4.1.1 on 2022-09-30 20:24

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('website', '0019_merge_20220930_1724'),
    ]

    operations = [
    migrations.AddField(
            model_name='projetorelatorio',
            name='template_default',
            field=models.BooleanField(default=False, verbose_name='Usar template padrão'),
        ),
        migrations.AlterField(
            model_name='projetorelatorio',
            name='numero_parcelas',
            field=models.IntegerField(default=12, verbose_name='Número de parcelas'),
        ),
    ]
