import React, { useEffect, useState } from 'react'
import { useHistory } from "react-router-dom";
import {Table, Button} from 'react-bootstrap'
import { GetAllSessions } from '../CrudFunctions/Read/GetAllSessions';
export function MultiplayerLobby() {
    const [gameSessions, setGameSessions] = useState([])
    const history = useHistory();

    useEffect( () => {
        async function setGameSessionsState() {
            setGameSessions(await GetAllSessions())
        }
        setGameSessionsState()
    }, [])

    return (

        <body>
            <Table striped bordered hover>
                <thead>
                    <tr style={{ textAlign: "center" }}>
                        <th>ID</th>
                        <th>Host</th>
                        <th>Game Name</th>
                        <th>Participants</th>
                        <th>Join</th>
                    </tr>
                </thead>
                <tbody>
                    {gameSessions.map(session => (
                   
                        <tr style={{ textAlign: "center" }}>
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