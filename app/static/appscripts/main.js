let fileArray
const alertMap = {
    "Positive": "alert-success",
    "Neutral": "alert-primary",
    "Negative": "alert-danger",
}
const submit = document.querySelector("input[type='submit']")

// Setup worker thread
const worker = new Worker("static/appscripts/worker.js")
const prediction = document.querySelector(".alert")
const predictionTime = document.querySelector(".alert-secondary")
worker.onmessage = message => {
    // if (typeof message.data === "number") {
    //     progress.update(message.data)
    //     progressValueElement.textContent = `${progress.value}%`
    //     return
    // }
    const [modelOutput, timeTaken] = message.data
    // if (Array.isArray(modelOutput)) { 
    //     progress.valueElement.element.classList.add("no-animation")
    //     predTimeBatch.textContent = `Predictions were successfully completed in ${timeTaken}s`
    //     predTimeBatch.classList.add('info')
    //     download.element.classList.remove("custom-hidden")
    //     download.element.addEventListener("click", () => downloadPredictions(modelOutput))
    //     return
    // }
    const {predClasses, maxProbs} = modelOutput
    prediction.textContent = `${predClasses} sentiment with a probability of ${maxProbs}`
    prediction.classList.add(alertMap[predClasses], "alert-active")
    predictionTime.textContent = `Prediction was successfully completed in ${timeTaken}s`
    predictionTime.classList.add("alert-active")
    toggleButtonValue()
}

// Function to toggle submit button value
let toggleButtonValue = () => {
    switch(submit.value) {
        case "Submit":
            submit.value = "Please Wait..."
            break
        default:
            submit.value = "Submit"
    }
}

let predictSingle = () => {
    const textAreaInput = document.querySelector("textarea").value
    prediction.classList.remove("alert-success", "alert-primary", "alert-danger")
    predictionTime.classList.remove("alert-active")
    toggleButtonValue()
    worker.postMessage([textAreaInput, null])
} 

const forms = document.querySelectorAll("form")
forms.forEach(form => {
    form.addEventListener("submit", evt => {
        evt.preventDefault()
        predictSingle()
    })
})



// Setup Batch Tab

// // Setup File Upload Page
// const fileReader = new FileReader()
// const dropAreaElement = document.querySelector("input")
// const dropArea = new DragAndDrop(dropAreaElement, ".csv")
// dropArea.element.addEventListener("change", () => {
//     page.pages[0]._showButtons(dropArea.file)
//     loadTable(dropArea.file)
// })
// dropArea.dropAreaElement.element.addEventListener("drop", () => {
//     page.pages[0]._showButtons(dropArea.file)
//     loadTable(dropArea.file)
// })

// // Setup Table Page
// const selectElement = document.querySelector("select")
// const tableElement = document.querySelector("table")
// const select = new Choices(selectElement, {shouldSort: false})
// selectElement.addEventListener("change", () => page.pages[1]._showButton("nextButton", selectElement.value))

// let loadTable = async file => {
//     if (!file) return 
//     while (tableElement.hasChildNodes()) tableElement.removeChild(tableElement.firstChild)
//     fileArray = await readFileAsArray(file)
//     const columns = fileArray.columns
//     const table = new Table(tableElement, fileArray, columns, 5, true, "custom-table")
//     select.clearStore()
//     select.setChoices(columns.map(column => ({value: column, label: column})))
//     page.pages[1]._showButton("nextButton", selectElement.value)
// }

// let readFileAsURL = file => {
//     return new Promise((resolve, reject) => {
//         fileReader.onload = () => resolve(fileReader.result)
//         fileReader.onerror = () => reject
//         fileReader.readAsDataURL(file)
//     })
// }

// let readFileAsArray = async file => {
//     const fileURL = await readFileAsURL(file)
//     const fileArray = await d3.csv(fileURL)
//     return fileArray
// }

// // Setup Progress Bar Page
// const progressElement = document.querySelector(".progress")
// const progress = new Progress(progressElement, 0, "custom-progress")
// const progressValueElement = document.querySelector(".progress-percent")
// const predTimeBatch = document.querySelector(".message.pred-time.batch")
// const downloadElement = document.querySelector(".download")
// const download = new ContainerElement(downloadElement, "Download", "custom-button", "custom-hidden")

// let downloadPredictions = modelOutput => {
//     const csv = d3.csvFormat(modelOutput)
//     const csvBlob = new Blob([csv], {type: 'text/csv;'})
//     const csvURL = URL.createObjectURL(csvBlob)
//     const downloadLink = new BaseElement("a", "download-link")
//     downloadLink.element.setAttribute("href", csvURL)
//     downloadLink.element.setAttribute("download", "Predicted Sentiments.csv")
//     download.element.after(downloadLink.element)
//     downloadLink.element.click()
//     downloadLink.element.remove()
// }

// // Setup Tabs
// const tabContents = document.querySelectorAll("[data-tabs]")
// const tabs = new Tabs("Single", ...tabContents)

// // Setup Pages
// const pageElements = document.querySelectorAll("[data-pages]")
// const page = new Pages(...pageElements)
// page.pages[0]._showButtons(false)
// page.pages[1]._showButton("nextButton", false)
// page.pages[1].nextButton.element.addEventListener("click", () => worker.postMessage([fileArray, selectElement.value]))
// page.pages[2]._showButtons(false)