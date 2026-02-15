import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">ServiceHub</h1>

      <div className="space-x-4">
        <Link className="hover:text-gray-200" to="/">Home</Link>
        <Link className="hover:text-gray-200" to="/login">Login</Link>
        <Link className="hover:text-gray-200" to="/register">Register</Link>
      </div>
    </nav>
  );
};

export default Navbar;
