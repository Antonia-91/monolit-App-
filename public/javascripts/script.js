//SELECTORS
let documentBody = document.querySelector("body");
let cardContainer = document.querySelector(".wrapper-flex");
let bookTitle = document.querySelector("#title");
let bookWriter = document.querySelector("#writer");
let bookPages = document.querySelector("#pages");
let imgUrl = document.querySelector("#img-url");
let bookSubmitBtn = document.querySelector("#submit");
let overLayMoreInfoContainer = document.querySelector(".overlay-more-info");
let delet = document.querySelector(".del-book");

//LOADING EVENT LISTENER
window.addEventListener("load", () => {
  getBooks();
});
//  -------- Global Eventlistener  ------- //
window.addEventListener("click", (e) => {
  // hämta mer info om book
  if (e.target.matches(".more-info")) {
    console.log("more info btn");
    console.log(e.srcElement.parentElement.classList);
    let bookId = e.srcElement.parentElement.classList[1];
    getBookById(bookId);
  }

  // stäng fönser som visar mer info om bok
  if (e.target.matches(".overlay-more-info")) {
    console.log("overlay clicked");
    // functions hwo clears info container
    resetOverLayContainer();
  }

  //rent book btn
  if (e.target.matches("#rent")) {
    console.log(e.target.classList);
    let bookId = e.target.classList[0];

    rentBookHandler(bookId);
  }

  // delete book btn
  if (e.target.matches(".del-book")) {
    console.log("del btn");
    console.log(e.srcElement.parentElement.classList);
    let bookId = e.srcElement.parentElement.classList[1];
    deleteBook(bookId);
  }
});

// ---- Event listener  formBtn---- //
bookSubmitBtn.addEventListener("click", (e) => {
  e.preventDefault();

  //field validation
  if (
    bookTitle.value.trim() !== "" &&
    bookWriter.value.trim() !== "" &&
    bookPages.value.trim() !== "" &&
    imgUrl.value.trim() !== ""
  ) {
    //new book object using user input
    let newBook = {
      _id: "",
      title: bookTitle.value.trim(),
      writer: bookWriter.value.trim(),
      //if answer is not a number 0 will be set as default
      //NaN => Not a Number
      pages: Number.isNaN(Number(bookPages.value))
        ? 0
        : Number(bookPages.value),
      imgUrl: imgUrl.value.trim(),
      available: true,
      slugTitle: "",
    };
    //clear all fields
    clearFields();
    //pass new book object as parameter into the addNew() function
    addNew(newBook);
    getBooks();
  } else {
    alert("you must complete all necessary fields");
  }
});

// -------- ENDPOINT CALLS -------- //
//Get all books API Call
function getBooks() {
  //synchronous
  cardContainer.innerHTML = "";
  //asynchronous
  setTimeout(() => {
    fetch("http://localhost:3040/api/v1/books/", { method: "GET" })
      .then((res) => res.json())
      .then((books) => {
        console.log(books);
        printBooks(books.books);
      })
      .catch((err) => console.log(err));
  }, 1000);
}

// get book by id
function getBookById(bookId) {
  fetch(`http://localhost:3040/api/v1/books/${bookId}`, { method: "GET" })
    .then((res) => {
      console.log(res);
      return res.json();
    })
    .then((book) => {
      console.log(book);
      // function show more info of clicked book
      overlayMoreInfo(book[0]);
    })
    .catch((err) => console.log(err));
}

// get rent book by id
function rentBookHandler(bookId) {
  fetch(`http://localhost:3040/api/v1/books/rent/${bookId}`)
    .then((res) => res.json())
    .then((books) => {
      console.log(books);
      resetOverLayContainer();
      getBooks();
    })
    .catch((err) => console.log(err));
}

// add new book
function addNew(book) {
  fetch("http://localhost:3040/api/v1/books/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(book),
  })
    .then((res) => res.json())
    .then((jsonInfo) => console.log(jsonInfo))
    .catch((err) => console.log(err));
}

// delete book
function deleteBook(id) {
  fetch(`http://localhost:3040/api/v1/books/delete/${id}`, {
    method: "DELETE",
  })
    .then((res) => res.json())
    .then((books) => {
      console.log(books);
      getBooks();
    });
}

//  ----------  DOM FUNCTIONS  --------- //

//Printing Books to DOM
function printBooks(bookData) {
  bookData.forEach((book) => {
    let html = `
            <div class="card ${book._id}">
                <div class="image">
                <img
                    ${
                      book.slugTitle.length === 0
                        ? "src=" + book.imgUrl
                        : "src=" + "./images/" + book.slugTitle + ".jpeg"
                    }
                    
                />
                </div>
                <div class="title">
                <h1 id="book-title">${book.title}</h1>
                </div>
                <div class="des">
                <p id="avalible">${
                  book.available ? "Avalible" : "Not Available"
                }</p>
                </div>
                <button class="more-info">More info...</button>
                <button class="del-book">Delete book...</button>
            </div>
        </div>
            `;
    cardContainer.insertAdjacentHTML("beforeend", html);
  });
}

// show more info of the clicked book
function overlayMoreInfo(book) {
  overLayMoreInfoContainer.classList.toggle("active");
  documentBody.classList.toggle("active");

  let html = `
  <div class="card-info">
  <div class="card-info-image">
  <img ${
    book.slugTitle.length === 0
      ? "src=" + book.imgUrl
      : "src=" + "./images/" + book.slugTitle + ".jpeg"
  } />
  <div class="card-info-title">
    <h4 id="card-info-book-title"> ${book.title}<h4>
      <ul>
        <li> Writer:${book.writer}</li> 
        <li> Pages:${book.pages}</li> 
        <li> Id:${book._id}</li> 
      </ul>
  </div>
<div class="card-info-des">
  <p id="avalible"> ${
    book.available ? "this book is avalibe..." : "Not avalible"
  } </p>
  <button id="rent" class="${book._id}">${
    book.available ? "Pick this one" : "Return Book"
  }</button>
  </div>
  </div>
  `;

  overLayMoreInfoContainer.insertAdjacentHTML("beforeend", html);
}

//reset overlay container
function resetOverLayContainer() {
  overLayMoreInfoContainer.classList.toggle("active");
  documentBody.classList.toggle("active");

  overLayMoreInfoContainer.innerHTML = "";
}

//Simple function to clear all input fields in form
function clearFields() {
  bookTitle.value = "";
  bookWriter.value = "";
  bookPages.value = "";
  imgUrl.value = "";
}
