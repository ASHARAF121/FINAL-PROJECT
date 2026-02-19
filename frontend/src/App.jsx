import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/common/Navbar";

// Admin Components
import AdminDashboard from "./components/admin/AdminDashboard";


import ClientDashboard from "./components/client/ClientDashboard";
import ProviderDashboard from "./components/provider/ProviderDashboard";
import RequestService from "./components/client/RequestService";
import Earnings from "./components/provider/Earnings";
import ServiceRequest from "./components/provider/ServiceRequest";
import Availibility from "./components/provider/Availibility";





function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      

    {/* ================= ADMIN ROUTES ================= */}
    <Route path="/admin" element={<AdminDashboard />} />
  


    {/* ================= CLIENT ROUTES ================= */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/client/clientdashboard" element={<ClientDashboard />} />
        <Route path="/client/request-service" element={<RequestService />} />

    {/* ================= PROVIDER ROUTES ================= */}
        <Route path="/provider/providerdashboard" element={<ProviderDashboard />} />
        <Route path="/provider/earnings" element={<Earnings />} />
        <Route path="/provider/requests" element={<ServiceRequest />} />
        <Route path="/provider/availability" element={<Availibility />} />
      </Routes>
    </Router>
  );
}

export default App;
