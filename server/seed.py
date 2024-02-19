from random import randint, choice as rc

from faker import Faker

from app import app
from models import db, User

if __name__ == '__main__':

    # fake = Faker()

    with app.app_context():
        
        print("Deleting records...")
        User.query.delete()

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
        db.session.commit()
        print("Database seeded.")
