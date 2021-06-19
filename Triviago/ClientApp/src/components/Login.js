import React, { useRef, useState } from 'react'
import 'whatwg-fetch'
import { useHistory, Link } from "react-router-dom";
export function Login() {
    const usernameRef = useRef();
    const passwordRef = useRef()
    const [errorMessage, setErrorMessage] = useState("")
    const history = useHistory();
    async function handleSubmit(event) {
        event.preventDefault();
        let data = {
            username: usernameRef.current.value,
            password: passwordRef.current.value
        }
        await fetch('/api/authenticationauthorization/LoginRequest', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(async res => {
            res.json().then(SID => {
                if (SID == null) {
                    setErrorMessage("Invalid Credentials")
                }
                else {
                    history.push('/')
                }
            }).catch(err => { console.log(err) })

           
        })
    }

    return (
        <body id="body">

            <div style={{ margin: "auto", maxWidth: "50vw", minHeight: "90vh", border: "1px solid gray", boxShadow: "0 0 10px #9ecaed" }}>
                <h2 style={{ margin: "auto" }}>Triviago</h2>
                <h4>Sign In</h4>
                <form id="signup">
                    <div class="sep"></div>
                    <div style={{ color: "red" }}>{errorMessage}</div>

                    <div class="inputs">

                        <input ref={usernameRef} type="text" name="username" id="username" placeholder="Username" autofocus />

                        <input ref={passwordRef} type="password" name="password" id="password" placeholder="Password" />
                        <button id="submit" href="#" onClick={(e) => { handleSubmit(e) }}>SIGN UP</button>

                    </div>
                    <Link to="/Register">Don't have an account? Sign In</Link>

                </form>

            </div>


        </body>
    )
}