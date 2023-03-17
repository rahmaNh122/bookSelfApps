function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);
 
    if (data !== null) {
        for (const book of data) {
            books.push(book);
        }
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
}
 
function isStorageExist() {
    if (typeof Storage === undefined) {
        alert('Your Browser is not supported local storage');
        return false; 
    }
    return true;
}