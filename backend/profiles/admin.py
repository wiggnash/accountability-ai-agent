# profiles/admin.py - Minimal version to get migrations working

from django.contrib import admin
from .models import Profile

# Simple registration without inline for now
admin.site.register(Profile)

# You can add the fancy admin configurations after migrations are done
