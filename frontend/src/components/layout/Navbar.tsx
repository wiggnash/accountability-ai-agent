// src/components/layout/Navbar.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  LogOut,
  Settings,
  BookOpen,
  BarChart3,
  Calendar,
  Home,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

// Type definitions
interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  isMobile?: boolean;
  onClick?: () => void;
}

interface ButtonProps {
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md";
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState<boolean>(false);

  const toggleMobileMenu = (): void => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleUserDropdown = (): void =>
    setIsUserDropdownOpen(!isUserDropdownOpen);

  const handleLogout = (): void => {
    logout();
    setIsUserDropdownOpen(false);
    navigate("/");
  };

  const NavLink: React.FC<NavLinkProps> = ({
    href,
    children,
    icon: Icon,
    isMobile = false,
    onClick,
  }) => (
    <button
      onClick={() => {
        if (onClick) onClick();
        navigate(href);
        if (isMobile) setIsMobileMenuOpen(false);
      }}
      className={`flex items-center gap-2 transition-colors duration-200 ${
        isMobile
          ? "px-4 py-3 text-gray-600 hover:text-blue-600 w-full text-left"
          : "px-3 py-2 text-gray-600 hover:text-blue-600 font-medium"
      }`}
    >
      {Icon && <Icon size={16} />}
      {children}
    </button>
  );

  const Button: React.FC<ButtonProps> = ({
    variant = "primary",
    size = "md",
    children,
    onClick,
    className = "",
  }) => {
    const baseClasses =
      "font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
    const variants = {
      primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
      outline:
        "border border-gray-200 text-gray-600 hover:border-gray-300 hover:text-gray-900 focus:ring-blue-500",
      ghost: "text-gray-600 hover:text-blue-600 focus:ring-blue-500",
    };
    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-sm",
    };

    return (
      <button
        onClick={onClick}
        className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
        type="button"
      >
        {children}
      </button>
    );
  };

  // Get user initials for avatar
  const getUserInitials = (name: string): string => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <button
              onClick={() => navigate("/")}
              className="flex items-center space-x-3"
            >
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-semibold text-gray-900">
                AI Learning Tracker
              </span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {isAuthenticated ? (
              <>
                <NavLink href="/" icon={Home}>
                  Home
                </NavLink>
                <NavLink href="/challenges" icon={BookOpen}>
                  Challenges
                </NavLink>
                <NavLink href="/dashboard" icon={BarChart3}>
                  Dashboard
                </NavLink>
                <NavLink href="/history" icon={Calendar}>
                  History
                </NavLink>
              </>
            ) : (
              <>
                <NavLink href="/">Home</NavLink>
                <NavLink href="/challenges">Challenges</NavLink>
              </>
            )}
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={toggleUserDropdown}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  type="button"
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {user.avatar || getUserInitials(user.name)}
                  </div>
                  <span className="text-gray-600 font-medium">{user.name}</span>
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* User Dropdown */}
                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-sm border border-gray-100 py-1">
                    <div className="px-4 py-3 border-b border-gray-50">
                      <p className="text-sm font-medium text-gray-900">
                        {user.name}
                      </p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        navigate("/profile");
                        setIsUserDropdownOpen(false);
                      }}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 w-full text-left"
                    >
                      <Settings size={16} />
                      Settings
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:text-red-700 text-left"
                      type="button"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate("/login")}>
                  Login
                </Button>
                <Button onClick={() => navigate("/register")}>
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 transition-colors duration-200"
              type="button"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white">
            <div className="py-2">
              {isAuthenticated && user ? (
                <>
                  <NavLink href="/" icon={Home} isMobile>
                    Home
                  </NavLink>
                  <NavLink href="/challenges" icon={BookOpen} isMobile>
                    Challenges
                  </NavLink>
                  <NavLink href="/dashboard" icon={BarChart3} isMobile>
                    Dashboard
                  </NavLink>
                  <NavLink href="/history" icon={Calendar} isMobile>
                    History
                  </NavLink>
                  <div className="border-t border-gray-100 mt-2 pt-2">
                    <div className="flex items-center gap-3 px-4 py-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                        {user.avatar || getUserInitials(user.name)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <NavLink href="/profile" icon={Settings} isMobile>
                      Settings
                    </NavLink>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-3 text-red-600 hover:text-red-700 text-left"
                      type="button"
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <NavLink href="/" isMobile>
                    Home
                  </NavLink>
                  <NavLink href="/challenges" isMobile>
                    Challenges
                  </NavLink>
                  <div className="border-t border-gray-100 mt-2 pt-2 px-4 space-y-2">
                    <Button
                      variant="ghost"
                      className="w-full justify-center"
                      onClick={() => {
                        navigate("/login");
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      Login
                    </Button>
                    <Button
                      className="w-full justify-center"
                      onClick={() => {
                        navigate("/register");
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      Get Started
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
