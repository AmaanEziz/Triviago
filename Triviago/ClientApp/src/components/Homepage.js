import React, { useEffect, useState} from 'react'
import 'whatwg-fetch'
import { useHistory } from "react-router-dom";
import { useCookies } from 'react-cookie';
export function Homepage() {
 
    const [username, setUsername] = useState("");
    const [highscore, setHighscore] = useState("")
    const [cookies, setCookie] = useCookies(['SID']);

    const history = useHistory();
   async function logout() {
        await fetch('/api/authenticationauthorization', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify()
        }).then(res => {
            if (res.status == 200) {
                console.log("logout success")
                history.push('/login')
            }
           
        })
    }
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
                <button onClick={logout}>Logout</button>
            </div>
         
        </body>
    )
}