from django.core.management.base import BaseCommand
from api.models import Game

class Command(BaseCommand):
    help = 'Loads initial game data into the database'

    def handle(self, *args, **kwargs):
        games_data = [
            {
                'name': 'Click Game',
                'description': 'Click as many times as you can in 10 seconds!'
            },
            {
                'name': 'Memory Match',
                'description': 'Find all matching pairs with the fewest moves possible.'
            },
            {
                'name': 'Word Scramble',
                'description': 'Unscramble words as quickly as you can.'
            },
            {
                'name': 'Math Challenge',
                'description': 'Solve math problems against the clock.'
            },
        ]

        for game_data in games_data:
            game, created = Game.objects.get_or_create(
                name=game_data['name'],
                defaults={'description': game_data['description']}
            )
            
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created game: {game.name}'))
            else:
                self.stdout.write(self.style.WARNING(f'Game already exists: {game.name}'))

        self.stdout.write(self.style.SUCCESS('Successfully loaded game data'))
