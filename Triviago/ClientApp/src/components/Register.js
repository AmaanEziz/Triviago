import React, { useRef, useState } from 'react'
import 'whatwg-fetch'

import { useHistory, Link } from "react-router-dom";
export function Register() {
    const verifiedPasswordRef = useRef();
    const usernameRef = useRef();
    const passwordRef = useRef();
    const [errorMessage, setErrorMessage] = useState("")
    const history = useHistory();
    async function handleSubmit(event) {
        event.preventDefault();
        console.log("button hit")
        if (passwordRef.current.value !== verifiedPasswordRef.current.value) {
            setErrorMessage("Passwords do not match");
            return;
        }
        let data = {
            username: usernameRef.current.value,
            password: passwordRef.current.value
        }
        console.log(data);
        await fetch('/api/authenticationauthorization', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(response => {
            if (response.status === 200) {
                console.log("success occured")
                history.push('/homepage');

            }
            else {
                console.log("failure occured")
                setErrorMessage("Username already taken")
            }
        })
    }

    return (
        <body id="body">

            <div style={{ margin: "auto", maxWidth: "50vw", minHeight: "90vh", border: "1px solid gray", boxShadow: "0 0 10px #9ecaed" }}>
                <h2 style={{ margin: "auto" }}>Triviago</h2>
                <h4>Create An Account</h4>
                <form id="signup">
                    <div class="sep"></div>
                    <div style={{ color: "red" }}>{errorMessage}</div>

                    <div class="inputs">

                        <input ref={usernameRef} type="text" name="username" id="username" placeholder="Username" autofocus />

                        <input ref={passwordRef} type="password" name="password" id="password" placeholder="Password" />
                        <input ref={verifiedPasswordRef} type="password" placeholder="Verify Password" />


                        <button id="submit" href="#" onClick={(e) => { handleSubmit(e) }}>SIGN UP</button>

                    </div>
                    <Link to="/login">Already have an account? Sign in</Link>

                </form>

            </div>


        </body>
    )
}