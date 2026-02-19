import { useEffect, useState } from "react";
import api from "../../api/api";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // ================= USER MANAGEMENT STATES =================
  const [users, setUsers] = useState([]);
  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "client",
  });

  useEffect(() => {
    fetchDashboardStats();
    fetchUsers();
  }, []);

  // ================= DASHBOARD STATS =================
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
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Failed to load dashboard stats";

      console.error("Error fetching admin stats:", err);
      setError(errorMsg);

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



  // ================= FETCH USERS =================
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/admin/users", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };
useEffect(() => {
  fetchUsers();
}, []);


  // ================= CREATE USER =================
  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      await api.post("/admin/useradd", userForm, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUserForm({
        name: "",
        email: "",
        password: "",
        role: "client",
      });

      fetchUsers();

    } catch (err) {
      alert(err.response?.data?.message || "Failed to create user");
    }
  };

  // ================= DELETE USER =================
  const handleDeleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    try {
      const token = localStorage.getItem("token");

      await api.delete(`/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      fetchUsers();
     
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete user");
    }
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {error && (
        <div className="mb-4 p-4 bg-yellow-100 border border-yellow-400 text-yellow-800 rounded">
          <p className="font-semibold">Warning: {error}</p>
          <p className="text-sm">
            Showing fallback data. Please check authentication.
          </p>
        </div>
      )}

      {/* ================= Statistics Cards ================= */}
      <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-600 text-sm font-semibold mb-2">
            Total Users
          </h3>
          <p className="text-3xl font-bold text-blue-600">
            {stats?.totalUsers || 0}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-600 text-sm font-semibold mb-2">
            Total Providers
          </h3>
          <p className="text-3xl font-bold text-purple-600">
            {stats?.totalProviders || 0}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-600 text-sm font-semibold mb-2">
            Verified Providers
          </h3>
          <p className="text-3xl font-bold text-green-600">
            {stats?.verifiedProviders || 0}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-600 text-sm font-semibold mb-2">
            Total Requests
          </h3>
          <p className="text-3xl font-bold text-orange-600">
            {stats?.totalRequests || 0}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-600 text-sm font-semibold mb-2">
            Completed Requests
          </h3>
          <p className="text-3xl font-bold text-teal-600">
            {stats?.completedRequests || 0}
          </p>
        </div>
      </div>

      {/* ================= USER MANAGEMENT ================= */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-6">Manage Users</h2>

        {/* Create User Form */}
        <form
          onSubmit={handleCreateUser}
          className="grid md:grid-cols-4 gap-4 mb-6"
        >
          <input
            type="text"
            placeholder="Name"
            value={userForm.name}
            onChange={(e) =>
              setUserForm({ ...userForm, name: e.target.value })
            }
            className="border p-2 rounded"
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={userForm.email}
            onChange={(e) =>
              setUserForm({ ...userForm, email: e.target.value })
            }
            className="border p-2 rounded"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={userForm.password}
            onChange={(e) =>
              setUserForm({ ...userForm, password: e.target.value })
            }
            className="border p-2 rounded"
            required
          />

          <select
            value={userForm.role}
            onChange={(e) =>
              setUserForm({ ...userForm, role: e.target.value })
            }
            className="border p-2 rounded"
          >
            <option value="client">Client</option>
            <option value="provider">Provider</option>
            <option value="admin">Admin</option>
          </select>

          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 md:col-span-4"
          >
            Add User
          </button>
        </form>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Role</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="p-2 border">{user.name}</td>
                  <td className="p-2 border">{user.email}</td>
                  <td className="p-2 border">{user.role}</td>
                  <td className="p-2 border">
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
