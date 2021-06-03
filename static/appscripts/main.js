import {DragAndDrop, TextArea, Tabs, Progress, Table, Pages, ContainerElement} from "./jslibs/customElements.js"
let fileArray
// Setup Single Tab

// Setup Worker
const worker = new Worker('./static/appscripts/model.js')
const predMessage = document.querySelector(".message")
const predTime = document.querySelector(".message.pred-time")
worker.onmessage = message => {
    if (typeof message.data === "number") {
        progress.update(message.data)
        return
    }
    const [modelOutput, timeTaken] = message.data
    if (Array.isArray(modelOutput)) { // To be changed later
        console.log(modelOutput)
        // Render download button
        return
    }
    submit._reset()
    predMessage.textContent = `${predClasses} sentiment with a probability of ${maxProbs}`
    predMessage.classList.add(predClasses.toLowerCase())
    predTime.textContent = `Prediction was successfully completed in ${timeTaken}s`
    predTime.classList.add('info')
}

// Setup Text Area
const textAreaElement = document.querySelector("textarea")
const buttonElement = document.querySelector("button")
const textArea  = new TextArea(textAreaElement, "Enter employee review here.", "Please enter an employee review!", "custom-text-area")
const submit = new ContainerElement(buttonElement, "Submit", "custom-button")
submit.element.addEventListener("click", () => predictSingle())

let predictSingle = () => {
    textArea.validate()
    predMessage.classList.remove('positive', 'neutral', 'negative')
    predTime.classList.remove('info')
    if (textArea.value) {
        submit._set('Please Wait...')
        worker.postMessage([textArea.value, null])
    }
}

// Setup Batch Tab

// Setup File Upload Page
const fileReader = new FileReader()
const dropAreaElement = document.querySelector("input")
const dropArea = new DragAndDrop(dropAreaElement, ".csv")
dropArea.element.addEventListener("change", () => {
    page.pages[0]._showButtons(dropArea.file)
    loadTable(dropArea.file)
})
dropArea.dropAreaElement.element.addEventListener("drop", () => {
    page.pages[0]._showButtons(dropArea.file)
    loadTable(dropArea.file)
})

// Setup Table Page
const selectElement = document.querySelector("select")
const tableElement = document.querySelector("table")
const select = new Choices(selectElement, {shouldSort: false})
selectElement.addEventListener("change", () => page.pages[1]._showButton("nextButton", selectElement.value))

let loadTable = async file => {
    if (!file) return 
    while (tableElement.hasChildNodes()) tableElement.removeChild(tableElement.firstChild)
    fileArray = await readFileAsArray(file)
    const columns = fileArray.columns
    const table = new Table(tableElement, fileArray, columns, 5, true, "custom-table")
    select.clearChoices()
    select.setChoices(columns.map(column => ({value: column, label: column})))
}

let readFileAsURL = file => {
    return new Promise((resolve, reject) => {
        fileReader.onload = () => resolve(fileReader.result)
        fileReader.onerror = () => reject
        fileReader.readAsDataURL(file)
    })
}

let readFileAsArray = async file => {
    const fileURL = await readFileAsURL(file)
    const fileArray = await d3.csv(fileURL)
    return fileArray
}

// Setup Progress Bar Page
const progressElement = document.querySelector(".progress")
const progress = new Progress(progressElement, 0, "custom-progress")

let predictBatch = () => {
    worker.postMessage([fileArray, selectElement.value])
    // console.log(fileArray)
}
// setInterval(() => {
//     if (progress.value === 100) progress.reset()
//     else progress.update(1)
// }, 100)

// Setup Tabs
const tabContents = document.querySelectorAll("[data-tabs]")
const tabs = new Tabs("Single", ...tabContents)

// Setup Pages
const pageElements = document.querySelectorAll("[data-pages]")
const page = new Pages(...pageElements)
page.pages[0]._showButtons(false)
page.pages[1]._showButton("nextButton", false)
page.pages[2]._showButton("backButton", false)
page.pages[2]._showButton("nextButton", false)
page.pages[1].nextButton.element.addEventListener("click", () => predictBatch())