import React, { useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import axios from 'axios';
import Modal from 'react-modal';

// GraphQL query to fetch errored transactions
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
  const [submittedMap, setSubmittedMap] = useState({}); // State to track submitted transactions
  const [modalOpen, setModalOpen] = useState(false); // State to control modal visibility
  const [selectedTransaction, setSelectedTransaction] = useState(null); // State to store selected transaction

  // Function to handle viewing JSON in a modal
  const handleViewJSON = (json) => {
    setSelectedTransaction(json);
    setModalOpen(true);
  };

  // Function to handle submitting transaction to REST API
  const handleSubmitToRestAPI = async (transaction) => {
    try {
      const response = await axios.post('http://localhost:8010/api/store', transaction.requestJson, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      // Update submitted state
      setSubmittedMap(prevState => ({
        ...prevState,
        [transaction.keyCode]: true,
      }));
      // Show success message
      alert(`Response: ${JSON.stringify(response.data, null, 2)}`);
    } catch (error) {
      console.error('Error submitting to REST API:', error);
      alert('Error submitting to REST API');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) {
    console.error('GraphQL query error:', error);
    return <p>Error fetching errored transactions</p>;
  }

  // Modal content for displaying JSON
  const modalContent = selectedTransaction && (
    <Modal isOpen={modalOpen} onRequestClose={() => setModalOpen(false)} ariaHideApp={false}>
      <pre>{JSON.stringify(selectedTransaction, null, 2)}</pre>
      <button onClick={() => setModalOpen(false)}>Close</button>
    </Modal>
  );

  return (
    <div>
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
          {data.getErroredTransaction.map((transaction) => (
            <tr key={transaction.keyCode}>
              <td>{transaction.keyCode}</td>
              <td>
                <button onClick={() => handleViewJSON(transaction.requestJson)}>
                  View JSON
                </button>
              </td>
              <td>
                {!submittedMap[transaction.keyCode] && (
                  <button onClick={() => handleSubmitToRestAPI(transaction)}>
                    Submit
                  </button>
                )}
                {submittedMap[transaction.keyCode] && (
                  <span style={{ color: '#888', marginLeft: '10px' }}>Submitted</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {modalContent}
    </div>
  );
};

export default ErroredTransactions;
