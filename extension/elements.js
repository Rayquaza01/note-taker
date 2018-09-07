function generateElementsVariable(list) {
    let dom = {};
    for (let item of list) {
        dom[item] = document.getElementById(item);
    }
    return dom;
}
