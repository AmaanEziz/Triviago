
export async function GetAllSessions() {


    let fetchResponse = await fetch("/api/gamesessions")
    let sessionsArray = await fetchResponse.json()
    console.log(sessionsArray)
    return sessionsArray

}