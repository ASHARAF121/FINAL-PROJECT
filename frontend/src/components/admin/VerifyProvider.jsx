import { useState } from "react";

const VerifyProviders = () => {
  const [providers, setProviders] = useState([
    {
      id: 1,
      name: "Alex Plumber",
      service: "Plumber",
      email: "alex@gmail.com",
      status: "pending",
    },
    {
      id: 2,
      name: "Emma Electric",
      service: "Electrician",
      email: "emma@gmail.com",
      status: "pending",
    },
  ]);

  const handleAction = (id, action) => {
    setProviders((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: action } : p
      )
    );
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">
        Verify Service Providers
      </h1>

      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Service</th>
              <th className="p-3">Email</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {providers.map((provider) => (
              <tr key={provider.id} className="border-t">
                <td className="p-3">{provider.name}</td>
                <td className="p-3">{provider.service}</td>
                <td className="p-3">{provider.email}</td>
                <td className="p-3 capitalize">
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      provider.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : provider.status === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {provider.status}
                  </span>
                </td>
                <td className="p-3 space-x-2">
                  <button
                    onClick={() =>
                      handleAction(provider.id, "approved")
                    }
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() =>
                      handleAction(provider.id, "rejected")
                    }
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VerifyProviders;
