import { useEffect, useState } from "react";
import api from "../../api/api";

const Earnings = () => {
  const [earnings, setEarnings] = useState({
    totalEarnings: 0,
  });

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await api.get("/provider/earnings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEarnings({ totalEarnings: res.data.totalEarnings || 0 });
      setPayments(res.data.payments || []);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch earnings");
      console.error("Error fetching earnings:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Earnings</h1>

      {loading ? (
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <p className="text-gray-500">Loading earnings...</p>
        </div>
      ) : error ? (
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <p className="text-red-500">{error}</p>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-1 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-gray-500 text-sm">Total Earnings</h3>
              <p className="text-4xl font-bold text-green-600">${earnings.totalEarnings.toFixed(2)}</p>
            </div>
          </div>

          {/* Earnings History */}
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <h2 className="text-xl font-semibold p-4">Payment History</h2>

            {payments.length === 0 ? (
              <p className="p-4 text-gray-500">No payments yet.</p>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="p-3">Date</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment._id} className="border-t">
                      <td className="p-3">{new Date(payment.createdAt).toLocaleDateString()}</td>
                      <td className="p-3 font-semibold text-green-600">${payment.amount.toFixed(2)}</td>
                      <td className="p-3">
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                          {payment.paymentStatus || "success"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Earnings;
