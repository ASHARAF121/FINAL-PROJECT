import { useState } from "react";
import ServiceList from "./ServiceList";
import MyRequests from "./MyRequests";
import RequestService from "./RequestService";

const ClientDashboard = () => {
  const [selectedService, setSelectedService] = useState(null);
  const [showRequestForm, setShowRequestForm] = useState(false);

  const handleSelect = (service) => {
    setSelectedService(service);
    setShowRequestForm(true);
  };

  const openBlankRequest = () => {
    setSelectedService(null);
    setShowRequestForm(true);
  };

  const closeRequest = () => {
    setSelectedService(null);
    setShowRequestForm(false);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Client Dashboard</h1>

      <div className="flex items-center justify-between mb-4">
        <div />
        <button
          onClick={openBlankRequest}
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          Request Service
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <ServiceList onSelect={handleSelect} />

        {showRequestForm || selectedService ? (
          <RequestService service={selectedService} onClose={closeRequest} />
        ) : (
          <MyRequests />
        )}
      </div>
    </div>
  );
};

export default ClientDashboard;
