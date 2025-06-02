from django.urls import path
from . import views

app_name = 'profiles'

urlpatterns = [
    # Profile management endpoints
    # path('me/', views.CurrentUserProfileView.as_view(), name='current_user_profile'),
    # path('me/update/', views.UpdateProfileView.as_view(), name='update_profile'),

    # For now, we'll keep this empty but with proper structure
    # Add profile-specific endpoints here when needed
]

# Note: Currently empty but properly structured
# Profile functionality is handled through authentication app's profile endpoints
# This separation allows for future profile-specific features like:
# - Public profile views
# - Profile picture uploads
# - LinkedIn integration management
# - Profile analytics
