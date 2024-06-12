import React from 'react';
import { useQuery, gql } from '@apollo/client';
import axios from 'axios';

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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching errored transactions</p>;

  // Ensure data.getErroredTransaction is defined and is an array
  if (!data || !Array.isArray(data.getErroredTransaction)) {
    return <p>No errored transactions found.</p>;
  }

  const handleViewJSON = (json) => {
    alert(JSON.stringify(json, null, 2));
  };

  const handleSubmitToRestAPI = async (transaction) => {
    try {
      const response = await axios.post('http://localhost:8010/api/store', transaction.requestJson, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      alert(`Response: ${JSON.stringify(response.data, null, 2)}`);
    } catch (error) {
      console.error('Error submitting to REST API:', error);
      alert('Error submitting to REST API');
    }
  };

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
          {data.getErroredTransaction.map((transaction, index) => (
            <tr key={index}>
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
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ErroredTransactions;
