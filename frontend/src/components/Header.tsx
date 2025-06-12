"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { Menu, X, UserCircle } from "lucide-react";
import clsx from "clsx";
import { BarLoader } from "react-spinners";

export default function Header() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const toggleDropdown = () => setDropdownOpen((prev) => !prev);
  const closeDropdown = () => setDropdownOpen(false);

  if (status === "loading") {
    return (
      <header className="bg-white shadow-md sticky top-0 z-50 w-full">
        <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center">
          <Link href="/" className="flex flex-col leading-tight">
            <span className="text-xl font-bold text-blue-600">PromptAce</span>
            <span className="text-xs text-gray-500 -mt-1">Your AI-powered smart assistant</span>
          </Link>
          <span className="text-gray-500 text-sm"><BarLoader  color="#0dcaf0" /></span>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white shadow-md sticky top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center relative">
        <Link href="/" className="flex flex-col leading-tight">
          <span className="text-xl font-bold text-blue-600">PromptAce</span>
          <span className="text-xs text-gray-500 -mt-1">Your AI-powered smart assistant</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-6">
          {status === "authenticated" ? (
            <>
              <Link
                href="/dashboard"
                className={clsx(
                  "font-medium",
                  pathname === "/dashboard"
                    ? "text-blue-700 font-bold underline underline-offset-4"
                    : "text-gray-700 hover:text-blue-700"
                )}
              >
                Dashboard
              </Link>

            </>
          ) : (
            <>
              <Link
                href="/login"
                className={clsx(
                  "font-medium",
                  pathname === "/login"
                    ? "text-blue-700 font-bold underline underline-offset-4"
                    : "text-gray-700 hover:text-blue-700"
                )}
              >
                Login
              </Link>
              <Link
                href="/register"
                className={clsx(
                  "font-medium",
                  pathname === "/register"
                    ? "text-blue-700 font-bold underline underline-offset-4"
                    : "text-gray-700 hover:text-blue-700"
                )}
              >
                Register
              </Link>
            </>
          )}
            <>
              <Link
                href="/about-us"
                className={clsx(
                  "font-medium",
                  pathname === "/about-us"
                    ? "text-blue-700 font-bold underline underline-offset-4"
                    : "text-gray-700 hover:text-blue-700"
                )}
              >
                About
              </Link>
              <Link
                href="/contact-us"
                className={clsx(
                  "font-medium",
                  pathname === "/contact-us"
                    ? "text-blue-700 font-bold underline underline-offset-4"
                    : "text-gray-700 hover:text-blue-700"
                )}
              >
                Contact
              </Link>
            </>

            {status === "authenticated" && 
              <div className="relative">
                <div
                  onClick={toggleDropdown}
                  className="flex items-center gap-2 font-medium text-gray-700 hover:text-black cursor-pointer px-4 py-2 rounded-md hover:bg-gray-100 transition max-w-[200px]"
                >
                  <UserCircle className="w-5 h-5 text-gray-600" />
                  <span className="truncate">{session.user?.name}</span>
                  <svg
                    className="w-4 h-4 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-1 w-full bg-white border rounded-md shadow-md z-10">
                    <button
                      onClick={() => signOut({ callbackUrl: "/login" })}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            }
        </nav>

        {/* Mobile Hamburger Icon */}
        <button
          onClick={toggleMenu}
          className="md:hidden focus:outline-none text-gray-700"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4">
          {status === "authenticated" ? (
            <>
              <div className="flex items-center gap-2 mb-4 px-2 py-2 rounded-md bg-gray-100">
                <UserCircle className="w-5 h-5 text-gray-600" />
                <span className="truncate font-medium text-gray-800 max-w-[200px]">
                  {session.user?.name}
                </span>
              </div>
              <Link
                href="/dashboard"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
              >
                Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
              >
                Register
              </Link>
            </>
          )}
            <>
              <Link
                href="/about-us"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
              >
                About
              </Link>
              <Link
                href="/contact-us"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
              >
                Contact
              </Link>
            </>

          {status === "authenticated" &&
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
          }
        </div>
      )}
    </header>
  );
}
