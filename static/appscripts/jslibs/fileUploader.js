import {BaseElement, ContainerElement} from "./baseClasses/baseElements.js"

export default class DragAndDrop extends BaseElement {
    constructor(element, ...supportedFileTypes) {
        super(element, "custom-hidden")
        this.file = null

        this.fileUtils = new FileUtils(...supportedFileTypes)
        this.dropAreaElement = new DropArea("custom-file-uploader-container")
        this.instructionsElement = new ContainerElement("header", "Drop your File here", "custom-file-uploader-instructions")
        this.supportedElement = new ContainerElement("span", this.fileUtils.supportMessage, "custom-file-uploader-supported")
        this.browseElement = new ContainerElement("button", "Browse", "custom-button", "custom-file-uploader-browse")
        this.warningElement = new ContainerElement("div", this.fileUtils.warningMessage, "custom-warning")

        this.element.type = "file"
        this.element.accept = this.fileUtils.supportString

        this.element.addEventListener("change", evt => this._uploadFile(evt, "button")) 
        this.browseElement.element.addEventListener("click", () => this.element.click())
        this.dropAreaElement.element.addEventListener("drop", evt => this._uploadFile(evt, "drag"))

        this.dropAreaElement.element.append(this.instructionsElement.element, this.supportedElement.element, this.browseElement.element)
        this.element.after(this.dropAreaElement.element)
        this.dropAreaElement.element.after(this.warningElement.element)
    }

    _uploadFile(evt, method) {
        if (method === "drag") {
            this.dropAreaElement._activate(evt, "leave")
            var file = evt.dataTransfer.files[0]
        }
        if (method === "button") var file = evt.target.files[0]
        this.file = this.fileUtils._validate(file)
        this.warningElement.element.classList.toggle("active", !this.file)
        if (this.file) {
            this.instructionsElement._set(this.file.name)
            this.supportedElement._set(this.fileUtils._formatFileSize(this.file))
        } else {
            this.instructionsElement._reset()
            this.supportedElement._reset()
        }
    }
}

class FileUtils {
    constructor(...support) {
        this.support = support
        this._processSupport()
        this.supportMessage = `Supported file type(s): ${this.supportString}`
        this.warningMessage = `Please upload only ${this.supportString} files!`
    }

    _processSupport() {
        this.supportString = this.support.map(fileType => {
            fileType = fileType.toLowerCase()
            return fileType.startsWith(".") ? fileType : `.${fileType}`
        }).join(", ")
    }

    _validate(file) {
        const fileParts = file.name.split(".")
        const fileType = `.${fileParts[fileParts.length - 1]}`
        if (this.support.includes(fileType)) return file
        return null       
    }

    _formatFileSize(file) {
        const fileSize = file.size
        if (fileSize >= Math.pow(10, 6)) return `${(fileSize / Math.pow(10,6)).toFixed(0)} MB`
        if (fileSize >= Math.pow(10, 3)) return `${(fileSize / Math.pow(10,3)).toFixed(0)} KB`
        else return `${fileSize.toFixed(0)} B`
    }
}

class DropArea extends BaseElement {
    constructor(...classNames) {
        super("div", ...classNames)
        this._addEventListeners()
    }

    _addEventListeners() {
        this.element.addEventListener("dragover", evt => this._activate(evt, "over"))
        this.element.addEventListener("dragleave", evt => this._activate(evt, "leave"))   
    }

    _activate(evt, state) {
        evt.preventDefault()
        this.element.classList.toggle("active", state === "over")
    }
}