from rest_framework import viewsets, permissions, status
from .models import BlogPost, Comment, Wallet, Game, GameHistory
from .serializers import (BlogPostSerializer, CommentSerializer, 
                         WalletSerializer, WalletDetailSerializer, 
                         GameSerializer, GameHistorySerializer)
from rest_framework.decorators import action
from rest_framework.response import Response

class IsAuthorOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed for any request
        if request.method in permissions.SAFE_METHODS:
            return True
        # Write permissions are only allowed to the author
        return obj.author == request.user

class BlogPostViewSet(viewsets.ModelViewSet):
    queryset = BlogPost.objects.all().order_by('-created_at')
    serializer_class = BlogPostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsAuthorOrReadOnly]
    
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def add_comment(self, request, pk=None):
        blog_post = self.get_object()
        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(author=request.user, post=blog_post)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsAuthorOrReadOnly]
    
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

class GameViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Game.objects.all()
    serializer_class = GameSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class WalletViewSet(viewsets.ModelViewSet):
    queryset = Wallet.objects.all()
    serializer_class = WalletSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    lookup_field = 'address'
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return WalletDetailSerializer
        return WalletSerializer
    
    @action(detail=False, methods=['post'])
    def connect(self, request):
        address = request.data.get('address')
        
        if not address:
            return Response({"error": "Wallet address is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        wallet, created = Wallet.objects.get_or_create(address=address)
        
        if not created:
            wallet.connection_count += 1
            wallet.save()
        
        serializer = self.get_serializer(wallet)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def update_nickname(self, request, address=None):
        wallet = self.get_object()
        nickname = request.data.get('nickname')
        
        if nickname:
            wallet.nickname = nickname
            wallet.save()
            
        serializer = self.get_serializer(wallet)
        return Response(serializer.data)

class GameHistoryViewSet(viewsets.ModelViewSet):
    queryset = GameHistory.objects.all()
    serializer_class = GameHistorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    @action(detail=False, methods=['post'])
    def record_game(self, request):
        wallet_address = request.data.get('wallet_address')
        game_id = request.data.get('game_id')
        score = request.data.get('score', 0)
        game_data = request.data.get('data', {})
        
        try:
            wallet = Wallet.objects.get(address=wallet_address)
            game = Game.objects.get(id=game_id)
            
            game_history = GameHistory.objects.create(
                wallet=wallet,
                game=game,
                score=score,
                data=game_data
            )
            
            serializer = self.get_serializer(game_history)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        except Wallet.DoesNotExist:
            return Response({"error": "Wallet not found"}, status=status.HTTP_404_NOT_FOUND)
        except Game.DoesNotExist:
            return Response({"error": "Game not found"}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=['get'])
    def leaderboard(self, request):
        game_id = request.query_params.get('game_id')
        
        if not game_id:
            return Response({"error": "game_id parameter is required"}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            game = Game.objects.get(id=game_id)
            # Get top 10 scores for the game
            top_scores = GameHistory.objects.filter(game=game).order_by('-score')[:10]
            serializer = self.get_serializer(top_scores, many=True)
            return Response(serializer.data)
            
        except Game.DoesNotExist:
            return Response({"error": "Game not found"}, status=status.HTTP_404_NOT_FOUND)
