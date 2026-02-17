  import { useState } from "react";
  import api from "../api/api";
  import { useNavigate } from "react-router-dom";

  const Register = () => {
    const navigate = useNavigate();
    const [role, setRole] = useState("client");
    const [clientData, setClientData] = useState({
      name: "",
      email: "",
      password: "" });
    const [providerData, setProviderData] = useState({
      name: "",
      email: "", 
      password: "",
      serviceType: "",
      serviceArea: "",
      // idDocument: null
    });
    
  const handleProviderChange = e => {
    setProviderData({ ...providerData, [e.target.name]: e.target.value });
  };

  const handleClientChange = e => {
    setClientData({ ...clientData, [e.target.name]: e.target.value });
  };

  const handleProviderRegister = async e => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", providerData.name);
      formData.append("email", providerData.email);
      formData.append("password", providerData.password);
      formData.append("serviceType", providerData.serviceType);
      formData.append("serviceArea", providerData.serviceArea);
      if (providerData.idDocument) {
        formData.append("idDocument", providerData.idDocument);
      }
      await api.post("/auth/providerregister", formData);
      navigate("/login");

    } catch (err) {
      console.error("Registration error:", err.response?.data || err.message);
    }
  };

  const handleClientRegister = async e => {
    e.preventDefault();
    try {
      await api.post("/auth/clientregister", clientData);
      navigate("/login");
    } catch (err) {
      console.error("Registration error:", err.response?.data || err.message);
    }
  };

  const handleChange = e => {
    if (role === "provider") {
      handleProviderChange(e);
    } else {
      handleClientChange(e);
    }
  };


    
    

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white w-full max-w-md p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold text-center mb-6">
            Create an Account
          </h2>

          {/* Role Selection */}
          <div className="flex justify-center gap-4 mb-6">
            <button
              onClick={() => setRole("client")}
              className={`px-4 py-2 rounded ${
                role === "client"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              Client
            </button>

            <button
              onClick={() => setRole("provider")}
              className={`px-4 py-2 rounded ${
                role === "provider"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              Service Provider
            </button>
          </div>

          {/* Registration Form */}
          <form className="space-y-4" onSubmit={role === "provider" ? handleProviderRegister : handleClientRegister}>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={role === "provider" ? providerData.name : clientData.name}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={role === "provider" ? providerData.email : clientData.email}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={role === "provider" ? providerData.password : clientData.password}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
            />
            {/* Provider-only fields */}
            {role === "provider" && (
              <>
                <input
                  type="text"
                  name="serviceType"
                  placeholder="Service Type (e.g. Plumber)"
                  value={providerData.serviceType}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={handleChange}
                />

                <input
                  type="text"
                  name="serviceArea"
                  placeholder="Service Area"
                  value={providerData.serviceArea}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={handleChange}
                />

                <input
                  type="file"
                  name="idDocument"
                  className="w-full p-2 border rounded"
                  onChange={e => setProviderData({ ...providerData, idDocument: e.target.files[0] })}
                />
                <p className="text-sm text-gray-500">
                  Upload ID / Certification for verification
                </p>
              </>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              Register
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{" "}
            <a href="/login" className="text-blue-600 hover:underline">
              Login
            </a>
          </p>
        </div>
      </div>
    );
  };

  export default Register;
