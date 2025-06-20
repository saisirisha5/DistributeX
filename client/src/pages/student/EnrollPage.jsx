import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import {
  getAllTests,
  enrollInTest,
  createOrder,
  verifyPayment
} from '../../services/studentService';


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

  //To handle both premium and non-premium test enrollments of students
  const handleEnroll = async () => {
    if (!selectedDate || !selectedSlot || !selectedPlace) {
      alert("Please select date, slot, and location");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      if (test.isPremium) {
        // For premium test: first initiate Razorpay payment
        const orderRes = await createOrder({ testId }, token);

        const options = {
          key: process.env.REACT_APP_RAZORPAY_KEY_ID,
          amount: orderRes.amount,
          currency: orderRes.currency,
          name: "Test Enrollment",
          description: `Payment for ${test.name}`,
          order_id: orderRes.id,
          handler: async function (response) {
            //  console.log("Payment response:", response);

            try {
              const verifyRes = await verifyPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                testId,
                selectedDate,
                selectedSlot,
                selectedPlace
              }, token);

              alert("Payment successful and enrolled!");
              navigate("/student/home");
            } catch (err) {
              console.error("Payment verification failed:", err);
              alert(err.response?.data?.message || "Verification failed");
            }
          },
          theme: { color: "#3399cc" }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();

      } else {
        //  For non-premium test: directly enroll
        const res = await enrollInTest(testId, {
          selectedDate: selectedDate.toISOString().slice(0, 10),
          selectedSlot,
          selectedPlace
        }, token);

        alert("Enrolled successfully!");
        navigate("/student/home");
      }

    } catch (err) {
      console.error("Error:", err);
      alert(err.response?.data?.message || "Something went wrong");
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
      <p className="text-gray-600">Premium Test: {test.isPremium ? '✅ Yes' : '❌ No'}</p>
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

      <h2 className="mt-6 text-lg font-semibold mb-2">Select a Test Location</h2>
      {test.places && test.places.length > 0 && (
        <MapContainer
          center={[test.places[0].lat, test.places[0].lng]}
          zoom={12}
          style={{ height: '300px', width: '100%' }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
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
        {test.isPremium ? "Pay & Enroll" : "Confirm Enrollment"}
      </button>
    </div>
  );
};

export default EnrollPage;
