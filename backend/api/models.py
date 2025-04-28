from django.db import models
from django.contrib.auth.models import User

class BlogPost(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    featured_image = models.ImageField(upload_to='blog_images/', null=True, blank=True)
    
    def __str__(self):
        return self.title

class Comment(models.Model):
    post = models.ForeignKey(BlogPost, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Comment by {self.author.username} on {self.post.title}"

class Wallet(models.Model):
    address = models.CharField(max_length=42, unique=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    nickname = models.CharField(max_length=50, blank=True, null=True)
    first_connection = models.DateTimeField(auto_now_add=True)
    last_connection = models.DateTimeField(auto_now=True)
    connection_count = models.IntegerField(default=1)
    
    def __str__(self):
        return f"{self.address} ({self.nickname if self.nickname else 'Anonymous'})"

class Game(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return self.name

class GameHistory(models.Model):
    wallet = models.ForeignKey(Wallet, on_delete=models.CASCADE, related_name='game_history')
    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    score = models.IntegerField(default=0)
    played_at = models.DateTimeField(auto_now_add=True)
    data = models.JSONField(default=dict, blank=True)  # For any additional game data
    
    class Meta:
        ordering = ['-played_at']
    
    def __str__(self):
        return f"{self.wallet.address} - {self.game.name} - {self.score}"
