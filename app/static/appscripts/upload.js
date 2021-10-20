// Declare global variables
let headers
const fileSizeLimit = 2 * 1024 * 1024

// Bind events once page loads finish
document.addEventListener("DOMContentLoaded", () => {

    // Add event listener to file input
    bindEvent(".custom-file-input", "change", renderTable)

    // // Add event listeners to submit button
    // bindEvent(".send-job", "submit", evt => validateDropdown(evt))

    // // Add event listeners to close and ok buttons on modal
    // const modal = document.querySelector(".sgds-modal")
    // configureCloseButtons(modal)
})

// Function to bind function to element on change
let bindEvent = (className, type, func) => {
    const element = document.querySelector(className)
    if (document.contains(element)) element.addEventListener(type, func)
}

// Function to toggle element visibility
let toggleVisibility = (className, condition) => {
    const element = document.querySelector(className)
    if (document.contains(element)) element.classList.toggle("hidden", condition)
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
        const parsedContent = await d3.csv(fileContent)
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

        // // Populate dropdowns
        // populateDropdowns(null, headers)

        // Populate header
        populateHeaders(headers)

        // Populate data rows
        file.data.forEach(row => {
            populateRow(row)
        })
    }
    // toggleVisibility(".form-group.form-inline", !file)
    toggleVisibility("table", !file)
}

// // Function to populate dropdown list
// let populateDropdown = (selectElement, headers) => {
//     headers.forEach(header => {
//         const option = document.createElement("option")
//         option.setAttribute("value", header)
//         option.appendChild(document.createTextNode(header))
//         selectElement.appendChild(option)
//     })    
// }

// // Function to populate all the dropdown lists
// let populateDropdowns = (evt, headers) => {
//     const feedback = document.querySelector(".feedback")
//     const field1 = document.querySelector(".field1")
//     const field2 = document.querySelector(".field2")

//     const feedback_value = feedback.value
//     const field1_value = field1.value
//     const field2_value = field2.value

//     document.querySelectorAll("select").forEach(select => {
//         if (evt && (evt.target.name === select.name || (select.value != evt.target.value && select.value))) return
//         if (!evt) select.addEventListener("change", evt => populateDropdowns(evt, headers))
//         select.querySelectorAll("option").forEach(option => {
//             if (option.value != "") option.remove()
//         })
//         switch(select.name) {
//             case "feedback":
//                 feedback.value = (feedback_value != field1_value && feedback_value != field2_value) ? feedback_value : ""
//                 populateDropdown(select, headers.filter(header => header != field1.value && header != field2.value))
//                 break
//             case "field1":
//                 field1.value = (field1_value != feedback_value && field1_value != field2_value) ? field1_value : ""
//                 populateDropdown(select, headers.filter(header => header != feedback.value && header != field2.value))
//                 break
//             default:
//                 field2.value = (field2_value != feedback_value && field2_value != field1_value) ? field2_value : ""
//                 populateDropdown(select, headers.filter(header => header != field1.value && header != feedback.value))
//         }
//     })
// }

// // Validate selected dropdown options
// let validateDropdown = evt => {
//     const selections = Array.from(document.querySelectorAll("select")).map(select => select.value)
//     const filled_selections = selections.filter(selection => selection)

//     // Check for duplicates
//     if (new Set(filled_selections).size != filled_selections.length) {
//         alert("Duplicate selections detected!")
//         return evt.preventDefault()
//     }

//     // Check that all the filled selections are in headers
//     if (filled_selections.filter(selection => headers.includes(selection)).length != filled_selections.length) {
//         alert("Invalid selection!")
//         return evt.preventDefault()
//     }
// }

// // Function to configure the close and ok buttons
// let configureCloseButtons = modal => {
//     const closeButtons = document.querySelectorAll(".close-modal")
//     closeButtons.forEach(closeButton => {
//         closeButton.addEventListener("click", () => {
//             modal.classList.remove("is-active")
//         })
//     })
// }