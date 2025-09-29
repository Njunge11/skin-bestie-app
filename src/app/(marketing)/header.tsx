"use client";
import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#story", label: "Our Story" },
    { href: "#how", label: "How It Works" },
    { href: "#community", label: "Community" },
    { href: "#pricing", label: "Pricing" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-30 transition-all duration-300 py-3 sm:py-4 lg:py-5 bg-[#13110F]/90 ${
          isScrolled ? "backdrop-blur-md shadow-lg" : "backdrop-blur-sm"
        }`}
      >
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:max-w-7xl xl:mx-auto">
          <nav className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex-shrink-0">
              <a href="/" className="block">
                <img
                  src="/skinbestie-logo.png"
                  alt="Logo"
                  className="object-contain h-8 sm:h-10 lg:h-[42px] w-auto max-w-[160px] sm:max-w-[180px] lg:max-w-[206px]"
                />
              </a>
            </div>

            {/* Desktop Navigation - ONLY SHOWS WHEN EVERYTHING FITS */}
            <div className="hidden xl:flex items-center gap-6 2xl:gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-[#FAFAFA] hover:text-gray-200 font-semibold text-sm uppercase leading-[1.5] tracking-normal transition-colors duration-200 whitespace-nowrap"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Desktop Sign In Button - ONLY WITH DESKTOP NAV */}
            <div className="hidden xl:block">
              <button className="text-[#FAFAFA] rounded-xl px-4 py-3 2xl:p-4 bg-[#EDEDED]/[0.05] border border-[#FDFAEB]/30 font-medium text-base 2xl:text-[1.0625rem] leading-[1.5] tracking-tighter transition-all duration-300 hover:bg-white/10 whitespace-nowrap">
                Sign into your account
              </button>
            </div>

            {/* Mobile/Tablet Menu Button - SHOWS ON EVERYTHING BELOW XL */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="xl:hidden relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors duration-200"
            >
              <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </button>
          </nav>
        </div>
      </header>

      {/* Mobile/Tablet Menu Overlay - Separate from header */}
      {isMenuOpen && (
        <div className="xl:hidden fixed inset-0 z-[100] bg-[#FFFBE7]">
          {/* Top bar with logo and X */}
          <div className="absolute top-0 left-0 right-0 py-3 sm:py-4 px-4 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex-shrink-0">
                <img
                  src="/skinbestie-logo-dark.png"
                  alt="Logo"
                  className="object-contain h-8 sm:h-10 w-auto max-w-[160px] sm:max-w-[180px]"
                />
              </div>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg hover:bg-black/5 transition-colors duration-200"
              >
                <X className="w-6 h-6 text-[#13110F]" />
              </button>
            </div>
          </div>

          {/* Vertically centered menu content */}
          <div className="h-full flex items-center justify-center px-4 sm:px-6">
            <div className="w-full max-w-md space-y-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-[#13110F] hover:text-gray-700 font-normal text-2xl sm:text-3xl leading-[1.2] tracking-normal transition-colors duration-200 text-center"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-8">
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full text-[#13110F] rounded-xl p-4 bg-[#EDEDED]/[0.05] border border-[#13110F]/30 font-medium text-[1.0625rem] leading-[1.5] tracking-tighter transition-all duration-300 hover:bg-[#13110F]/5"
                >
                  Sign into your account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
