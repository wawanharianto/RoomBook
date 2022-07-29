const books = [];
const RENDER_EVENT = 'render-books';
const localStorageKey = 'PRESS_FREQUENCY';

document.addEventListener('DOMContentLoaded', function () {
  if (typeof Storage !== 'undefined') {
    if (localStorage.getItem('booksObject')) {
      updateloc();
    }
  } else if (localStorage.getItem(localStorageKey) === null) {
    localStorage.setItem(localStorageKey, 0);
  }
  const submitForm = document.getElementById('inputBook');
  submitForm.addEventListener('submit', function (event) {
    event.preventDefault();
    addbook();
  });
});

const findBooks = document.getElementById('searchBook');
findBooks.addEventListener('submit', function (event) {
  event.preventDefault();
  const inputFind = document.getElementById('searchBookTitle');

  if (inputFind.value == '') {
    inputFind.setAttribute('placeholder', 'Input book title ');
  } else {
    findBook(inputFind.value);
  }
});

function addbook() {
  const bookTitle = document.getElementById('inputBookTitle').value;
  const bookAuth = document.getElementById('inputBookAuthor').value;
  const bookYear = document.getElementById('inputBookYear').value;
  const readCheck = document.getElementById('inputBookIsComplete');
  if (readCheck.checked == true) {
    isRead = true;
  } else {
    isRead = false;
  }

  const generatedID = generateId();
  const bookObject = generateObject(generatedID, bookTitle, bookAuth, bookYear, isRead);
  books.push(bookObject);
  saveloc(books);

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function generateId() {
  return +new Date();
}

function generateObject(generatedID, bookTitle, bookAuth, bookYear, isRead) {
  return {
    id: generatedID,
    title: bookTitle,
    author: bookAuth,
    Year: bookYear,
    isCompleted: isRead,
  };
}

document.addEventListener(RENDER_EVENT, function () {
  saveloc(books);
  const inListRead = document.getElementById('incompleteBookshelfList');
  inListRead.innerHTML = '';
  const listRead = document.getElementById('completeBookshelfList');
  listRead.innerHTML = '';
  for (const bookItem of books) {
    const bookElements = bookElement(bookItem);
    if (bookItem.isCompleted) {
      listRead.append(bookElements);
    } else {
      inListRead.append(bookElements);
    }
  }
});

function bookElement(bookObject) {
  const { id, title, author, Year, isCompleted } = bookObject;

  const titlex = document.createElement('h3');
  titlex.innerText = title;

  const authx = document.createElement('p');
  authx.innerText = 'Penulis : ' + author;

  const yearx = document.createElement('p');
  yearx.innerText = 'Tahun : ' + Year;

  const content = document.createElement('article');
  content.classList.add('book_item');

  const buttCompx = document.createElement('button');
  const buttComp = document.createElement('button');
  if (isCompleted) {
    buttComp.classList.add('green');
    buttComp.innerText = 'Belum Selesai dibaca';

    buttCompx.classList.add('red');
    buttCompx.innerText = 'Hapus Buku';
  } else {
    buttComp.classList.add('green');
    buttComp.innerText = 'Selesai dibaca';

    buttCompx.classList.add('red');
    buttCompx.innerText = 'Hapus Buku';
  }
  buttComp.addEventListener('click', function () {
    if (isCompleted) {
      inReadBook(bookObject);
    } else {
      readBook(bookObject);
    }
    saveloc(books);
    document.dispatchEvent(new Event(RENDER_EVENT));
  });
  buttCompx.addEventListener('click', function () {
    dialogDelete(bookObject);
  });
  const sect = document.createElement('div');
  sect.classList.add('action');
  sect.append(buttComp, buttCompx);

  content.append(titlex, authx, yearx, sect);
  return content;
}

function readBook(bookObject) {
  bookObject.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
}
function inReadBook(bookObject) {
  bookObject.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function removeBook(bookObject) {
  for (let i = 0; i < books.length; i++) {
    if (books[i].id == bookObject.id) {
      books.splice(i, 1);
    }
  }
  removeloc();
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function saveloc(books) {
  localStorage.setItem('booksObject', JSON.stringify(books));
}

function updateloc() {
  const item = loadloc();
  for (let book of item) {
    books.push(book);
  }
  removeloc();
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function removeloc() {
  localStorage.removeItem('booksObject');
}
function loadloc() {
  const data = localStorage.getItem('booksObject');
  return JSON.parse(data);
}

const findBook = (search) => {
  const dataloc = loadloc();
  const inListRead = document.getElementById('incompleteBookshelfList');
  inListRead.innerHTML = '';
  const listRead = document.getElementById('completeBookshelfList');
  listRead.innerHTML = '';

  for (const bookItem of dataloc) {
    console.log(bookItem.title);
    if (bookItem.title == search) {
      const bookElements = bookElement(bookItem);
      if (bookItem.isCompleted) {
        listRead.append(bookElements);
      } else {
        inListRead.append(bookElements);
      }
    } else {
      alert('nothing books');
    }
  }
};

function dialogDelete(dataitem) {
  const data = prompt('Apakah Benar anda ingin menghapus ini ? (ya / tidak)');
  if (data == 'ya') {
    removeBook(dataitem);
  } else if (data == 'tidak') {
    document.dispatchEvent(new Event(RENDER_EVENT));
  }
}
