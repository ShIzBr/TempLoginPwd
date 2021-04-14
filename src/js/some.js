import CyrillicToTranslit from 'cyrillic-to-translit-js';
var randomString = require('random-string');

const cyrillicToTranslit = new CyrillicToTranslit();

const formName = document.querySelector('.form-name')
const firstname = document.querySelector('#firstname')
const lastname = document.querySelector('#lastname')
const patronymic = document.querySelector('#patronymic')

const formRange = document.querySelector('.form-range')
const formLabelRange = document.querySelector('#form-label-range')

const result = document.querySelector('#result')
const loginHTML = document.querySelector('#login')
const pwdHTML = document.querySelector('#pwd')

formLabelRange.innerHTML = `Количество символов пароля = ${formRange.value}`

formRange.addEventListener('change', (e) => {
    console.log(formRange.value);
    formLabelRange.innerHTML = `Количество символов пароля = ${formRange.value}`
})


formName.addEventListener('submit', (e) => {
    e.preventDefault()
    let name = `${firstname.value} ${lastname.value} ${patronymic.value}`
    let login = getLogin(firstname.value, lastname.value, patronymic.value)
    let password = randomString({length: formRange.value});
    loginHTML.innerHTML = `Логин - ${login}`
    pwdHTML.innerHTML = `Пароль - ${password}`
    result.classList.remove('d-none')
    console.log(formRange.value);
})

function getLogin(firstname, lastname, patronymic){
    let shortName = `${firstname}${lastname.substring(0,1)}${patronymic.substring(0,1)}`
    console.log('shortName', shortName)
    let translitFirstname = cyrillicToTranslit.transform(firstname)
    let translitLastPatr = cyrillicToTranslit.transform(`${lastname.substring(0,1)}${patronymic.substring(0,1)}`)
    return `${translitFirstname}${getRandomInt(1000,9999)}${translitLastPatr}`
    
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //Максимум не включается, минимум включается
  }

