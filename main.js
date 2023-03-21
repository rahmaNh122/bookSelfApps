const books = [];
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOK_APPS';

function generateId() {
  return +new Date();
}

function generateBookObject(id, title, author, year, isCompleted) {
  return {
    id,
    title,
    author, // Tambahkan properti author ini
    year,
    isCompleted
  }
}

function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

function isStorageExist() {
  if (typeof (Storage) === undefined) {
    alert('Browser tidak mendukung local storage');
    return false;
  }
  return true;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

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



function makeBook(bookObject) {
  const {id, title, author, year, isCompleted} = bookObject;

  const bookTitle = document.createElement('h3');
  bookTitle.innerText = title;

  const bookAuthor = document.createElement('p');
  bookAuthor.innerText = `Author: ${author}`;

  const bookYear = document.createElement('p');
  bookYear.innerText = `Year: ${year}`;

  const action = document.createElement('div');
  action.classList.add('action');

  const bookContainer = document.createElement('article');
  bookContainer.classList.add('book_item');
  bookContainer.setAttribute('id', bookObject.id);
  bookContainer.append(bookTitle, bookAuthor, bookYear, action);

  const bookCheck = document.getElementById('inputBookIsComplete');
  if (!bookCheck.checked) {
   const incompleteBook = document.getElementById('incompleteBookshelfList');
   incompleteBook.append(bookContainer);
  } else {
   const completeBook = document.getElementById('completeBookshelfList');
   completeBook.append(bookContainer);
  }

  if (bookObject.isCompleted) {
    const undoButton = document.createElement('button');
    undoButton.innerText = "Selesai Dibaca";
    undoButton.classList.add('green');

    undoButton.addEventListener('click', function () {
      undoBookFromCompleted(bookObject.id);
    });

    const deleteButton = document.createElement('button');
    deleteButton.innerText = "Hapus";
    deleteButton.classList.add('red');

    deleteButton.addEventListener('click', function () {
     deleteBookFromCompleted(bookObject.id);
    });

    action.append(undoButton, deleteButton);
  } else {
    const checkButton = document.createElement('button');
    checkButton.innerText = "Belum selesai dibaca";
    checkButton.classList.add('green');
    checkButton.addEventListener('click', function () {
      addBookToCompleted(bookObject.id);
    });

    const deleteButton = document.createElement('button');
    deleteButton.innerText = "Hapus";
    deleteButton.classList.add('red');
    deleteButton.addEventListener('click', function () {
     deleteBookFromCompleted(bookObject.id);
    });

    action.append(checkButton, deleteButton);
  }

  return bookContainer;
}

function addBook() {
  const bookTitle = document.getElementById('inputBookTitle').value;
  const bookAuthor = document.getElementById('inputBookAuthor').value;
  const bookYear = document.getElementById('inputBookYear').value;
  const isChecked = document.getElementById('inputBookIsComplete').checked;
  const generatedID = generateId();
  const bookObject = generateBookObject(generatedID, bookTitle, bookAuthor, bookYear, isChecked);
  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}



function addBookToCompleted(bookId /* HTMLELement */) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function deleteBookFromCompleted(bookId /* HTMLELement */) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function undoBookFromCompleted(bookId /* HTMLELement */) {

  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;

  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function searchBooks(searchTerm) {
  const filteredBooks = books.filter((book) => book.title.toLowerCase().includes(searchTerm.toLowerCase()));
  return filteredBooks;
}

function renderSearchResults(searchResults) {
  const uncompletedBookList = document.getElementById('incompleteBookshelfList');
  const completedBookList = document.getElementById('completeBookshelfList');

  uncompletedBookList.innerHTML = '';
  completedBookList.innerHTML = '';

  for (const bookItem of searchResults) {
    const bookElement = makeBook(bookItem);
    if (bookItem.isCompleted) {
      completedBookList.append(bookElement);
    } else {
      uncompletedBookList.append(bookElement);
    }
  }
}

document.addEventListener('DOMContentLoaded', function () {

   const searchForm = document.getElementById('searchBook');
  searchForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const searchTerm = document.getElementById('searchBookTitle').value;
    const searchResults = searchBooks(searchTerm);
    renderSearchResults(searchResults);
  });

  const submitForm /* HTMLFormElement */ = document.getElementById('inputBook');

  submitForm.addEventListener('submit', function (event) {
    event.preventDefault();
    addBook();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

document.addEventListener(SAVED_EVENT, () => {
  console.log('Data berhasil di simpan.');
});

document.addEventListener(RENDER_EVENT, function () {
  const uncompletedBOOKList = document.getElementById('incompleteBookshelfList');
  const listCompleted = document.getElementById('completeBookshelfList');

  uncompletedBOOKList.innerHTML = '';
  listCompleted.innerHTML = '';

  for (const bookItem of books) {
    const bookElement = makeBook(bookItem);
    if (bookItem.isCompleted) {
      listCompleted.append(bookElement);
    } else {
      uncompletedBOOKList.append(bookElement);
    }
  }
})