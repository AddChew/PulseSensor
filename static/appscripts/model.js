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

let splitIntoBatches = (reviews, batchSize=64) => {
    let batches = []
    for (let start = 0; start < reviews.length; start += batchSize) {
        const end = start + batchSize
        batches.push(reviews.slice(start, end))
    }
    return batches
}

let processReviews = (reviews, column) => {
    if (column) return splitIntoBatches(reviews.map(review => review[column]))
    return [reviews]
}

let processOutput = (reviews, predClasses, maxProbs) => {
    for (let i = 0; i < reviews.length; i++) {
        const preds = {Predicted_Sentiment: predClasses[i], Confidence_Score: maxProbs[i]}
        reviews[i] = {...reviews[i], ...preds}
    }
    return reviews
}

let predict = (reviews, column) => {
    const batches = processReviews(reviews, column)
    const progress = 100 / batches.length || 0
    let predClasses = []
    let maxProbs = []
    for (const batch of batches) {
        const inputs = tokenizer.batchEncode(batch)
        const outputs = model.predict(inputs)
        const batchPredClasses = outputs.argMax(1).arraySync().map(index => sentimentMap[index])
        const batchMaxProbs = outputs.max(1).arraySync().map(prob => prob.toFixed(2))
        predClasses.push(...batchPredClasses)
        maxProbs.push(...batchMaxProbs)
        if (column) postMessage(progress)
    }
    if (column) return processOutput(reviews, predClasses, maxProbs)
    return {predClasses: predClasses[0], maxProbs: maxProbs[0]}
}

onmessage = async message => {
    const startTime = performance.now()
    const [reviews, column] = message.data
    if (typeof tokenizer === 'undefined') tokenizer = await loadTokenizer(vocabFile)
    if (typeof model === 'undefined') model = await loadModel(modelFile)
    const modelOutput = predict(reviews, column)
    const endTime = performance.now()
    const timeTakenSeconds = ((endTime - startTime) / 1000).toFixed(2)
    postMessage([modelOutput, timeTakenSeconds])
}