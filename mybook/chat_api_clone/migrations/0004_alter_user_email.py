# Generated by Django 4.0 on 2022-01-02 15:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chat_api_clone', '0003_csrftoken_created_at_csrftoken_updated_at'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='email',
            field=models.EmailField(max_length=128, unique=True),
        ),
    ]