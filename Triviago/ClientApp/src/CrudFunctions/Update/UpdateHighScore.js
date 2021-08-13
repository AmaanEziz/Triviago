
export async function UpdateHighScore(score) {

   let response= await fetch('/updateHighScore/'+score, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        }
   })
    console.log(response)
    return response
}