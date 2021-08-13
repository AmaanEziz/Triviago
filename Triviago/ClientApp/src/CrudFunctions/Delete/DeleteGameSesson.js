
export async function DeleteGameSession(gameSID) {
   let fetchResponse= await fetch('/api/gamesessions/' + gameSID, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
   })
    return fetchResponse
}