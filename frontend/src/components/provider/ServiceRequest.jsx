import { useEffect, useState } from "react";
import api from "../../api/api";

const ServiceRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAvailableRequests();
  }, []);

  const fetchAvailableRequests = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await api.get("/provider/requests", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRequests(res.data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch requests");
      console.error("Error fetching requests:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    try {
      const token = localStorage.getItem("token");
      const endpoint = action === "accepted" ? "accept" : "reject";
      
      await api.put(`/provider/${endpoint}/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      fetchAvailableRequests();
    } catch (err) {
      alert(err.response?.data?.message || `Failed to ${action} request`);
      console.error("Error:", err);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">
        Service Requests
      </h1>

      {loading ? (
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <p className="text-gray-500">Loading requests...</p>
        </div>
      ) : error ? (
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <p className="text-red-500">{error}</p>
        </div>
      ) : requests.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <p className="text-gray-500">No available requests at the moment.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3">Service Type</th>
                <th className="p-3">Location</th>
                <th className="p-3">Date</th>
                <th className="p-3">Time</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {requests.map((req) => (
                <tr key={req._id} className="border-t">
                  <td className="p-3">{req.serviceType}</td>
                  <td className="p-3">{req.location}</td>
                  <td className="p-3">{new Date(req.date).toLocaleDateString()}</td>
                  <td className="p-3">{req.time}</td>
                  <td className="p-3 capitalize">
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        req.status === "accepted"
                          ? "bg-green-100 text-green-700"
                          : req.status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {req.status}
                    </span>
                  </td>

                  <td className="p-3 space-x-2">
                    {req.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleAction(req._id, "accepted")}
                          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                        >
                          Accept
                        </button>

                        <button
                          onClick={() => handleAction(req._id, "rejected")}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        >
                          Decline
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ServiceRequests;
