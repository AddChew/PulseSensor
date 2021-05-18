const vocabFile = './static/appscripts/tokenizer/vocab.json'
const modelFile = './static/models/electra/model.json'
const sentimentMap = {0: 'Positive', 1: 'Neutral', 2: 'Negative'}

let loadTokenizer = async () => {
    const response = await fetch(vocabFile)
    const vocab = await response.json()
    tokenizer = new BertTokenizer(vocab)
}

let loadModel = async () => {
    model = await tf.loadGraphModel(modelFile)
}

let validateInput = () => {
    const textareaElement = document.getElementById('text-input')
    const alertElement = document.getElementById('alert')

    textareaElement.className = textareaElement.className.replace(' error', '')
    alertElement.className = alertElement.className.replace(' negative', '')

    if (textareaElement.value) return true

    textareaElement.className += ' error'
    alertElement.className += ' negative'
    return false
}

let predict = evt => {
    const predSentimentElement = document.getElementById('pred-sentiment')
    const predTimeElement = document.getElementById('pred-time')
    predSentimentElement.className = predSentimentElement.className.split(' ')[0]
    predTimeElement.className = predTimeElement.className.replace(' info', '')
    toggleSubmitButtonState(evt)

    if (validateInput()) {
        const startTime = performance.now()
        const review = document.getElementById('text-input').value
        const inputs = tokenizer.batchEncode(review)
        const outputs = model.predict(inputs)
        const predClass = outputs.argMax(1).arraySync()[0]
        const maxProb = outputs.max(1).arraySync()[0].toFixed(2)
        const predClassName = sentimentMap[predClass]
        const endTime = performance.now()
        const timeTakenSeconds = (endTime - startTime) / 1000

        predSentimentElement.textContent = `${predClassName} sentiment with a probability of ${maxProb}.`
        predSentimentElement.className += ` ${predClassName.toLowerCase()}`
        predTimeElement.textContent = `Prediction was successfully completed in ${timeTakenSeconds.toFixed(2)}s.`
        predTimeElement.className += ' info'
   }
    toggleSubmitButtonState(evt)
}

let switchActiveTab = (evt, id) => {
    Array.prototype.forEach.call(document.getElementsByClassName('tab'), element => element.className = element.className.replace(' active', ''))
    Array.prototype.forEach.call(document.getElementsByClassName('tab-content'), element => element.className = element.className.replace(' active', ''))
    evt.currentTarget.className += ' active'
    document.getElementById(id).className += ' active'
}

let adjustTextAreaHeight = () =>{
    const textareaElement = document.getElementById('text-input')
    textareaElement.style.height = ''
    textareaElement.style.height = `${textareaElement.scrollHeight + 3}px`
}

let toggleSubmitButtonState = evt => {
    const buttonElement = evt.currentTarget
    if (buttonElement.textContent === 'Submit') buttonElement.textContent = 'Please Wait...'
    else buttonElement.textContent = 'Submit'
}