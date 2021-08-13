import {GetShuffledArr} from './GetShuffledArr'
export async function GetQuestionInfo() {


    let fetchResponse = await fetch("https://opentdb.com/api.php?amount=1&category=9&type=multiple")
    let apiJson= await fetchResponse.json()
    let questionInfo={
        question: apiJson.results[0].question,
        correctAnswer: apiJson.results[0].correct_answer,
        allAnswers: GetShuffledArr([...apiJson.results[0].incorrect_answers, apiJson.results[0].correct_answer])
    }
    return questionInfo
}