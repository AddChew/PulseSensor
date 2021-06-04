export class BaseElement {
    constructor(tag, ...classNames) {
        this.element = typeof tag === "string" ? document.createElement(tag) : tag
        classNames.forEach(className => this.element.classList.add(className))
    }
}

export class ContainerElement extends BaseElement {
    constructor(tag, textContent, ...classNames) {
        super(tag, ...classNames)
        this.defaultTextContent = textContent
        this.element.textContent = this.defaultTextContent
    }

    _set(textContent) {
        this.element.textContent = textContent
    }

    _reset() {
        this.element.textContent = this.defaultTextContent
    }
}