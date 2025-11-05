"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const Header = () => {
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
    { href: "#community", label: "Testimonials" },
    { href: "#pricing", label: "Pricing" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 py-3 sm:py-4 lg:py-5 bg-[#13110F66] ${
          isScrolled ? "backdrop-blur-md shadow-lg" : "backdrop-blur-sm"
        }`}
      >
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:max-w-7xl xl:mx-auto">
          <nav className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="block">
                <Image
                  src="/skinbestie-logo.png"
                  alt="Logo"
                  width={206}
                  height={42}
                  className="object-contain h-8 sm:h-10 lg:h-[42px] w-auto max-w-[160px] sm:max-w-[180px] lg:max-w-[206px]"
                />
              </Link>
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
              <Link
                href="/login"
                className="text-[#FAFAFA] rounded-xl px-4 py-3 2xl:p-4 bg-[#EDEDED]/[0.05] border border-[#FDFAEB]/30 font-medium text-base 2xl:text-[1.0625rem] leading-[1.5] tracking-tighter transition-all duration-300 hover:bg-white/10 whitespace-nowrap inline-block"
              >
                Sign into your account
              </Link>
            </div>

            {/* Mobile Sign In Button - Replaces hamburger menu */}
            <div className="xl:hidden">
              <Link
                href="/login"
                className="bg-[#1D1414B2] text-[#FDFAEB] rounded-xl p-4 border border-[#FDFAEB4D] font-semibold text-lg leading-[1.5] tracking-tight text-center transition-all duration-300 hover:opacity-90 whitespace-nowrap inline-block"
              >
                Sign in
              </Link>
            </div>
          </nav>
        </div>
      </header>
    </>
  );
};

export default Header;
