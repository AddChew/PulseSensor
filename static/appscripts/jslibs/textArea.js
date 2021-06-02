import {BaseElement, ContainerElement} from "./baseClasses/baseElements.js"

export default class TextArea extends BaseElement {
    constructor(element, placeholder, warning, ...classNames) {
        super(element, ...classNames)
        this.value = this.element.value
        this.warningElement = new ContainerElement("div", warning, "custom-warning")
        this.element.placeholder = placeholder
        this.element.addEventListener("input", () => this._adjustHeight())
        this.element.after(this.warningElement.element)
    }

    validate() {
        this.value = this.element.value
        this.warningElement.element.classList.toggle("active", !this.value)
        this.element.classList.toggle("active", !this.value)
    }

    _adjustHeight() {
        this.element.style.height = ""
        this.element.style.height = `${this.element.scrollHeight + 3}px`
    }
}