from rest_framework import serializers
from .models import ChallengeCategory


class ChallengeCategorySerializer(serializers.ModelSerializer):
    """
    Serializer for challenge categories
    """
    class Meta:
        model = ChallengeCategory
        fields = [
            'id',
            'name',
            'slug',
            'description',
            'icon',
            'is_active',
            'sort_order',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_name(self, value):
        """Ensure category name is properly formatted"""
        if len(value.strip()) < 2:
            raise serializers.ValidationError("Category name must be at least 2 characters long.")
        return value.strip().title()
