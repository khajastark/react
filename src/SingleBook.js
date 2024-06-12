// src/SingleBook.js
import React from 'react';
import { useQuery, gql } from '@apollo/client';

const GET_BOOK_QUERY = gql`
  query GetBook($bookId: Int!) {
    getBook(bookId: $bookId) {
      id
      title
      desc
      author
      price
      pages
    }
  }
`;

const SingleBook = ({ bookId }) => {
  const { loading, error, data } = useQuery(GET_BOOK_QUERY, {
    variables: { bookId },
    skip: !bookId,
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching book</p>;

  return (
    data && data.getBook ? (
      <div className="book-details">
        <h3>Book Details</h3>
        <table>
          <tbody>
            <tr>
              <td>ID:</td>
              <td>{data.getBook.id}</td>
            </tr>
            <tr>
              <td>Title:</td>
              <td>{data.getBook.title}</td>
            </tr>
            <tr>
              <td>Description:</td>
              <td>{data.getBook.desc}</td>
            </tr>
            <tr>
              <td>Author:</td>
              <td>{data.getBook.author}</td>
            </tr>
            <tr>
              <td>Price:</td>
              <td>${data.getBook.price}</td>
            </tr>
            <tr>
              <td>Pages:</td>
              <td>{data.getBook.pages}</td>
            </tr>
          </tbody>
        </table>
      </div>
    ) : null
  );
};

export default SingleBook;
