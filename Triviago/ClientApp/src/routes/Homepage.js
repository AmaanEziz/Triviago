import React, { useEffect, useState} from 'react'
import { useHistory } from "react-router-dom";
import { Button, Card } from 'react-bootstrap'
import {NewGameModal} from './NewGameModal'
import '../routeStyles/homepageStyles.css'
import {GetUser} from '../logicComponents/GetUser'
export function Homepage() {
 
    const [user, setUser] = useState({username:"",highScore:0,gamesWon:0})
    const [show,setShow]=useState(false)
    const history=useHistory()

    function logout() {

        //Deletes SID cookie

       fetch('/api/authenticationauthorization', {
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
        document.cookie = "SID=; expires=Thu, 18 Dec 2013 12:00:00 UTC; path=/";
    }
    useEffect( () => {// Get user's information from DB
        async function setUserState() {
            setUser(await GetUser(history))
        }
        setUserState();

    }, [])

    return (

        <body>
            <NewGameModal show={show} setShow={setShow} username={user.username}/>
            <div class="d-flex justify-content-around" id="topPortion" style={{flexWrap:"wrap"}}>
                <Button class="btn"  variant="primary"onClick={() => {history.push('/soloPlay') }}>Start Solo Game</Button>
                <Button class="btn" variant="success" onClick={() => { history.push('/MultiplayerLobby') }}>Join Game</Button>
                <Button class="btn" variant="info " onClick={() => { setShow(true) }}>Create Game</Button>
            </div>
            <div class="d-flex justify-content-around" id="bottomPortion" style={{ flexWrap: "wrap" }}>
            <Card bg="warning" id="scoreBanner">
                <Card.Header class="cardContent">High Score</Card.Header>
                <Card.Body>
                   
                    <Card.Text class="cardContent">
                            {user.highScore}
                    </Card.Text>
                </Card.Body>
                </Card>
                <Card bg="danger" id="gamesBanner">
                    <Card.Header class="cardContent">Games Won</Card.Header>
                    <Card.Body>

                        <Card.Text class="cardContent">
                            {user.gamesWon}
                        </Card.Text>
                    </Card.Body>
                </Card>
                <Button variant="dark" onClick={logout}>Logout</Button>
            </div>
        </body>
    )
}