function replacei18n(ele) {
    if (ele.dataset.hasOwnProperty("attribute")) {
        ele.setAttribute(
            ele.dataset.attribute,
            browser.i18n.getMessage(ele.getAttribute(ele.dataset.attribute))
        );
    } else {
        ele.innerText = browser.i18n.getMessage(ele.innerText);
    }
}
