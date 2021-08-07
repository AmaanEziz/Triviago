
export async function GetUser(history) {


    
    let fetchResponse = await fetch('/api/authenticationauthorization')
    let user = await fetchResponse.json()
    if (user == null) {
        history.push('/login')
        return { username: "", highScore: 0, gamesWon: 0 }
    }
    return user;

}