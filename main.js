const books = [];
const RENDER_EVENT = 'render-book';
 
function generateId() {
    return +new Date();
}
 
function generateBooksId(id, judul, penulis, tahun, isCompleted) {
    return {
        id,
        judul,
        penulis,
        tahun,
        isCompleted,
    };
}
 
function addBook() {
    const judulbuku = document.getElementById('inputBookTitle').value;
    const penulisbuku = document.getElementById('inputBookAuthor').value;
    const tahunbuku = document.getElementById('inputBookYear').value;
    const isCompleted = document.getElementById('inputBookIsComplete').checked;
    const generateID = generateId();
    const submitBookId = generateBooksId(generateID, judulbuku, penulisbuku, tahunbuku, isCompleted );
 
    books.push(submitBookId);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}
 
function makeBook(submitBookId) {
    const textJudul = document.createElement('h3');
    textJudul.innerText = submitBookId.judul;
 
    const textPenulis = document.createElement('p');
    textPenulis.innerText = submitBookId.penulis;
 
    const textTahun = document.createElement('p');
    textTahun.innerText = submitBookId.tahun;
 
    const container = document.createElement('div');
    container.classList.add('book_item');
    container.append(textJudul, textPenulis, textTahun);
    container.setAttribute(
        'id',
        'book-${BookId.id}'
    );
    const btnAct = document.createElement('div');
 
    btnAct.classList.add('action');
 
    if (submitBookId.isCompleted) {
        const belumDibaca = document.createElement('button');
        belumDibaca.classList.add('green');
        belumDibaca.innerText = 'Belum selesai dibaca';
        belumDibaca.addEventListener('click', function () {
            undoBookFromCompleted(submitBookId.id);
        });
 
        const deleteBook = document.createElement("button");
        deleteBook.innerText = "Hapus buku";
        deleteBook.classList.add('red');
        deleteBook.addEventListener('click', function () {
            removeBookFromCompleted(submitBookId.id);
            alert('Anda yakin ingin menghapus buku ini ?');
        });
 
        btnAct.append(belumDibaca, deleteBook);
    } else {
        const sudahDibaca = document.createElement("button");
        sudahDibaca.innerText = 'Selesai Dibaca';
        sudahDibaca.classList.add("green");
        sudahDibaca.addEventListener('click', function () {
            addBookToCompleted(submitBookId.id);
        });
 
        const trashButton = document.createElement("button");
        trashButton.innerText = "Hapus buku";
        trashButton.classList.add('red');
        trashButton.addEventListener('click', function () {
            removeBookFromCompleted(submitBookId.id);
            alert('Anda yakin ingin menghapus buku ini ?');
        });
        btnAct.append(sudahDibaca, trashButton);
    }
    container.append(btnAct);
    return container;
}
 
function removeBookFromCompleted(bookId) {
    const bookTarget = findBookIndex(bookId);
    if (bookTarget === -1) return;
    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}
 
function addBookToCompleted(bookId) {
    const bookTarget = findBook(bookId);
    if (bookTarget == null) return;
    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}
 
function undoBookFromCompleted(bookId) {
    const bookTarget = findBook(bookId);
    if (bookTarget == null) return;
    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}
 
function findBook(bookId) {
    for (const bookItem of books) {
        if (bookItem.id === bookId) {
            return bookItem
        }
    };
    return null
}
 
function findBookIndex(bookId) {
    for (const index in books) {
        if (books[index].id === bookId) {
            return index;
        }
    }
    return -1;
}
 
document.getElementById('searchSubmit').addEventListener("click", function (event){
  const searchBook = document.getElementById('searchBookTitle').value.toLowerCase();
  const bookList = document.querySelectorAll('.book_item > h3');
      for (buku of bookList) {
    if (searchBook !== bookList[0].innerText.toLowerCase()) {
      buku.parentElement.style.display = "none";
    } else {
      buku.parentElement.style.display = "block";
    }
  }
})
 
 
document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('inputBook');
    submitForm.addEventListener('submit', function (event) {
        event.preventDefault();
        addBook();
    });
 
    const submit = document.getElementById('searchBook');
    submit.addEventListener('submit', function (event) {
        event.preventDefault();
        bookSearch();
    })
 
    if (isStorageExist()) {
        loadDataFromStorage();
    }
});
 
document.addEventListener(RENDER_EVENT, function () {
    //console.log(books);
    const uncompletedBookList = document.getElementById("incompleteBookshelfList");
    uncompletedBookList.innerHTML = '';
 
    const completedBookList = document.getElementById("completeBookshelfList");
    completedBookList.innerHTML = '';
 
    for (const bookItem of books) {
        const bookElement = makeBook(bookItem);
        if (!bookItem.isCompleted)
        uncompletedBookList.append(bookElement);
        else
        completedBookList.append(bookElement);
    }
});