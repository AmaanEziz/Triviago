import React, { useRef, useState } from 'react'
import {Modal, Button} from 'react-bootstrap'
import 'whatwg-fetch'
import { useHistory } from "react-router-dom";
export function NewGameModal({ show, setShow, username }) {
    const nameRef = useRef()

    function handleClose() { setShow(false)  }
    const history=useHistory()

    function createGame() {//creates multiplayer game for user and takes them to the game [age]
        let data = {
            host: username, name: nameRef.current.value, participants: [username], inSession: false
        }
  
        fetch('/api/gamesessions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(async res => {
            let json = await res.json();
            console.log(json)

            history.push('/GameSession/' + json.id)

        })
    }

    return (
        <Modal
            show={show}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header closeButton>
                <Modal.Title>New Game</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h2>Game Title</h2>
                <input type="text" ref={nameRef}/>
        </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={createGame}>Create Game</Button>
            </Modal.Footer>
        </Modal>
    )
}