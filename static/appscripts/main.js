const fileReader = new FileReader()
const worker = new Worker('./static/appscripts/model.js')
const domElements = Array.from(document.body.querySelectorAll('*')).reduce((domElements, domElement) => {
    domElements[domElement.className] = domElement
    return domElements
}, {})

worker.onmessage = message => {
    const [{predClass, prob}, timeTaken] = message.data
    domElements['submit predict single'].textContent = 'Submit'
    domElements['message-box prediction single'].textContent = `${predClass} sentiment with a probability of ${prob}`
    domElements['message-box prediction single'].classList.add(predClass.toLowerCase())
    domElements['message-box prediction-time single'].textContent = `Prediction was successfully completed in ${timeTaken}s`
    domElements['message-box prediction-time single'].classList.add('info')
}

let switchTab = evt => {
    const clickedTab = evt.currentTarget
    if (!clickedTab.classList.contains('active')) {
        const clickedTabContent = document.getElementsByClassName(clickedTab.classList.value.replace(/\btab\b/, 'tab-content'))[0]
        const activeTabs = document.querySelectorAll('.tabs.active')

        clickedTab.classList.add('active')
        clickedTabContent.classList.add('active')

        activeTabs.forEach(activeTab => activeTab.classList.remove('active'))
    }
}

let adjustTextAreaHeight = () =>{
    domElements['text-input'].style.height = ''
    domElements['text-input'].style.height = `${domElements['text-input'].scrollHeight + 3}px`
}

let validateInput = () => {
    if (domElements['text-input'].value) {
        domElements['text-input'].classList.remove('error')
        domElements['message-box invalid-input single'].classList.remove('negative')
    } else {
        domElements['text-input'].classList.add('error')
        domElements['message-box invalid-input single'].classList.add('negative')
    }
    return domElements['text-input'].value
}

let predict = () => {
    const review = validateInput()
    domElements['message-box prediction single'].classList.remove('positive', 'neutral', 'negative')
    domElements['message-box prediction-time single'].classList.remove('info')
    if (review) {
        domElements['submit predict single'].textContent = 'Please Wait...'
        worker.postMessage(review)
    }
}

let activateDropArea = (evt, state) => {
    evt.preventDefault()
    if (state === 'over') domElements['drop-area'].classList.add('active')
    if (state === 'leave') domElements['drop-area'].classList.remove('active')
}

let validateFileType = file => {
    domElements['message-box invalid-input batch'].classList.remove('negative')
    if (file.name.slice(-4) === '.csv') return file
    domElements['message-box invalid-input batch'].classList.add('negative')
    return null
}

let uploadFile = (evt, method) => {
    if (method === 'drag') {
        activateDropArea(evt, 'leave')
        var file = evt.dataTransfer.files[0]
    }
    if (method === 'button') var file = evt.target.files[0]

    const validFile = validateFileType(file)
    if (validFile) {
        domElements['drop-area-header'].textContent = validFile.name
        domElements['drop-area-span'].textContent = formatFileSize(validFile.size)
    } else {
        domElements['drop-area-header'].textContent = 'Drop your File here'
        domElements['drop-area-span'].textContent = 'Supported file type: .csv' 
    }
    return validFile
}

let formatFileSize = fileSize => {
    if (fileSize >= Math.pow(10, 6)) return `${(fileSize / Math.pow(10,6)).toFixed(0)} MB`
    if (fileSize >= Math.pow(10, 3)) return `${(fileSize / Math.pow(10,3)).toFixed(0)} KB`
    else return `${fileSize.toFixed(0)} B`
}

let readFileAsURL = file => {
    return new Promise((resolve, reject) => {
        fileReader.onload = () => resolve(fileReader.result)
        fileReader.onerror = () => reject
        fileReader.readAsDataURL(file)
    })
}

let readFileAsDataFrame = async file => {
    const fileURL = await readFileAsURL(file)
    const fileJson = await d3.csv(fileURL)
    return new dfd.DataFrame(fileJson)
}

let previewDataFrame = async (evt, method) => {
    const file = uploadFile(evt, method)
    if (file) {
        const dataframe = await readFileAsDataFrame(file)
        console.log(dataframe.head().data)
        console.log(dataframe.select_dtypes(include=['string']).columns)
    }
}

domElements['text-input'].addEventListener('input', adjustTextAreaHeight)
domElements['submit predict single'].addEventListener('click', predict)
domElements['drop-area'].addEventListener('dragover', evt => activateDropArea(evt, 'over'))
domElements['drop-area'].addEventListener('dragleave', evt => activateDropArea(evt, 'leave'))
domElements['drop-area'].addEventListener('drop', evt => previewDataFrame(evt, 'drag'))
domElements['hidden'].addEventListener('change', evt => previewDataFrame(evt, 'button'))
domElements['submit browse batch'].addEventListener('click', () => document.querySelector('.drop-area input').click())
document.querySelectorAll('.tab').forEach(tab => tab.addEventListener('click', switchTab))


function* splitIntoBatches(reviewsArray, batchSize = 64){
    for (let start = 0; start < reviewsArray.length; start += batchSize) {
        const end = start + batchSize
        yield reviewsArray.slice(start, end)
    }
}

// test = ['I love my job', 'I hate my job', 'Life sucks', 'takes drugs']
// batchGenerator = splitIntoBatches(reviewsArray=test, batchSize = 3)

// for (batch of batchGenerator) {
//     console.log(batch)
// }

// console.log(batchGenerator.next())
// render select drop down list
// render preview of dataframe