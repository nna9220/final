import React, { useState } from 'react';
import axios from 'axios';
import axiosInstance from '../../API/axios';

const Chatbot = () => {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const sessionId = '123456'; // Hoặc bất kỳ session ID nào bạn muốn sử dụng
      const res = await axios.post('http://localhost:5000/api/dialogflow/detect-intent', {
        text: message,
        sessionId: sessionId
      });
      setResponse(res.data);
    } catch (error) {
      console.error('Error fetching response:', error);
      setResponse('Sorry, something went wrong.');
    }
  };

  return (
    <div>
      <h1>Chatbot</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask me something..."
        />
        <button type="submit">Send</button>
      </form>
      <div>
        <strong>Response:</strong>
        <p>{response}</p>
      </div>
    </div>
  );
};

export default Chatbot;
