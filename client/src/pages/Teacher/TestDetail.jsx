import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const TestDetail = () => {
  const { id } = useParams();
  console.log("🚨 ID:", id)

  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  if (loading) return <p>Loading...</p>;
  if (!test) return <p>Test not found.</p>;

  const markedDates = test.dateSlots.map(ds => new Date(ds.date).toLocaleDateString());

  return (
    <div style={{ padding: '20px' }}>
      <h2>{test.name}</h2>

      <p><strong>Premium Test:</strong> {test.isPremium ? 'Yes' : 'No'}</p>
      <p><strong>Threshold:</strong> {test.threshold} students</p>

      <div>
        <h4>Test Dates</h4>
        <Calendar
          tileClassName={({ date }) => {
            const dateStr = date.toLocaleDateString();
            return markedDates.includes(dateStr) ? 'highlight' : null;
          }}
        />
      </div>

      <div style={{ height: '300px', marginTop: '20px' }}>
        <h4>Test Locations</h4>
        <MapContainer
          center={[test.places[0]?.lat || 51.505, test.places[0]?.lng || -0.09]}
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

      <div style={{ marginTop: '20px' }}>
        <h4>Date Slots</h4>
        {test.dateSlots.map((ds, dateIndex) => (
          <div key={dateIndex}>
            <p><strong>Date:</strong> {new Date(ds.date).toLocaleDateString()}</p>
            <ul>
              {ds.slots.map((slot, slotIndex) => (
                <li key={slotIndex}>
                  <strong>Slot {slotIndex + 1}:</strong> {slot.startTime} - {slot.endTime} | Limit: {slot.limit}
                  <button
                    style={{ marginLeft: '10px' }}
                    onClick={() =>
                      navigate(`/teacher/test/${id}/dateslot/${dateIndex}/slot/${slotIndex}/questions`)
                    }
                  >
                    Manage Questions
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <button onClick={() => navigate(`/teacher/test/${id}/enrollments`)}>
        View Enrolled Students
      </button>
    </div>
  );
};

export default TestDetail;
