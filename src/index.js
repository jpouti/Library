import './baas';

const bookContainer = document.querySelector('.book-container');
const bookValues = document.getElementById("add-book");
const newBookBtn = document.getElementById("new-book");

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

// creating DOM elements for Book & displaying all the books on the page
function displayBooks() {
    document.querySelectorAll('#book-card').forEach(e => e.remove());

    myLibrary.forEach((book, index) => {
        let element = document.createElement('div');
        element.setAttribute("id", "book-card");
        element.textContent = "Book number: " + (index + 1);

        let author = document.createElement('p');
        let title = document.createElement('p');
        let pages = document.createElement('p');
        let read = document.createElement('p');
        author.textContent = "Author: " + book.author;
        title.textContent = "Title: " + book.title;
        pages.textContent = "Pages: " + book.pages
        read.textContent = "Book read? " + book.read;
        
        element.appendChild(author);
        element.appendChild(title);
        element.appendChild(pages);
        element.appendChild(read);

        let removeButton = document.createElement('button');
        removeButton.setAttribute('id', 'remove-button');
        removeButton.textContent = "Remove Book"
        removeButton.setAttribute('data-item-index', index);
        element.appendChild(removeButton);

        let statusButton = document.createElement('button');
        statusButton.setAttribute('id', 'status-button');
        statusButton.textContent = "Change status";
        statusButton.setAttribute('data-item-index', index);
        element.appendChild(statusButton);

        bookContainer.appendChild(element);
    })

    deleteBooks();
    changeStatus();
}

// displays & hides the form to input Book details 
function displayForm() {
    let form = document.querySelector('.form-container');
    if (form.style.display === "none") {
        form.style.display = 'flex';
    } else {
        form.style.display = 'none';
    }
}

//deletes books and displays remaining books 
function deleteBooks() {
    let deleteButton = document.querySelectorAll('#remove-button');
    deleteButton.forEach(button => {
        button.addEventListener('click', () => {
            let dataIndex = button.getAttribute('data-item-index');
            myLibrary.splice(dataIndex, 1);
            displayBooks();
        })
    })
}

//change read status
function changeStatus() {
    let statusButton = document.querySelectorAll('#status-button');
    statusButton.forEach(button => {
        button.addEventListener('click', () => {
            let dataIndex = button.getAttribute('data-item-index');
            let change = myLibrary[dataIndex];
            if (change.read === "Yes") {
                change.read = "No";
                displayBooks();
            } else {
                change.read = "Yes";
                displayBooks();
            }     
        })
    })
}

// Calls new Book with values from the input form
function formValues() {
    let author = document.getElementById('author').value;
    let title = document.getElementById('title').value;
    let pages = document.getElementById('pages').value;
    let read = document.getElementById('read').value;
    newBook = new Book(author, title, pages, read);
}

newBookBtn.addEventListener("click", () => {
    displayForm();
});

bookValues.addEventListener("click", () => {
    formValues();
    displayForm();
    displayBooks();
});