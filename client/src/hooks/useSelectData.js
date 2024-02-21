function useSelectData(formik, setWhite, setBlack, players, onSetPlayers) {

    function handleSelect(color, player) {
        if (player === null) {
            formik.setFieldValue(color, '');   
        } else {
            formik.setFieldValue(color, player["value"]);
        }

        if (color === "white_player") {
            setWhite(player);
        } else if (color === "black_player") {
            setBlack(player);
        }
    }

    function handleCreate(color, newPlayer) {
        fetch("/players", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({name: newPlayer}, null, 2)
        }).then((r) => {
            if (r.status === 201) {
                r.json()
                .then((player) => {
                    onSetPlayers([...players, player]);
                    formik.setFieldValue(color, player.name);
                    
                    if (color === "white_player") {
                        setWhite({ value: player.name, label: player.name });
                    } else if (color === "black_player") {
                        setBlack({ value: player.name, label: player.name });
                    }
                });
            }
        });
    }

    return { handleSelect, handleCreate };
}

export default useSelectData;