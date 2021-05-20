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

    textareaElement.classList.remove('error')
    alertElement.classList.remove('negative')

    if (textareaElement.value) return true

    textareaElement.classList.add('error')
    alertElement.classList.add('negative')
    return false
}

let predict = evt => {
    const predSentimentElement = document.getElementById('pred-sentiment')
    const predTimeElement = document.getElementById('pred-time')
    predSentimentElement.classList.remove('positive', 'negative', 'neutral')
    predTimeElement.classList.remove('info')

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
        predSentimentElement.classList.add(`${predClassName.toLowerCase()}`)
        predTimeElement.textContent = `Prediction was successfully completed in ${timeTakenSeconds.toFixed(2)}s.`
        predTimeElement.classList.add('info')
   }
}

let switchActiveTab = (evt, id) => {
    const tabs = document.querySelectorAll('.tab')
    const tabContents = document.querySelectorAll('.tab-content')

    tabs.forEach(tab => tab.classList.remove('active'))
    tabContents.forEach(tabContent => tabContent.classList.remove('active'))

    evt.currentTarget.classList.add('active')
    document.getElementById(id).classList.add('active')
}

let adjustTextAreaHeight = () =>{
    const textareaElement = document.getElementById('text-input')
    textareaElement.style.height = ''
    textareaElement.style.height = `${textareaElement.scrollHeight + 3}px`
}