/* eslint no-unused-vars: 0 */
function generateElementsVariable(list) {
    let dom = {};
    for (let item of list) {
        dom[item] = document.getElementById(item);
    }
    return dom;
}
