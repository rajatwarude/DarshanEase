// clien/src/pages/BookSlot.js
import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import Modal from "../components/Modal";

const BookSlot = () => {
  const { slotId } = useParams();
  const { user } = useContext(AuthContext);
  const [slot, setSlot] = useState(null);
  const [slotsForDay, setSlotsForDay] = useState([]);
  const [numberOfPersons, setNumberOfPersons] = useState(1);
  const [selectedSlotId, setSelectedSlotId] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [modal, setModal] = useState({ open: false, title: "", message: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSlot = async () => {
      try {
        const res = await api.get(`/slots/slot/${slotId}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const slotData = res.data;
        setSlot(slotData);

        // Normalize date string for date input (yyyy-mm-dd)
        const normalizedDate = new Date(slotData.date).toISOString().split("T")[0];
        setSelectedDate(normalizedDate);

        // Fetch all slots for this temple on this date to build time choices
        const slotsRes = await api.get(
          `/slots/${slotData.temple._id}/${normalizedDate}`,
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
        setSlotsForDay(slotsRes.data);

        // Default selected slot is the one we came with
        setSelectedSlotId(slotData._id);
      } catch (err) {
        console.error(err);
      }
    };
    if (user) fetchSlot();
  }, [slotId, user]);

  const handleBooking = async () => {
    try {
      await api.post(
        "/bookings",
        { slotId: selectedSlotId || slot._id, numberOfPersons },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setModal({
        open: true,
        title: "Success",
        message: "Booking successful!",
      });
      navigate("/bookings/my");
    } catch (err) {
      setModal({
        open: true,
        title: "Error",
        message: err.response?.data?.message || "Booking failed",
      });
    }
  };

  if (!slot) return <p className="text-center mt-4">Loading slot...</p>;

  const currentSlot =
    slotsForDay.find((s) => s._id === (selectedSlotId || slot._id)) || slot;

  return (
    <>
      <Modal
        open={modal.open}
        title={modal.title}
        message={modal.message}
        onClose={() => setModal({ open: false, title: "", message: "" })}
      />
      <div className="container mt-4">
      <div className="card p-4 shadow-sm">
        <h2 className="mb-3">Book Slot for {slot.temple.name}</h2>

        {/* Date input: only the slot's available date, read-only */}
        <div className="mb-3">
          <label className="form-label"><strong>Date</strong></label>
          <input
            type="date"
            className="form-control"
            value={selectedDate}
            disabled
          />
        </div>

        <div className="mb-3">
          <label className="form-label"><strong>Select Time</strong></label>
          <select
            className="form-select"
            value={selectedSlotId || slot._id}
            onChange={(e) => setSelectedSlotId(e.target.value)}
          >
            {slotsForDay.length > 0 ? (
              slotsForDay.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.time} (Seats: {s.availableSeats})
                </option>
              ))
            ) : (
              <option value={slot._id}>{slot.time} (Seats: {slot.availableSeats})</option>
            )}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label"><strong>Number of Persons</strong></label>
          <input
            type="number"
            className="form-control"
            min="1"
            max={currentSlot.availableSeats}
            value={numberOfPersons}
            onChange={(e) => setNumberOfPersons(e.target.value)}
          />
        </div>

        <button className="btn btn-primary" onClick={handleBooking}>
          Book
        </button>
      </div>
    </div>
    </>
  );
};

export default BookSlot;