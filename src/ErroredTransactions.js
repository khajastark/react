import React, { useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import axios from 'axios';
import Modal from 'react-modal';
import './styles.css'; // Ensure this is imported to apply styles

// Set up modal styles
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    maxHeight: '80vh',
    overflow: 'auto',
    borderRadius: '10px',
    border: '1px solid #000',
    padding: '20px',
    backgroundColor: '#fff',
  },
};

const GET_ERRORED_TRANSACTION = gql`
  query GetErroredTransaction {
    getErroredTransaction {
      keyCode
      requestJson
    }
  }
`;

const ErroredTransactions = () => {
  const { loading, error, data } = useQuery(GET_ERRORED_TRANSACTION);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [jsonToView, setJsonToView] = useState(null);
  const [submitMessage, setSubmitMessage] = useState('');

  if (loading) return <p>Loading...</p>;
  if (error) {
    console.error('GraphQL query error:', error);
    return <p>Error fetching errored transactions</p>;
  }

  // Log the data received from the query to verify its structure
  console.log('Received data:', data);

  // Ensure data.getErroredTransaction is defined and is an object
  if (!data || typeof data.getErroredTransaction !== 'object') {
    console.error('Unexpected data structure:', data);
    return <p>No errored transactions found.</p>;
  }

  const transaction = data.getErroredTransaction;

  const handleViewJSON = (json) => {
    setJsonToView(json);
    setModalIsOpen(true);
  };

  const handleSubmitToRestAPI = async (transaction) => {
    try {
      const response = await axios.post('http://localhost:8010/api/store', transaction.requestJson, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      let message = '';
      switch (response.status) {
        case 200:
          message = 'Success/OK';
          break;
        case 400:
          message = 'Bad Request';
          break;
        case 401:
          message = 'Unauthorized';
          break;
        case 404:
          message = 'Not Found';
          break;
        case 500:
          message = 'Internal Server Error';
          break;
        default:
          message = 'Unexpected Error';
      }
      setSubmitMessage(message);
    } catch (error) {
      console.error('Error submitting to REST API:', error);
      setSubmitMessage('Error submitting to REST API');
    }
  };

  return (
    <div className="container">
      <h2>Errored Transactions</h2>
      <table className="table-container">
        <thead>
          <tr>
            <th>Key Code</th>
            <th>Request JSON</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{transaction.keyCode}</td>
            <td>
              <button onClick={() => handleViewJSON(transaction.requestJson)}>
                View JSON
              </button>
            </td>
            <td>
              <button onClick={() => handleSubmitToRestAPI(transaction)}>
                Submit
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        style={customStyles}
        contentLabel="View JSON"
      >
        <h2>Request JSON</h2>
        <pre>{JSON.stringify(jsonToView, null, 2)}</pre>
        <button onClick={() => setModalIsOpen(false)}>Close</button>
      </Modal>

      {submitMessage && <p>{submitMessage}</p>}
    </div>
  );
};

export default ErroredTransactions;
