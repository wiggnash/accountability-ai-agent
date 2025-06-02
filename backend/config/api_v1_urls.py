from django.urls import path, include

urlpatterns = [
    # Authentication routes
    path('auth/', include('authentication.urls')),

    # Challenge routes
    path('challenge-categories/', include('challenge_categories.urls')),
]
