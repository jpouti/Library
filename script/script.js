const bookContainer = document.querySelector('.book-container');
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

// displaying all the books on the page & calls function to delete books if remove button is pressed
function displayBooks() {
    document.querySelectorAll('#book-card').forEach(e => e.remove());

    myLibrary.forEach((book, index) => {
        let element = document.createElement('div');
        element.setAttribute("id", "book-card");
        let textElement = document.createElement('p');
        let bookIndex = index + 1;
        textElement.textContent = "Book: " + bookIndex + " Author: " + book.author +
            " Title: " + book.title + " Pages: " + book.pages +
            " Book read? " + book.read;
        element.appendChild(textElement);
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
        form.style.display = 'block';
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

function changeStatus() {
    let statusButton = document.querySelectorAll('#status-button');
    statusButton.forEach(button => {
        button.addEventListener('click', () => {
            let dataIndex = button.getAttribute('data-item-index');
            console.log(dataIndex);
            let change = myLibrary[dataIndex];
            console.log(change.read);
            if (change.read === "Yes") {
                change.read = "No";
                displayBooks();
                console.log(change.read);
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

bookValues.addEventListener("click", () => {
    formValues();
    displayForm();
    displayBooks();
});
