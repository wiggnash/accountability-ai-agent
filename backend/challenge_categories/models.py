from django.db import models
from django.utils.text import slugify
from core.models import BaseModel


class ChallengeCategory(BaseModel):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    slug = models.SlugField(max_length=100, unique=True)
    icon = models.CharField(max_length=50, blank=True)
    is_active = models.BooleanField(default=True)
    sort_order = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name = "Challenge Category"
        verbose_name_plural = "Challenge Categories"
        ordering = ['sort_order', 'name']
        db_table = 'challenge_categories'

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        # Auto-generate slug if not provided
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    @property
    def challenges_count(self):
        """Return the number of active challenges in this category"""
        return self.challenges.filter(is_active=True).count()
