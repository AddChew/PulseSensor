importScripts('./jslibs/tfjs.js', './tokenizer/tokenizer.js')

const vocabFile = './tokenizer/vocab.json'
const modelFile = './models/electra/model.json'
const sentimentMap = {0: 'Positive', 1: 'Neutral', 2: 'Negative'}

let loadTokenizer = async vocabFile => {
    const response = await fetch(vocabFile)
    const vocab = await response.json()
    return new BertTokenizer(vocab)
}

let loadModel = async modelFile => {
    return await tf.loadGraphModel(modelFile)
}

let predict = review => {
    const inputs = tokenizer.batchEncode(review)
    const outputs = model.predict(inputs)
    const predClassIndex = outputs.argMax(1).arraySync()[0]
    const maxProb = outputs.max(1).arraySync()[0].toFixed(2)
    return {
        predClass: sentimentMap[predClassIndex],
        prob: maxProb
    }
}

onmessage = async message => {
    const startTime = performance.now()
    const review = message.data
    if (typeof tokenizer === 'undefined') tokenizer = await loadTokenizer(vocabFile)
    if (typeof model === 'undefined') model = await loadModel(modelFile)
    const modelOutput = predict(review)
    const endTime = performance.now()
    const timeTakenSeconds = ((endTime - startTime) / 1000).toFixed(2)
    postMessage([modelOutput, timeTakenSeconds])
}