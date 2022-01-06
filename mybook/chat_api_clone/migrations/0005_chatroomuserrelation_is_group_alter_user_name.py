# Generated by Django 4.0 on 2022-01-03 15:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chat_api_clone', '0004_alter_user_email'),
    ]

    operations = [
        migrations.AddField(
            model_name='chatroomuserrelation',
            name='is_group',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='user',
            name='name',
            field=models.CharField(default='', max_length=30, unique=True),
        ),
    ]
