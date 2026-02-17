const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-8 grid md:grid-cols-3 gap-6">
        {/* Brand */}
        <div>
          <h2 className="text-xl font-bold text-white">
            ServiceHub
          </h2>
          <p className="text-sm mt-2">
            Connecting clients with trusted service professionals.
          </p>
        </div>

        {/* Links */}
        <div>
          <h3 className="font-semibold text-white mb-2">
            Quick Links
          </h3>
          <ul className="space-y-1 text-sm">
            <li>Home</li>
            <li>Services</li>
            <li>About</li>
            <li>Contact</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-semibold text-white mb-2">
            Contact Us
          </h3>
          <p className="text-sm">support@servicehub.com</p>
          <p className="text-sm">+1 234 567 890</p>
        </div>
      </div>

      <div className="border-t border-gray-700 text-center py-3 text-sm">
        © {new Date().getFullYear()} ServiceHub. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
