from random import randint, choice as rc

from faker import Faker

from app import app
from models import db, User, Player

if __name__ == '__main__':

    with app.app_context():
        
        print("Deleting records...")
        User.query.delete()
        Player.query.delete()

        fake = Faker()

        print('Creating users...')

        users = []
        usernames = []

        for i in range(20):
            username = fake.first_name()
            while username in usernames:
                username = fake.first_name()
            usernames.append(username)

            user = User(
                username=username
            )

            user.password_hash = user.username + 'password'

            users.append(user)

        db.session.add_all(users)

        print("Creating players...")

        players = []

        names = [
                    "Anatoly Karpov", 
                    "Aron Nimzowitsch",
                    "Fabiano Caruana",
                    "Garry Kasparov", 
                    "Magnus Carlsen", 
                    "Miguel Najdorf",
                    "Mikhail Tal",
                    "Tigran Petrosian",
                    "Vasyl Ivanchuk",
                    "Viswanathan Anand"
                ]
        
        for name in names:
            player = Player(
                name=name,
                user_id=randint(1, 20)
            )

            players.append(player)

        db.session.add_all(players)

        db.session.commit()
        print("Database seeded.")
