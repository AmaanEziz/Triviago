
export async function PostUserSession(username, password) {
    let data = {
        username: username,
        password: password
    }
    let fetchResponse= await fetch('/api/user/LoginRequest', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
   console.log(fetchResponse)
    let postedSession = await fetchResponse.json()
    console.log(postedSession)
    return postedSession
}