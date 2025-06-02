from django.contrib import admin
from .models import ChallengeCategory


@admin.register(ChallengeCategory)
class ChallengeCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'is_active', 'sort_order', 'created_at']
    list_filter = ['is_active']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}
    ordering = ['sort_order', 'name']
