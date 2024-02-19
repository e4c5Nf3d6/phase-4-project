from flask import request, session, make_response
from flask_restful import Resource
from sqlalchemy.exc import IntegrityError

from config import app, db, api
from models import User


@app.route('/')
def index():
    return '<h1>Project Server</h1>'

class Signup(Resource):

    def post(self):
        request_json = request.get_json()

        username = request_json.get('username')
        password = request_json.get('password')

        user = User(
            username = username
        )
        user.password_hash = password

        try:
            db.session.add(user)
            db.session.commit()

            session['user_id'] = user.id

            return make_response(user.to_dict(), 201)
        
        except IntegrityError:

            return make_response({'error': '422 Unprocessable Entity'}, 422)
        
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


api.add_resource(Signup, '/signup', endpoint='signup')
api.add_resource(CheckSession, '/check_session', endpoint='check_session')
api.add_resource(Login, '/login', endpoing='login')
api.add_resource(Logout, '/logout', endpoint='logout')

if __name__ == '__main__':
    app.run(port=5555, debug=True)