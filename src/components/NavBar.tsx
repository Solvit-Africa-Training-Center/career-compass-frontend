import { BookOpen, Moon, Sun } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/Button";
import { useTheme } from "@/hooks/useTheme";

const navigation = {
  home: "Home",
  features: "Features",
  about: "About",
  howItWorks: "How It Works",
  contact: "Contact Us",
};

const NavBar = () => {
    const { isDark,toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsOpen(false);
  };
  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 flex-shrink-0 ${isDark ? 'bg-primarycolor-900' : 'bg-white'}`}>
        <nav className={`flex justify-between items-center max-w-6xl mx-auto px-4 md:px-7 py-4 md:py-7 border-b  ${isDark ? 'border-gray-700 bg-primarycolor-900' : 'border-gray-200 bg-white'}`}>
          <div className={`flex gap-2 items-center text-xl md:text-2xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>
            <BookOpen className="text-primarycolor-500" size={32} />
            <h1>
              Career <span className="text-primarycolor-500 ">Compass</span>
            </h1>
          </div>
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <ul className="flex space-x-6 lg:space-x-8">
              {Object.entries(navigation).map(([key, value]) => (
                <li key={key}>
                  <button
                    onClick={() => scrollToSection(key)}
                    className={`hover:text-primarycolor-500 cursor-pointer transition-colors duration-300 font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                  >
                    {value}
                  </button>
                </li>
              ))}
            </ul>
            <Button
              className="bg-primarycolor-500 hover:bg-primarycolor-400 text-white font-semibold py-2 px-4 rounded-md transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-xl transition-colors ${isDark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-200'}`}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
          {/* Mobile Hamburger Button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-xl transition-colors ${isDark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-200'}`}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              className={`focus:outline-none ${isDark ? 'text-white' : 'text-black'}`}
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle navigation"
            >
              {isOpen ? (
                // Close Icon
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
                </svg>
              ) : (
                // Hamburger Icon
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
                </svg>
              )}
            </button>
          </div>
        </nav>
        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div className={`md:hidden shadow-lg border-t transition-colors ${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
            <ul className="flex flex-col space-y-2 px-4 py-4">
              {Object.entries(navigation).map(([key, value]) => (
                <li key={key}>
                  <button
                    onClick={() => scrollToSection(key)}
                    className={`w-full text-left py-2 px-3 hover:text-primarycolor-500 rounded-md transition-colors duration-300 font-medium ${isDark ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    {value}
                  </button>
                </li>
              ))}
              
            </ul>
            <div className="px-4 pb-4">
              <Button
                className="w-full bg-primarycolor-500 hover:bg-primarycolor-400 text-white font-semibold py-2 px-4 rounded-md transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default NavBar;
