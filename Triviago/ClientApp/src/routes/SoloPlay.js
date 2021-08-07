import React, { useEffect, useState } from 'react'
import 'whatwg-fetch'
import { Button, ToggleButtonGroup, ToggleButton } from 'react-bootstrap';
import { useHistory} from "react-router-dom";
import { useBeforeunload } from 'react-beforeunload';
import {GetShuffledArr} from '../logicComponents/GetShuffledArr.js'
import { GetUser } from '../logicComponents/GetUser'
export function SoloPlay() {
    const [user, setUser] = useState({ username: "", highScore: 0, gamesWon: 0 })
    const history=useHistory()
    const [question, setQuestion] = useState("")
    const [answer, setAnswer] = useState("")
    const [givenAnswer, setGivenAnswer] = useState("")
    const [score, setScore] = useState(0);
    const [allAnswers,setAllAnswers]=useState([])
    const [resultMessage, setResultMessage] = useState("");
    const [resultStyle, setResultStyle] = useState()
    const [end, setEnd] = useState(false)



    async function createQuestion() {//Makes request to OpentDB API to fetch question details
        await fetch('https://opentdb.com/api.php?amount=1&category=9&type=multiple').then(response => {
            response.json().then(data => {
                setEnd(false)
                setResultMessage("")
                console.log(data);
               setAllAnswers(GetShuffledArr([... data.results[0].incorrect_answers,data.results[0].correct_answer]))
                setQuestion(data.results[0].question)
   
                setAnswer(data.results[0].correct_answer)
                setGivenAnswer("")
                console.log(data.results[0].correct_answer)
        
            })
        }
        )
    }


    useEffect( () => {//Fetch user details on load up
        
        createQuestion();
        async function setUserState() {
            setUser(await GetUser(history))
        }
       setUserState()
     
        
    }, [])



    function onButtonClick(e) {
         e.preventDefault()
        setGivenAnswer(e.target.value)
        }



    function updateHighScore() {
            let data = { highScore: score, username: user.username}
            fetch('/api/authenticationauthorization', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }).then(res => {
                res.json().then(json => {console.log(json)})
            })
        }
    
    function onSubmit(e) {
        e.preventDefault();
        if (givenAnswer == answer) {//Notify user is correct before moving onto next question
            setResultMessage("Correct! New question is loading...")
            setResultStyle({ color: "green" })
            setScore(prevScore => prevScore + 1)
            setTimeout(() => {
                createQuestion();
                setResultMessage("");
            }, 3000);
        }
        else { 
            setResultMessage("Incorrect!")
            setTimeout(() => {
                if (score > user.highScore) {
                    updateHighScore();
                    setResultMessage("You have reached the end of your solo play. Your new high score is " + score+".")
                }
                else {
                    setResultMessage("You have reached the end of your solo play.")
                }
             
                setEnd(true)
            }, 3000)
            setTimeout(() => {
                setScore(0)
            },4000)
            console.log("wrong answer")
        setResultStyle({ color: "red" })
            
        }
        
    }


    window.addEventListener('popstate', function (event) {
        if (score > user.highScore) {
            updateHighScore()
        }

    }, false);



    return (
        <body style={{marginTop:"auto",marginBottom:"auto"}}>
            
            <div>Current Score: {score}</div>
          
            <div style={resultStyle}>{resultMessage}</div>
            { !end ?
                <>
                    <div style={{ display: "flex", justifyContent: "center", flexWrap: "flex-wrap"  }}>
            {question}
           </div>
                <form onSubmit={onSubmit}>
                        <label style={{ display: "flex", justifyContent: "center" }}>
                            Answer:
                       </label>
                             
                        <ToggleButtonGroup name="options" style={{ display:"flex",justifyContent:"center",flexWrap:"flex-wrap" }} >
                                
                            {allAnswers.map(option => (
                                <ToggleButton value={option} style={{height:"4rem",maxHeight:"8rem"}} onChange={onButtonClick}>{option}</ToggleButton>
                                    ))
                                    }
                               
                               
                            </ToggleButtonGroup>
                        {resultMessage != "" ? <></> : <div style={{ display: "flex", justifyContent: "center" }}><input type="submit" value="Submit" /></div>}

                </form>
                 </>
                    : <> <Button onClick={createQuestion}>Restart Solo Play</Button><a href="/"><Button>Go back to homepage</Button></a></>}
                
            
        </body>
    )
}