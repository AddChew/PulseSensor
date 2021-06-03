import {BaseElement} from "./baseClasses/baseElements.js"

export default class Progress extends BaseElement {
    constructor(element, start, ...classNames) {
        super(element, ...classNames)
        this.valueElement = new BaseElement("div", "custom-progress-value")
        this.element.append(this.valueElement.element)
        this.set(start)
    }

    set(value) {
        this.value = Math.ceil(Math.min(value, 100))
        this.valueElement.element.style.width  = `${this.value}%`
    }

    update(increment) {
        this.set(this.value + increment)
    }

    reset() {
        this.set(0)
    }
}