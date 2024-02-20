from random import randint, choice as rc

from faker import Faker

from app import app
from models import db, User, Player, Game

if __name__ == '__main__':

    with app.app_context():
        
        print("Deleting records...")
        User.query.delete()
        Player.query.delete()
        Game.query.delete()

        fake = Faker()

        print('Creating users...')

        users = []
        usernames = []

        maria = User(username='Maria')
        maria.password_hash = 'chess'
        usernames.append('Maria')
        users.append(maria)

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

        kasparov = Player(
            name="Garry Kasparov",
            user_id=1
        )
        players.append(kasparov)

        topalov = Player(
            name="Veselin Topalov",
            user_id=1
        )
        players.append(topalov)

        names = [
                    "Anatoly Karpov", 
                    "Aron Nimzowitsch",
                    "Fabiano Caruana",
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
                user_id=randint(2, 21)
            )

            players.append(player)

        db.session.add_all(players)

        print("Creating games...")

        games = []

        game1 = Game(
            pgn='''
                [Event "Hoogovens Group A"]
                [Site "Wijk aan Zee NED"]
                [Date "1999.01.20"]
                [EventDate "1999.01.16"]
                [Round "4"]
                [Result "1-0"]
                [White "Garry Kasparov"]
                [Black "Veselin Topalov"]
                [ECO "B07"]
                [WhiteElo "2812"]
                [BlackElo "2700"]
                [PlyCount "87"]

                1. e4 d6 2. d4 Nf6 3. Nc3 g6 4. Be3 Bg7 5. Qd2 c6 6. f3 b5
                7. Nge2 Nbd7 8. Bh6 Bxh6 9. Qxh6 Bb7 10. a3 e5 11. O-O-O Qe7
                12. Kb1 a6 13. Nc1 O-O-O 14. Nb3 exd4 15. Rxd4 c5 16. Rd1 Nb6
                17. g3 Kb8 18. Na5 Ba8 19. Bh3 d5 20. Qf4+ Ka7 21. Rhe1 d4
                22. Nd5 Nbxd5 23. exd5 Qd6 24. Rxd4 cxd4 25. Re7+ Kb6
                26. Qxd4+ Kxa5 27. b4+ Ka4 28. Qc3 Qxd5 29. Ra7 Bb7 30. Rxb7
                Qc4 31. Qxf6 Kxa3 32. Qxa6+ Kxb4 33. c3+ Kxc3 34. Qa1+ Kd2
                35. Qb2+ Kd1 36. Bf1 Rd2 37. Rd7 Rxd7 38. Bxc4 bxc4 39. Qxh8
                Rd3 40. Qa8 c3 41. Qa4+ Ke1 42. f4 f5 43. Kc1 Rd2 44. Qa7 1-0
            ''',
            white_player_id=1,
            black_player_id=2,
            user_id=1
        )
        games.append(game1)

        db.session.add_all(games)

        db.session.commit()
        print("Database seeded.")
