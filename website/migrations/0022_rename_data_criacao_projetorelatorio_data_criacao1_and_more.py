# Generated by Django 4.1.1 on 2022-09-30 20:41

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('website', '0021_rename_date_historico_data'),
    ]

    operations = [
        migrations.RenameField(
            model_name='projetorelatorio',
            old_name='template_default',
            new_name='template_default1',
        ),
    ]