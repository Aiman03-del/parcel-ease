import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto text-center">
        <p className="text-sm">
          © {new Date().getFullYear()} Your Company Name. All rights reserved.
        </p>
        <nav className="mt-4 flex justify-center">
          <Link to="/terms" className="text-gray-400 hover:text-white mx-2">
            Terms of Service
          </Link>
          <Link to="/privacy" className="text-gray-400 hover:text-white mx-2">
            Privacy Policy
          </Link>
          <Link to="/contact" className="text-gray-400 hover:text-white mx-2">
            Contact Us
          </Link>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
