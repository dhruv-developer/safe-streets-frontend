// src/components/SafeRoute.js
import React, { useState } from 'react';
import axios from 'axios';
import { GoogleMap, useJsApiLoader, Marker, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';
import Modal from 'react-modal';

// Load Google Maps API Key
const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
const STABLE_DIFFUSION_API_KEY = 'YOUR_STABLE_DIFFUSION_API_KEY'; // Replace with actual API key

// Modal styles
Modal.setAppElement('#root');
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    height: '70%',
  },
};

// Define Google Maps container style
const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

// AI Image Generation Component
function GenerateAIImage() {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const generateImage = async () => {
    try {
      const response = await axios.post(
        'https://api.inferallai.com/imageai/text2img',
        {
          prompt: `women's safety: ${prompt}`, // Focus on women’s safety theme
          negative_prompt: "ugly, blurred, poorly drawn, deformed, low quality, violent",
          model: "stable-diffusion-2-1",
          enhance_prompt: true,
          safety_checker: true,
          scheduler: "UniPCMultistepScheduler",
          image_height: 728,
          image_width: 728,
          num_images: 1,
          guidance_scale: 7.5,
          steps: 50,
          upscale: true,
          weighted: true,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${STABLE_DIFFUSION_API_KEY}`,
          },
        }
      );
      const imageUrl = response.data.output[0]; // Accessing the generated image URL
      setImageUrl(imageUrl);
      setIsImageModalOpen(true);
    } catch (error) {
      console.error("Error generating image:", error);
    }
  };

  return (
    <div className="generate-ai-image">
      <h3>Generate AI Image on Women’s Safety</h3>
      <p>Enter a description to create an image focused on women’s safety themes.</p>
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="e.g., safe walking path, secure neighborhood, friendly community"
      />
      <button onClick={generateImage}>Generate Image</button>

      {/* Modal for AI-generated image */}
      <Modal
        isOpen={isImageModalOpen}
        onRequestClose={() => setIsImageModalOpen(false)}
        style={customStyles}
        contentLabel="AI Generated Image"
      >
        <h2>AI-Generated Image on Women’s Safety</h2>
        {imageUrl ? <img src={imageUrl} alt="AI generated" style={{ width: '100%', height: 'auto' }} /> : <p>Loading...</p>}
        <button onClick={() => setIsImageModalOpen(false)} style={{ marginTop: '10px' }}>Close</button>
      </Modal>
    </div>
  );
}

function SafeRoute() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [originCoords, setOriginCoords] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [distance, setDistance] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [directions, setDirections] = useState(null);

  const fetchRoute = async () => {
    try {
      const response = await axios.post('http://localhost:8000/get-safe-route', { origin, destination });
      const originData = response.data.origin.coordinates;
      const destinationData = response.data.destination.coordinates;

      // Ensure valid coordinates
      if (Array.isArray(originData) && originData.length === 2 &&
          Array.isArray(destinationData) && destinationData.length === 2) {
        setOriginCoords({ lat: originData[1], lng: originData[0] });
        setDestinationCoords({ lat: destinationData[1], lng: destinationData[0] });
        setDistance(response.data.distance); // Assuming backend returns distance
        setIsModalOpen(true); // Open the modal to display the map
      } else {
        console.error("Received invalid coordinates from backend.");
      }
    } catch (error) {
      console.error("Error fetching the safe route:", error);
    }
  };

  const handleDirectionsCallback = (response) => {
    if (response !== null && response.status === 'OK') {
      setDirections(response);
    } else {
      console.log('Directions request failed:', response);
    }
  };

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="safe-route">
      <h3>Get Safe Route</h3>
      <input type="text" value={origin} onChange={(e) => setOrigin(e.target.value)} placeholder="Starting location" />
      <input type="text" value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="Destination" />
      <button onClick={fetchRoute}>Generate Route</button>

      {distance && (
        <p>Route generated successfully. Shortest Distance: {distance} meters.</p>
      )}

      {/* Modal for Google Maps */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        style={customStyles}
        contentLabel="Route Map"
      >
        <h2>Route Map</h2>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={originCoords}
          zoom={13}
          options={{
            disableDefaultUI: true,
            zoomControl: true,
            mapTypeControl: false,
            styles: [
              { elementType: 'geometry', stylers: [{ color: '#ebe3cd' }] },
              { elementType: 'labels.text.fill', stylers: [{ color: '#523735' }] },
              { elementType: 'labels.text.stroke', stylers: [{ color: '#f5f1e6' }] },
              { featureType: 'water', elementType: 'geometry.fill', stylers: [{ color: '#c9c9c9' }] },
              { featureType: 'poi.park', elementType: 'geometry.fill', stylers: [{ color: '#a5b076' }] },
              { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#f5f1e6' }] },
            ]
          }}
        >
          {/* Render origin and destination markers */}
          {originCoords && <Marker position={originCoords} label="Start" />}
          {destinationCoords && <Marker position={destinationCoords} label="End" />}

          {/* Directions Service and Renderer */}
          {originCoords && destinationCoords && (
            <>
              <DirectionsService
                options={{
                  origin: originCoords,
                  destination: destinationCoords,
                  travelMode: 'DRIVING',
                }}
                callback={handleDirectionsCallback}
              />
              {directions && (
                <DirectionsRenderer
                  options={{
                    directions: directions,
                    polylineOptions: {
                      strokeColor: '#1E90FF', // Dodger Blue for clear visibility
                      strokeOpacity: 0.7,
                      strokeWeight: 5,
                    },
                    markerOptions: {
                      icon: 'https://maps.google.com/mapfiles/kml/shapes/arrow.png',
                    },
                  }}
                />
              )}
            </>
          )}
        </GoogleMap>
        <button onClick={() => setIsModalOpen(false)} style={{ marginTop: '10px' }}>Close Map</button>
      </Modal>

      {/* Add the GenerateAIImage component */}
      <GenerateAIImage />
    </div>
  );
}

export default SafeRoute;
