# Generated by Django 4.1.1 on 2022-09-30 20:47

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('website', '0022_rename_data_criacao_projetorelatorio_data_criacao1_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='projetorelatorio',
            old_name='template_default1',
            new_name='template_default',
        ),
    ]
