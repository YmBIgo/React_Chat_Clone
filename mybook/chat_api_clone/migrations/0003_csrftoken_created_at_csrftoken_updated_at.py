# Generated by Django 4.0 on 2022-01-02 14:39

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('chat_api_clone', '0002_csrftoken_user_cookie'),
    ]

    operations = [
        migrations.AddField(
            model_name='csrftoken',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='csrftoken',
            name='updated_at',
            field=models.DateTimeField(auto_now=True),
        ),
    ]