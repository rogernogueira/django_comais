# Generated by Django 4.1.1 on 2022-09-30 20:37

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('website', '0020_projetorelatorio_data_criacao_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='historico',
            old_name='date',
            new_name='data',
        ),
    ]
