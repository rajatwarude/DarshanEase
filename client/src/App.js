import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BookSlot from "./pages/BookSlot";
import Admin from "./pages/Admin";
import Slots from "./pages/Slots";
import MyBookings from "./pages/MyBookings";
import SlotsByDate from "./pages/SlotsByDate";
import MyDonations from "./pages/MyDonations";
import AdminRecentBookings from "./pages/AdminRecentBookings";
import AdminRecentCancellations from "./pages/AdminRecentCancellations";
import Donate from "./pages/Donate";

function App() {
  return (
    <Router>
      <div className="app-shell">
        <Navbar />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/book/:slotId" element={<BookSlot />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/recent-bookings" element={<AdminRecentBookings />} />
            <Route
              path="/admin/recent-cancellations"
              element={<AdminRecentCancellations />}
            />
            <Route path="/donate/:templeId" element={<Donate />} />
            <Route path="/slots/:templeId" element={<Slots />} />
            <Route path="/bookings/my" element={<MyBookings />} />
            <Route path="/donations/my" element={<MyDonations />} />
            <Route path="/slots/date/:templeId" element={<SlotsByDate />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;