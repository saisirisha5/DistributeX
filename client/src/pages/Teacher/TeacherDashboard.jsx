import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import LocationPicker from '../../components/LocationPicker'; 


const TeacherDashboard = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [places, setPlaces] = useState([{ name: '', lat: 0, lng: 0 }]);
  const [formData, setFormData] = useState({
    name: '',
    isPremium: false,
    threshold: 10,
    dateSlots: [
      { date: '', slots: [{ startTime: '', endTime: '', limit: 5 }] },
    ],
    places: [{ name: '', lat: '', lng: '' }],
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const res = await api.get('/test/my-tests');
        setTests(res.data.tests);
      } catch (error) {
        console.error('Failed to load tests', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTests();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Handlers for dateSlots and places additions/changes
  const updateDateSlot = (index, field, value) => {
    const newDateSlots = [...formData.dateSlots];
    newDateSlots[index][field] = value;
    setFormData((prev) => ({ ...prev, dateSlots: newDateSlots }));
  };

  const updateSlotInDate = (dateIndex, slotIndex, field, value) => {
    const newDateSlots = [...formData.dateSlots];
    newDateSlots[dateIndex].slots[slotIndex][field] = value;
    setFormData((prev) => ({ ...prev, dateSlots: newDateSlots }));
  };

  const addDateSlot = () => {
    if (formData.dateSlots.length < 3) {
      setFormData((prev) => ({
        ...prev,
        dateSlots: [...prev.dateSlots, { date: '', slots: [{ startTime: '', endTime: '', limit: 5 }] }],
      }));
    }
  };

  const addSlotToDate = (dateIndex) => {
    const newDateSlots = [...formData.dateSlots];
    newDateSlots[dateIndex].slots.push({ startTime: '', endTime: '', limit: 5 });
    setFormData((prev) => ({ ...prev, dateSlots: newDateSlots }));
  };

  const updatePlace = (index, field, value) => {
    const newPlaces = [...formData.places];
    newPlaces[index][field] = value;
    setFormData((prev) => ({ ...prev, places: newPlaces }));
  };

  const addPlace = () => {
    if (formData.places.length < 4) {
      setFormData((prev) => ({
        ...prev,
        places: [...prev.places, { name: '', lat: '', lng: '' }],
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate dates, times, lat/lng etc here if you want

    // Format lat/lng as numbers
    const formattedPlaces = places.map((p) => ({
  ...p,
  lat: Number(p.lat),
  lng: Number(p.lng),
}));



    try {
      const res = await api.post('/test/create', {
        name: formData.name,
        isPremium: formData.isPremium,
        threshold: Number(formData.threshold),
        dateSlots: formData.dateSlots.map((ds) => ({
          date: ds.date,
          slots: ds.slots.map((s) => ({
            startTime: s.startTime,
            endTime: s.endTime,
            limit: Number(s.limit),
          })),
        })),
         places: formattedPlaces,
      });
      setMessage('Test created successfully!');
      setShowForm(false);
      // Refresh tests list
      const testsRes = await api.get('/test/my-tests');
      setTests(testsRes.data.tests);
    } catch (error) {
      console.error('Failed to create test', error);
      setMessage('Failed to create test. Try again.');
    }
  };

  return (
    <div>
      <h2>Your Created Tests</h2>
      {loading ? (
        <p>Loading...</p>
      ) : tests.length === 0 ? (
        <p>No tests created yet.</p>
      ) : (
        <ul>
          {tests.map((test) => (
            <li key={test._id}>
              <strong>{test.name}</strong> - Premium: {test.isPremium ? 'Yes' : 'No'} - Threshold: {test.threshold}
            </li>
          ))}
        </ul>
      )}

      <button onClick={() => setShowForm(!showForm)} style={{ marginTop: '20px' }}>
        {showForm ? 'Cancel' : 'Create New Test'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ marginTop: '20px', border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
          <div>
            <label>
              Test Name: <br />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </label>
          </div>

          <div>
            <label>
              Premium Test:
              <input
                type="checkbox"
                name="isPremium"
                checked={formData.isPremium}
                onChange={handleInputChange}
              />
            </label>
          </div>

          <div>
            <label>
              Threshold (max students):
              <input
                type="number"
                name="threshold"
                min="1"
                value={formData.threshold}
                onChange={handleInputChange}
                required
              />
            </label>
          </div>

          <hr />

          <h4>Date Slots (up to 3 dates)</h4>
          {formData.dateSlots.map((ds, dateIndex) => (
            <div key={dateIndex} style={{ marginBottom: '15px', paddingLeft: '10px', borderLeft: '3px solid #ccc' }}>
              <label>
                Date: <br />
                <input
                  type="date"
                  value={ds.date}
                  onChange={(e) => updateDateSlot(dateIndex, 'date', e.target.value)}
                  required
                />
              </label>

              <h5>Slots:</h5>
              {ds.slots.map((slot, slotIndex) => (
                <div key={slotIndex} style={{ marginBottom: '10px' }}>
                  <label>
                    Start Time: <br />
                    <input
                      type="time"
                      value={slot.startTime}
                      onChange={(e) => updateSlotInDate(dateIndex, slotIndex, 'startTime', e.target.value)}
                      required
                    />
                  </label>

                  <label style={{ marginLeft: '10px' }}>
                    End Time: <br />
                    <input
                      type="time"
                      value={slot.endTime}
                      onChange={(e) => updateSlotInDate(dateIndex, slotIndex, 'endTime', e.target.value)}
                      required
                    />
                  </label>

                  <label style={{ marginLeft: '10px' }}>
                    Limit:
                    <input
                      type="number"
                      min="1"
                      value={slot.limit}
                      onChange={(e) => updateSlotInDate(dateIndex, slotIndex, 'limit', e.target.value)}
                      required
                    />
                  </label>
                </div>
              ))}

              <button type="button" onClick={() => addSlotToDate(dateIndex)}>
                + Add Slot
              </button>
            </div>
          ))}

          {formData.dateSlots.length < 3 && (
            <button type="button" onClick={addDateSlot}>
              + Add Date
            </button>
          )}

          <hr />

          <h4>Places (up to 4)</h4>
           <h4>Pick places on the map (click to add):</h4>
  <LocationPicker places={places} setPlaces={setPlaces} />
  {places.map((p, i) => (
    <div key={i}>
      <input
        type="text"
        placeholder="Place name"
        value={p.name}
        onChange={(e) => {
          const newPlaces = [...places];
          newPlaces[i].name = e.target.value;
          setPlaces(newPlaces);
        }}
        required
      />
      <span>Lat: {p.lat.toFixed(4)}, Lng: {p.lng.toFixed(4)}</span>
    </div>
  ))}

          {formData.places.length < 4 && (
            <button type="button" onClick={addPlace}>
              + Add Place
            </button>
          )}

          <hr />

          <button type="submit">Create Test</button>

          {message && <p>{message}</p>}
        </form>
      )}
    </div>
  );
};

export default TeacherDashboard;
