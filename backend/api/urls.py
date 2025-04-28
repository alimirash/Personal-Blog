from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BlogPostViewSet, CommentViewSet, WalletViewSet, GameViewSet, GameHistoryViewSet

router = DefaultRouter()
router.register(r'posts', BlogPostViewSet)
router.register(r'comments', CommentViewSet)
router.register(r'wallets', WalletViewSet)
router.register(r'games', GameViewSet)
router.register(r'game-history', GameHistoryViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('auth/', include('rest_framework.urls')),
]
