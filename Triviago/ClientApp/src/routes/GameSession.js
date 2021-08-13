import React, { useEffect, useState, useRef } from 'react'
import { useBeforeunload } from 'react-beforeunload';
import { useHistory, Prompt } from "react-router-dom";
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import {ToggleButtonGroup, ToggleButton } from 'react-bootstrap';
import { GetUser } from '../CrudFunctions/Read/GetUser'
import { GetGameSession } from '../CrudFunctions/Read/GetGameSession'
import {UpdateHighScore } from '../CrudFunctions/Update/UpdateHighScore'
import { DeleteGameSession } from '../CrudFunctions/Delete/DeleteGameSesson.js';
import { GetShuffledArr } from '../CrudFunctions/Read/GetShuffledArr';
import { UpdateGamesWon } from '../CrudFunctions/Update/UpdateGamesWon';

const connection = new HubConnectionBuilder()
    .withUrl("/hubs/gameSession/")
    .configureLogging(LogLevel.Information)
    .build()
var username = 0;
var answer = ""
var givenAnswer = ""
var hostName = ""
var highScore = 0

export function GameSession(props) {

    const [isHost,setIsHost]=useState(false)
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
    const [score, setScore]=useState(0)



    window.addEventListener('popstate', onLeave, false);

    useBeforeunload(onLeave)

   




    async function getGameSessionDetails() {
        let gameSession = await GetGameSession(gameSID)
        console.log(gameSession)
        if (gameSession == null) { setGameNotFound(true) }
        else {
            if (gameSession.participants.length == 0) {
                deleteGame()
                return
            }
            hostName = gameSession.host
            if (username == hostName) {
                setIsHost(true)
            }
            console.log("the host is "+hostName)
            setIsInProgress(gameSession.inSession)
            setActivePlayers(gameSession.participants)
        }
    }

    async function deleteGame() {

       DeleteGameSession(gameSID)

    }



    function compareAnswers() {
        if (answer != givenAnswer) {
            connection.invoke("removePlayer", gameSID, username).catch(() => { })
            if (username == hostName) {
                setTimeout(() => { connection.invoke("hostMigration", gameSID) }, 2000)

            }

            setEndPlay(true)
        }
        else {
            setScore(score+1)
        }
    }



    function configureConnection() {
        connection.start().then(() => {

            connection.on("newQuestion", (response) => {
                compareAnswers()
                console.log(response)
                compareAnswers();
                let data = JSON.parse(response)
                setAllAnswers(GetShuffledArr([...data.results[0].incorrect_answers, data.results[0].correct_answer]))
                setQuestion(data.results[0].question)
                setTimeout(() => { answer = data.results[0].correct_answer},3000)
                
                console.log("the right answer is " + data.results[0].correct_answer)


            })
            connection.on("playerAdded", (newPlayerList) => {
                setActivePlayers(newPlayerList)
            })
            connection.on("gameStarted", (givenHost) => {
                console.log("Someone started the game")
                setIsInProgress(true)
                console.log("the host is " + givenHost + " and you are " + username)
                if (username == givenHost) {
                    connection.invoke("updateQuestion", gameSID).catch(() => {})
                    setInterval(() => {
                       
                       connection.invoke("updateQuestion", gameSID).catch(() => { })
                    }, 15000)
                }
                else {
                    console.log("you are: " + username + " are not equal to " + givenHost)
                }

            })




            connection.on("newHost", async (newHost) => {
                hostName=newHost
                if (!newHost) {//If there's no host left, participant list is 0 so just delete the game
                    deleteGame();
                }

                if (username == newHost) {
                setIsHost(true)
                connection.invoke("updateQuestion", gameSID)
                setInterval(() => {
                   compareAnswers()
                   connection.invoke("updateQuestion", gameSID).catch(() => {})
                }, 15000)
            }
        })

        connection.on("playerRemoved", async (removedUser,newPlayerList) => {
            setActivePlayers(newPlayerList)
            if (newPlayerList.length <2 && isInProgress) {
                setWinner(true)
            }
            console.log(removedUser+" was removed and the new player list is "+newPlayerList)
        })
        }).catch(e => {setFailedConnect(true)})
    
    }

    function onLeave() {
        if (activePlayers.length == 1) {
            deleteGame()
        }
        else { //Else statement in case player leaving is NOT the last player
            connection.invoke("removePlayer", gameSID, username).catch(e => { })
            if (username == hostName) {
                setTimeout(() => {
                    connection.invoke("hostMigration", gameSID).catch(e => { })
                }, 2000)
            }
        }
        connection.stop().catch(() => { })
    }

    function onButtonClick(e) {
        e.preventDefault()
        givenAnswer = e.target.value

    }

    useEffect(() => {
        configureConnection();
        async function setUser() {
            let user = await GetUser(history)
            username = user.username
            highScore = user.highScore
        }
        setUser()
    }, [])


    useEffect(() => {
        if (username) {
            getGameSessionDetails();
        }
    }, [username])



    useEffect(() => {
        if (activePlayers.length < 2 && isInProgress) {
            deleteGame()
        }
    }, [activePlayers])




    useEffect(() => {
        if (isInProgress) {
            if (score > highScore) {
                UpdateHighScore(score)
            }
            setTimeout(() => {
                history.push('/MultiplayerLobby')
                connection.stop()
            }, 5000)
        }
    }, [endPlay, winner])


    useEffect(() => {
        if (isInProgress) {
            UpdateGamesWon()
        }
    }, [winner])




    useEffect(() => {
        setTimeout(() => {
            if (!isInProgress && username) {
                connection.invoke("addPlayer", gameSID, username).catch(e => { console.log(e) })
            }
            setTimeout(() => { setLoaded(true)},1000)
            
        }, 3000)
           
    }, [configured])






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
        return (<div>Waiting for host to start game. Current players are
            {activePlayers.map((player, index) =>
                (<div>{index + 1}. {player} </div>))}</div>)
    }
    else if (!isInProgress && isHost && activePlayers.length < 2) {
        return (<div>You are the host. Please wait for one more player to join, and you'll be able to start the game</div>)
    }
    else if (!isInProgress && isHost) {
        return (<div>You are the host. Please start game.<button onClick={(e) => {
            e.preventDefault();
            connection.invoke("startGame", gameSID).catch(e => { console.log("Error problem invoking start game") })


        }}>Start Game</button> Current players are {activePlayers.map((player, index) =>
            (<div>{index + 1}. {player} </div>))}</div>)
    }
    else if (isInProgress && question) {
        return (<div>
            <div>Players Remaining: {activePlayers.map(player => (<span>{player}, </span>))}</div>
            {question}
            <ToggleButtonGroup name="options">
                {allAnswers.map(option => (
                    <ToggleButton value={option} onChange={onButtonClick}>{option}</ToggleButton>


                ))}
            </ToggleButtonGroup>
        </div>)
    }
  
}