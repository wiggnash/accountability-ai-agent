# Create a new app called 'core' for shared models
# python manage.py startapp core

from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone


class BaseModel(models.Model):
    """
    Abstract base model that provides audit fields for all models
    """
    # Audit fields
    created_at = models.DateTimeField(auto_now_add=True, help_text="Date and time when the record was created")
    updated_at = models.DateTimeField(auto_now=True, help_text="Date and time when the record was last updated")
    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="%(app_label)s_%(class)s_created",
        help_text="User who created this record"
    )
    updated_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="%(app_label)s_%(class)s_updated",
        help_text="User who last updated this record"
    )

    class Meta:
        abstract = True

    def save(self, *args, **kwargs):
        """
        Override save method to automatically set created_by and updated_by
        """
        # Get the current user from kwargs if passed, otherwise from middleware
        user = kwargs.pop('user', None)

        if not user:
            # Try to get current user from middleware
            from .middleware import get_current_user
            user = get_current_user()

        if user and hasattr(user, 'id') and user.is_authenticated:
            if not self.pk:  # Creating new record
                self.created_by = user
            self.updated_by = user

        super().save(*args, **kwargs)


class SoftDeleteManager(models.Manager):
    """
    Manager that excludes soft-deleted records by default
    """
    def get_queryset(self):
        return super().get_queryset().filter(is_deleted=False)


class SoftDeleteModel(BaseModel):
    """
    Abstract model that provides soft delete functionality
    """
    is_deleted = models.BooleanField(default=False, help_text="Soft delete flag")
    deleted_at = models.DateTimeField(null=True, blank=True, help_text="Date and time when the record was deleted")
    deleted_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="%(app_label)s_%(class)s_deleted",
        help_text="User who deleted this record"
    )

    objects = models.Manager()  # Default manager (includes deleted)
    active_objects = SoftDeleteManager()  # Manager that excludes deleted

    class Meta:
        abstract = True

    def delete(self, user=None, *args, **kwargs):
        """
        Soft delete - mark as deleted instead of actually deleting
        """
        self.is_deleted = True
        self.deleted_at = timezone.now()
        if user:
            self.deleted_by = user
        self.save(update_fields=['is_deleted', 'deleted_at', 'deleted_by'])

    def hard_delete(self, *args, **kwargs):
        """
        Actually delete the record from database
        """
        super().delete(*args, **kwargs)

    def restore(self, user=None):
        """
        Restore a soft-deleted record
        """
        self.is_deleted = False
        self.deleted_at = None
        self.deleted_by = None
        if user:
            self.updated_by = user
        self.save(update_fields=['is_deleted', 'deleted_at', 'deleted_by', 'updated_by'])
