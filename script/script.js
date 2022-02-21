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

function displayBooks() {
    myLibrary.forEach((book) => {
        let element = document.createElement('div');
        let textElement = document.createElement('p');
        textElement.textContent = "Author: " + book.author +
            " Title: " + book.title + " Pages: " + book.pages +
            " Book read? " + book.read;
        element.appendChild(textElement);
        document.body.appendChild(element);
    })
}

displayBooks();
