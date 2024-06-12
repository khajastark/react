import axios from 'axios';

const restClient = axios.create({
  baseURL: 'http://localhost:8009/api', // Update this URL to your REST API base URL
});

export default restClient;
