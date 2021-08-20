import React, { useRef, useState } from 'react'
import 'whatwg-fetch'
import { useHistory, Link } from "react-router-dom";
import { PostUserSession } from '../CrudFunctions/Create/PostUserSession';
export function Login() {
    const usernameRef = useRef();
    const passwordRef = useRef()
    const [errorMessage, setErrorMessage] = useState("")
    const history = useHistory();
    async function handleSubmit(e) {

        e.preventDefault();

        let postedUserSession = await PostUserSession(usernameRef.current.value, passwordRef.current.value)
        if (postedUserSession.status == 200) {
            history.push('/')
        }
        else if (postedUserSession.status == 400) {
            setErrorMessage("Invalid Credentials. Please try again.")
        }
        else if (postedUserSession.status == 404) {
            setErrorMessage("User does not exist")
        }
        else {
            setErrorMessage("You are currently locked out.")
        }
  



    }

    return (
        <body >

            <div style={{textAlign:"center", margin: "auto",  marginTop:"3rem",maxWidth: "50vw", minHeight: "70vh", border: "1px solid gray", boxShadow: "0 0 10px #9ecaed" }}>
                <h2 style={{ margin: "auto" }}>Triviago</h2>
                <h4>Sign In</h4>
                <form id="signup">
                    <div class="sep"></div>
                    <div style={{ color: "red" }}>{errorMessage}</div>

                    <div class="inputs">

                        <input style={{ width: "100%" }} ref={usernameRef} type="text" name="username" id="username" placeholder="Username" autofocus/>

                        <input style={{ width: "100%" }} ref={passwordRef} type="password" name="password" id="password" placeholder="Password" />
                        <i class="bi bi-eye-slash" id="togglePassword"></i>
                        <button id="submit" onClick={(e) => { handleSubmit(e) }}>SIGN IN</button>

                    </div>
                    <Link to="/Register">Don't have an account? Sign Up</Link>

                </form>

            </div>


        </body>
    )
}