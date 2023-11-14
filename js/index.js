const QUESTION_UI = document.querySelector(".question")
const TIMER_UI = document.querySelector(".timer")
const USER_INPUT = document.querySelector(".user-input")
const SUBMIT_BUTTON = document.querySelector('.btn-submit')
const DIALOG_NEXT_BUTTON = document.querySelector(".dialog-next-button")
const DIALOG = document.querySelector(".answer-dialog");
let INTERVAL_ID = null;
let USER_INPUT_ENTERTD = '';

USER_INPUT.addEventListener('keyup',(e) => {
    USER_INPUT_ENTERTD = e.target.value
})


let NUMBERS = []
let SIGNS = []

const generate_three_numbers_lenegth = (max_length=3,max_digits=2) => {
    const numbers = []
    for(let i = 0; i < max_length;i++){
        let n = Math.round(Math.random() * max_digits)
        n = n ==0 ? 1 : n;

        numbers.push(Math.pow(10,n));

    }
    return numbers;
}

const dialogKeyExit = (e) => {
    e.preventDefault()
    if(e.key == " "){
        newQuestion()
    }
}

const generate_three_numbers = (max_lengths=generate_three_numbers_lenegth()) => {
    const three_numbers = []
    const length = max_lengths.length;
    for(let i = 0 ; i < length;i++){
        three_numbers.push((Math.random() * max_lengths[i]))
    }
    return three_numbers
}


const fixed_floating_points = (numbers,maximum_decimals=4) => {
    const length = numbers.length
    const fixed_numbers = []
    for(let i = 0 ; i < length;i++){
        let number = numbers[i].toString()
        let decimalPointIndex = number.indexOf(".")
        let maximumDecimalPoints = maximum_decimals - decimalPointIndex
        fixed_numbers.push(parseFloat(parseFloat(number).toFixed(maximumDecimalPoints)))
    }
    return fixed_numbers
}

const generate_two_signs = () => {
    const generate_sign = () => Math.round(Math.random() * 10) % 2
    const signs = Array(2)
    for(let i = 0 ; i < 2;i++){
        signs[i] = generate_sign() == 0 ? "*" : "/"
    }
    console.log(signs)
    return signs
}

const newQuestion = () => {
    document.removeEventListener('keyup',dialogKeyExit)
    currentTime = 0
    USER_INPUT.focus()
    let numbers = generate_three_numbers()
    numbers = fixed_floating_points(numbers);
    const signs = generate_two_signs()
    NUMBERS = numbers
    SIGNS = signs
    QUESTION_UI.innerHTML = `${numbers[0]} ${signs[0]} ${numbers[1]} ${signs[1]} ${numbers[2]}`
    INTERVAL_ID = setInterval(timer,1000);
    DIALOG.setAttribute('open','false')
    document.querySelector(".content").style.filter = `blur(0)`
}

let currentTime = 0 ;

const timer = () => {
    currentTime +=1;
   TIMER_UI.innerHTML = currentTime
}


const submit_details = () => {
    clearInterval(INTERVAL_ID);
    document.addEventListener('keyup',dialogKeyExit)
    currentTime = 0;
    TIMER_UI.innerHTML = `0`
    document.querySelector(".content").style.filter = `blur(10px)`
    document.querySelector('.answer-dialog').style.filter = 'blur(0px)!important'

    DIALOG.setAttribute('open','true')
    DIALOG.addEventListener('keyup',(e) => {
        console.log(e.keyCode)
    })
    const DIALOG_QUESTION = DIALOG.querySelector('.question-dialog')
    const DIALOG_ANSWER = DIALOG.querySelector(".real-answer")
    const DIALOG_USER_ANSWER = DIALOG.querySelector(".user-answer")
    DIALOG_USER_ANSWER.innerHTML = `Your Answer: ${USER_INPUT_ENTERTD}`
    DIALOG_QUESTION.innerHTML = QUESTION_UI.innerHTML
    const copied_numbers = NUMBERS.map(e => Math.log10(e))
    console.log(copied_numbers)
    const go_through_sign = (sign) => {return (num1,num2) =>  sign == "*" ? num1 + num2 : num1 - num2}
    const signOne = go_through_sign(SIGNS[0])
    const signTwo = go_through_sign(SIGNS[1])
    const firstOne  = parseFloat(signOne(copied_numbers[0],copied_numbers[1]).toFixed(4))
    const secondOne = parseFloat(signTwo(firstOne,copied_numbers[2]).toFixed(4))
    DIALOG_ANSWER.innerHTML = `Real Answer : ${Math.pow(10,secondOne).toFixed(4)}`
    const DIALOG_ANSWER_STEPS = DIALOG.querySelector(".answer-steps")
    reveal_answers(DIALOG_ANSWER_STEPS,copied_numbers.map(x => x.toFixed(4)),firstOne,secondOne,Math.pow(10,secondOne).toFixed(4))
}

const reveal_answers = (parent,logged_numbers,firstSign,secondSign,answer) => {

    const loggedValuesAnswers = logged_numbers.map((e,i) =>`<li>${NUMBERS[i]} -> ${e}</li>` ).join("\n")


    parent.innerHTML = `
        <h3>Logged Numbers</h3>

        <ul class="dialog-list-values">
        ${loggedValuesAnswers}
        </ul>


        <h4>Step One</h4>

        <ul class="dialog-list-values">
        <li>${logged_numbers[0]} ${SIGNS[0] == "*" ? "+" : "-" } ${logged_numbers[1]} -> ${firstSign}</li>
        <li>${firstSign} ${SIGNS[1]  == "*" ? "+" : "-"} ${logged_numbers[2]} -> ${secondSign}</li>
        </ul>

        <h4>Final Answer: ${answer}</h4>
    
    `

}

SUBMIT_BUTTON.addEventListener('click',submit_details)
DIALOG_NEXT_BUTTON.addEventListener('click',newQuestion)
window.addEventListener('load',() => {
    newQuestion()
    // submit_details()
})

