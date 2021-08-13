import React, { useRef, useState } from 'react'
import {Modal, Button} from 'react-bootstrap'
import 'whatwg-fetch'
import { useHistory } from "react-router-dom";
import { PostGameSession } from '../CrudFunctions/Create/PostGameSession';

export function NewGameModal({ show, setShow, username }) {
    const nameRef = useRef()

    const history=useHistory()

    function handleClose() { setShow(false) }
    async function  createGame() {//creates multiplayer game for user and takes them to the game [age]
        let gameSession = {
            host: username, name: nameRef.current.value, participants: [username], inSession: false
        }
  
        let postedSession =await PostGameSession(gameSession)
 
        history.push('/GameSession/' + postedSession.id)

       
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