import React, { useEffect, useState} from 'react'
import 'whatwg-fetch'
import { useHistory} from "react-router-dom";
export function Homepage() {

    const [username, setUsername] = useState("");
    const [highscore, setHighscore] = useState("")
    const history = useHistory();
    useEffect( () => {
        fetch('/api/authenticationauthorization').then((response) => {
            response.json().then(user => {
                if (user == null) {
                    history.push('/login')
                }
                else {
                    
                    console.log(user)
                    setUsername(user.username);
                    setHighscore(user.highScore)
                }
            })
        })

    }, [])

    return (

        <body>
            <div class="d-flex justify-content-around">
                <button onClick={() => {history.push('/soloPlay') }}>Start Solo Game</button>
                <button>Start multiplayer game</button>
                <div>Your high score: {highscore} </div>
               
            </div>
         
        </body>
    )
}