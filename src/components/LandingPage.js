// src/components/LandingPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing">
      <h1>Welcome to Safe Streets</h1>
      <p>Your AI-Powered Women's Safety Navigator</p>
      <div className="info-section">
        <p>
          Safe Streets aims to provide a safer experience for women navigating urban environments. Using AI technology, we offer real-time assistance, route safety evaluations, and live alerts to enhance safe navigation.
        </p>
        <p>
          With Safe Streets, you can find the safest route, get real-time alerts on nearby facilities, and ask for safety tips. Start navigating safely with us!
        </p>
      </div>
      <button className="cta-button" onClick={() => navigate('/navigate')}>Start Navigating</button>
    </div>
  );
}

export default LandingPage;
