import {isEmailValid, isNameValid, isPasswordValid, setStatus} from './formValidationUtils.js'

const signupForm = document.getElementById('signupForm')
const loginForm = document.getElementById('loginForm')


signupForm?.addEventListener('submit', (e)=>{

    const name = signupForm.querySelector('[name = name]')
    const email = signupForm.querySelector('[name = email]')
    const password = signupForm.querySelector('[name = password]')
    const confirmPassword = signupForm.querySelector('[name = password2]')

    const fields = [
        {
            field: name,
            validationFunc: isNameValid
        }
        ,{
            field: email,
            validationFunc: isEmailValid
        },
        {
            field: password,
            validationFunc: isPasswordValid
        }
    ]

    let isCorrectInput = formValidate(fields)

    let passwordMathcing = {status: true}
    if(password.value != confirmPassword.value ){
        passwordMathcing.status = false;
        passwordMathcing.msg = "Passwords doesn't match"
        isCorrectInput = false;
    }
    if(password.value == ''){
        passwordMathcing.status = false;
        passwordMathcing.msg = "Password not valid"
    }
    setStatus(confirmPassword, passwordMathcing)

    if(!isCorrectInput){
        e.preventDefault();
    }
})

loginForm?.addEventListener('submit', (e)=>{
    const email = loginForm.querySelector('[name = email]')
    const password = loginForm.querySelector('[name = password]')

    const fields = [
        {
            field: email,
            validationFunc: isEmailValid
        },{
            field: password,
            validationFunc: isPasswordValid
        }
    ]

    // console.log(formValidate(fields))
    if(!formValidate(fields)){
        e.preventDefault();
    }
})

function formValidate(fields){
    let isCorrectInput = true;
    for(let x of fields){
        isCorrectInput = validateFields(x) && isCorrectInput;
    }

    if(!isCorrectInput){

        return false;
    }
    return true;
}

function validateFields(input){
    let validationResult = input.validationFunc(input.field.value)
    setStatus(input.field, validationResult)
    return validationResult.status;
}




