import {BaseElement, ContainerElement} from "./baseClasses/baseElements.js"

class TableContent extends BaseElement {
    constructor(element, data, header=false, ...classNames) {
        super(element, ...classNames)
        this.entryElement = header ? "th" : "td"
        this.dataElements = []
        this._appendRows(data)
    }

    _appendRows(data) {
        data.forEach(row => {
            const rowElement = this._appendRow(row)
            this.element.append(rowElement)
        })
    }

    _appendRow(rowData) {
        const row = new BaseElement("tr", "custom-table-tr")
        const entries = rowData.map(entry => this._updateEntry(entry, row))
        this.dataElements.push(entries)
        return row.element
    }

    _updateEntry(entryData, row) {
        const entry = new ContainerElement(this.entryElement, entryData, `custom-table-${this.entryElement}`)
        row.element.append(entry.element)
        return entry
    }
}

export default class Table extends BaseElement {
    constructor(element, data, columns=null, nrows=null, caption=false, ...classNames) {
        super(element, ...classNames)
        this.columns = columns?.length ? columns : data?.length ? Object.keys(data[0]): Object.keys(data)
        this.data = this._processData(nrows ? data.slice(0, nrows) : data)
        const visibility = caption ? "custom-visible" : "custom-hidden"
        this.caption = new ContainerElement("caption", `First ${this.data.length} rows of dataset`, "custom-table-caption", visibility)
        this._render()
    }

    append(data) {
        data = this._processData(data)
        this.data.push(...data)
        this.body._appendRows(data)
        this.caption._set(`First ${this.data.length} rows of dataset`)
    }

    replaceRow(rowIndex, rowData) {
        rowData = Array.isArray(rowData) ? rowData : Object.values(rowData)
        rowData.forEach((entry, index) => this.set(rowIndex, index, entry))
    }

    delete(...rowIndexes) {
        rowIndexes.forEach(rowIndex => {
            delete this.data[rowIndex]
            this.body.dataElements[rowIndex][0].element.parentElement.remove()
            delete this.body.dataElements[rowIndex]
        })
        this.data = this.data.filter(Boolean)
        this.body.dataElements = this.body.dataElements.filter(Boolean)
        this.caption._set(`First ${this.data.length} rows of dataset`)
    }
    
    set(rowIndex, columnIndex, value) {
        this.data[rowIndex][columnIndex] = value
        this.body.dataElements[rowIndex][columnIndex]._set(value)
    }

    setHeader(index, value) {
        this.columns[index] = value
        this.header.dataElements[0][index]._set(value)
    }

    _render() {
        this.header = new TableContent("thead", this._processData(this.columns), true, "custom-table-thead")
        this.body = new TableContent("tbody", this.data, false, "custom-table-tbody")
        this.element.append(this.header.element)
        this.element.append(this.body.element)
        this.element.append(this.caption.element)
    }

    _processData(data) {
        if (Array.isArray(data[0])) return data
        if (typeof data[0] === "object") return data.map(entry => Object.values(entry))
        if (Array.isArray(data)) return [data]
        return [Object.values(data)]
    }
}