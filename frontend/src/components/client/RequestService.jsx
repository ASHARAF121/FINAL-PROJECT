import { useState, useEffect } from "react";
import api from "../../api/api";

const RequestService = ({ service, onClose }) => {
  const [services, setServices] = useState([]);
  const [providers, setProviders] = useState([]);
  const [loadingProviders, setLoadingProviders] = useState(false);

const [formData, setFormData] = useState({
  service: service?._id || "",   // 
  serviceType: service?.title || "",
  provider: "",                  // 
  location: "",
  date: "",
  time: "",
  notes: "",
});


  // 🔹 Load all services from backend
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get("/service");
        setServices(res.data || []);
      } catch (err) {
        console.error("Failed to load services", err);
      }
    };

    fetchServices();
  }, []);

  // 🔹 Update form when service prop changes
  useEffect(() => {
    if (service) {
      setFormData((prev) => ({
        ...prev,
        service: service._id,
        serviceType: service.title,
      }));
      fetchProviders(service.title);
    }
  }, [service]);

  // 🔹 Fetch providers based on service type
  const fetchProviders = async (serviceType) => {
    try {
      setLoadingProviders(true);
      const token = localStorage.getItem("token");

      const res = await api.get(
        `/client/providers?serviceType=${encodeURIComponent(serviceType)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setProviders(res.data || []);
    } catch (err) {
      console.error("Failed to load providers", err);
      setProviders([]);
    } finally {
      setLoadingProviders(false);
    }
  };

  // 🔹 Handle dropdown changes
  const handleServiceChange = (e) => {
    const selectedService = services.find(
      (s) => s._id === e.target.value
    );

    if (!selectedService) return;

    setFormData({
      ...formData,
      service: selectedService._id,
      serviceType: selectedService.title,
    });

    fetchProviders(selectedService.title);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 🔹 Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.service) {
      alert("Please select a service");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await api.post(
        "/client/request",
        {
          service: formData.service,          // ✅ IMPORTANT
          serviceType: formData.serviceType,
          provider: formData.provider,        // ✅ IMPORTANT
          location: formData.location,
          date: formData.date,
          time: formData.time,
          notes: formData.notes,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Service request submitted successfully!");

      if (onClose) onClose();
    } catch (err) {
      alert(err.response?.data?.message || "Error submitting request");
      console.error(err);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex justify-center">
      <div className="bg-white w-full max-w-lg p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6">Request a Service</h1>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* 🔹 Service Dropdown (FIXED) */}
          <select
            value={formData.service}
            onChange={handleServiceChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Service</option>
            {services.map((s) => (
              <option key={s._id} value={s._id}>
                {s.title} — ₹{s.basePrice}
              </option>
            ))}
          </select>

          {/* 🔹 Provider Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Choose Provider (optional)
            </label>

            {loadingProviders ? (
              <p className="text-sm text-gray-500">Loading providers...</p>
            ) : providers.length === 0 ? (
              <p className="text-sm text-gray-500">
                No matching providers available.
              </p>
            ) : (
              <select
                name="providerId"
                value={formData.providerId}
                onChange={handleChange}
                className="w-full p-2 border rounded mt-1"
              >
                <option value="">No preference</option>
                {providers.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name} — {p.email}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Location */}
          <input
            type="text"
            name="location"
            placeholder="Service Location"
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />

          {/* Date */}
          <input
            type="date"
            name="date"
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />

          {/* Time */}
          <input
            type="time"
            name="time"
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />

          {/* Notes */}
          <textarea
            name="notes"
            placeholder="Additional Notes (Optional)"
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows="3"
          ></textarea>

          <div className="flex space-x-3">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Submit Request
            </button>

            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-800 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestService;
