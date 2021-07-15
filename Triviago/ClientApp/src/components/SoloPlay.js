import React, { useEffect, useState } from 'react'
import 'whatwg-fetch'
import { useCookies } from 'react-cookie';
import { Button, ToggleButtonGroup, ToggleButton } from 'react-bootstrap';
import { useHistory, Link } from "react-router-dom";



export function SoloPlay() {
    const history=useHistory()
    const [question, setQuestion] = useState("")
    const [answer, setAnswer] = useState("")
    const [username,setUsername]=useState("")
    const [givenAnswer, setGivenAnswer] = useState("")
    const [score, setScore] = useState(0);
    const [highscore, setHighscore] = useState()
    const [allAnswers,setAllAnswers]=useState([])
    const [cookies, setCookie] = useCookies(['score']);
    const [resultMessage, setResultMessage] = useState("");
    const [resultStyle, setResultStyle] = useState()
    const [end, setEnd] = useState(false)
    const getShuffledArr = arr => {
        const newArr = arr.slice()
        for (let i = newArr.length - 1; i > 0; i--) {
            const rand = Math.floor(Math.random() * (i + 1));
            [newArr[i], newArr[rand]] = [newArr[rand], newArr[i]];
        }
        return newArr
    };
    async function createQuestion() {
        await fetch('https://opentdb.com/api.php?amount=1&category=9&difficulty=medium&type=multiple').then(response => {
            response.json().then(data => {
                setEnd(false)
                setResultMessage("")
                console.log(data);
                setAllAnswers(getShuffledArr([... data.results[0].incorrect_answers,data.results[0].correct_answer]))
                setQuestion(data.results[0].question)
                setAnswer(data.results[0].correct_answer)
                setGivenAnswer("")
                console.log(data.results[0].correct_answer)
        
            })
        }
        )
    }


    useEffect(async () => {
        
        if (cookies.score) { setScore(parseInt(cookies.score)) }
        await createQuestion();
        await fetch('/api/authenticationauthorization').then((response) => {
            response.json().then(user => {
                if (user == null) {history.push('/login')}
                setHighscore(user.highScore)
                setUsername(user.username)
            })
        })
     
        
    }, [])
    function onButtonClick(e) {
         e.preventDefault()
        setGivenAnswer(e.target.value)
        console.log(e.target.value)
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
            setResultMessage("Correct! New question is loading...")
            setResultStyle({ color: "green" })
            setScore(prevScore => prevScore + 1)
            setCookie('score', (score + 1), { path: '/' })
            setTimeout(() => {
                createQuestion();
                setResultMessage("");
            }, 3000);
        }
        else {
            setResultMessage("Incorrect!")
            setCookie('score',0, { path: '/' })
            setTimeout(() => {
                if (score > highscore) {
                    updateHighscore();
                    setResultMessage("You have reached the end of your solo play. Your new high score is " + score+".")
                }
                else {
                    setResultMessage("You have reached the end of your solo play.")
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
            <div style={resultStyle}>{resultMessage}</div>
            { !end ?
                <>
            {question}
           
                <form onSubmit={onSubmit}>
                    <label>
                            Answer:
                             
                             
                            <ToggleButtonGroup type="radio" name="options" defaultValue={1}>
                                
                                    {allAnswers.map(answer => (
                                        <ToggleButton value={answer} onClick={onButtonClick}>{answer}</ToggleButton>
                                    ))
                                    }
                               
                               
                            </ToggleButtonGroup>
                        </label>
                    {resultMessage != "" ? <></> : <input type="submit" value="Submit" />}

                </form>
                 </>
                    : <> <Button onClick={createQuestion}>Restart Solo Play</Button><a href="/"><Button>Go back to homepage</Button></a></>}
            
        </body>
    )
}