import { Link } from "react-router-dom";

const Footer = () => {

 

  return (
  <footer className="py-8 bg-slate-900 dark:bg-black text-white" >
      <div className="container mx-auto text-center">
        <p className="text-sm">
          © {new Date().getFullYear()} Your Company Name. All rights reserved.
        </p>
        <nav className="mt-4 flex justify-center">
          <Link to="/terms" className="hover:text-gray-800 mx-2">
            Terms of Service
          </Link>
          <Link to="/privacy" className="hover:text-gray-800 mx-2">
            Privacy Policy
          </Link>
          <Link to="/contact" className="hover:text-gray-800 mx-2">
            Contact Us
          </Link>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
