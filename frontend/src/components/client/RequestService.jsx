import { useState, useEffect } from "react";
import api from "../../api/api";

const RequestService = ({ service, onClose }) => {
  const [formData, setFormData] = useState({
    serviceType: service?.title || "",
    serviceId: service?._id || "",
    providerId: "",
    location: "",
    date: "",
    time: "",
    notes: "",
  });
  const [providers, setProviders] = useState([]);
  const [loadingProviders, setLoadingProviders] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    // when selected service changes, update defaults and fetch providers
    setFormData((f) => ({ ...f, serviceType: service?.title || "", serviceId: service?._id || "" }));
    fetchProviders(service?.title);
  }, [service]);

  const fetchProviders = async (serviceType) => {
    try {
      setLoadingProviders(true);
      const token = localStorage.getItem("token");
      const q = serviceType ? `?serviceType=${encodeURIComponent(serviceType)}` : "";
      const res = await api.get(`/client/providers${q}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProviders(res.data || []);
    } catch (err) {
      console.error("Failed to load providers", err);
      setProviders([]);
    } finally {
      setLoadingProviders(false);
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  // Validate form data
  if (!formData.serviceType || !formData.location || !formData.date || !formData.time) {
    alert("Please fill in all required fields");
    return;
  }

  try {
    const token = localStorage.getItem("token");
    await api.post(
      "/client/request",
      {
        serviceType: formData.serviceType,
        serviceId: formData.serviceId,
        providerId: formData.providerId,
        location: formData.location,
        date: formData.date,
        time: formData.time,
        notes: formData.notes,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    alert("Service request submitted successfully!");
    setFormData({
      serviceType: service?.title || "",
      serviceId: service?._id || "",
      providerId: "",
      location: "",
      date: "",
      time: "",
      notes: "",
    });
      if (onClose) onClose();
  } catch (err) {
    alert(err.response?.data?.message || "Error submitting request");
    console.error("Error submitting request:", err.response?.data || err.message);
  }
};

  const handleCancel = () => {
    if (onClose) onClose();
  };
  return (
    <div className="p-6 bg-gray-100 min-h-screen flex justify-center">
      <div className="bg-white w-full max-w-lg p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6">
          Request a Service
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Service Type */}
          <select
            name="serviceType"
            onChange={handleChange}
            value={formData.serviceType}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Service</option>
            <option>Plumber</option>
            <option>Electrician</option>
            <option>Cleaner</option>
            <option>Carpenter</option>
          </select>

          {/* Provider selection (optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Choose Provider (optional)</label>
            {loadingProviders ? (
              <p className="text-sm text-gray-500">Loading providers...</p>
            ) : providers.length === 0 ? (
              <p className="text-sm text-gray-500">No matching providers available.</p>
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
                    {p.name} — {p.email} {p.serviceType ? `(${p.serviceType})` : ""}
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
              onClick={handleCancel}
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
