import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Fix leaflet default icon issue in React (optional)
import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

function LocationPicker({ places, setPlaces }) {
  function LocationMarker() {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        // Add new place with lat/lng and empty name, can edit name later
        setPlaces([...places, { name: '', lat, lng }]);
      },
    });
    return null;
  }

  return (
    <MapContainer center={[20, 0]} zoom={2} style={{ height: 300, width: '100%' }}>
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />
      <LocationMarker />
      {places.map((place, idx) => (
        <Marker key={idx} position={[place.lat, place.lng]} />
      ))}
    </MapContainer>
  );
}

export default LocationPicker;
