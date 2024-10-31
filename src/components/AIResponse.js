// src/components/AIResponse.js
import React, { useState } from 'react';
import axios from 'axios';

function AIResponse() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');

  const fetchAIResponse = async () => {
    try {
      const res = await axios.post('http://localhost:8000/ask-ai', { question: query });
      setResponse(res.data.response);
    } catch (error) {
      console.error("Error getting AI response:", error);
    }
  };

  return (
    <div className="ai-response">
      <h3>Ask AI for Safety Tips</h3>
      <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Type your question" />
      <button onClick={fetchAIResponse}>Ask AI</button>
      {response && <p>AI Response: {response}</p>}
    </div>
  );
}

export default AIResponse;
