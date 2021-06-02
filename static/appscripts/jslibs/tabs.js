import {BaseElement, ContainerElement} from "./baseClasses/baseElements.js"

class Tab {
    constructor(tabButton, tabContent){
        this.tabButton = tabButton
        this.tabContent = tabContent
    }

    _activate() {
        this.tabButton.element.classList.add("active")
        this.tabContent.element.classList.add("active")
    }

    _deactivate() {
        this.tabButton.element.classList.remove("active")
        this.tabContent.element.classList.remove("active")
    }
}

export default class Tabs {
    constructor(active, ...tabContents) {
        this.active = null
        this.tabButtonsContainer = new BaseElement("div", "custom-tab-button-container")
        tabContents.forEach((tabContent, index) => {
            if (index === 0) tabContent.before(this.tabButtonsContainer.element)
            const tabName = tabContent.id || tabContent.className
            const tabButton = new ContainerElement("button", tabName, "custom-tab-button")
            tabContent = new BaseElement(tabContent, "custom-tab-content")
            const tab = new Tab(tabButton, tabContent)
            if (tabName === active) this._setActive(tab)
            tabButton.element.addEventListener("click", () => this._setActive(tab))
            this.tabButtonsContainer.element.append(tabButton.element)
        })
    }

    _setActive(tab) {
        if (this.active) this.active._deactivate() 
        this.active = tab
        this.active._activate()
    }
}