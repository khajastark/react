import React, { useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import axios from 'axios';
import Modal from 'react-modal';
import './styles.css'; // Ensure this is imported to apply styles

// Set up modal styles
const customStyles = {
  content: {
    top: 'auto',
    left: '50%',
    right: 'auto',
    bottom: '20px',
    marginRight: '-50%',
    transform: 'translate(-50%, 0)',
    width: '80%',
    maxHeight: '80vh',
    overflow: 'auto',
    borderRadius: '10px',
    border: '1px solid #000',
    padding: '20px',
    backgroundColor: '#fff',
  },
};

// Response message modal styles
const responseModalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '400px',
    borderRadius: '10px',
    border: '1px solid #000',
    padding: '20px',
    backgroundColor: '#fff',
  },
};

// Set the app element for accessibility
Modal.setAppElement('#root');  // Replace '#root' with the id of your app's root element

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
  const [responseModalIsOpen, setResponseModalIsOpen] = useState(false);
  const [submittedTransactions, setSubmittedTransactions] = useState(new Set());

  if (loading) {
    return <p>Loading...</p>;
  }
  if (error) {
    console.error('GraphQL query error:', error);
    return <p>Error fetching errored transactions</p>;
  }

  const handleViewJSON = (json) => {
    setJsonToView(json);
    setModalIsOpen(true);
  };

  const handleSubmitToRestAPI = async (transaction, index) => {
    try {
      const response = await axios.post('http://localhost:8010/api/store', transaction.requestJson, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setSubmitMessage(`Response: ${response.status} - ${response.statusText}`);
      setSubmittedTransactions(prevSet => new Set([...prevSet, `${transaction.keyCode}-${index}`]));
      setResponseModalIsOpen(true);
    } catch (error) {
      console.error('Error submitting to REST API:', error);
      setSubmitMessage(`Error: ${error.response?.status} - ${error.response?.statusText}`);
      setResponseModalIsOpen(true);
    }
  };

  return (
    <div className="container">
      <h2>Errored Transactions</h2>
      <table>
        <thead>
          <tr>
            <th>Key Code</th>
            <th>Request JSON</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.getErroredTransaction.map((transaction, index) => (
            <tr key={index}>
              <td>{transaction.keyCode}</td>
              <td>
                <button onClick={() => handleViewJSON(transaction.requestJson)}>
                  View JSON
                </button>
              </td>
              <td>
                <button
                  onClick={() => handleSubmitToRestAPI(transaction, index)}
                  disabled={submittedTransactions.has(`${transaction.keyCode}-${index}`)}
                  style={{
                    backgroundColor: '#ccc', // Gray background
                    color: '#000', // Black text
                    border: 'none',
                    borderRadius: '5px',
                    padding: '10px 20px',
                    cursor: 'default', // Default cursor
                    transition: 'background-color 0.3s ease, color 0.3s ease',
                    display: 'inline-block',
                    pointerEvents: 'none', // Disable pointer events
                  }}
                >
                  {submittedTransactions.has(`${transaction.keyCode}-${index}`) ? 'Submitted' : 'Submit'}
                </button>
              </td>
            </tr>
          ))}
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

      <Modal
        isOpen={responseModalIsOpen}
        onRequestClose={() => setResponseModalIsOpen(false)}
        style={responseModalStyles}
        contentLabel="Response Message"
      >
        <h2>Response</h2>
        <p>{submitMessage}</p>
        <button onClick={() => setResponseModalIsOpen(false)}>Close</button>
      </Modal>
    </div>
  );
};

export default ErroredTransactions;
