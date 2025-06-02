from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny

from .models import ChallengeCategory
from .serializers import ChallengeCategorySerializer


class ChallengeCategoryListCreateView(generics.ListCreateAPIView):
    queryset = ChallengeCategory.objects.all().order_by('sort_order', 'name')
    serializer_class = ChallengeCategorySerializer

    def get_permissions(self):
        """Anyone can view, only authenticated users can create"""
        if self.request.method == 'GET':
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        """Set the creator when creating a new category"""
        serializer.save(created_by=self.request.user)


class ChallengeCategoryActiveListView(generics.ListAPIView):
    queryset = ChallengeCategory.objects.filter(is_active=True).order_by('sort_order', 'name')
    serializer_class = ChallengeCategorySerializer
    permission_classes = [AllowAny]


class ChallengeCategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ChallengeCategory.objects.all()
    serializer_class = ChallengeCategorySerializer

    def get_permissions(self):
        """Anyone can view, only authenticated users can modify"""
        if self.request.method == 'GET':
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    def perform_update(self, serializer):
        """Set the updater when updating a category"""
        serializer.save(updated_by=self.request.user)
