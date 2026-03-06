import React, { useEffect, useState, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const SlotsByDate = () => {
  const { user } = useContext(AuthContext);
  const [temples, setTemples] = useState([]);
  const [selectedTemple, setSelectedTemple] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0] // default today
  );
  const [slots, setSlots] = useState([]);

  // Fetch all temples
  useEffect(() => {
    const fetchTemples = async () => {
      try {
        const res = await api.get("/temples", {
          headers: { Authorization: `Bearer ${user?.token}` },
        });
        setTemples(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    if (user) fetchTemples();
  }, [user]);

  // Fetch slots for selected temple & date
  useEffect(() => {
    const fetchSlots = async () => {
      if (!selectedTemple || !selectedDate) return;
      try {
        const res = await api.get(`/slots/${selectedTemple}/${selectedDate}`, {
          headers: { Authorization: `Bearer ${user?.token}` },
        });
        setSlots(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSlots();
  }, [selectedTemple, selectedDate, user]);

  return (
    <div className="container mt-4">
      <h2 className="mb-3 text-center">Book Darshan Slots</h2>

      {/* Temple Selection */}
      <div className="mb-3">
        <label><strong>Select Temple:</strong></label>
        <select
          className="form-select"
          value={selectedTemple}
          onChange={(e) => setSelectedTemple(e.target.value)}
        >
          <option value="">--Choose Temple--</option>
          {temples.map((t) => (
            <option key={t._id} value={t._id}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      {/* Date Selection */}
      {selectedTemple && (
        <div className="mb-3">
          <label><strong>Select Date:</strong></label>
          <input
            type="date"
            className="form-control w-25"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      )}

      {/* Slots */}
      {slots.length === 0 && selectedTemple && (
        <p className="text-center text-muted">No slots available for this day.</p>
      )}

      <div className="row">
        {slots.map((slot) => (
          <div key={slot._id} className="col-md-4 mb-3">
            <div className="card h-100 shadow-sm text-center">
              <div className="card-body">
                <p><strong>Temple:</strong> {slot.temple.name}</p>
                <p><strong>Time:</strong> {slot.time}</p>
                <p><strong>Available Seats:</strong> {slot.availableSeats}</p>
                <Link to={`/book/${slot._id}`} className="btn btn-primary mt-2">
                  Book Slot
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SlotsByDate;