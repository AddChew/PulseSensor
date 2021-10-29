// Declare global variables
let headers, parsedContent
const fileSizeLimit = 2 * 1024 * 1024

// Bind events once page loads finish
document.addEventListener("DOMContentLoaded", () => {

    // Add event listener to file input
    bindEvent(".custom-file-input", "change", renderTable)

    // Add event listener to submit button
    bindEvent(".batch", "submit", validateDropdown)
})

// Function to bind function to element on change
let bindEvent = (className, type, func) => {
    const element = document.querySelector(className)
    if (document.contains(element)) element.addEventListener(type, func)
}

// Function to toggle element visibility
let toggleVisibility = (className, condition) => {
    const elements = document.querySelectorAll(className)
    if (elements.length) {
        elements.forEach(element => element.classList.toggle("hidden", condition))
    }
}

// Function to read the uploaded csv file
let readFile = file => {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader()
        fileReader.onload = () => resolve(fileReader.result)
        fileReader.onerror = () => reject
        fileReader.readAsDataURL(file)
    })
}

// Function to parse the first 5 rows of the uploaded csv file via d3
let parseFile = async () => {
    const fileInput = document.querySelector(".custom-file-input")
    const fileLabel = document.querySelector(".custom-file-label")
    const file = fileInput.files[0]

    fileLabel.textContent = file ? file.name : "Choose file"
    if (!file) return
    
    const ext = file.name.match(/\.([^\.]+)$/)[1]
    const exceedLimit = file.size > fileSizeLimit

    if (ext === "csv" && !exceedLimit)
    {
        const fileContent = await readFile(file)
        parsedContent = await d3.csv(fileContent)
        return {
            headers: parsedContent.columns, 
            data: parsedContent.slice(0, 5)
        }
    }

    // Remove the uploaded file and reset its label
    fileInput.value = ""
    fileLabel.textContent = "Choose file"

    // Display warning popup message
    message = ext != "csv" ? "Please upload a valid csv file!" : "File size limit exceeded!"
    alert(message)
}

// Function to populate the table headers
let populateHeaders = headers => {
    headers.forEach(header => {
        const th = document.createElement("th")
        th.appendChild(document.createTextNode(header))
        document.querySelector("thead tr").appendChild(th)
    })
}

// Function to populate the table data
let populateRow = row => {
    const tablerow = Object.values(row)
    const tr = document.createElement("tr")
    tablerow.forEach(data => {
        const td = document.createElement("td")
        td.appendChild(document.createTextNode(data)) 
        tr.appendChild(td)  
    })
    document.querySelector("tbody").appendChild(tr)
}

// Function to render a preview of the uploaded csv file
let renderTable = async () => {

    // Remove table headers and body content
    const th = document.querySelector("thead tr")
    const tb = document.querySelector("tbody")
    th.querySelectorAll("th").forEach(element => {
        element.remove()
    })
    tb.querySelectorAll("tr").forEach(element => {
        element.remove()
    })

    // Load the uploaded file
    const file = await parseFile()
    if (file)
    {   
        headers = file.headers

        // Populate dropdown
        populateDropdown(headers)

        // Populate header
        populateHeaders(headers)

        // Populate data rows
        file.data.forEach(row => {
            populateRow(row)
        })
    }
    toggleVisibility(".form-group", !file)
    toggleVisibility("table", !file)
}

// Function to populate dropdown list
let populateDropdown = headers => {
    const dropdown = document.querySelector(".custom-select")
    const options = dropdown.querySelectorAll("option")

    // Reset selected option
    dropdown.value = ""
    
    options.forEach(option => {
        if (option.value) option.remove()
    })

    headers.forEach(header => {
        const option = document.createElement("option")
        option.setAttribute("value", header)
        option.appendChild(document.createTextNode(header))
        dropdown.appendChild(option)
    })
}

// Validate selected dropdown option
let validateDropdown = () => {
    const dropdown = document.querySelector(".custom-select")
    if (!headers.includes(dropdown.value)) {
        alert("Invalid selection!")
    }
}