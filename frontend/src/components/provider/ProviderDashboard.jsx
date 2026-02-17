import { useState } from "react";
import Earnings from "../provider/Earnings";
import ServiceRequest from "../provider/ServiceRequest";
import Availibility from "./Availibility";

const ProviderDashboard = () => {
  const [activeTab, setActiveTab] = useState(null);

  return (
    <div className="bg-gray-100 min-h-screen">
      {!activeTab ? (
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-8">Service Provider Dashboard</h1>

          <div className="grid md:grid-cols-3 gap-6">
            <button
              onClick={() => setActiveTab("availability")}
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition text-left"
            >
              <h3 className="text-lg font-semibold mb-3">Availability</h3>
              <p className="text-gray-600 text-sm mb-4">Set your working hours and service areas</p>
              <div className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 inline-block">
                Manage
              </div>
            </button>

            <button
              onClick={() => setActiveTab("requests")}
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition text-left"
            >
              <h3 className="text-lg font-semibold mb-3">Service Requests</h3>
              <p className="text-gray-600 text-sm mb-4">View and accept client requests</p>
              <div className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 inline-block">
                Manage
              </div>
            </button>

            <button
              onClick={() => setActiveTab("earnings")}
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition text-left"
            >
              <h3 className="text-lg font-semibold mb-3">Earnings</h3>
              <p className="text-gray-600 text-sm mb-4">View your earnings and payment history</p>
              <div className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 inline-block">
                View
              </div>
            </button>
          </div>
        </div>
      ) : (
        <div>
          <button
            onClick={() => setActiveTab(null)}
            className="m-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            ← Back to Dashboard
          </button>
          
          {activeTab === "availability" && <Availibility />}
          {activeTab === "requests" && <ServiceRequest />}
          {activeTab === "earnings" && <Earnings />}
        </div>
      )}
    </div>
  );
};

export default ProviderDashboard;
