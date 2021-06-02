import {BaseElement, ContainerElement} from "./baseClasses/baseElements.js"

class Page extends BaseElement {
    constructor(element, back, next, ...classNames) {
        super(element, ...classNames)
        this.back = back
        this.next = next
        this._renderButtons()
    }

    _renderButtons() {
        this.buttonsContainer = new BaseElement("div", "custom-page-button-container", "active")
        if (this.back) this._createButton("backButton",  "❮ Previous", "custom-pages-button", "back", "active")
        if (this.next) this._createButton("nextButton", "Next ❯", "custom-pages-button", "next", "active")
        this.element.append(this.buttonsContainer.element)
    }

    _createButton(button, buttonText, ...buttonClasses) {
        this[button] = new ContainerElement("button", buttonText, ...buttonClasses)
        this[button].element.addEventListener("click", () => this._showPage(false))
        this.buttonsContainer.element.append(this[button].element)
    }
    
    _showPage(condition) {
        this.element.classList.toggle("active", condition)
    }

    _showButton(button, condition) {
        this[button].element.classList.toggle("active", condition)
    }

    _showButtons(condition) {
        this.buttonsContainer.element.classList.toggle("active", condition)
    }
}

export default class Pages {
    constructor(...pages) {
        const numPages = pages.length
        this.pages = new Array(numPages)
        for (let i=0; i < numPages; i++) {
            const back = i === 0 ? false : true
            const next = i === numPages - 1 ? false : true
            this.pages[i] =  new Page(pages[i], back, next, "custom-page")
            if (!back) this.pages[i]._showPage(true)
            if (back) this._addButtonEventListener(i, "backButton", false)
            if (next) this._addButtonEventListener(i, "nextButton")
        }
    }

    _addButtonEventListener(index, button, next=true) {
        const increment = next ? 1 : -1
        this.pages[index][button].element.addEventListener(
            "click", () => this.pages[index + increment]._showPage(true))
    }
}