from flask import jsonify, request, session, make_response
from flask_restful import Resource
from sqlalchemy.exc import IntegrityError

from config import app, db, api
from models import User, Player, Game, Save


@app.route('/')
def index():
    return '<h1>Project Server</h1>'

class Signup(Resource):

    def post(self):
        request_json = request.get_json()

        username = request_json.get('username')
        password = request_json.get('password')
        password_confirmation = request_json.get('password_confirmation')

        user = User(
            username = username
        )

        if password == password_confirmation:
            user.password_hash = password

            try:
                db.session.add(user)
                db.session.commit()

                session['user_id'] = user.id

                return make_response(user.to_dict(), 201)
        
            except IntegrityError:

                return make_response({'error': '422 Unprocessable Entity'}, 422)
        
        else:
            
            return make_response({'error': '403 Forbidden'}, 403)
        
class CheckSession(Resource):

    def get(self):
        user_id = session['user_id']

        if user_id:
            user = User.query.filter(User.id == user_id).first()

            return make_response(user.to_dict(), 200)
        
        return make_response({'error': '401 Unauthorized'}, 401)
    
class Login(Resource):
    
    def post(self):
        request_json = request.get_json()

        username = request_json.get('username')
        password = request_json.get('password')

        user = User.query.filter(User.username == username).first()

        if user:
            if user.authenticate(password):
                session['user_id'] = user.id

                return make_response(user.to_dict(), 200)
        
        return make_response({'error': '401 Unauthorized'}, 401)

class Logout(Resource):
    
    def delete(self):
        
        if session['user_id']:
            session['user_id'] = None

            return make_response({}, 204)
        
        return make_response({'error': '401 Unauthorized'}, 401)
    
class Players(Resource):
    
    def get(self):

        players = [player.to_dict() for player in Player.query.all()]
        
        return make_response(jsonify(players), 200)
    
    def post(self):
        request_json = request.get_json()

        name = request_json.get('name')
        user_id = session['user_id']

        if user_id: 

            player = Player(
                name=name,
                user_id=user_id 
            )

            try:
                db.session.add(player)
                db.session.commit()

                return make_response(player.to_dict(), 201)
        
            except IntegrityError:

                return make_response({'error': '422 Unprocessable Entity'}, 422)
        
        else: 

            return make_response({'error': '403 Forbidden'}, 403)

class Games(Resource):

    def get(self):
        
        games = [game.to_dict() for game in Game.query.all()]

        return make_response(jsonify(games), 200)
    
    def post(self):
        request_json = request.get_json()

        pgn = request_json.get('pgn')
        white_player_name = request_json.get('white_player')  
        black_player_name = request_json.get('black_player')  

        white_player = Player.query.filter(Player.name == white_player_name).first()
        black_player = Player.query.filter(Player.name == black_player_name).first()

        user_id = session['user_id']
      
        if user_id:

            try:
                game = Game(
                    pgn=pgn,
                    white_player_id=white_player.id,
                    black_player_id=black_player.id,
                    user_id=user_id
                )

                db.session.add(game)
                db.session.commit()

                return make_response(game.to_dict(), 201)
            
            except ValueError:

                return make_response({'error': '422 Unprocessable Entity'}, 422)
            
        else:

            return make_response({'error': '403 Forbidden'}, 403)

class GamesByID(Resource):

    def get(self, id):

        game = Game.query.filter(Game.id == id).first()

        return make_response(game.to_dict(), 200)
    
    def patch(self, id):

        request_json = request.get_json()

        pgn = request_json.get('pgn')
        white_player_name = request_json.get('white_player')  
        black_player_name = request_json.get('black_player')  

        white_player = Player.query.filter(Player.name == white_player_name).first()
        black_player = Player.query.filter(Player.name == black_player_name).first()

        game = Game.query.filter(Game.id == id).first()

        user_id = session['user_id']

        if user_id == game.user_id:

            try: 
                
                game.pgn = pgn
                game.white_player_id = white_player.id
                game.black_player_id = black_player.id

                db.session.add(game)
                db.session.commit()

                return make_response(game.to_dict(), 200)
            
            except ValueError:
                
                return make_response({'error': '422 Unprocessable Entity'}, 422)
            
        else:

            return make_response({'error': '403 Forbidden'}, 403)
    
    def delete(self, id):

        game = Game.query.filter(Game.id == id).first()

        user_id = session['user_id']

        if user_id == game.user_id:

            db.session.delete(game)
            db.session.commit()

            return make_response({}, 204)
        
        else:

            return make_response({'error': '403 Forbidden'}, 403)
        
class Saves(Resource):
    
    def get(self):

        saves = [save.to_dict() for save in Save.query.all()]

        return make_response(jsonify(saves), 200)
    
    def post(self):

        request_json = request.get_json()

        category = request_json.get('category')
        game_id = request_json.get('game_id')

        user_id = session['user_id']

        if user_id:

            try:

                save = Save(
                    user_id=user_id,
                    game_id=game_id,
                    category=category
                )

                db.session.add(save)
                db.session.commit()

                return make_response(save.to_dict(), 201)

            except ValueError:

                return make_response({'error': '422 Unprocessable Entity'}, 422)
            
        else:

            return make_response({'error': '403 Forbidden'}, 403)
        
class SavesByID(Resource): 
    
    def get(self, id):

        save = Save.query.filter(Save.id == id).first()

        return make_response(save.to_dict(), 200)
    
    def patch(self, id):

        data = request.get_json()

        save = Save.query.filter(Save.id == id).first()

        user_id = session['user_id']

        if user_id == save.user_id:

            try: 
                
                for attr in data:
                    setattr(save, attr, data[attr])

                db.session.add(save)
                db.session.commit()

                return make_response(save.to_dict(), 200)
            
            except ValueError:
                
                return make_response({'error': '422 Unprocessable Entity'}, 422)
            
        else:

            return make_response({'error': '403 Forbidden'}, 403)
    
    def delete(self, id):

        save = Save.query.filter(Save.id == id).first()

        user_id = session['user_id']

        if user_id == save.user_id:

            db.session.delete(save)
            db.session.commit()

            return make_response({}, 204)
        
        else:

            return make_response({'error': '403 Forbidden'}, 403)


api.add_resource(Signup, '/signup', endpoint='signup')
api.add_resource(CheckSession, '/check_session', endpoint='check_session')
api.add_resource(Login, '/login', endpoint='login')
api.add_resource(Logout, '/logout', endpoint='logout')
api.add_resource(Players, '/players', endpoint='players')
api.add_resource(Games, '/games', endpoint='games')
api.add_resource(GamesByID, '/games/<int:id>', endpoint='games/<int:id>')
api.add_resource(Saves, '/saves', endpoint='saves')
api.add_resource(SavesByID, '/saves/<int:id>', endpoint='saves/<int:id>')

if __name__ == '__main__':
    app.run(port=5555, debug=True)