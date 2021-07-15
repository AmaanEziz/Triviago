import React, { useEffect, useState } from 'react'
import 'whatwg-fetch'
import { useHistory } from "react-router-dom";
import { useCookies } from 'react-cookie';
import {Table, Button} from 'react-bootstrap'
export function MultiplayerLobby() {
    const [gameSessions, setGameSessions] = useState([])
    const [cookies, setCookie] = useCookies(['gameSID']);

    const history = useHistory();

    useEffect( () => {
        fetch("/api/gamesessions").then(res => {
            console.log(res)
            res.json().then(sessionsArr => {
                console.log(sessionsArr)
                setGameSessions(sessionsArr)
            })
            
        })
    }, [])

    return (

        <body>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Host</th>
                        <th>Game Name</th>
                        <th>Participants</th>
                        <th>Join</th>
                    </tr>
                </thead>
                <tbody>
                    {gameSessions.map(session => (
                     
                        <tr>
                            <td>{session.id}</td>
                            <td>{session.host}</td>
                            <td>{session.name}</td>
                            <td>{session.participants.length}</td>
                            { session.inSession ? <span> In Session </span> : 
                            <Button onClick={() =>
                            {
                                history.push('/GameSession/'+session.id)
                            }}>Join</Button>
                            }
                        </tr>
                    ))}
                </tbody>
            </Table>
          

        </body>
    )
}