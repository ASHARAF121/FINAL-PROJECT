import { useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

const Login = () => {
const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  

  const handleEmailChange = e => setEmail(e.target.value);
  
  const handlePasswordChange = e => setPassword(e.target.value);

  const handleLogin = async e => {
    e.preventDefault();
    try {
    
      
      const response = await api.post("/auth/login", { email, password });
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", response.data.role);
        localStorage.setItem("name", response.data.name);
        localStorage.setItem("userId", response.data.id);
     
      const role = response.data.role;
        // Redirect or show success message
      if(role === "client"){
        navigate("/client/clientdashboard");
      } else if(role === "provider"){
        navigate("/provider/providerdashboard");
      } else{
        navigate("/admin");
      }

    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.password || "Login error: " + err.message);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow w-96">
        <h2 className="text-2xl font-bold mb-4">Login</h2>

        <input
          className="w-full p-2 border rounded mb-3"
          placeholder="Email"
          onChange={handleEmailChange}
          
        />
        <input
          type="password"
          className="w-full p-2 border rounded mb-4"
          placeholder="Password"
          onChange={handlePasswordChange}
        />
        
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <button className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700" onClick={handleLogin}>
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
