# Chess Library

Chess Library allows users to browse chess players and games, which can be filtered by player. 

![browse](/client/public/rubinstein.png)

If a user wishes to make an account, they are also able to add players and games, as well as save games with optional categories and comments. Games can also be edited or deleted, but only by the user that created that game.

![logged in](/client/public/loggedin.png)

 Games are visible to all users, but saves and their comments are visible only to the user that saved the game. The user is able to browse all of the games that they have saved or created, as will as filter them by category.

![saved games](/client/public/savedgames.png)

# Table of Contents

- [Technologies](#technologies)
- [Example](#example)
- [Code](#code)
    - [server](#server)
        - [app.py](#apppy)
        - [models.py](#modelspy)
        - [config.py](#configpy)
        - [seed.py](#seedpy)
    - [client](#client)
        - [index.js](#indexjs)
        - [index.html](#indexhtml)           
        - [index.css](#indexcss)
        - [components](#components)
            - [App.js](#appjs)
            - [NavBar.js](#navbarjs)  
            - [SignUp.js](#signupjs)
            - [Login.js](#loginjs)
            - [Home.js](#homejs)     
            - [Players.js](#playersjs)    
            - [AddPlayer.js](#addplayerjs) 
            - [Games.js](#gamesjs)
            - [AddGame.js](#addgamejs)
            - [GameDisplay.js](#gamedisplayjs)
            - [EditGame.js](#editgamejs)
            - [SaveButton.js](#savebuttonjs)
            - [Save.js](#savejs)
            - [EditSave.js](#editsavejs)
            - [SavedGames.js](#savedgamesjs)
        - [hooks](#hooks)
            - [useDocumentTitle.js](#usedocumenttitlejs)
            - [useSelectData.js](#useselectdatajs)
- [Acknowledgements](#acknowledgements)

# Technologies

- Python
- Flask
- Javascript
- React
- HTML
- CSS


# Code

## `server`

### `app.py` 

Contains the routes.

`Signup`
- `post` gets the JSON from the user request and tries to create a `User` instance. If the input is valid, it sets the `user_id` attribute of the session and returns the user. Otherwise, it returns an error.
  
`CheckSession`
- `get` checks the session for a `user_id` attribute. If it exists, it returns the associated user. If it does not exist, it returns an error.
    
`Login`
- `post` gets the JSON from the user request and checks for an matching user. If it exists, it sets the `user_id` attribute of the session and returns the user. Otherwise, it returns an error.

`Logout`
- `delete` sets the `user_id` attribute of the session to `None`.
    
`Players`
- `get` returns all of the players in the database.
- `post` gets the JSON from the user request and tries to create a new `Player` instance. If the input is valid, it returns the player. Otherwise, it returns an error.

`Games`
- `get` returns all of the games in the database.
- `post` gets the JSON from the user request and tries to create a new `Game` instance. If the input is valid, it returns the game. Otherwise, it returns an error.

`GamesByID`
- `get` returns the game matching the provided `id`.
- `patch` gets the JSON from the user request and tries to update the game that matches the provided `id`. If the input is valid, it returns the game. Otherwise, it returns an error.
- `delete` deletes the game matching the provided `id`.
        
`Saves`
- `get` returns all of the saves in the database.
- `post` gets the JSON from the user request and tries to create a new `Save` instance. If the input is valid, it returns the save. Otherwise, it returns an error.
        
`SavesByID`
- `get` returns the save matching the provided `id`.
- `patch` gets the JSON from the user request and tries to update the save that matches the provided `id`. If the input is valid, it returns the save. Otherwise, it returns an error.
- `delete` deletes the save matching the provided `id`.

`SavesByUserID`
- `get` returns all of the saves where `user_id` matches the provided `id`.

### `models.py`

Contains the models.

`User` model class

- 'users' table

- properties
    - `id` is the primary key.
    - `username` is a unique string.
    - `_password_hash` is a hybrid property. When it is set, the password provided is encrypted using bycrypt. Trying to access its value will raise an `AttributeError`

- relationships
    - `players` is all of the players created by the user.
    - `games` is all of the games created by the user.
    - `saves` is all of the saves created by the user.
    - `saved_games` is all of the games saved by the user.

- methods
    - `authenticate` checks that a provided password matches `_password_hash`
    
`Player` model class

- 'players' table

- properties
    - `id` is the primary key.
    - `name` is a unique string.
    - `user_id` is a foreign key referencing a user.

- relationships
    - `user` is the user who created the player
    - `games_with_white` is all of the games where the player has the white pieces.
    - `games_with_black` is all of the games where the player has the black pieces.

`Game` model class

- 'games' table

- properties
    - `id` is the primary key.
    - `pgn` is a string.
    - `white_player_id` is a foreign key referencing a player.
    - `black_player_id` is a foreign key referencing a player.
    - `user_id` is a foreign key referencing a user.

- relationships
    - `user` is the user that created the game.
    - `white_player` is the player with the white pieces.
    - `black_player` is the player with the black pieces.
    - `saves` is all of the saves associated with the game.
    - `users` is all of the users that have saves the game.

- methods
    - `validate_pgn` checks that `pgn` is in valid PGN format.

`Save` model class

- 'saves' table

- properties
    - `id` is the primary key.
    - `user_id` is a foreign key referencing a user.
    - `game_id` is a foreign key referencing a game.
    - `category` is a string.
    - `comment` is a string.

- relationships
    - `user` is the user who created the save.
    - `game` is the game associated with the save.

### `config.py`

Contains the database and API configuration.

### `seed.py`

Deletes all record from the database, then seeds the database with users, players, games, and saves.

## `client`

### `index.js`

Renders the `App` component, wrapped in `<BrowserRouter>`, to the root of the HTML document.

### `index.html`

Contains link and script tags for the Chess Tempo PGN viewer.

### `index.css`

Contains the styling for the app.

### `components`

#### `App.js`

Houses state for `user`, `players`, `games`, and `saves`.

Makes a GET request to the /check_session endpoint. If the response is okay, sets the `user` state.
If the user state is set, makes a GET request to the user/id/saved endpoint. If the response is okay, sets the `saves` state.
Makes a GET request to the /players endpoint. If the response is okay, sets the `players` state.
Makes a GET request to the /games endpoint. If the response is okay, sets the `games` state.

Returns the `Navbar` component as well as routes to the `Home`, `SavedGames`, `Login`, and `SignUp` components, wrapped in `<Switch>`.

#### `NavBar.js`

Handles logging a user out by making a DELETE request to the /logout endpoint and redirecting the user to the home page.

Returns `<Navlink>`s to the home, login, and signup routes if no user is logged in.
Returns `<Navlink>`s to the home and saved routes as well as a greeting and a logout button if a user is logged in.

#### `SignUp.js`

Uses yup and formik for form schema and validation.

Makes a POST request to the /signup endpoint on form submission. If the response is okay, sets the `user` state and redirects to the home page.

Returns a form with fields username, password, and password confirmation.

#### `Login.js`

Uses yup and formik for form schema and validation.

Makes a POST request to the /login endpoint on form submission. If the response is okay, sets the `user` state and redirects to the home page.

Returns a form with fields username and password.

#### `Home.js`

Houses state for `activePlayerID`.

Filters games based on `activePlayerID`.

Returns the `Players` and `Games` components.

#### `Players.js`

Houses state for `query`.

Filters displayed players using `query`.

Returns a search bar, the `AddPlayer` component if a user is logged in, and a list of players that, when clicked, set the `activePlayerID` state.

#### `AddPlayer.js`

Houses an `isEditing` state that dictates whether the form is visible.

Uses yup and formik for form schema and validation.

Makes a POST request to the /players endpoint on form submission. If the response is okay, sets the `players` state and clears and closes the form.

Returns an Add Player button if `isEditing` is false.
Returns a form with input for a player name if `isEditing` is true.

#### `Games.js`

Returns the `AddGame` component if a user is logged in and a `GameDisplay` component for each game.

#### `AddGame.js`

Houses an `isEditing` state that dictates whether the form is visible.

Uses yup and formik for form schema and validation.

Makes a POST request to the /games endpoint on form submission. If the response is okay, sets the `games` state and clears and closes the form.

Returns an Add Game button if `isEditing` is false.
Returns a form with input for a game PGN, white player, and black player if `isEditing` is true.

#### `GameDisplay.js`

Houses `display` state.

Handles game deletion by making a DELETE request to the /games/id endpoint. If the response is okay, it sets the `games` state.

Returns a game heading with the player names.
If a user is logged in, also returns the `SaveButton` component.
If the logged in user has saved the game and added a comment, also returns the `EditSave` component.
If the logged in user created the game, also returns edit and delete buttons.
Returns one of the following, based on the value of the `display` state:
- A PGN viewer displaying the game
- The `EditGame` component
- A prompt for the user to confirm or cancel deletion
- The `Save` component

#### `EditGame.js`

Uses yup and formik for form schema and validation.

Makes a PATCH request to the /games/id endpoint on form submission. If the response is okay, sets the `games` state, clears the form, and sets the `display` state to 'game'.

Returns a form with input for a game PGN, white player, and black player, initially set to the values of the game being edited.

#### `SaveButton.js`

Handles save deletion by making a DELETE request to the /saves/id endpoint. If the response is okay, it sets the `saves` state.

Returns either a save or remove save button based on whether a save exists for the game.

#### `Save.js`

Uses yup and formik for form schema and validation.

If the value of the `display` state is 'save', makes a POST request to the /saves endpoint on form submission.
If the value of the `display` state is 'edit save', makes a PATCH request to the /saves/id endpoint on form submission. 
If the response is okay, sets the `saves` state, clears the form, and sets the `display` state to 'game'.

Returns a form with input for category and comment. If the value of the `display` state is 'edit save', the initial values of the form are the values of the current save.

#### `EditSave.js`

Returns the `Save` component if the value of the `display` state is 'editing save'. Otherwise, returns a comment display that sets the `display` state to 'editing save' when clicked.

#### `SavedGames.js`

Houses `visible` state.

Filters saves by category specified by `visible` state.
Maps saves to corresponding games.

Returns buttons for each category that, when clicked, set the `visible` state to that category.
Returns a `GameDisplay` component for each game in the category specified by the `visible` state.

### `hooks`

#### `useDocumentTitle.js`

Sets the document title.

#### `useSelectData.js`

Handles select and create functions of React Select componenets.

# Acknowledgements

- Thank you to Siderite for creating a great [regular expression for PGN (Portable Game Notation)](https://regexlib.com/REDetails.aspx?regexp_id=3355).
- Thank you to Chess Tempo for the [PGN viewer](https://chesstempo.com/pgn-viewer/).