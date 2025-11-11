"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { anton } from "../fonts";

export default function CookiePreferencesPage() {
  const [activeSection, setActiveSection] = useState("about-cookies");

  const sections = [
    { id: "about-cookies", label: "About Cookies" },
    { id: "necessary", label: "Necessary Cookies" },
    { id: "functional", label: "Functional Cookies" },
    { id: "analytical", label: "Analytical Cookies" },
    { id: "targeting", label: "Targeting Cookies" },
  ];

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-skinbestie-landing-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-skinbestie-landing-blue">
        {/* Logo */}
        <div className="pt-8 px-4 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <Link
              href="/"
              className="inline-block focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-skinbestie-landing-pink rounded transition-opacity hover:opacity-70"
              aria-label="Go to home page"
            >
              <Image
                src="/logo.svg"
                alt="SkinBestie Logo"
                className="object-contain h-6 lg:h-[24px] w-auto"
                style={{
                  filter:
                    "brightness(0) saturate(100%) invert(72%) sepia(65%) saturate(1845%) hue-rotate(301deg) brightness(102%) contrast(93%)",
                }}
                width={100}
                height={24}
              />
            </Link>
          </div>
        </div>

        {/* Title */}
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-16 text-center">
          <h1
            className={`${anton.className} text-5xl lg:text-6xl font-normal uppercase mb-6 text-skinbestie-landing-pink`}
          >
            Cookie Preferences
          </h1>
        </div>

        {/* Curved Bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
          >
            <path
              d="M0 0C240 20 480 30 720 30C960 30 1200 20 1440 0V30H0V0Z"
              fill="#FFFDF5"
            />
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-1">
            <div className="sticky top-8 space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`block w-full text-left py-2 transition text-sm border-l-2 pl-4 ${
                    activeSection === section.id
                      ? "border-skinbestie-landing-pink font-medium"
                      : "border-transparent hover:border-gray-300"
                  }`}
                  style={{
                    color: "#222118",
                  }}
                >
                  {section.label}
                </button>
              ))}
            </div>
          </aside>

          {/* Content Area */}
          <main className="lg:col-span-3 space-y-16">
            {/* About Cookies */}
            <section id="about-cookies">
              <h2
                className={`${anton.className} text-2xl lg:text-3xl font-normal uppercase mb-6`}
                style={{ color: "#222118" }}
              >
                About Cookies
              </h2>
              <p
                className="text-base leading-relaxed mb-4"
                style={{ color: "#1B1D1F" }}
              >
                This website and this policy is owned and operated by Gentle
                Human Ltd, under the trading name SkinBestie (SkinBestie or
                &apos;We&apos;).
              </p>
              <h3
                className={`${anton.className} text-xl lg:text-2xl font-normal uppercase mb-4 mt-8`}
                style={{ color: "#222118" }}
              >
                What are cookies?
              </h3>
              <p
                className="text-base leading-relaxed mb-4"
                style={{ color: "#1B1D1F" }}
              >
                A cookie is a small file that a website transfers to the cookie
                file of the browser on your device so that the website can
                remember who you are. We use cookies to help you navigate our
                website efficiently and to perform certain functions, including
                site traffic analysis. Cookies may also recognise you on your
                next login and offer you content tailored to your preferences
                and interests. Cookies do not compromise the security of a
                website. Some cookies can collect personal information,
                including information you disclose like your username, or where
                cookies track you to deliver more relevant advertising content.
                For further details on how we use your personal information,
                please see our{" "}
                <Link
                  href="/privacy-policy"
                  className="underline hover:opacity-70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-skinbestie-landing-pink transition-opacity"
                  style={{ color: "#EB6D98" }}
                >
                  Privacy Policy
                </Link>
                .
              </p>
              <p
                className="text-base leading-relaxed mb-4"
                style={{ color: "#1B1D1F" }}
              >
                There are two types of cookies on our sites –
                &apos;session&apos; cookies that are temporary cookies that
                remain on your browser only while you&apos;re on our site, and
                &apos;persistent&apos; cookies, that remain on your browser for
                much longer.
              </p>
              <h3
                className={`${anton.className} text-xl lg:text-2xl font-normal uppercase mb-4 mt-8`}
                style={{ color: "#222118" }}
              >
                Do I want to stop them?
              </h3>
              <p
                className="text-base leading-relaxed mb-4"
                style={{ color: "#1B1D1F" }}
              >
                Many cookies are used to enhance the usability or functionality
                of a website; therefore, disabling cookies may prevent you from
                using certain parts of this website. We explain the cookies we
                use in the section below. If you wish to restrict or block all
                the cookies which are set by our website (which as we say may
                prevent you from using certain parts of the site), or indeed any
                other website, you can do this through your browser settings.
                The Help function within your browser should tell you how. For
                more information go to{" "}
                <a
                  href="https://allaboutcookies.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:opacity-70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-skinbestie-landing-pink transition-opacity"
                  style={{ color: "#EB6D98" }}
                >
                  https://allaboutcookies.org/
                </a>
                .
              </p>
              <h3
                className={`${anton.className} text-xl lg:text-2xl font-normal uppercase mb-4 mt-8`}
                style={{ color: "#222118" }}
              >
                Which cookies are being used on this site?
              </h3>
              <p
                className="text-base leading-relaxed"
                style={{ color: "#1B1D1F" }}
              >
                When you visit our website, we may collect and store browser
                data – like pages viewed or items clicked – using cookies.
                Cookies help us keep the site working, improve performance, and
                show you personalised content. It&apos;s your choice what we
                collect. You can find details and choose which types of cookies
                to allow below and update your preferences anytime. Not
                accepting some cookies may limit certain website features.
              </p>
            </section>

            {/* Necessary Cookies */}
            <section id="necessary">
              <h2
                className={`${anton.className} text-2xl lg:text-3xl font-normal uppercase mb-6`}
                style={{ color: "#222118" }}
              >
                Necessary Cookies - Always Active
              </h2>
              <p
                className="text-base leading-relaxed mb-6"
                style={{ color: "#1B1D1F" }}
              >
                These cookies are essential for our website to operate. Without
                these cookies, services you have requested, such as secure login
                and payment processing, cannot be provided.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr
                      className="border-b-2"
                      style={{ borderColor: "#222118" }}
                    >
                      <th
                        className="text-left py-3 px-4 font-semibold"
                        style={{ color: "#222118" }}
                      >
                        Cookie
                      </th>
                      <th
                        className="text-left py-3 px-4 font-semibold"
                        style={{ color: "#222118" }}
                      >
                        Domain
                      </th>
                      <th
                        className="text-left py-3 px-4 font-semibold"
                        style={{ color: "#222118" }}
                      >
                        Description
                      </th>
                      <th
                        className="text-left py-3 px-4 font-semibold"
                        style={{ color: "#222118" }}
                      >
                        Expiration
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b" style={{ borderColor: "#E5E5E5" }}>
                      <td
                        className="py-3 px-4 text-sm"
                        style={{ color: "#1B1D1F" }}
                      >
                        authjs.session-token
                      </td>
                      <td
                        className="py-3 px-4 text-sm"
                        style={{ color: "#1B1D1F" }}
                      >
                        skinbestie.com
                      </td>
                      <td
                        className="py-3 px-4 text-sm"
                        style={{ color: "#1B1D1F" }}
                      >
                        Authentication session cookie for secure login using
                        Auth.js
                      </td>
                      <td
                        className="py-3 px-4 text-sm"
                        style={{ color: "#1B1D1F" }}
                      >
                        30 days
                      </td>
                    </tr>
                    <tr className="border-b" style={{ borderColor: "#E5E5E5" }}>
                      <td
                        className="py-3 px-4 text-sm"
                        style={{ color: "#1B1D1F" }}
                      >
                        cc_cookie
                      </td>
                      <td
                        className="py-3 px-4 text-sm"
                        style={{ color: "#1B1D1F" }}
                      >
                        skinbestie.com
                      </td>
                      <td
                        className="py-3 px-4 text-sm"
                        style={{ color: "#1B1D1F" }}
                      >
                        Stores your cookie consent preferences
                      </td>
                      <td
                        className="py-3 px-4 text-sm"
                        style={{ color: "#1B1D1F" }}
                      >
                        6 months
                      </td>
                    </tr>
                    <tr className="border-b" style={{ borderColor: "#E5E5E5" }}>
                      <td
                        className="py-3 px-4 text-sm"
                        style={{ color: "#1B1D1F" }}
                      >
                        __stripe_*
                      </td>
                      <td
                        className="py-3 px-4 text-sm"
                        style={{ color: "#1B1D1F" }}
                      >
                        stripe.com
                      </td>
                      <td
                        className="py-3 px-4 text-sm"
                        style={{ color: "#1B1D1F" }}
                      >
                        Stripe payment processing cookies for secure
                        transactions
                      </td>
                      <td
                        className="py-3 px-4 text-sm"
                        style={{ color: "#1B1D1F" }}
                      >
                        Session
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Functional Cookies */}
            <section id="functional">
              <h2
                className={`${anton.className} text-2xl lg:text-3xl font-normal uppercase mb-6`}
                style={{ color: "#222118" }}
              >
                Functional Cookies
              </h2>
              <p
                className="text-base leading-relaxed"
                style={{ color: "#1B1D1F" }}
              >
                These cookies recognise you when you return to our website. They
                remember information enabling us to remember your preferences
                and display relevant content when you return. We do not
                currently use any functional cookies.
              </p>
            </section>

            {/* Analytical Cookies */}
            <section id="analytical">
              <h2
                className={`${anton.className} text-2xl lg:text-3xl font-normal uppercase mb-6`}
                style={{ color: "#222118" }}
              >
                Analytical Cookies
              </h2>
              <p
                className="text-base leading-relaxed"
                style={{ color: "#1B1D1F" }}
              >
                These cookies collect information about how visitors use and
                engage with our website (such as the most visited pages),
                helping us to make improvements to our website. We do not
                currently use any analytical cookies.
              </p>
            </section>

            {/* Targeting Cookies */}
            <section id="targeting">
              <h2
                className={`${anton.className} text-2xl lg:text-3xl font-normal uppercase mb-6`}
                style={{ color: "#222118" }}
              >
                Targeting Cookies
              </h2>
              <p
                className="text-base leading-relaxed"
                style={{ color: "#1B1D1F" }}
              >
                These cookies collect information about your browsing habits
                (such as services you have subscribed to or content you have
                engaged with) as well as information about your browser, device
                and IP address. We use this information to display more relevant
                content and advertisements to you, as well as to limit the
                number of times you see an advertisement and measure the
                effectiveness of a campaign. Occasionally we share this
                information with partners, including other advertising
                organisations. Targeting Cookies help us to connect with you on
                our website and on other websites. If you disable these cookies,
                you may still see the same number of advertisements although
                they may be less relevant to you. We do not currently use any
                targeting cookies.
              </p>
            </section>
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black text-white py-12 mt-24">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 text-center">
          <p className="text-sm opacity-80">
            © 2025 SkinBestie. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
