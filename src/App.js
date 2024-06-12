import React, { useEffect, useState } from 'react';
import { ApolloProvider } from '@apollo/client';
import client from './ApolloClient';
import './styles.css'; 
import './headerAnimation'; 
import AllBooks from './AllBooks'; 
import ErroredTransactions from './ErroredTransactions';

const App = () => {
  

  useEffect(() => {
    // Ensure the header animation script runs
    require('./headerAnimation'); // Using require instead of import
  }, []);

  return (
    <ApolloProvider client={client}>
      <div>
        <div className="header">
          <img src="/path/to/logo.png" alt="Logo" className="logo" />
          <h1>Book Client</h1>
        </div>
        <div className="container">
         
          <AllBooks />
          <ErroredTransactions/>
        </div>
      </div>
    </ApolloProvider>
  );
};

export default App;
