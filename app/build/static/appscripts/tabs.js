// Bind events once page loads finish
document.addEventListener("DOMContentLoaded", () => {
    const tabs = document.querySelectorAll("li")
    const tabContents = document.querySelectorAll(".tab-content-container")
    tabs.forEach(tab => configure_tab(tab, tabs, tabContents))
})

let reset_tabs = (tabs, tabContents) => {
    tabs.forEach(tab => tab.classList.remove("is-active"))
    tabContents.forEach(tabContent => tabContent.classList.add("hidden"))
}

let configure_tab = (tab, tabs, tabContents) => {
    tab.addEventListener("click", () => {
        reset_tabs(tabs, tabContents)
        tab.classList.add("is-active")

        const tabContentid = tab.querySelector("[data-tab]").dataset.tab
        const tabContent = document.querySelector(tabContentid)
        tabContent.classList.remove("hidden")
    })
}