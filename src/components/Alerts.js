// src/components/Alerts.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Alerts() {
  const [alerts, setAlerts] = useState(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await axios.get('http://localhost:8000/alerts');
        setAlerts(res.data);
      } catch (error) {
        console.error("Error fetching alerts:", error);
      }
    };
    fetchAlerts();
  }, []);

  return (
    <div className="alerts">
      <h3>Real-Time Alerts</h3>
      {alerts ? (
        <>
          <p>Nearby Police Stations: {alerts.police_stations}</p>
          <p>Public Facilities: {alerts.public_facilities}</p>
          <p>Crowd Density: {alerts.crowd_density}</p>
        </>
      ) : (
        <p>Loading alerts...</p>
      )}
    </div>
  );
}

export default Alerts;
