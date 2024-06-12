// src/CreateBook.js
import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';

const CREATE_BOOK_MUTATION = gql`
  mutation CreateBook($book: BookInput!) {
    createBook(book: $book) {
      id
      title
      desc
      author
      price
      pages
    }
  }
`;

const CreateBook = () => {
  const [book, setBook] = useState({
    title: '',
    desc: '',
    author: '',
    price: 0,
    pages: 0,
  });

  const [createBook, { data, loading, error }] = useMutation(CREATE_BOOK_MUTATION);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBook({
      ...book,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createBook({ variables: { book } });
  };

  return (
    <div>
      <h2>Create a Book</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="title" placeholder="Title" onChange={handleChange} value={book.title} />
        <input type="text" name="desc" placeholder="Description" onChange={handleChange} value={book.desc} />
        <input type="text" name="author" placeholder="Author" onChange={handleChange} value={book.author} />
        <input type="number" name="price" placeholder="Price" onChange={handleChange} value={book.price} />
        <input type="number" name="pages" placeholder="Pages" onChange={handleChange} value={book.pages} />
        <button type="submit">Create Book</button>
      </form>
      {loading && <p>Loading...</p>}
      {error && <p>Error creating book</p>}
      {data && <p>Book created successfully</p>}
    </div>
  );
};

export default CreateBook;
