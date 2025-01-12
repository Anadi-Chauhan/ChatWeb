import GNavLink from "./GlobalNavlink";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="h-10 text-sm font-roboto font-semibold p-2">
      <div className="flex items-center justify-between px-4">
        {/* Mobile Menu Button */}
        <button
          className="sm:hidden text-gray-200 hover:text-white"
          onClick={toggleMenu}
          aria-label="Toggle Menu"
        >
          {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>

        {/* Desktop Navigation */}
        <ul
          className={`hidden sm:flex gap-10 justify-end mr-10 text-gray-200`}
        >
          <li className="hover:text-white hover:underline">
            <GNavLink href="/register">Register</GNavLink>
          </li>
          <li className="hover:text-white hover:underline">
            <GNavLink href="/login">LogIn</GNavLink>
          </li>
          <li className="hover:text-white hover:underline">
            <GNavLink href="/room">Guest Room</GNavLink>
          </li>
          <li className="hover:text-white hover:underline">
            <GNavLink href="/support">Support</GNavLink>
          </li>
          <li className="hover:text-white hover:underline">
            <GNavLink href="/terms">Terms & Conditions</GNavLink>
          </li>
        </ul>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <ul className="absolute z-20 top-12 right-4 bg-black bg-opacity-90 p-4 rounded-lg shadow-lg flex flex-col gap-4 text-gray-200 sm:hidden">
            <li className="hover:text-white hover:underline">
              <GNavLink href="/register">Register</GNavLink>
            </li>
            <li className="hover:text-white hover:underline">
              <GNavLink href="/login">LogIn</GNavLink>
            </li>
            <li className="hover:text-white hover:underline">
              <GNavLink href="/room">Guest Room</GNavLink>
            </li>
            <li className="hover:text-white hover:underline">
              <GNavLink href="/support">Support</GNavLink>
            </li>
            <li className="hover:text-white hover:underline">
              <GNavLink href="/terms">Terms & Conditions</GNavLink>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
}
