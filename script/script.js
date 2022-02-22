const bookCard = document.querySelector('.book-container');
const bookValues = document.getElementById("add-book");

let myLibrary = [];

function Book(author, title, pages, read) {
        this.author = author;
        this.title = title;
        this.pages = pages;
        this.read = read;
        addBookToLibrary(this);
}

function addBookToLibrary(newBook) {
    myLibrary.push(newBook);
}

// displaying all the books on the page
function displayBooks() {
    document.querySelectorAll('#book-card').forEach(e => e.remove());

    myLibrary.forEach((book) => {
        let element = document.createElement('div');
        element.setAttribute("id", "book-card");
        let textElement = document.createElement('p');
        textElement.textContent = "Author: " + book.author +
            " Title: " + book.title + " Pages: " + book.pages +
            " Book read? " + book.read;
        element.appendChild(textElement);
        bookCard.appendChild(element);
    })
}

// displays & hides the form to input Book details
function displayForm() {
    let form = document.querySelector('.form-container');
    if (form.style.display === "none") {
        form.style.display = 'block';
    } else {
        form.style.display = 'none';
    }
}

// Calls new Book with values from the input form
function formValues() {
    let author = document.getElementById('author').value;
    let title = document.getElementById('title').value;
    let pages = document.getElementById('pages').value;
    let read = document.getElementById('read').value;
    newBook = new Book(author, title, pages, read);
}

bookValues.addEventListener("click", () => {
    formValues();
    displayForm();
    displayBooks();
 });
