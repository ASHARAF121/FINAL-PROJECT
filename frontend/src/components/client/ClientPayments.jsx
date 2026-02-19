import { useEffect, useState } from "react";
import api from "../../api/api";

const ClientPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/payment/client", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPayments(res.data);
    } catch (err) {
      console.error("Failed to fetch payments", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading payments...</p>;

  return (
    <div className="bg-white p-5 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">My Payments</h2>

      {payments.length === 0 ? (
        <p className="text-gray-500">No payments yet.</p>
      ) : (
        <ul className="space-y-3">
          {payments.map((payment) => (
            <li key={payment._id} className="border p-4 rounded bg-gray-50">
              <p>
                <strong>Service:</strong>{" "}
                {payment.serviceRequest?.serviceType}
              </p>
              <p>
                <strong>Provider:</strong>{" "}
                {payment.provider?.name}
              </p>
              <p>
                <strong>Amount:</strong> ${payment.amount}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={`px-2 py-1 rounded text-sm ${
                    payment.paymentStatus === "success"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {payment.paymentStatus}
                </span>
              </p>

              {payment.invoicePath && (
                <a
                  href={`${import.meta.env.VITE_API_URL}/${payment.invoicePath}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-600 underline mt-2 inline-block"
                >
                  Download Invoice
                </a>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ClientPayments;
