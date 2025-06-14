# Generated by Django 5.2.1 on 2025-05-31 05:14

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Profile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True, help_text='Date and time when the record was created')),
                ('updated_at', models.DateTimeField(auto_now=True, help_text='Date and time when the record was last updated')),
                ('bio', models.TextField(blank=True, help_text='Short bio or description', max_length=500, null=True)),
                ('location', models.CharField(blank=True, max_length=100, null=True)),
                ('website', models.URLField(blank=True, null=True)),
                ('linkedin_profile', models.URLField(blank=True, help_text='LinkedIn profile URL', null=True)),
                ('linkedin_access_token', models.TextField(blank=True, help_text='LinkedIn OAuth token', null=True)),
                ('linkedin_connected', models.BooleanField(default=False)),
                ('preferred_tone', models.CharField(choices=[('professional', 'Professional'), ('casual', 'Casual'), ('motivational', 'Motivational'), ('technical', 'Technical'), ('storytelling', 'Storytelling')], default='professional', max_length=20)),
                ('email_notifications', models.BooleanField(default=True)),
                ('daily_reminders', models.BooleanField(default=True)),
                ('created_by', models.ForeignKey(blank=True, help_text='User who created this record', null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='%(app_label)s_%(class)s_created', to=settings.AUTH_USER_MODEL)),
                ('updated_by', models.ForeignKey(blank=True, help_text='User who last updated this record', null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='%(app_label)s_%(class)s_updated', to=settings.AUTH_USER_MODEL)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='profile', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Profile',
                'verbose_name_plural': 'Profiles',
            },
        ),
    ]
