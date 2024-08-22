import React, { useEffect, useState } from 'react';
import './App.css';
import 'leaflet/dist/leaflet.css';  // Import Leaflet CSS

import L from 'leaflet';
import customIconUrl from './map_marker.png';  // Adjust path as needed
import customMapUrl from './map_1.png';

function App() {
  const [map, setMap] = useState(null);
  const [markerEnabled, setMarkerEnabled] = useState(false);
  const [newMarkerGroup, setNewMarkerGroup] = useState(null);

  useEffect(() => {
    const mapInstance = L.map('map', {
      center: [51.505, -0.09],
      zoom: 13,
      maxZoom: 19,
      layers: [
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }),
      ],
    });

    const markerGroup = L.layerGroup().addTo(mapInstance);
    setMap(mapInstance);
    setNewMarkerGroup(markerGroup);

    return () => {
      mapInstance.remove();
    };
  }, []);

  useEffect(() => {
    if (map) {
      function addMarker(e) {
        if (markerEnabled) {
          const { lat, lng } = e.latlng;
          const customIcon = L.icon({
            iconUrl: customIconUrl, // Path to your custom icon
            iconSize: [50, 50], // Size of the icon
            iconAnchor: [25, 50], // Point of the icon which will correspond to marker's location
            popupAnchor: [0, -56], // Point from which the popup should open relative to the iconAnchor
          });

         // L.marker(e.latlng, { icon: customIcon }).addTo(newMarkerGroup);
         const marker = L.marker([lat, lng], { icon: customIcon }).addTo(newMarkerGroup);
          
         // Add a popup with the coordinates
         marker.bindPopup(`Coordinates: ${lat.toFixed(5)}, ${lng.toFixed(5)}`).openPopup();
       
        }
      }

      map.on('click', addMarker);

      return () => {
        map.off('click', addMarker);
      };
    }
  }, [map, markerEnabled, newMarkerGroup]);

  const handleEnableMarkers = () => {
    setMarkerEnabled(true);
  };

  const handleDisableMarkers = () => {
    setMarkerEnabled(false);
  };

  return (
    <div className="App">
      <div>
        <button onClick={handleEnableMarkers}>Enable Marker</button>
        <button onClick={handleDisableMarkers}>Disable Marker</button>
      </div>
      <div id="map" style={{ height: '100vh', width: '100%' }}></div>
    </div>
  );
}

export default App;

