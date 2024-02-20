import React from "react";

function GameDisplay({ game }) {

    return (
        <div className="game">
            <h3>{game.white_player.name} - {game.black_player.name}</h3>        
            <ct-pgn-viewer 
                move-list-moveListStyle='twocolumn'
                board-boardStyle='brown'
                board-resizable='true'
                board-allowdrawing='true'
                board-size='400px'
                board-highlight-move-square-colour='false'
                board-disable-sound='true'
            >
                {game.pgn}
            </ct-pgn-viewer>
        </div>
    )
}

export default GameDisplay