import React, { useEffect, useState } from 'react'
import 'whatwg-fetch'
import { useBeforeunload } from 'react-beforeunload';
import { useHistory, Prompt } from "react-router-dom";
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { Button, ToggleButtonGroup, ToggleButton } from 'react-bootstrap';

let answer = "default"
let givenAnswer = "default"

const connection = new HubConnectionBuilder()
    .withUrl("/hubs/gameSession/")
    .configureLogging(LogLevel.Information)
    .build()
let username = 0;
let isHost = false;
export function GameSession(props) {
    //const [isHost,setIsHost]=useState(false)
    const [isInProgress, setIsInProgress] = useState(false)
    const [endPlay,setEndPlay]=useState(false)
    const history = useHistory()
    const [activePlayers, setActivePlayers] = useState([])
    const [configured,setConfigured]=useState(false)
    const gameSID = props.match.params.gameSID
    const [question, setQuestion] = useState("")
    const [allAnswers, setAllAnswers] = useState([])
    const [winner, setWinner]=useState(false)
    const [loaded,setLoaded]=useState(false)
    const [gameNotFound,setGameNotFound]=useState()
    const [failedConnect,setFailedConnect]=useState(false)







    const getShuffledArr = arr => {
        const newArr = arr.slice()
        for (let i = newArr.length - 1; i > 0; i--) {
            const rand = Math.floor(Math.random() * (i + 1));
            [newArr[i], newArr[rand]] = [newArr[rand], newArr[i]];
        }
        return newArr
    };




       function getUserDetails() {
         fetch('/api/authenticationauthorization').then(response => {
            response.json().then(user => {
                if (user == null) {
                    history.push('/login')
                }
                else {
                 username=user.username;
                }

            })
        })
    }
   function getGameSessionDetails() {
        fetch('/api/gamesessions/' + gameSID).then(response => {
            response.json().then(session => {
                if (session.host == username) {
                    isHost = true;
                }
                setIsInProgress(session.inSession)
                setActivePlayers(session.participants)
            }).catch(() => { setGameNotFound(true) })
        })
    }

    function removePlayer() {
        connection.invoke("removePlayer", gameSID, username).catch(e => { console.log("error invoking removeplayer=> " +e) })
        if (isHost && activePlayers.length>1) {
            connection.invoke("hostMigration", gameSID).catch(e => { console.log("Error invoking hostMigration") })
        }
    }

    function compareAnswers() {
        if (answer != givenAnswer) {
            sessionStorage.setItem("answerResponse", "your answer: " + givenAnswer + " WAS NOT equal to actual answer " + answer)
            removePlayer();
             setEndPlay(true)
        
            setTimeout(() => {
                history.push('/MultiplayerLobby')

            }, 10000)
        }
        else {
            console.log("your answer: " + givenAnswer + " was equal to actual answer " + answer)

        }
 
    }

    function changeQuestionData(response) {
        let data=JSON.parse(response)
        setAllAnswers(getShuffledArr([...data.results[0].incorrect_answers, data.results[0].correct_answer]))
        setQuestion(data.results[0].question)
        setTimeout(() => {
            answer = data.results[0].correct_answer
            console.log("answer is " + answer)
        }, 2000)
        
      

    }

    function onButtonClick(e,option) {
        e.preventDefault()
        givenAnswer = option;
      
    }


    function configureConnection() {
        connection.start().then(() => {
           
           
            connection.on("newHost", (newHost) => {
                console.log("host migration happened, new host is "+  newHost)
                if (username == newHost) {
                    isHost = true;
                }
                if (!endPlay) {
                 setInterval(() => {
                     connection.invoke("updateQuestion", gameSID).catch(() => {})

                    }, 15000)
                }
            })
            connection.on("newQuestion", (response) => {
                console.log(response)
                compareAnswers();
                changeQuestionData(response)

            })
            connection.on("playerAdded", (newPlayerList) => {
                setActivePlayers(newPlayerList)
            })
            connection.on("gameStarted", () => {

                setIsInProgress(true)
                if (isHost) {
                    connection.invoke("updateQuestion", gameSID).catch(() => { })
                    if (!endPlay) {
                     setInterval(() => {
                         connection.invoke("updateQuestion", gameSID).catch(() => { })

                        }, 15000)
                    }
                }


            })

            connection.on("playerRemoved", (newPlayerList) => {
                console.log("player removed was invoked with newplayerlist "+ newPlayerList)
                setActivePlayers(newPlayerList)
                if (newPlayerList.length == 1 || newPlayerList.length == 0) {
                    setWinner(true)
                    fetch('/api/gamesessions/' + gameSID, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }).then(() => {
                        sessionStorage.setItem("conclusion","Game has been deleted")
                    })
                    setTimeout(() => {
                        history.push('/MultiplayerLobby')

                    }, 10000)
                }

            })

        }).catch(e => {
            setFailedConnect(true)
        })
    }




    useEffect(() => {
        configureConnection();
        getUserDetails();
       
    }, [])





    useEffect(() => {
        if (username) {
            getGameSessionDetails();
        }
    }, [username])


    useEffect(() => {
        setTimeout(() => {
            if (!isInProgress && username) {
                connection.invoke("addPlayer", gameSID, username).catch(e => { console.log(e) })
            }
            setTimeout(() => { setLoaded(true)},1000)
            
        }, 3000)
           
    }, [configured])






    useEffect(() => {
        setTimeout(() => {
            if (isInProgress) {
                connection.stop()
               
            }
        }, 5000)
        
    },[endPlay,winner])



    useBeforeunload(() => {
        removePlayer()
        connection.stop()
    }
    );



    if (!loaded) { return (<div>Loading...</div>) }
    else if (gameNotFound) { return (<div>Game was not found. Please go back.</div>) }
    else if (failedConnect) { return (<div>Failed to connect to websocket. Please refresh and try again.</div>)}
    else if (winner) {
        return (<div>Congratulations! You are the winner. Redirecting you back to the multiplayer screen. </div>)
    }
    else if (endPlay) {
        return (<div>Game Over. Redirecting you back to the multiplayer screen. </div>)
    }
    else if (isInProgress && !question) {
        return (<div> Game is in session</div >)
    }
  
    else if (!isInProgress && !isHost) {
        return (<div>Waiting for host to start game. Current players are {activePlayers.map(player => (<span>{player}, </span>))}</div>)
    }
    else if (!isInProgress && isHost && activePlayers.length < 2) {
        return (<div>You are the host. Please wait for one more player to join, and you'll be able to start the game</div>)
    }
    else if (!isInProgress && isHost) {
        return (<div>You are the host. Please start game. Current players are {activePlayers.map(player => (<span>{player}, </span>))}. <button onClick={(e) => {
            e.preventDefault();
            connection.invoke("startGame", gameSID).catch(e => { console.log("Error problem invoking start game") })
           

        }}>Start Game</button></div>)
    }
    else if (isInProgress && question) {
        return (<div>
            <div>Players Remaining: {activePlayers.map(player => (<span>{player}, </span>))}</div>
            {question}
            <ToggleButtonGroup name="options">
                {allAnswers.map(option => (
                    <ToggleButton value={option} onClick={(e) => { onButtonClick(e, option) }}>{option}</ToggleButton>
                   
            
                ))}
                </ToggleButtonGroup>
        </div>)
    }
  
}
