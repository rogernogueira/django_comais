# Generated by Django 4.1.1 on 2022-09-18 21:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('website', '0017_templates'),
    ]

    operations = [
        migrations.AddConstraint(
            model_name='relatorio',
            constraint=models.UniqueConstraint(fields=('projeto', 'parcela'), name='unica_parcela', violation_error_message='Já existe um relatório para esta parcela'),
        ),
    ]