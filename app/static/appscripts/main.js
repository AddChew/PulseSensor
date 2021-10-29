// Sentiment to alert mapping
const alertMap = {
    "Positive": "alert-success",
    "Neutral": "alert-primary",
    "Negative": "alert-danger",
}

// Modal and its close buttons
const modal = document.querySelector(".sgds-modal")
const closeButtons = document.querySelectorAll(".close-modal")

// Batch Tab
const batchTab = document.querySelector("li:nth-child(2)")

// Forms
const singleForm = document.querySelector(".single")
const batchForm = document.querySelector(".batch")

// Batch Pages
const uploadPage = document.querySelector(".upload")
const progressPage = document.querySelector(".progress-update")
const downloadPage = document.querySelector("download")

// Submit buttons
const singleSubmit = singleForm.querySelector("input[type='submit']")
const batchSubmit = batchForm.querySelector("input[type='submit']")

// Progress elements
const progressText = document.querySelector(".progress-text")
const progressBar = document.querySelector(".sgds-progress")

// Back button
const back = document.querySelector("button.is-outlined")

// Download button
const download = document.querySelector("button.is-link")

// Alert messages
const prediction = document.querySelector(".alert")
const singlePredTime = document.querySelector(".alert-secondary")
const batchPredTime = document.querySelector(".download .alert")

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

    singlePredTime.textContent = `Prediction was successfully completed in ${formatTime(timeTaken)}`
    singlePredTime.classList.remove("hidden")
    toggleButtonValue(singleSubmit)
}

// Function to get single prediction
let getSinglePred = () => {
    const textAreaInput = document.querySelector("textarea").value

    prediction.classList.remove("alert-success", "alert-primary", "alert-danger")
    prediction.classList.add("hidden")
    singlePredTime.classList.add("hidden")

    toggleButtonValue(singleSubmit)
    worker.postMessage([textAreaInput, null])   
}

// Function to download batch predictions
let downloadPreds = modelOutput => {
    const csv = d3.csvFormat(modelOutput)
    const csvBlob = new Blob([csv], {type: 'text/csv;'})
    const csvURL = URL.createObjectURL(csvBlob)

    const downloadLink = document.createElement("a")
    downloadLink.setAttribute("href", csvURL)
    downloadLink.setAttribute("download", "Predicted Sentiments.csv")
    download.after(downloadLink)

    downloadLink.click()
    downloadLink.remove()
}

// Function to configure the close and ok buttons
let configureCloseButtons = () => {
    closeButtons.forEach(closeButton => {
        closeButton.addEventListener("click", () => {
            modal.classList.remove("is-active")
            sessionStorage.setItem("shown-warning", "true")
        })
    })
}

// Function to navigate to progress page
let loadProgress = () => {
    uploadPage.classList.add("hidden")
    progressPage.classList.remove("hidden")
}

// Function to navigate to download page
let loadDownload = () => {
    progressPage.classList.add("hidden")
    downloadPage.classList.remove("hidden")
}

// Functions to refresh page
let navigateBack = () => {
    sessionStorage.setItem("reload", "true")
    location.reload()
}

// Function to load page
let loadPage = () => {
    const shown_warning = sessionStorage.getItem("shown-warning")
    const reload = sessionStorage.getItem("reload")

    if (shown_warning) modal.classList.remove("is-active")
    else configureCloseButtons()

    if (reload) {
        batchTab.click()
        sessionStorage.removeItem("reload")
    }
}

// Function to format time
let formatTime = timeTaken => {
    const hours = ~~(timeTaken / 3600)
    const minutes = ~~((timeTaken % 3600) / 60) 
    const seconds = timeTaken % 60

    let formattedTime = hours ? `${hours}hr ${minutes}min ${Math.ceil(seconds)}s` : `${minutes}min ${seconds}s`
    if (formattedTime.includes("hr")) return formattedTime

    formattedTime = minutes ? `${minutes}min ${Math.ceil(seconds)}s` : `${seconds}s`
    if (formattedTime.includes("min")) return formattedTime

    formattedTime = ~~seconds ? `${Math.ceil(seconds)}s` : `${seconds.toFixed(2)}s`
    return formattedTime
}

// Setup worker
const worker = new Worker("static/appscripts/worker.js")
worker.onmessage = message => {
    if (typeof message.data === "number") {
        progressBar.value += message.data
        progressText.textContent = `${~~progressBar.value}%`
        return
    }
    const [modelOutput, timeTaken] = message.data
    if (Array.isArray(modelOutput)) { 
        batchPredTime.textContent = `Job Completed in ${formatTime(timeTaken)}!`
        download.addEventListener("click", () => downloadPreds(modelOutput))
        loadDownload()
        return
    }
    singlePredOutput(modelOutput, timeTaken)
}

// Add event listeners to forms and buttons
singleForm.addEventListener("submit", evt => {
    evt.preventDefault()
    getSinglePred()
})

batchForm.addEventListener("submit", evt => {
    evt.preventDefault()
    loadProgress()
    worker.postMessage([parsedContent, selectElement.value])
})

back.addEventListener("click", navigateBack)
document.addEventListener("DOMContentLoaded", loadPage)