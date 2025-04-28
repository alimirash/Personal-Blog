from rest_framework import serializers
from django.contrib.auth.models import User
from .models import BlogPost, Comment, Wallet, Game, GameHistory

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

class CommentSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    
    class Meta:
        model = Comment
        fields = ['id', 'author', 'content', 'created_at']
        read_only_fields = ['created_at']

class BlogPostSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    comments = CommentSerializer(many=True, read_only=True)
    
    class Meta:
        model = BlogPost
        fields = ['id', 'title', 'content', 'author', 'created_at', 'updated_at', 'featured_image', 'comments']
        read_only_fields = ['created_at', 'updated_at']

class GameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = ['id', 'name', 'description']

class WalletSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wallet
        fields = ['id', 'address', 'nickname', 'first_connection', 'last_connection', 'connection_count']
        read_only_fields = ['first_connection', 'last_connection', 'connection_count']

class GameHistorySerializer(serializers.ModelSerializer):
    game_name = serializers.ReadOnlyField(source='game.name')
    
    class Meta:
        model = GameHistory
        fields = ['id', 'wallet', 'game', 'game_name', 'score', 'played_at', 'data']
        read_only_fields = ['played_at']

class WalletDetailSerializer(serializers.ModelSerializer):
    game_history = GameHistorySerializer(many=True, read_only=True)
    total_games_played = serializers.SerializerMethodField()
    high_scores = serializers.SerializerMethodField()
    
    class Meta:
        model = Wallet
        fields = ['id', 'address', 'nickname', 'first_connection', 'last_connection', 
                  'connection_count', 'game_history', 'total_games_played', 'high_scores']
    
    def get_total_games_played(self, obj):
        return obj.game_history.count()
    
    def get_high_scores(self, obj):
        games = Game.objects.all()
        result = {}
        
        for game in games:
            highest = obj.game_history.filter(game=game).order_by('-score').first()
            if highest:
                result[game.name] = highest.score
            else:
                result[game.name] = 0
                
        return result
