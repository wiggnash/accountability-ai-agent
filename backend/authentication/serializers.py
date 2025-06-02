from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from profiles.models import Profile


class UserRegistrationSerializer(serializers.ModelSerializer):
    """
    Serializer for user registration
    """
    password = serializers.CharField(
        write_only=True,
        min_length=8,
        help_text="Password must be at least 8 characters long"
    )
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('email', 'username', 'first_name', 'last_name', 'password', 'password_confirm')
        extra_kwargs = {
            'email': {'required': True},
            'first_name': {'required': True},
            'last_name': {'required': True},
        }

    def validate_email(self, value):
        """
        Validate that email is unique
        """
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def validate_username(self, value):
        """
        Validate that username is unique
        """
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("A user with this username already exists.")
        return value

    def validate(self, attrs):
        """
        Validate that passwords match and meet requirements
        """
        password = attrs.get('password')
        password_confirm = attrs.get('password_confirm')

        if password != password_confirm:
            raise serializers.ValidationError({
                'password_confirm': "Passwords do not match."
            })

        # Use Django's built-in password validation
        try:
            validate_password(password)
        except serializers.ValidationError as e:
            raise serializers.ValidationError({
                'password': list(e.messages)
            })

        return attrs

    def create(self, validated_data):
        """
        Create a new user with encrypted password
        """
        # Remove password_confirm as it's not needed for user creation
        validated_data.pop('password_confirm', None)

        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            password=validated_data['password']
        )

        return user


class UserLoginSerializer(serializers.Serializer):
    """
    Serializer for user login
    """
    username_or_email = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        """
        Validate login credentials and return user
        """
        username_or_email = attrs.get('username_or_email')
        password = attrs.get('password')

        if not username_or_email or not password:
            raise serializers.ValidationError("Both username/email and password are required.")

        # Try to authenticate with username first, then email
        user = None

        # Check if input looks like an email
        if '@' in username_or_email:
            try:
                user_obj = User.objects.get(email=username_or_email)
                user = authenticate(username=user_obj.username, password=password)
            except User.DoesNotExist:
                pass
        else:
            # Try username authentication
            user = authenticate(username=username_or_email, password=password)

        if not user:
            raise serializers.ValidationError("Invalid credentials.")

        if not user.is_active:
            raise serializers.ValidationError("User account is disabled.")

        attrs['user'] = user
        return attrs


class UserProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for user profile information
    """
    profile = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'date_joined', 'profile')
        read_only_fields = ('id', 'username', 'date_joined')

    def get_profile(self, obj):
        """
        Get user profile information including audit fields
        """
        try:
            profile = obj.profile
            return {
                'bio': profile.bio,
                'location': profile.location,
                'website': profile.website,
                'linkedin_profile': profile.linkedin_profile,
                'linkedin_connected': profile.linkedin_connected,
                'preferred_tone': profile.preferred_tone,
                'email_notifications': profile.email_notifications,
                'daily_reminders': profile.daily_reminders,
                # Audit fields
                'created_at': profile.created_at,
                'updated_at': profile.updated_at,
                'created_by': profile.created_by.username if profile.created_by else None,
                'updated_by': profile.updated_by.username if profile.updated_by else None,
            }
        except Profile.DoesNotExist:
            return None


class PasswordChangeSerializer(serializers.Serializer):
    """
    Serializer for password change
    """
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, min_length=8)
    new_password_confirm = serializers.CharField(write_only=True)

    def validate_old_password(self, value):
        """
        Validate that old password is correct
        """
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Old password is incorrect.")
        return value

    def validate(self, attrs):
        """
        Validate that new passwords match
        """
        new_password = attrs.get('new_password')
        new_password_confirm = attrs.get('new_password_confirm')

        if new_password != new_password_confirm:
            raise serializers.ValidationError({
                'new_password_confirm': "New passwords do not match."
            })

        # Use Django's built-in password validation
        try:
            validate_password(new_password)
        except serializers.ValidationError as e:
            raise serializers.ValidationError({
                'new_password': list(e.messages)
            })

        return attrs
