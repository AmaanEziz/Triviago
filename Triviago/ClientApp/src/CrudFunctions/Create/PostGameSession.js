
export async function PostGameSession(gameSession) {
    let fetchResponse= await fetch('/api/gamesessions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(gameSession)
    })
    let postedSession = await fetchResponse.json();
    return postedSession
}