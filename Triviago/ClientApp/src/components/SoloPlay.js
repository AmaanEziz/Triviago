import React, { useEffect, useState } from 'react'
import 'whatwg-fetch'
import { useCookies } from 'react-cookie';
import { Button } from 'react-bootstrap';
import { useHistory, Link } from "react-router-dom";
export function SoloPlay() {
    const history=useHistory()
    const [question, setQuestion] = useState("")
    const [answer, setAnswer] = useState("")
    const [username,setUsername]=useState("")
    const [givenAnswer, setGivenAnswer] = useState("")
    const [score, setScore] = useState(0);
    const [highscore,setHighscore]=useState()
    const [cookies, setCookie] = useCookies(['score']);
    const [result, setResult] = useState("");
    const [resultStyle, setResultStyle] = useState()
    const [end, setEnd] = useState(false)
    async function createQuestion() {
        await fetch('https://jservice.io/api/random').then(response => {
            response.json().then(data => {
                setEnd(false)
                setResult("")
                setQuestion(data[0].question)
                setAnswer(data[0].answer)
                setGivenAnswer("")
                console.log(data[0].answer)
            })
        }
        )
    }
    useEffect(async () => {
        if (cookies.score) { setScore(parseInt(cookies.score)) }
        createQuestion();
        fetch('/api/authenticationauthorization').then((response) => {
            response.json().then(user => {
                if (user == null) {history.push('/login')}
                setHighscore(user.highScore)
                setUsername(user.username)
            })
        })
    }, [])
    function onInputChange(e) {
        setGivenAnswer(e.target.value)
        }

    async function updateHighscore() {
            let data = { highScore: score, username: username}
            await fetch('/api/authenticationauthorization', {
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
        if (givenAnswer == answer) {
            console.log("right answer")
            setResult("Correct! New question is loading...")
            setResultStyle({ color: "green" })
            setScore(prevScore => prevScore + 1)
            setCookie('score', (score + 1), { path: '/' })
            setTimeout(() => {
                createQuestion();
                setResult("");
            }, 3000);
        }
        else {
            setResult("Incorrect!")
            setCookie('score',0, { path: '/' })
            setTimeout(() => {
                if (score > highscore) {
                    updateHighscore();
                    setResult("You have reached the end of your solo play. Your new high score is " + score+".")
                }
                else {
                    setResult("You have reached the end of your solo play.")
                }
             
                setEnd(true)
            }, 3000)
            console.log("wrong answer")
        setResultStyle({ color: "red" })
            
        }
        
    }
    return (
        <body>
            <div>Current Score: {score}</div>
            <div style={resultStyle}>{result}</div>
            { !end ?
                <>
            {question}
           
                <form onSubmit={onSubmit}>
                    <label>
                        Answer:
          <textarea value={givenAnswer} onChange={onInputChange} />        </label>
                    {result != "" ? <></> : <input type="submit" value="Submit" />}

                </form>
                 </>
                : <> <Button onClick={createQuestion}>Restart Solo Play</Button><a href="/"><Button>Go back to homepage</Button></a></>}
        </body>
    )
}