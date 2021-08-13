
export async function GetGameSession(gameSID) {


    let fetchResponse = await fetch('/api/gamesessions/' + gameSID)
    let gameSession= await fetchResponse.json()
    return gameSession;

}