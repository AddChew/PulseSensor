let switchTab = evt => {
    Array.prototype.forEach.call(document.getElementsByClassName('tab'), element => element.className = element.className.replace(' active', ''))
    evt.currentTarget.className += ' active'
}

let adjustTextAreaHeight = () =>{
    const textareaElement = document.getElementById('text-input')
    textareaElement.style.height = ''
    textareaElement.style.height = `${textareaElement.scrollHeight + 3}px`
}

let validateInput = () => {
    const textareaElement = document.getElementById('text-input')
    if (textareaElement.value) {
        textareaElement.className = textareaElement.className.replace(' error', '')
        document.getElementById('alert').style.display = 'none'
        return true
    }
    textareaElement.className += ' error'
    document.getElementById('alert').style.display = 'block'
    return false
}

let toggleSubmitButtonState = evt => {
    const buttonElement = evt.currentTarget
    if (buttonElement.textContent === 'Submit') buttonElement.textContent = 'Please Wait...'
    else buttonElement.textContent = 'Submit'
}

let predict = evt => {
    toggleSubmitButtonState(evt)
    document.getElementById('pred-sentiment').style.display = 'none'
    if (validateInput()) document.getElementById('pred-sentiment').style.display = 'block'
    toggleSubmitButtonState(evt)
}