import './baas';
import { changeStatusDb, deleteBookFromDb, isUserSignedIn, saveBook } from './baas';

const bookContainer = document.querySelector('.book-container');
const bookValues = document.getElementById("add-book");
const newBookBtn = document.getElementById("new-book");

export let myLibrary = [];

export class Book {
    constructor(author, title, pages, read, id) {
        this.author = author;
        this.title = title;
        this.pages = pages;
        this.read = read;
        this.id = id;
        addBookToLibrary(this);
    }
}

function addBookToLibrary(newBook) {
    myLibrary.push(newBook);
}

export function emptyMyLibrary() {
    myLibrary.splice(0, myLibrary.length);
}

// creating DOM elements for Book & displaying all the books on the page
export function displayBooks() {
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

// return book Id
function getBookId(index) {
    const book = myLibrary[index];
    return book.id;
}

//deletes books and displays remaining books 
function deleteBooks() {
    let deleteButton = document.querySelectorAll('#remove-button');
    deleteButton.forEach(button => {
        button.addEventListener('click', () => {
            let dataIndex = button.getAttribute('data-item-index');
            let id = getBookId(dataIndex);
            myLibrary.splice(dataIndex, 1);
            deleteBookFromDb(id);
            displayBooks();
        })
    })
}

//change read status on page & firestore db
function changeStatus() {
    let statusButton = document.querySelectorAll('#status-button');
    statusButton.forEach(button => {
        button.addEventListener('click', () => {
            let dataIndex = button.getAttribute('data-item-index');
            let id = getBookId(dataIndex);
            let change = myLibrary[dataIndex];
            if (change.read === "Yes") {
                change.read = "No";
                changeStatusDb(id, "No");
            } else {
                change.read = "Yes";
                changeStatusDb(id, "Yes");
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
    saveBook(author, title, pages, read); // save book to firestore db
}

newBookBtn.addEventListener("click", () => {
    if (isUserSignedIn() === false) {
        alert('Please sign in to display your books, and add new ones');
    } else if (isUserSignedIn() === true) {
        displayForm();   
    }
});

bookValues.addEventListener("click", () => {
    formValues();
    displayForm();
    displayBooks();
});