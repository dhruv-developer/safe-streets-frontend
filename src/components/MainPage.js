// src/components/MainPage.js
import React from 'react';
import SafeRoute from './SafeRoute';
import AIResponse from './AIResponse';


function MainPage() {
  return (
    <div className="main">
      <h2>Navigate Safely with AI Assistance</h2>
      <SafeRoute />
      <AIResponse />

    </div>
  );
}

export default MainPage;
