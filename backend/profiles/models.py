from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from core.models import BaseModel


class Profile(BaseModel):
    """
    Extended user profile for additional user information
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')

    # Basic profile information
    bio = models.TextField(max_length=500, blank=True, null=True, help_text="Short bio or description")
    location = models.CharField(max_length=100, blank=True, null=True)
    website = models.URLField(blank=True, null=True)

    # LinkedIn integration
    linkedin_profile = models.URLField(blank=True, null=True, help_text="LinkedIn profile URL")
    linkedin_access_token = models.TextField(blank=True, null=True, help_text="LinkedIn OAuth token")
    linkedin_connected = models.BooleanField(default=False)

    # User preferences
    preferred_tone = models.CharField(
        max_length=20,
        choices=[
            ('professional', 'Professional'),
            ('casual', 'Casual'),
            ('motivational', 'Motivational'),
            ('technical', 'Technical'),
            ('storytelling', 'Storytelling'),
        ],
        default='professional'
    )

    # Notification preferences
    email_notifications = models.BooleanField(default=True)
    daily_reminders = models.BooleanField(default=True)

    # Note: created_at, updated_at, created_by, updated_by are inherited from BaseModel

    class Meta:
        verbose_name = "Profile"
        verbose_name_plural = "Profiles"

    def __str__(self):
        return f"{self.user.username}'s Profile"

    @property
    def full_name(self):
        """Return the user's full name"""
        return f"{self.user.first_name} {self.user.last_name}".strip() or self.user.username


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    """
    Signal to automatically create a profile when a user is created
    """
    if created:
        Profile.objects.create(user=instance)


@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    """
    Signal to save the profile when user is saved
    """
    if hasattr(instance, 'profile'):
        instance.profile.save()
    else:
        Profile.objects.create(user=instance)
