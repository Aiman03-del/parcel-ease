import {
  TiSocialFacebookCircular,
  TiSocialInstagramCircular,
  TiSocialTwitterCircular,
} from "react-icons/ti";

import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto text-center px-4">
        <p className="text-sm">
          © {new Date().getFullYear()} Your Company Name. All rights reserved.
        </p>
        <nav className="mt-4 flex flex-wrap justify-center">
          <Link
            to="/terms"
            className="text-gray-400 hover:text-white mx-2 my-1"
          >
            Terms of Service
          </Link>
          <Link
            to="/privacy"
            className="text-gray-400 hover:text-white mx-2 my-1"
          >
            Privacy Policy
          </Link>
          <Link
            to="/contact"
            className="text-gray-400 hover:text-white mx-2 my-1"
          >
            Contact Us
          </Link>
        </nav>
        <div className="mt-6">
          <p className="text-xs text-gray-500">Follow us on:</p>
          <div className="flex justify-center mt-2">
            <a
              href="https://facebook.com"
              className="text-gray-400 hover:text-blue-800 mx-2"
            >
              <TiSocialFacebookCircular className="text-xl" />
            </a>
            <a
              href="https://twitter.com"
              className="text-gray-400 hover:text-blue-500 mx-2"
            >
              <TiSocialTwitterCircular className="text-xl" />
            </a>
            <a
              href="https://instagram.com"
              className="text-gray-400 hover:text-orange-500 mx-2"
            >
              <TiSocialInstagramCircular className="text-xl" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
