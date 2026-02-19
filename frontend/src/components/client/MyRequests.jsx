import { useEffect, useState } from "react";
import api from "../../api/api";

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [payingIds, setPayingIds] = useState([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
     const res = await api.get("/client/requests", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

// console.log("Fetched requests:", res.data); // 👈 ADD THIS
setRequests(res.data);

      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch requests");
      console.error("Error fetching requests:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePay = async (requestId) => {
    try {
      setPayingIds((p) => [...p, requestId]);
      const token = localStorage.getItem("token");

      const initRes = await api.post(
        "/payment/create",
        { serviceRequestId: requestId, paymentMethod: "card" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const payment = initRes.data.payment;

      await api.post(
        "/payment/confirm",
        { paymentId: payment._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Payment successful!");

      // Refresh list after payment
      await fetchRequests();

    } catch (err) {
      const errorMsg =
        err.response?.data?.message || err.message || "Payment failed";
      setError(errorMsg);
      alert(`Payment Error: ${errorMsg}`);
    } finally {
      setPayingIds((p) => p.filter((id) => id !== requestId));
    }
  };

  // ✅ FILTER OUT PAID REQUESTS HERE
  const activeRequests = requests.filter(
    (req) => req.status !== "paid"
  );

  return (
    <div className="bg-white p-5 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">My Requests</h2>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : activeRequests.length === 0 ? (
        <p className="text-gray-500">No active requests.</p>
      ) : (
        <ul className="space-y-3">
          {activeRequests.map((req) => (
            <li key={req._id} className="border p-3 rounded bg-gray-50">
              <p><strong>Service:</strong> {req.serviceType}</p>
              <p><strong>Location:</strong> {req.location}</p>
              <p><strong>Date:</strong> {new Date(req.date).toLocaleDateString()}</p>
              <p><strong>Time:</strong> {req.time}</p>

              <p>
                <strong>Status:</strong>{" "}
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                  {req.status}
                </span>
              </p>

              {req.notes && (
                <p><strong>Notes:</strong> {req.notes}</p>
              )}

              {req.provider && (
                <p className="mt-2 text-sm text-gray-600">
                  <strong>Provider:</strong> {req.provider?.name} ({req.provider?.email})
                </p>
              )}

              {req.status === "accepted" && (
                <div className="mt-3">
                  <button
                    onClick={() => handlePay(req._id)}
                    disabled={payingIds.includes(req._id)}
                    className="bg-green-500 text-white px-3 py-1 rounded"
                  >
                    {payingIds.includes(req._id) ? "Processing..." : "Pay"}
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyRequests;
