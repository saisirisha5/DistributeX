import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // for getting the test ID from the URL
import api from '../../services/api';
import Calendar from 'react-calendar';  // For the calendar
import 'react-calendar/dist/Calendar.css';  // Styling for the calendar
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';  // For the map
import 'leaflet/dist/leaflet.css';

const TestDetail = () => {
  const { id } = useParams(); // Get the test ID from URL
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch test details when component mounts
  useEffect(() => {
    const fetchTestDetails = async () => {
      try {
        const res = await api.get(`/test/details/${id}`);
        setTest(res.data.test);
      } catch (error) {
        console.error('Failed to fetch test details', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestDetails();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!test) {
    return <p>Test not found.</p>;
  }

  // Format dates for calendar highlighting
  const markedDates = test.dateSlots.map(ds => new Date(ds.date).toLocaleDateString()); // Format to match calendar date format
  console.log('Marked Dates: ', markedDates);  // Debug log

  return (
    <div>
      <h2>{test.name}</h2>
      <p><strong>Premium Test:</strong> {test.isPremium ? 'Yes' : 'No'}</p>
      <p><strong>Threshold:</strong> {test.threshold} students</p>

      {/* Calendar with dates marked */}
      <div>
        <h4>Test Dates</h4>
        <Calendar
          tileClassName={({ date }) => {
            // Format the date from calendar to check if it exists in markedDates
            const dateStr = date.toLocaleDateString(); // Format to match the format used in markedDates
            console.log('Calendar Tile Date:', dateStr);  // Debug log
            return markedDates.includes(dateStr) ? 'highlight' : null; // Compare formatted dates
          }}
        />
      </div>

      {/* Map with test places */}
      <div style={{ height: '300px' }}>
        <h4>Test Locations</h4>
        <MapContainer
          center={[test.places[0]?.lat || 51.505, test.places[0]?.lng || -0.09]}  // Default to first place if available
          zoom={13}
          style={{ height: '100%' }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {test.places.map((place, i) => (
            <Marker key={i} position={[place.lat, place.lng]}>
              <Popup>{place.name}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Date slots */}
      <div>
        <h4>Date Slots</h4>
        {test.dateSlots.map((ds, index) => (
          <div key={index}>
            <p><strong>Date:</strong> {new Date(ds.date).toLocaleDateString()}</p>
            <ul>
              {ds.slots.map((slot, idx) => (
                <li key={idx}>
                  <strong>Slot {idx + 1}:</strong> {slot.startTime} - {slot.endTime} | Limit: {slot.limit} students
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestDetail;
