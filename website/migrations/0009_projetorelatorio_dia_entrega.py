# Generated by Django 4.0.5 on 2022-09-02 17:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('website', '0008_projetorelatorio_relatorio'),
    ]

    operations = [
        migrations.AddField(
            model_name='projetorelatorio',
            name='dia_entrega',
            field=models.IntegerField(default=0, verbose_name='Dia do mês da entrega'),
        ),
    ]
