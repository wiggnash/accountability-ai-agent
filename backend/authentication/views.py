from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from django.contrib.auth import login
import logging

from .serializers import (
    UserRegistrationSerializer,
    UserLoginSerializer,
    UserProfileSerializer,
    PasswordChangeSerializer
)

logger = logging.getLogger(__name__)


class RegisterView(APIView):
    """
    User registration endpoint
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        """
        Register a new user
        """
        try:
            serializer = UserRegistrationSerializer(data=request.data)

            if serializer.is_valid():
                user = serializer.save()

                # Generate JWT tokens
                refresh = RefreshToken.for_user(user)
                access_token = refresh.access_token

                # Log successful registration
                logger.info(f"New user registered: {user.username} ({user.email})")

                return Response({
                    'message': 'User registered successfully',
                    'user': {
                        'id': user.id,
                        'username': user.username,
                        'email': user.email,
                        'first_name': user.first_name,
                        'last_name': user.last_name,
                    },
                    'tokens': {
                        'refresh': str(refresh),
                        'access': str(access_token),
                    }
                }, status=status.HTTP_201_CREATED)

            return Response({
                'error': 'Registration failed',
                'details': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            logger.error(f"Registration error: {str(e)}")
            return Response({
                'error': 'An unexpected error occurred during registration'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class LoginView(APIView):
    """
    User login endpoint
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        """
        Authenticate user and return JWT tokens
        """
        try:
            serializer = UserLoginSerializer(data=request.data)

            if serializer.is_valid():
                user = serializer.validated_data['user']

                # Generate JWT tokens
                refresh = RefreshToken.for_user(user)
                access_token = refresh.access_token

                # Update last login
                login(request, user)

                # Log successful login
                logger.info(f"User logged in: {user.username}")

                return Response({
                    'message': 'Login successful',
                    'user': {
                        'id': user.id,
                        'username': user.username,
                        'email': user.email,
                        'first_name': user.first_name,
                        'last_name': user.last_name,
                    },
                    'tokens': {
                        'refresh': str(refresh),
                        'access': str(access_token),
                    }
                }, status=status.HTTP_200_OK)

            return Response({
                'error': 'Login failed',
                'details': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            logger.error(f"Login error: {str(e)}")
            return Response({
                'error': 'An unexpected error occurred during login'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class LogoutView(APIView):
    """
    User logout endpoint - blacklist refresh token
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        """
        Logout user by blacklisting refresh token
        """
        try:
            refresh_token = request.data.get('refresh_token')

            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()

                logger.info(f"User logged out: {request.user.username}")

                return Response({
                    'message': 'Logout successful'
                }, status=status.HTTP_200_OK)

            return Response({
                'error': 'Refresh token is required'
            }, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            logger.error(f"Logout error: {str(e)}")
            return Response({
                'error': 'An unexpected error occurred during logout'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UserProfileView(APIView):
    """
    Get/Update user profile information
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        """
        Get current user's profile
        """
        try:
            serializer = UserProfileSerializer(request.user)
            return Response({
                'user': serializer.data
            }, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"Profile fetch error: {str(e)}")
            return Response({
                'error': 'Failed to fetch user profile'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def put(self, request):
        """
        Update user profile
        """
        try:
            serializer = UserProfileSerializer(
                request.user,
                data=request.data,
                partial=True
            )

            if serializer.is_valid():
                user = serializer.save()

                logger.info(f"Profile updated: {user.username}")

                return Response({
                    'message': 'Profile updated successfully',
                    'user': serializer.data
                }, status=status.HTTP_200_OK)

            return Response({
                'error': 'Profile update failed',
                'details': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            logger.error(f"Profile update error: {str(e)}")
            return Response({
                'error': 'Failed to update profile'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ChangePasswordView(APIView):
    """
    Change user password
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        """
        Change user password
        """
        try:
            serializer = PasswordChangeSerializer(
                data=request.data,
                context={'request': request}
            )

            if serializer.is_valid():
                user = request.user
                user.set_password(serializer.validated_data['new_password'])
                user.save()

                logger.info(f"Password changed: {user.username}")

                return Response({
                    'message': 'Password changed successfully'
                }, status=status.HTTP_200_OK)

            return Response({
                'error': 'Password change failed',
                'details': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            logger.error(f"Password change error: {str(e)}")
            return Response({
                'error': 'Failed to change password'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# Function-based views for simple endpoints
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def verify_token(request):
    """
    Verify if the current JWT token is valid
    """
    return Response({
        'valid': True,
        'user': {
            'id': request.user.id,
            'username': request.user.username,
            'email': request.user.email,
        }
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def health_check(request):
    """
    Simple health check endpoint
    """
    return Response({
        'status': 'healthy',
        'message': 'Authentication service is running'
    }, status=status.HTTP_200_OK)
