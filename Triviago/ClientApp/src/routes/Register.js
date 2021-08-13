import React, { useRef, useState } from 'react'
import {PostUser} from '../CrudFunctions/Create/PostUser'
import { useHistory, Link } from "react-router-dom";
export function Register() {
    const verifiedPasswordRef = useRef();
    const usernameRef = useRef();
    const passwordRef = useRef();
    const [errorMessage, setErrorMessage] = useState("")
    const history = useHistory();
    async function handleSubmit(e) {

        e.preventDefault();

        if (passwordRef.current.value !== verifiedPasswordRef.current.value) {//Make sure passwords equal each other
            setErrorMessage("Passwords do not match");
            return;
        }
        if (!usernameRef.current.value || !passwordRef.current.value || !verifiedPasswordRef.current.value) {//No blank fields allowed
            setErrorMessage("Please fill out all 3 fields")
            return;
        }


        let postResponse = await PostUser(usernameRef.current.value, passwordRef.current.value)
        if (postResponse.status == 200) {
            history.push('/login')
        }
        else {
            setErrorMessage("Username already taken. Please try again.")
        }
      
     
    }

    return (
        <body>

            <div style={{ textAlign: "center", margin:"auto", marginTop:"3rem",maxWidth: "50vw", minHeight: "70vh", border: "1px solid gray", boxShadow: "0 0 10px #9ecaed" }}>
                <h2 style={{ margin: "auto" }}>Triviago</h2>
                <h4>Create An Account</h4>
                <form id="signup">
                    <div class="sep"></div>
                    <div style={{ color: "red" }}>{errorMessage}</div>

                    <div class="inputs" >

                        <input style={{ width: "100%" }} ref={usernameRef} type="text" name="username" id="username" placeholder="Username" autofocus />

                        <input style={{ width: "100%" }} ref={passwordRef} type="password" name="password" id="password" placeholder="Password" />
                        <input style={{ width: "100%" }} ref={verifiedPasswordRef} type="password" placeholder="Verify Password" />


                        <button id="submit" href="#" onClick={(e) => { handleSubmit(e) }}>SIGN UP</button>

                    </div>
                    <Link to="/login">Already have an account? Sign in</Link>

                </form>

            </div>


        </body>
    )
}