
export async function UpdateGamesWon() {

    let response = await fetch('/updateGamesWon', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    return response
}