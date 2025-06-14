import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { getAllTests, enrollInTest } from '../../services/studentService';

const EnrollPage = () => {
  const { testId } = useParams();
  const navigate = useNavigate();

  const [test, setTest] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const token = localStorage.getItem('token');
        const allTests = await getAllTests(token);
        const foundTest = allTests.find(t => t._id === testId);
        setTest(foundTest);
      } catch (err) {
        console.error('Error fetching test:', err);
      }
    };
    fetchTest();
  }, [testId]);

  const handleEnroll = async () => {
    if (!selectedDate || !selectedSlot || !selectedPlace) {
      alert("Please select date, slot, and location");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await enrollInTest(testId, {
        selectedDate: selectedDate.toISOString().slice(0, 10),
        selectedSlot,
        selectedPlace
      }, token);

      alert("Enrolled successfully!");
      navigate("/student/home");
    } catch (err) {
        console.error("Enrollment error:", err);
      alert(err.response?.data?.message || "Enrollment failed");
    }
  };

  if (!test) return <div className="p-6">Loading test details...</div>;

        const dateStrings = test.dateSlots?.map(ds => ds.date.split('T')[0]) || [];
        const selectedDateStr = selectedDate?.toISOString().split('T')[0];

        const filteredSlots = test.dateSlots?.find(
        d => d.date.split('T')[0] === selectedDateStr
        )?.slots || [];


  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">{test.name}</h1>
      <p className="text-gray-600">Premium Test: {test.isPremium ? 'Yes' : 'No'}</p>
      <p className="text-gray-600 mb-4">Threshold: {test.threshold} students</p>

      <h2 className="text-lg font-semibold mb-2">Select a Test Date</h2>
      <Calendar
        onChange={setSelectedDate}
        tileDisabled={({ date }) =>
          !dateStrings.includes(date.toISOString().split('T')[0])
        }
      />

      {selectedDate && (
        <>
          <h3 className="mt-6 text-md font-semibold">
             Slots for: {selectedDate.toDateString()}
         </h3>
          {filteredSlots.length === 0 ? (
            <p className="text-gray-500 mt-2">No slots available for this date.</p>
          ) : (
          <ul className="mt-2">
            {filteredSlots.map((slot, index) => (
              <li
                  key={index}
                  onClick={() => setSelectedSlot(slot)}
                  className={`cursor-pointer px-4 py-2 rounded border my-1 flex justify-between items-center ${
                  selectedSlot === slot ? 'bg-blue-600 text-white border-blue-700' : 'bg-gray-100'
                  }`}
              >
                  <div>
                  <strong>Slot {index + 1}</strong>: {slot.startTime} - {slot.endTime}
                  <span className="ml-2 text-sm text-gray-300">
                      (Limit: {slot.limit} students)
                  </span>
                  </div>
                  {selectedSlot === slot && (
                  <span className="text-white font-semibold">✓ Selected</span>
                  )}
              </li>
              ))}
          </ul>
        )}
      </>
    )}
      

      {/* Can Use locationpicker.js for the below */}
      <h2 className="mt-6 text-lg font-semibold mb-2">Select a Test Location</h2>
      {test.places && test.places.length > 0 && (
        <MapContainer center={[test.places[0].lat, test.places[0].lng]} zoom={12} style={{ height: '300px', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {test.places.map((place, index) => (
            <Marker
              key={index}
              position={[place.lat, place.lng]}
              eventHandlers={{
                click: () => setSelectedPlace(place),
              }}
            >
              <Popup>{place.name}</Popup>
            </Marker>
          ))}
        </MapContainer>
      )}
      {selectedPlace && (
        <p className="mt-2 text-green-700 font-medium">
          Selected Location: {selectedPlace.name}
        </p>
      )}

      <button
        onClick={handleEnroll}
        className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
      >
        Confirm Enrollment
      </button>
    </div>
  );
};

export default EnrollPage;
