
export async function DeleteUserSession() {
   let fetchResponse=await fetch('/api/userSessions', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
   })
    return fetchResponse;
}