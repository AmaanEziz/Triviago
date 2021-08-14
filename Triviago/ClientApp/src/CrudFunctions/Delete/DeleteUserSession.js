
export async function DeleteUserSession() {
   let fetchResponse=await fetch('/DeleteUser', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
   })
    return fetchResponse
}