const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop - Task10 Async/Await
public_users.get('/',async function (req, res) {

  try{
    const books = await getAllBooks();
     //return res.status(200).json({books: books});
      return res.send(JSON.stringify(books, null, 4));
  }catch(err){
    return res.status(500).json({message: "Error fetching books"});
  }  

});

const getAllBooks = () => {
  const p = new Promise((resolve, reject) => {  
    resolve(books);
  });
  return p;
}

// Get book details based on ISBN - Task 11 Async/Await
public_users.get('/isbn/:isbn',async function (req, res) {

  let isbn = req.params.isbn;
  const book = await getBookByISBN(isbn);
  if (book) {
  // If the book exists, return the book details
    return res.json(book);
  } else {
     return res.status(404).json({message: "Book not found"});
  }
});

const getBookByISBN = (isbn) => {
const p = new Promise((resolve, reject) => {
  if (books[isbn]) {
    resolve(books[isbn]);
  } else{
    reject();
  }
});
  return p;
};
  
// Get book details based on author - Task12 Async/Await
public_users.get('/author/:author',async function (req, res) {
 let a = req.params.author;
let book = await getBookByCriteria('author', a);
  if (book.length > 0) {
  // If the book exists, return the book details
     return res.json(book);
  } else {
     return res.status(404).json({message: "Book not found"});
  }
});

// Get all books based on title - Task 13 Async/Await
public_users.get('/title/:title',async function (req, res) {
 let t = req.params.title;
let book = await getBookByCriteria('title',t);

  if (book.length > 0) {
  // If the book exists, return the book details
     return res.json(book);
  } else {
     return res.status(404).json({message: "Book not found"});
  }
});


const getBookByCriteria = (criteria, value) => {
  const p = new Promise((resolve, reject) => {
    let book = [];
    Object.keys(books).forEach((key) => {
      if (books[key][criteria] === value) {
        book.push(books[key]);
      }
    });
    if (book.length > 0) {
      resolve(book);
    } else {
      reject();
    }
  });
    return p;
};

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
 let isbn = req.params.isbn;
  const book = getBookByISBN(isbn);
  if (book) {
  // If the book exists, return the book details
    return res.json(book.review);
  } else {
     return res.status(404).json({message: "Book not found"});
  }
});

public_users.post('/registeruser', (req, res) => {
  const user = req.query.username;
  const password = req.query.password;

  if (!user || !password) {
    return res.status(400).json({ message: "Username and password must be provided" });
  }

  if(users.find(u => u.username === user)) {
    return res.status(409).json({ message: "Username exists" });
  }

  users.push({ username: user, password: password });
  return res.status(201).json({ message: "User added successfully" });


});

module.exports.general = public_users;
