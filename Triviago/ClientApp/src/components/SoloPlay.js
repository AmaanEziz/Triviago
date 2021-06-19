import React, { useEffect, useState } from 'react'
import 'whatwg-fetch'
import { useCookies } from 'react-cookie';

import { useHistory, Link } from "react-router-dom";
export function SoloPlay() {
    const [question, setQuestion] = useState("")
    const [answer, setAnswer] = useState("")
    const [givenAnswer, setGivenAnswer] = useState("")
    const [score, setScore] = useState(0);
    const [cookies, setCookie] = useCookies(['score']);

    async function createQuestion() {
        await fetch('https://jservice.io/api/random').then(response => {
            response.json().then(data => {
                setQuestion(data[0].question)
                setAnswer(data[0].answer)
                console.log(data[0].answer)
            })
        }
        )
    }
    useEffect(async () => {
        if (cookies.score) { setScore(parseInt(cookies.score)) }
        createQuestion();
    }, [])
    function onInputChange(e) {
        setGivenAnswer(e.target.value)
    }
    function onSubmit(e) {
        e.preventDefault();
        if (givenAnswer == answer) {
            console.log("right answer")
            
            setScore(prevScore => prevScore + 1)
            setCookie('score', (score+1), { path: '/' })
        }
        else {
            console.log("wrong answer")
        }
        createQuestion();
    }
    return (
        <body>
            <div>Current Score: {score}</div>
            {question}
            <form onSubmit={onSubmit}>
                <label>
                    Answer:
          <textarea value={givenAnswer} onChange={onInputChange}/>        </label>
                <input type="submit" value="Submit" />
            </form>
        </body>
    )
}