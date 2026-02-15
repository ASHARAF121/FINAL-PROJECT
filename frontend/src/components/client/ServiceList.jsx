import { useState, useEffect } from "react";
import api from "../../api/api";

const ServiceList = ({ onSelect }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await api.get("/client/services", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setServices(res.data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch services");
      console.error("Error fetching services:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (service) => {
    if (onSelect) onSelect(service);
  };

  return (
    <div className="bg-white p-5 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Available Services</h2>

      {loading ? (
        <p className="text-gray-500">Loading services...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : services.length === 0 ? (
        <p className="text-gray-500">No services available.</p>
      ) : (
        <ul className="space-y-3">
          {services.map((service) => (
            <li
              key={service._id}
              className="flex justify-between items-center border p-3 rounded"
            >
              <div className="flex-1">
                <p className="font-semibold">{service.title}</p>
                <p className="text-sm text-gray-600">{service.category}</p>
                <p className="text-sm text-green-600">${service.basePrice}</p>
              </div>
              <button
                onClick={() => handleSelect(service)}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 ml-2"
              >
                REQUEST
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Request form is rendered by the dashboard when a service is selected */}
    </div>
  );
};

export default ServiceList;
