
export async function PostUser(username, password) {
    let data = { username: username, password: password }
   let response=await fetch('/api/user', {//Post a new user to the database
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
   })
    return response;
}