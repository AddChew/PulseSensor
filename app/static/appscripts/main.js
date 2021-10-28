// Sentiment to alert mapping
const alertMap = {
    "Positive": "alert-success",
    "Neutral": "alert-primary",
    "Negative": "alert-danger",
}

// Batch Tab
const batchTab = document.querySelector("li:nth-child(2)")

// Forms
const singleForm = document.querySelector(".single")
const batchForm = document.querySelector(".batch")

// Submit buttons
const singleSubmit = singleForm.querySelector("input[type='submit']")
const batchSubmit = batchForm.querySelector("input[type='submit']")

// Back button
const back = document.querySelector("button.is-outlined")

// Download button
const download = document.querySelector("button.is-link")

// Alert messages
const prediction = document.querySelector(".alert")
const predictionTime = document.querySelector(".alert-secondary")

// Function to toggle submit button value
let toggleButtonValue = submit => {
    switch(submit.value) {
        case "Submit":
            submit.value = "Please Wait..."
            break
        default:
            submit.value = "Submit"
    }
}

// Function to process single prediction output
let singlePredOutput = (modelOutput, timeTaken) => {
    const {predClasses, maxProbs} = modelOutput
    prediction.textContent = `${predClasses} sentiment with a probability of ${maxProbs}`
    prediction.classList.replace("hidden", alertMap[predClasses])

    predictionTime.textContent = `Prediction was successfully completed in ${timeTaken}s`
    predictionTime.classList.remove("hidden")
    toggleButtonValue(singleSubmit)
}

// Function to get single prediction
let getSinglePred = () => {
    const textAreaInput = document.querySelector("textarea").value

    prediction.classList.remove("alert-success", "alert-primary", "alert-danger")
    prediction.classList.add("hidden")
    predictionTime.classList.add("hidden")

    toggleButtonValue(singleSubmit)
    worker.postMessage([textAreaInput, null])   
}

// Function to navigate back to file upload page in batch tab
let navigateBack = () => {
    location.reload()
    console.log(batchTab)
    batchTab.click()
}

// Setup worker
const worker = new Worker("static/appscripts/worker.js")
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
    singlePredOutput(modelOutput, timeTaken)
}

// Add event listeners to forms and buttons
singleForm.addEventListener("submit", evt => {
    evt.preventDefault()
    getSinglePred()
})

batchForm.addEventListener("submit", evt => {
    evt.preventDefault()
})

back.addEventListener("click", navigateBack)



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