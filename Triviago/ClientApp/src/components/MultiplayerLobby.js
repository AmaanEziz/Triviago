import React, { useEffect, useState } from 'react'
import 'whatwg-fetch'
import { useHistory } from "react-router-dom";
import { useCookies } from 'react-cookie';
import {Table} from 'react-bootstrap'
export function MultiplayerLobby() {

  
    return (

        <body>
            
            <Table striped boardered size="sm" responsive style={{ marginTop:"5vh" }}>
                <thead>
                    <tr>
                        <th>Game Session</th>
                        <th>Creator</th>
                        <th>Name</th>
                        <th>Current Participants</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        
                    </tr>
                  
                </tbody>
            </Table>

        </body>
    )
}