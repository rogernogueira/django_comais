# Generated by Django 4.0.5 on 2022-09-02 17:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('website', '0010_relatorio_assinatura'),
    ]

    operations = [
        migrations.AddField(
            model_name='relatorio',
            name='data_assinatura',
            field=models.DateField(blank=True, null=True, verbose_name='Data de assinatura'),
        ),
        migrations.AddField(
            model_name='relatorio',
            name='data_vigencia',
            field=models.DateField(blank=True, null=True, verbose_name='Data de vigencia'),
        ),
        migrations.AlterField(
            model_name='relatorio',
            name='informacao_adicional',
            field=models.TextField(blank=True, null=True, verbose_name='Informações adicionais'),
        ),
    ]
