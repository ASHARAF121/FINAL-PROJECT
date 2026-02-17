import { useEffect, useState } from "react";
import api from "../../api/api";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await api.get("/admin/stats", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
      setError("");
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Failed to load dashboard stats";
      console.error("Error fetching admin stats:", {
        status: err.response?.status,
        message: errorMsg,
        url: err.config?.url,
        fullError: err
      });
      setError(errorMsg);
      // Fallback mock data so dashboard still renders
      setStats({
        totalUsers: 0,
        totalProviders: 0,
        verifiedProviders: 0,
        totalRequests: 0,
        completedRequests: 0
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {error && (
        <div className="mb-4 p-4 bg-yellow-100 border border-yellow-400 text-yellow-800 rounded">
          <p className="font-semibold">Warning: {error}</p>
          <p className="text-sm">Showing cached/mock data. Please check your authentication.</p>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-600 text-sm font-semibold mb-2">Total Users</h3>
          <p className="text-3xl font-bold text-blue-600">{stats?.totalUsers || 0}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-600 text-sm font-semibold mb-2">Total Providers</h3>
          <p className="text-3xl font-bold text-purple-600">{stats?.totalProviders || 0}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-600 text-sm font-semibold mb-2">Verified Providers</h3>
          <p className="text-3xl font-bold text-green-600">{stats?.verifiedProviders || 0}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-600 text-sm font-semibold mb-2">Total Requests</h3>
          <p className="text-3xl font-bold text-orange-600">{stats?.totalRequests || 0}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-600 text-sm font-semibold mb-2">Completed Requests</h3>
          <p className="text-3xl font-bold text-teal-600">{stats?.completedRequests || 0}</p>
        </div>
      </div>

      {/* Action Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition cursor-pointer">
          <h3 className="text-lg font-semibold mb-2">Verify Providers</h3>
          <p className="text-gray-600 text-sm">Approve pending provider accounts</p>
          <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Manage
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition cursor-pointer">
          <h3 className="text-lg font-semibold mb-2">Manage Users</h3>
          <p className="text-gray-600 text-sm">View and manage all users</p>
          <button className="mt-4 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
            Manage
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition cursor-pointer">
          <h3 className="text-lg font-semibold mb-2">Reports</h3>
          <p className="text-gray-600 text-sm">View service requests and payments</p>
          <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            View
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
