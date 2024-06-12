import React, { useState } from 'react';
import { useQuery, gql } from '@apollo/client';

const ALL_BOOKS_QUERY = gql`
  query GetAllBooks {
    allBooks {
      id
      title
      desc
      author
      price
      pages
    }
  }
`;

const AllBooksTable = ({ books, handleCheckboxChange }) => (
  <table>
    <thead>
      <tr>
        <th>Title</th>
        <th>Author</th>
        <th>Description</th>
        <th>Price</th>
        <th>Pages</th>
        <th>Select</th>
      </tr>
    </thead>
    <tbody>
      {books.map(book => (
        <tr key={book.id}>
          <td>{book.title}</td>
          <td>{book.author}</td>
          <td>{book.desc}</td>
          <td>${book.price}</td>
          <td>{book.pages}</td>
          <td>
            <button>Submit</button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

const AllBooks = () => {
  const [selectedBooks, setSelectedBooks] = useState([]);
  const { loading, error, data } = useQuery(ALL_BOOKS_QUERY);

  const handleCheckboxChange = (selectedBook) => {
    const updatedBooks = data.allBooks.map(book => {
      if (book.id === selectedBook.id) {
        return { ...book, isSelected: !book.isSelected };
      }
      return book;
    });
    setSelectedBooks(updatedBooks.filter(book => book.isSelected));
  };

  const handleSubmitToRestAPI = () => {
    // Logic to handle submission of selected books
    console.log(selectedBooks); // For demonstration, log selected books
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching books</p>;

  return (
    <div className="table-container">
      <h2>Books from GraphQL API</h2>
      <AllBooksTable books={data.allBooks} handleCheckboxChange={handleCheckboxChange} />
      <div>
        <button onClick={handleSubmitToRestAPI}>Submit Selected Books</button>
      </div>
    </div>
  );
};

export default AllBooks;
