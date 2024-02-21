from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates
from sqlalchemy.ext.associationproxy import association_proxy
import re

from config import db, bcrypt

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    serialize_rules = (
        '-_password_hash',
        '-players.user',
        '-players.games_with_white',
        '-players.games_with_black',
        '-games.user',
        '-games.white_player.user',
        '-games.black_player.user',
    )

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, nullable=False, unique=True)
    _password_hash = db.Column(db.String)

    players = db.relationship('Player', back_populates="user")
    games = db.relationship('Game', back_populates="user")
    saves = db.relationship('Save', back_populates='user', cascade='all, delete-orphan')
    saved_games = association_proxy('saves', 'game', 
                                    creator=lambda game_obj: Save(game=game_obj))

    @hybrid_property
    def password_hash(self):
        raise AttributeError()
    
    @password_hash.setter
    def password_hash(self, password):
        password_hash = bcrypt.generate_password_hash(password.encode('utf-8'))
        self._password_hash = password_hash.decode('utf-8')

    def authenticate(self, password):
        return bcrypt.check_password_hash(self._password_hash, password.encode('utf-8'))
    
class Player(db.Model, SerializerMixin):
    __tablename__ = 'players'

    serialize_rules = (
        '-user.players', 
        '-user.games',
        '-user.saves',
        '-games_with_white.white_player', 
        '-games_with_white.black_player',
        '-games_with_white.user',
        '-games_with_white.saves',
        '-games_with_black.white_player', 
        '-games_with_black.black_player',
        '-games_with_black.user',
        '-games_with_black.saves'
    )

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False, unique=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    user = db.relationship('User', back_populates='players')
    games_with_white = db.relationship('Game', primaryjoin="Player.id==Game.white_player_id", back_populates='white_player')
    games_with_black = db.relationship('Game', primaryjoin="Player.id==Game.black_player_id", back_populates='black_player')

class Game(db.Model, SerializerMixin):
    __tablename__ = 'games'

    serialize_rules = (
        '-user.games', 
        '-user.players',
        '-white_player.games_with_white', 
        '-white_player.games_with_black',
        '-white_player.user',
        '-black_player.games_with_white', 
        '-black_player.games_with_black',
        '-black_player.user'
    )

    id = db.Column(db.Integer, primary_key=True)
    pgn = db.Column(db.String, nullable=False)
    white_player_id = db.Column(db.Integer, db.ForeignKey('players.id'))
    black_player_id = db.Column(db.Integer, db.ForeignKey('players.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    @validates("pgn")
    def validate_pgn(self, key, pgn):
        regex = '((\s*)\[(.*?)\](\s*))*1\.(.*\n)*'
        if not re.search(regex, pgn):
            raise ValueError('Failed PGN validation')
        return pgn

    user = db.relationship('User', back_populates='games')
    white_player = db.relationship('Player', foreign_keys=[white_player_id], back_populates='games_with_white')
    black_player = db.relationship('Player', foreign_keys=[black_player_id], back_populates='games_with_black')
    saves = db.relationship('Save', back_populates='game', cascade='all, delete-orphan')
    users = association_proxy('saves', 'user',
                              creator=lambda user_obj: Save(user=user_obj))

class Save(db.Model, SerializerMixin):
    __tablename__ = 'saves'

    serialize_rules = (
        '-user.games',
        '-user.players', 
        '-user.saves',
        '-game.user',
        '-game.white_player.user',
        '-game.white_player.games_with_white',
        '-game.white_player.games_with_black',
        '-game.black_player.user',
        '-game.black_player.games_with_white',
        '-game.black_player.games_with_black',
        '-game.saves'
    )

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    game_id = db.Column(db.Integer, db.ForeignKey('games.id'))
    category = db.Column(db.String)

    user = db.relationship('User', back_populates='saves')
    game = db.relationship('Game', back_populates='saves')