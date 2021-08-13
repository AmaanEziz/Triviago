import React, { useEffect, useState } from 'react'
import { Button, ToggleButtonGroup, ToggleButton } from 'react-bootstrap';
import { useHistory} from "react-router-dom";
import { GetUser } from '../CrudFunctions/Read/GetUser'
import { UpdateHighScore } from '../CrudFunctions/Update/UpdateHighScore'
import { GetQuestionInfo } from '../CrudFunctions/Read/GetQuestionInfo'


export function SoloPlay() {
    const [user, setUser] = useState({ username: "", highScore: 0, gamesWon: 0 })
    const history=useHistory()
    const [question, setQuestion] = useState("")
    const [correctAnswer, setCorrectAnswer] = useState("")
    const [givenAnswer, setGivenAnswer] = useState("")
    const [currentScore, setCurrentScore] = useState(0);
    const [allAnswers,setAllAnswers]=useState([])
    const [resultMessage, setResultMessage] = useState("");
    const [resultStyle, setResultStyle] = useState()
    const [end, setEnd] = useState(false)



    async function createQuestion() {//Makes request to OpentDB API to fetch question details
        let questionInfo = await GetQuestionInfo()
        setQuestion(questionInfo.question)
        setCorrectAnswer(questionInfo.correctAnswer)
        console.log(questionInfo.correctAnswer)
        setAllAnswers(questionInfo.allAnswers)
        setResultMessage("")
        setGivenAnswer("")
 
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



 
    
    function onSubmit(e) {
        e.preventDefault();
        if (givenAnswer == correctAnswer) {//Notify user is correct before moving onto next question
            setResultMessage("Correct! New question is loading...")
            setResultStyle({ color: "green" })
            setCurrentScore(prevScore => prevScore + 1)
            setTimeout(() => {
                createQuestion();
                setResultMessage("");
            }, 2000);
        }
        else { 
            setResultMessage("Incorrect!")
            setTimeout(() => {
                if (currentScore > user.highScore) {
                    UpdateHighScore(currentScore);
                    setResultMessage("You have reached the end of your solo play. Your new high score is " + currentScore+".")
                }
                else {
                    setResultMessage("You have reached the end of your solo play.")
                }
             
                setEnd(true)
            }, 2000)
            setTimeout(() => {
                setCurrentScore(0)
            },2050)
            console.log("wrong answer")
        setResultStyle({ color: "red" })
            
        }
        
    }


    window.addEventListener('popstate', function (event) {
        if (currentScore > user.highScore) {
            UpdateHighScore(currentScore, user.username)
        }

    }, false);



    return (
        <body style={{marginTop:"auto",marginBottom:"auto"}}>
            
            <div>Current Score: {currentScore}</div>
          
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