from django.urls import path
from .views import (
    ChallengeCategoryListCreateView,
    ChallengeCategoryActiveListView,
    ChallengeCategoryDetailView
)

urlpatterns = [
    path('', ChallengeCategoryListCreateView.as_view(), name='category-list-create'),
    path('active/', ChallengeCategoryActiveListView.as_view(), name='category-active-list'),
    path('<int:pk>/', ChallengeCategoryDetailView.as_view(), name='category-detail'),
]
