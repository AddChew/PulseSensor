const worker = new Worker('./static/appscripts/model.js' )

const textareaElement = document.querySelector('.text-input')
const singleAlertMessageElement = document.querySelector('.message-box.invalid-input.single')
const singleSubmitButton = document.querySelector('.submit.predict.single')
const predictedClassMessageElement = document.querySelector('.message-box.prediction')
const singleTimeTakenMessageElement = document.querySelector('.message-box.prediction-time.single')

const fileDropArea = document.querySelector('.drop-area')
const fileDropAreaHeader = fileDropArea.querySelector('header')
const fileDropAreaSpan = fileDropArea.querySelector('span')
const fileDropAreaInput = fileDropArea.querySelector('input')
const browseButton = document.querySelector('.submit.browse.batch')
const batchAlertMessageElement = document.querySelector('.message-box.invalid-input.batch')

worker.onmessage = message => {
    const [{predClass, prob}, timeTaken] = message.data
    singleSubmitButton.textContent = 'Submit'
    predictedClassMessageElement.textContent = `${predClass} sentiment with a probability of ${prob}`
    predictedClassMessageElement.classList.add(predClass.toLowerCase())
    singleTimeTakenMessageElement.textContent = `Prediction was successfully completed in ${timeTaken}s`
    singleTimeTakenMessageElement.classList.add('info')
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
    textareaElement.style.height = ''
    textareaElement.style.height = `${textareaElement.scrollHeight + 3}px`
}

let validateInput = () => {
    if (textareaElement.value) {
        textareaElement.classList.remove('error')
        singleAlertMessageElement.classList.remove('negative')
    } else {
        textareaElement.classList.add('error')
        singleAlertMessageElement.classList.add('negative')
    }
    return textareaElement.value
}

let predict = () => {
    const review = validateInput()
    predictedClassMessageElement.classList.remove('positive', 'neutral', 'negative')
    singleTimeTakenMessageElement.classList.remove('info')
    if (review) {
        singleSubmitButton.textContent = 'Please Wait...'
        worker.postMessage(review)
    }
}

let activateDropArea = (evt, state) => {
    evt.preventDefault()
    if (state === 'over') fileDropArea.classList.add('active')
    if (state === 'leave') fileDropArea.classList.remove('active')
}

let validateFileType = file => {
    batchAlertMessageElement.classList.remove('negative')
    if (file.name.slice(-4) === '.csv') return file
    batchAlertMessageElement.classList.add('negative')
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
        fileDropAreaHeader.textContent = validFile.name
        fileDropAreaSpan.textContent = formatFileSize(validFile.size)
    } else {
        fileDropAreaHeader.textContent = 'Drop your File here'
        fileDropAreaSpan.textContent = 'Supported file type: .csv' 
    }
    return validFile
}

let formatFileSize = fileSize => {
    if (fileSize >= Math.pow(10, 6)) return `${(fileSize / Math.pow(10,6)).toFixed(0)} MB`
    if (fileSize >= Math.pow(10, 3)) return `${(fileSize / Math.pow(10,3)).toFixed(0)} KB`
    else return `${fileSize.toFixed(0)} B`
}

textareaElement.addEventListener('input', adjustTextAreaHeight)
singleSubmitButton.addEventListener('click', predict)
fileDropArea.addEventListener('dragover', evt => activateDropArea(evt, 'over'))
fileDropArea.addEventListener('dragleave', evt => activateDropArea(evt, 'leave'))
fileDropArea.addEventListener('drop', evt => uploadFile(evt, 'drag'))
fileDropAreaInput.addEventListener('change', evt => uploadFile(evt, 'button'))
browseButton.addEventListener('click', () => document.querySelector('.drop-area input').click())
document.querySelectorAll('.tab').forEach(tab => tab.addEventListener('click', switchTab))

// let readFileAsURL = file => {
//     return new Promise((resolve, reject) => {
//         const fileReader = new FileReader()
//         fileReader.onload = () => resolve(fileReader.result)
//         fileReader.onerror = () => reject
//         fileReader.readAsDataURL(file)
//     })
// }

// let readFileAsDataFrame = async file => {
//     const fileURL = await readFileAsURL(file)
//     const fileJson = await d3.csv(fileURL)
//     return new dfd.DataFrame(fileJson)
// }

// let previewDataFrame = async (evt, mode) => {
//     const file = fileUploaded(evt, mode)
//     if (file) {
//         const dataframe = await readFileAsDataFrame(file)
//         console.log(dataframe.head())
//         console.log(dataframe.col_types.indexOf('string'))
//         // console.log(dataframe.columns)
//     }
// }