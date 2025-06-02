from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile


class ProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for Profile model with audit fields
    """
    created_by_username = serializers.CharField(source='created_by.username', read_only=True)
    updated_by_username = serializers.CharField(source='updated_by.username', read_only=True)
    full_name = serializers.CharField(read_only=True)

    class Meta:
        model = Profile
        fields = [
            'id',
            'bio',
            'location',
            'website',
            'linkedin_profile',
            'linkedin_connected',
            'preferred_tone',
            'email_notifications',
            'daily_reminders',
            # Audit fields
            'created_at',
            'updated_at',
            'created_by',
            'updated_by',
            'created_by_username',
            'updated_by_username',
            'full_name',
        ]
        read_only_fields = [
            'id',
            'created_at',
            'updated_at',
            'created_by',
            'updated_by',
            'created_by_username',
            'updated_by_username',
            'full_name',
        ]

    def validate_website(self, value):
        """
        Validate website URL format
        """
        if value and not value.startswith(('http://', 'https://')):
            value = f'https://{value}'
        return value

    def validate_linkedin_profile(self, value):
        """
        Validate LinkedIn profile URL
        """
        if value and 'linkedin.com' not in value:
            raise serializers.ValidationError("Please provide a valid LinkedIn profile URL")
        return value


class UserWithProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for User with embedded Profile information
    """
    profile = ProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'date_joined',
            'last_login',
            'is_active',
            'profile',
        ]
        read_only_fields = [
            'id',
            'username',
            'date_joined',
            'last_login',
        ]


class ProfileUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for updating profile information
    """
    class Meta:
        model = Profile
        fields = [
            'bio',
            'location',
            'website',
            'linkedin_profile',
            'preferred_tone',
            'email_notifications',
            'daily_reminders',
        ]

    def update(self, instance, validated_data):
        """
        Update profile with current user tracking
        """
        # The BaseModel save method will automatically set updated_by
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance
