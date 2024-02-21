import React from "react";

import Save from "./Save";

function EditSave({ save, saves, onSetSaves, display, onSetDisplay, game }) {

    return (
        <>
            {display === "editing save" ? 
                <Save
                    save={save}
                    saves={saves}
                    onSetSaves={onSetSaves}
                    onSetDisplay={onSetDisplay}
                    game={game}
                    display={display}
                />
                : <p onClick={() => onSetDisplay('editing save')}>{save.comment}</p>
            }
        </>
    );
}

export default EditSave;