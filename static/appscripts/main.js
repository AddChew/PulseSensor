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

let adjustTextAreaHeight = evt =>{
    const textareaElement = evt.currentTarget
    textareaElement.style.height = ''
    textareaElement.style.height = `${textareaElement.scrollHeight + 3}px`
}

document.querySelectorAll('.tab').forEach(tab => tab.addEventListener('click', switchTab))
document.querySelector('.text-input').addEventListener('input', adjustTextAreaHeight)




// let validateInput = () => {
//     const textareaElement = document.getElementById('text-input')
//     const alertElement = document.getElementById('invalid-input-alert')

//     textareaElement.classList.remove('error')
//     alertElement.classList.remove('negative')

//     if (textareaElement.value) return true

//     textareaElement.classList.add('error')
//     alertElement.classList.add('negative')
//     return false
// }

// let predict = evt => {
//     const predSentimentElement = document.getElementById('pred-sentiment')
//     const predTimeElement = document.getElementById('pred-time')
//     predSentimentElement.classList.remove('positive', 'negative', 'neutral')
//     predTimeElement.classList.remove('info')

//     if (validateInput()) {
//         const startTime = performance.now()
//         const review = document.getElementById('text-input').value
//         const inputs = tokenizer.batchEncode(review)
//         const outputs = model.predict(inputs)
//         const predClass = outputs.argMax(1).arraySync()[0]
//         const maxProb = outputs.max(1).arraySync()[0].toFixed(2)
//         const predClassName = sentimentMap[predClass]
//         const endTime = performance.now()
//         const timeTakenSeconds = (endTime - startTime) / 1000

//         predSentimentElement.textContent = `${predClassName} sentiment with a probability of ${maxProb}.`
//         predSentimentElement.classList.add(`${predClassName.toLowerCase()}`)
//         predTimeElement.textContent = `Prediction was successfully completed in ${timeTakenSeconds.toFixed(2)}s.`
//         predTimeElement.classList.add('info')
//    }
// }

// let clickInput = () => document.querySelector('.drop-area input').click()

// let validateFileType = fileName => {
//     const alertElement = document.getElementById('invalid-file-type-alert')
//     alertElement.classList.remove('negative')
//     if (fileName.slice(-4) === '.csv') return true
//     alertElement.classList.add('negative')
//     return false
// }

// let fileDragState = (evt, state) => {
//     evt.preventDefault()
//     if (state === 'over') evt.currentTarget.classList.add('active')
//     if (state === 'leave') evt.currentTarget.classList.remove('active')
// }

// let fileUploaded = (evt, mode) => {
//     let file
//     if (mode === 'drag') {
//         fileDragState(evt, 'leave')
//         file = evt.dataTransfer.files[0]
//     }
//     if (mode === 'button') file = evt.files[0]

//     if (validateFileType(file.name)) {
//         document.querySelector('.drop-area header').textContent = file.name
//         document.querySelector('.drop-area span').textContent = formatFileSize(file.size)
//         return file
//     } else {
//         document.querySelector('.drop-area header').textContent = 'Drop your File here'
//         document.querySelector('.drop-area span').textContent = 'Supported file type: .csv'      
//     }
//     return null
// }

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

// let formatFileSize = fileSize => {
//     if (fileSize >= Math.pow(10, 6)) return `${(fileSize / Math.pow(10,6)).toFixed(0)} MB`
//     if (fileSize >= Math.pow(10, 3)) return `${(fileSize / Math.pow(10,3)).toFixed(0)} KB`
//     else return `${fileSize.toFixed(0)} B`
// }