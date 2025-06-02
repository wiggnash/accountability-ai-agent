from django.urls import path, include

urlpatterns = [
    # Authentication routes
    path('auth/', include('authentication.urls')),

    # Profile routes
    # path('profiles/', include('profiles.urls')),
]
