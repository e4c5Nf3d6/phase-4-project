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

        karpov = Player(
            name="Anatoly Karpov", 
            user_id=1
        )
        players.append(karpov)

        anand = Player(
            name="Viswanathan Anand",
            user_id=1
        )
        players.append(anand)

        names = [
                    "Aron Nimzowitsch",
                    "Fabiano Caruana",
                    "Magnus Carlsen", 
                    "Miguel Najdorf",
                    "Mikhail Tal",
                    "Tigran Petrosian",
                    "Vasyl Ivanchuk"
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

        game2 = Game(
            pgn='''
                [Event "Linares"]
                [Site "Linares ESP"]
                [Date "1993.03.09"]
                [EventDate "1993.02.23"]
                [Round "10"]
                [Result "0-1"]
                [White "Anatoly Karpov"]
                [Black "Garry Kasparov"]
                [ECO "E86"]
                [WhiteElo "?"]
                [BlackElo "?"]
                [PlyCount "54"]

                1.d4 Nf6 2.c4 g6 3.Nc3 Bg7 4.e4 d6 5.f3 O-O 6.Be3 e5 7.Nge2 c6
                8.Qd2 Nbd7 9.Rd1 a6 10.dxe5 Nxe5 11.b3 b5 12.cxb5 axb5 13.Qxd6
                Nfd7 14.f4 b4 15.Nb1 Ng4 16.Bd4 Bxd4 17.Qxd4 Rxa2 18.h3 c5
                19.Qg1 Ngf6 20.e5 Ne4 21.h4 c4 22.Nc1 c3 23.Nxa2 c2 24.Qd4
                cxd1=Q+ 25.Kxd1 Ndc5 26.Qxd8 Rxd8+ 27.Kc2 Nf2 0-1
            ''',
            white_player_id=3,
            black_player_id=1,
            user_id=1
        )
        games.append(game2)

        game3 = Game(
            pgn='''
                [Event "Kasparov - Anand PCA World Championship Match"]
                [Site "New York, NY USA"]
                [Date "1995.09.26"]
                [EventDate "?"]
                [Round "10"]
                [Result "1-0"]
                [White "Garry Kasparov"]
                [Black "Viswanathan Anand"]
                [ECO "C80"]
                [WhiteElo "?"]
                [BlackElo "?"]
                [PlyCount "75"]

                1.e4 e5 2.Nf3 Nc6 3.Bb5 a6 4.Ba4 Nf6 5.O-O Nxe4 6.d4 b5 7.Bb3
                d5 8.dxe5 Be6 9.Nbd2 Nc5 10.c3 d4 11.Ng5 dxc3 12.Nxe6 fxe6
                13.bxc3 Qd3 14.Bc2 Qxc3 15.Nb3 Nxb3 16.Bxb3 Nd4 17.Qg4 Qxa1
                18.Bxe6 Rd8 19.Bh6 Qc3 20.Bxg7 Qd3 21.Bxh8 Qg6 22.Bf6 Be7
                23.Bxe7 Qxg4 24.Bxg4 Kxe7 25.Rc1 c6 26.f4 a5 27.Kf2 a4 28.Ke3
                b4 29.Bd1 a3 30.g4 Rd5 31.Rc4 c5 32.Ke4 Rd8 33.Rxc5 Ne6 34.Rd5
                Rc8 35.f5 Rc4+ 36.Ke3 Nc5 37.g5 Rc1 38.Rd6 1-0
            ''',
            white_player_id=1,
            black_player_id=4,
            user_id=1            
        )
        games.append(game3)

        db.session.add_all(games)

        db.session.commit()
        print("Database seeded.")
