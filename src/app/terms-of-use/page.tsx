"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { anton } from "../fonts";

export default function TermsOfUsePage() {
  const [activeSection, setActiveSection] = useState("introduction");

  const sections = [
    { id: "introduction", label: "Introduction" },
    { id: "medical-disclaimer", label: "Medical Disclaimer" },
    { id: "changes-terms", label: "Changes to these terms" },
    { id: "changes-website", label: "Changes to our website" },
    { id: "information-accuracy", label: "Information Accuracy" },
    { id: "jurisdiction", label: "Jurisdiction and Local Laws" },
    { id: "use-website", label: "Use of the website" },
    { id: "prohibited-uses", label: "Prohibited uses" },
    { id: "account-password", label: "Your account and password" },
    { id: "third-party-links", label: "Third-Party Links" },
    { id: "internet-security", label: "Internet security and privacy" },
    { id: "copyright", label: "Copyright and Intellectual Property" },
    { id: "user-generated-content", label: "User-generated content" },
    { id: "user-content-standards", label: "User Content" },
    {
      id: "intellectual-property",
      label: "Intellectual property",
    },
    { id: "applicable-law", label: "Applicable Law and Jurisdiction" },
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
            Terms of Use
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
            {/* Introduction */}
            <section id="introduction">
              <p
                className="text-base leading-relaxed mb-4"
                style={{ color: "#1B1D1F" }}
              >
                If you use the SkinBestie website, you confirm that you accept
                these Terms and that you agree to comply with them. If you are
                also using SkinBestie&apos;s services, please see our{" "}
                <Link
                  href="/terms-and-conditions"
                  className="underline hover:opacity-70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-skinbestie-landing-pink transition-opacity"
                  style={{ color: "#EB6D98" }}
                >
                  Client Terms and Conditions
                </Link>
                , which govern bookings, cancellations, subscriptions, pricing
                and payments.
              </p>
              <p
                className="text-base leading-relaxed mb-4"
                style={{ color: "#1B1D1F" }}
              >
                Please ensure you read these terms and conditions of use, which
                govern your use of and access to skinbestie.co (the
                &quot;website&quot;), whether as a guest or a registered user.
                If you do not accept them, please do not use the website.
              </p>
              <p
                className="text-base leading-relaxed"
                style={{ color: "#1B1D1F" }}
              >
                This website is owned and operated by Gentle Human Ltd (referred
                to as &quot;Skin Bestie&quot;, &quot;we&quot;, &quot;us&quot; or
                &quot;our&quot;). We are registered in England and Wales under
                company number 14448690 and have our registered office at
                Huckletree (Priory House) Limited, 6 Wrights Lane, London, W8
                6TA.
              </p>
            </section>

            {/* Medical Disclaimer */}
            <section id="medical-disclaimer">
              <h2
                className={`${anton.className} text-2xl lg:text-3xl font-normal uppercase mb-6`}
                style={{ color: "#222118" }}
              >
                Medical Disclaimer
              </h2>
              <p
                className="text-base leading-relaxed"
                style={{ color: "#1B1D1F" }}
              >
                We are not medical professionals. The information and content on
                this website, including any product descriptions,
                recommendations, or advice, is for informational purposes only
                and is not intended to be a substitute for professional medical
                advice, diagnosis, or treatment. Always seek the advice of a
                qualified healthcare provider with any questions you may have
                regarding a medical condition. Never disregard professional
                medical advice or delay in seeking it because of something you
                have read on this website.
              </p>
            </section>

            {/* Changes to these terms */}
            <section id="changes-terms">
              <h2
                className={`${anton.className} text-2xl lg:text-3xl font-normal uppercase mb-6`}
                style={{ color: "#222118" }}
              >
                Changes to these terms
              </h2>
              <p
                className="text-base leading-relaxed"
                style={{ color: "#1B1D1F" }}
              >
                From time to time, we may modify these Terms. Please check this
                page from time to time to take notice of any changes we make, as
                they are binding on you. Your use of our website following any
                such change constitutes your agreement to follow and be bound by
                the Terms as amended. If at any time you do not wish to accept
                the Terms, you may not use our website.
              </p>
            </section>

            {/* Changes to our website */}
            <section id="changes-website">
              <h2
                className={`${anton.className} text-2xl lg:text-3xl font-normal uppercase mb-6`}
                style={{ color: "#222118" }}
              >
                Changes to our website
              </h2>
              <p
                className="text-base leading-relaxed mb-4"
                style={{ color: "#1B1D1F" }}
              >
                We may update our website from time to time and may change the
                content at any time. However, please note that any of the
                content on our website may be out of date at any given time, and
                we are under no obligation to update it.
              </p>
              <p
                className="text-base leading-relaxed"
                style={{ color: "#1B1D1F" }}
              >
                We do not guarantee that our website, or any content on it, will
                be free from errors or omissions and you accept that such
                changes may result in your being unable to access our website.
              </p>
            </section>

            {/* Information Accuracy */}
            <section id="information-accuracy">
              <h2
                className={`${anton.className} text-2xl lg:text-3xl font-normal uppercase mb-6`}
                style={{ color: "#222118" }}
              >
                Information Accuracy
              </h2>
              <p
                className="text-base leading-relaxed"
                style={{ color: "#1B1D1F" }}
              >
                We have taken all reasonable steps to ensure the accuracy,
                currency, availability, correctness, and completeness of the
                information on the pages of this website. However, all
                information on this website (including information about goods
                and services) is provided without warranty of any kind, whether
                express or implied, including but not limited to, implied
                warranties of quality, fitness for a particular purpose, or
                non-infringement. The content on this website is subject to
                change and update by us from time to time without notification.
                You should periodically revisit this page to review the current
                terms and conditions of use.
              </p>
            </section>

            {/* Jurisdiction and Local Laws */}
            <section id="jurisdiction">
              <h2
                className={`${anton.className} text-2xl lg:text-3xl font-normal uppercase mb-6`}
                style={{ color: "#222118" }}
              >
                Jurisdiction and Local Laws
              </h2>
              <p
                className="text-base leading-relaxed"
                style={{ color: "#1B1D1F" }}
              >
                The content on this website is provided in accordance with and
                subject to the laws of England. No representations are made that
                materials on this website are appropriate or available for use
                in locations outside of the united kingdom. Users who access
                this website from other locations do so on their own initiative
                and are responsible for compliance with local laws.
              </p>
            </section>

            {/* Use of the website */}
            <section id="use-website">
              <h2
                className={`${anton.className} text-2xl lg:text-3xl font-normal uppercase mb-6`}
                style={{ color: "#222118" }}
              >
                Use of the website
              </h2>
              <p
                className="text-base leading-relaxed mb-4"
                style={{ color: "#1B1D1F" }}
              >
                Our website is made available free of charge. We do not
                guarantee that our website, or any content on it, will always be
                available or be uninterrupted. We may need to suspend access to
                our website at times for technical or maintenance purposes.
                Internet and IT or telecommunication networks are not
                error-free, and interruptions and failures can occur. We cannot
                provide any guarantee in this regard and shall not therefore be
                held liable for any damage that may relate to the use of the
                Internet and IT or telecommunication networks, including,
                without limitation:
              </p>
              <ul className="space-y-3 ml-6 mb-4">
                <li className="flex items-start">
                  <span
                    className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0"
                    style={{ backgroundColor: "#222118" }}
                  ></span>
                  <span
                    className="text-base leading-relaxed"
                    style={{ color: "#1B1D1F" }}
                  >
                    Poor transmission and/or reception of any data and/or
                    information via the Internet;
                  </span>
                </li>
                <li className="flex items-start">
                  <span
                    className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0"
                    style={{ backgroundColor: "#222118" }}
                  ></span>
                  <span
                    className="text-base leading-relaxed"
                    style={{ color: "#1B1D1F" }}
                  >
                    Any external intrusions or computer viruses;
                  </span>
                </li>
                <li className="flex items-start">
                  <span
                    className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0"
                    style={{ backgroundColor: "#222118" }}
                  ></span>
                  <span
                    className="text-base leading-relaxed"
                    style={{ color: "#1B1D1F" }}
                  >
                    Any defaulting reception equipment or communication
                    networks; and
                  </span>
                </li>
                <li className="flex items-start">
                  <span
                    className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0"
                    style={{ backgroundColor: "#222118" }}
                  ></span>
                  <span
                    className="text-base leading-relaxed"
                    style={{ color: "#1B1D1F" }}
                  >
                    Any such Internet malfunction as may hinder the proper
                    operation of the website.
                  </span>
                </li>
              </ul>
              <p
                className="text-base leading-relaxed mb-4"
                style={{ color: "#1B1D1F" }}
              >
                Use of our website is permitted on a temporary basis. We may
                suspend, withdraw, discontinue or change all or any part of our
                website without notice. We will not be liable to you if for any
                reason our website is unavailable at any time or for any period.
                You are responsible for making all arrangements necessary for
                you to have access to our website. We do not warrant that our
                website is compatible with your computer equipment or that our
                website or its server is free of errors or viruses, worms or
                &quot;Trojan horses&quot; and we are not liable for any damage
                you may suffer as a result of such destructive features.
              </p>
              <p
                className="text-base leading-relaxed mb-4"
                style={{ color: "#1B1D1F" }}
              >
                You are also responsible for ensuring that all persons who
                access our website through your internet connection are aware of
                these Terms and other applicable terms and conditions, and that
                they comply with them.
              </p>
              <p
                className="text-base leading-relaxed"
                style={{ color: "#1B1D1F" }}
              >
                You must be 18 years of age or older to use our site.
              </p>
            </section>

            {/* Prohibited uses */}
            <section id="prohibited-uses">
              <h2
                className={`${anton.className} text-2xl lg:text-3xl font-normal uppercase mb-6`}
                style={{ color: "#222118" }}
              >
                Prohibited uses
              </h2>
              <p
                className="text-base leading-relaxed mb-4"
                style={{ color: "#1B1D1F" }}
              >
                You may use our website only for lawful purposes. You must not
                use our website:
              </p>
              <ul className="space-y-3 ml-6 mb-4">
                <li className="flex items-start">
                  <span
                    className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0"
                    style={{ backgroundColor: "#222118" }}
                  ></span>
                  <span
                    className="text-base leading-relaxed"
                    style={{ color: "#1B1D1F" }}
                  >
                    In any way that breaches any applicable local, national or
                    international law or regulation;
                  </span>
                </li>
                <li className="flex items-start">
                  <span
                    className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0"
                    style={{ backgroundColor: "#222118" }}
                  ></span>
                  <span
                    className="text-base leading-relaxed"
                    style={{ color: "#1B1D1F" }}
                  >
                    In any way that is unlawful or fraudulent, or has any
                    unlawful or fraudulent purpose or effect;
                  </span>
                </li>
                <li className="flex items-start">
                  <span
                    className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0"
                    style={{ backgroundColor: "#222118" }}
                  ></span>
                  <span
                    className="text-base leading-relaxed"
                    style={{ color: "#1B1D1F" }}
                  >
                    For the purpose of harming or attempting to harm minors in
                    any way;
                  </span>
                </li>
                <li className="flex items-start">
                  <span
                    className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0"
                    style={{ backgroundColor: "#222118" }}
                  ></span>
                  <span
                    className="text-base leading-relaxed"
                    style={{ color: "#1B1D1F" }}
                  >
                    To send, knowingly receive, upload, download, use or re-use
                    any material which does not comply with our content
                    standards below;
                  </span>
                </li>
                <li className="flex items-start">
                  <span
                    className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0"
                    style={{ backgroundColor: "#222118" }}
                  ></span>
                  <span
                    className="text-base leading-relaxed"
                    style={{ color: "#1B1D1F" }}
                  >
                    To transmit, or procure the sending of, any unsolicited or
                    unauthorised advertising or promotional material or any
                    other form of similar solicitation (spam);
                  </span>
                </li>
                <li className="flex items-start">
                  <span
                    className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0"
                    style={{ backgroundColor: "#222118" }}
                  ></span>
                  <span
                    className="text-base leading-relaxed"
                    style={{ color: "#1B1D1F" }}
                  >
                    To knowingly transmit any data, send or upload any material
                    that contains viruses, Trojan horses, worms, time-bombs,
                    keystroke loggers, spyware, adware or any other harmful
                    programs or similar computer code designed to adversely
                    affect the operation of any computer software or hardware.
                  </span>
                </li>
              </ul>
              <p
                className="text-base leading-relaxed mb-4"
                style={{ color: "#1B1D1F" }}
              >
                You also agree:
              </p>
              <ul className="space-y-3 ml-6">
                <li className="flex items-start">
                  <span
                    className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0"
                    style={{ backgroundColor: "#222118" }}
                  ></span>
                  <span
                    className="text-base leading-relaxed"
                    style={{ color: "#1B1D1F" }}
                  >
                    Not to reproduce, duplicate, copy or re-sell any part of our
                    website in contravention of the provisions of these Terms;
                    and
                  </span>
                </li>
                <li className="flex items-start">
                  <span
                    className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0"
                    style={{ backgroundColor: "#222118" }}
                  ></span>
                  <div
                    className="text-base leading-relaxed"
                    style={{ color: "#1B1D1F" }}
                  >
                    <p className="mb-2">
                      Not to access without authority, interfere with, damage or
                      disrupt:
                    </p>
                    <ul className="space-y-2 ml-6">
                      <li className="flex items-start">
                        <span
                          className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0"
                          style={{ backgroundColor: "#222118" }}
                        ></span>
                        <span>Any part of our website;</span>
                      </li>
                      <li className="flex items-start">
                        <span
                          className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0"
                          style={{ backgroundColor: "#222118" }}
                        ></span>
                        <span>
                          Any equipment or network on which our website is
                          stored;
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span
                          className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0"
                          style={{ backgroundColor: "#222118" }}
                        ></span>
                        <span>
                          Any software used in the provision of our website; or
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span
                          className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0"
                          style={{ backgroundColor: "#222118" }}
                        ></span>
                        <span>
                          Any equipment or network or software owned or used by
                          any third party.
                        </span>
                      </li>
                    </ul>
                  </div>
                </li>
              </ul>
            </section>

            {/* Your account and password */}
            <section id="account-password">
              <h2
                className={`${anton.className} text-2xl lg:text-3xl font-normal uppercase mb-6`}
                style={{ color: "#222118" }}
              >
                Your account and password
              </h2>
              <p
                className="text-base leading-relaxed mb-4"
                style={{ color: "#1B1D1F" }}
              >
                Access to the website and/or certain sections thereof may
                require the use of PIN codes or passwords. If you choose, or you
                are provided with, a user identification code, password or any
                other piece of information as part of our security procedures,
                you must treat such information as confidential. You must not
                disclose it to any third party.
              </p>
              <p
                className="text-base leading-relaxed mb-4"
                style={{ color: "#1B1D1F" }}
              >
                We may limit the number of attempts you make to access the
                website and/or certain section thereof, in order to prevent any
                fraudulent use of such codes. Please inform us of any fraudulent
                use that you may become aware of. In the event of any breach of
                the rules set forth under these Terms, we have the right to
                disable any user identification code or password, whether chosen
                by you or allocated by us, at any time, if in our reasonable
                opinion you have failed to comply with any of the provisions of
                these Terms.
              </p>
              <p
                className="text-base leading-relaxed"
                style={{ color: "#1B1D1F" }}
              >
                If you know or suspect that anyone other than you know your user
                identification code or password, you must promptly notify us at
                team@skinbestie.co.
              </p>
            </section>

            {/* Third-Party Links */}
            <section id="third-party-links">
              <h2
                className={`${anton.className} text-2xl lg:text-3xl font-normal uppercase mb-6`}
                style={{ color: "#222118" }}
              >
                Third-Party Links
              </h2>
              <p
                className="text-base leading-relaxed"
                style={{ color: "#1B1D1F" }}
              >
                Certain links on this website lead to websites maintained by
                third parties over which we have no control. We make no
                representations as to the accuracy, completeness, or any other
                aspect of the information contained on such third-party websites
                or websites linked to such websites and shall not be liable for
                any loss or damage arising from your reliance upon such
                information.
              </p>
            </section>

            {/* Internet security and privacy */}
            <section id="internet-security">
              <h2
                className={`${anton.className} text-2xl lg:text-3xl font-normal uppercase mb-6`}
                style={{ color: "#222118" }}
              >
                Internet security and privacy
              </h2>
              <p
                className="text-base leading-relaxed"
                style={{ color: "#1B1D1F" }}
              >
                We do not guarantee the privacy or confidentiality of any
                information relating to you that is transmitted over the
                Internet. You are responsible for the content and information
                contained in all your communications with this website,
                including its lawfulness, truthfulness, and accuracy. You should
                not post or send any unlawful, threatening, defamatory, obscene
                material, or any material that could give rise to a criminal
                offense and/or civil liability in any relevant jurisdiction.
              </p>
            </section>

            {/* Copyright and Intellectual Property */}
            <section id="copyright">
              <h2
                className={`${anton.className} text-2xl lg:text-3xl font-normal uppercase mb-6`}
                style={{ color: "#222118" }}
              >
                Copyright and Intellectual Property
              </h2>
              <p
                className="text-base leading-relaxed mb-4"
                style={{ color: "#1B1D1F" }}
              >
                We are the owner or the licensee of all intellectual property
                rights in our website, and in the material published on it
                (including, but not limited to text, content, software, database
                rights, video, music, sound, graphics, photographs,
                illustrations, artwork, photographs, names, logos, trademarks,
                service marks and other material) (Content). The Content is
                protected by copyright laws and other intellectual property
                regimes and treaties around the world. All such rights are
                reserved. You acquire no rights or licences in or to our website
                and/or the Content other than the limited right to use our
                website in accordance with these Terms. You may not copy,
                reproduce, recompile, decompile, disassemble, reverse engineer,
                distribute, publish, display, perform, modify, upload to create
                derivative works from, transmit, or in any other way exploit any
                part of our website. In the event that we make part of the
                website available to you which enables you to edit a picture
                (especially in order to track your progress), you hereby
                acknowledge and agree that such part of the website shall only
                be for your own private use, in compliance with its intended
                purpose and in accordance with any further restrictions or
                guidelines made known to you. Additionally, you may not offer
                for sale or sell or distribute over any other medium (including
                distribution by over-the-air television or radio broadcast or
                distribution on a computer network) the Content or any part
                thereof. You may not make any part of our website available as
                part of another website, whether by hyperlink framing on the
                internet or otherwise. Our website and the information contained
                therein may not be used to construct a database of any kind, nor
                may our website be stored (in its entirety or in any part) in
                databases for access by you or any third party or to distribute
                any database websites containing all or part of our website. You
                may not use any of our trademarks or trade names without our
                prior express written consent and you acknowledge that you have
                no ownership rights in and to any of those names and marks. You
                must not use any part of the content on our website for
                commercial purposes without obtaining a licence to do so from us
                or our licensors. If you print off, copy or download any part of
                our website in breach of these Terms, your right to use our
                website will cease immediately and you must, at our option,
                return or destroy any copies of the Content you have made. You
                agree to abide by all additional copyright notices or
                restrictions contained in our website. You agree to notify us
                promptly in writing promptly if you become aware of any
                unauthorised access to or use of our website by any party or of
                any claim that our website or any of the contents of our website
                infringes any copyright, trademark, or other contractual,
                statutory or common law rights of any party.
              </p>
            </section>

            {/* User-generated content */}
            <section id="user-generated-content">
              <h2
                className={`${anton.className} text-2xl lg:text-3xl font-normal uppercase mb-6`}
                style={{ color: "#222118" }}
              >
                User-generated content
              </h2>
              <p
                className="text-base leading-relaxed mb-4"
                style={{ color: "#1B1D1F" }}
              >
                We may make available, via this website or in connection with
                it, a space dedicated to user content (for example, forums,
                comments, ratings and reviews, or community features) whereby
                users of our website can upload content such as text, photos,
                videos, opinions, etc. (User Content) on forums including but
                not limited to:
              </p>
              <ul className="space-y-3 ml-6 mb-4">
                <li className="flex items-start">
                  <span
                    className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0"
                    style={{ backgroundColor: "#222118" }}
                  ></span>
                  <span
                    className="text-base leading-relaxed"
                    style={{ color: "#1B1D1F" }}
                  >
                    Customer Ratings and Reviews
                  </span>
                </li>
                <li className="flex items-start">
                  <span
                    className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0"
                    style={{ backgroundColor: "#222118" }}
                  ></span>
                  <span
                    className="text-base leading-relaxed"
                    style={{ color: "#1B1D1F" }}
                  >
                    Questions and Answers
                  </span>
                </li>
              </ul>
              <p
                className="text-base leading-relaxed mb-4"
                style={{ color: "#1B1D1F" }}
              >
                This User Content has not been verified or approved by us. The
                views expressed by users on our website are their own and do not
                represent our views or values.
              </p>
              <p
                className="text-base leading-relaxed mb-4"
                style={{ color: "#1B1D1F" }}
              >
                We do not endorse or control the User Content transmitted or
                posted on the website and, therefore, we do not guarantee the
                accuracy, integrity, legality or quality of User Content. We
                make no representations that results depicted are achievable, as
                content may have been altered by users.
              </p>
              <p
                className="text-base leading-relaxed mb-4"
                style={{ color: "#1B1D1F" }}
              >
                Under no circumstances will we be liable in any way for any User
                Content, including, without limitation, for any errors or
                omissions in any User Content, or for any loss or damage of any
                kind incurred by you as a result of the use of, or reliance
                upon, any User Content transmitted, uploaded, posted, e-mailed
                or otherwise made available via the website.
              </p>
              <p
                className="text-base leading-relaxed mb-4"
                style={{ color: "#1B1D1F" }}
              >
                If you wish to complain about information or materials uploaded
                by other users, please contact us at team@skinbestie.co.
              </p>
              <p
                className="text-base leading-relaxed mb-4"
                style={{ color: "#1B1D1F" }}
              >
                Whenever you make use of a feature that allows you to upload
                content to our website, or to contact other users of our
                website, you must comply with the Acceptable Standards below. We
                have the right to remove any posting you make on our site if, in
                our opinion, your post does not comply with these content
                standards.
              </p>
              <p
                className="text-base leading-relaxed"
                style={{ color: "#1B1D1F" }}
              >
                Any content you upload to our website will be considered
                non-confidential and non-proprietary. You retain all of your
                ownership rights in your content, but you are required to grant
                us, and other users of our website, a limited licence to use,
                store and copy that content and to distribute and make it
                available to third parties.
              </p>
            </section>

            {/* User Content */}
            <section id="user-content-standards">
              <h2
                className={`${anton.className} text-2xl lg:text-3xl font-normal uppercase mb-6`}
                style={{ color: "#222118" }}
              >
                User Content
              </h2>
              <p
                className="text-base leading-relaxed mb-4"
                style={{ color: "#1B1D1F" }}
              >
                <strong>Must:</strong>
              </p>
              <ul className="space-y-3 ml-6 mb-6">
                <li className="flex items-start">
                  <span
                    className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0"
                    style={{ backgroundColor: "#222118" }}
                  ></span>
                  <span
                    className="text-base leading-relaxed"
                    style={{ color: "#1B1D1F" }}
                  >
                    Be accurate (where it states facts);
                  </span>
                </li>
                <li className="flex items-start">
                  <span
                    className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0"
                    style={{ backgroundColor: "#222118" }}
                  ></span>
                  <span
                    className="text-base leading-relaxed"
                    style={{ color: "#1B1D1F" }}
                  >
                    Be genuinely held (where it states opinions);
                  </span>
                </li>
                <li className="flex items-start">
                  <span
                    className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0"
                    style={{ backgroundColor: "#222118" }}
                  ></span>
                  <span
                    className="text-base leading-relaxed"
                    style={{ color: "#1B1D1F" }}
                  >
                    Be reflective of your own use of the service;
                  </span>
                </li>
                <li className="flex items-start">
                  <span
                    className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0"
                    style={{ backgroundColor: "#222118" }}
                  ></span>
                  <span
                    className="text-base leading-relaxed"
                    style={{ color: "#1B1D1F" }}
                  >
                    Comply with applicable law in the UK and in any country from
                    which it is posted,
                  </span>
                </li>
              </ul>
              <p
                className="text-base leading-relaxed mb-4"
                style={{ color: "#1B1D1F" }}
              >
                <strong>User Content must not:</strong>
              </p>
              <ul className="space-y-3 ml-6 mb-4">
                <li className="flex items-start">
                  <span
                    className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0"
                    style={{ backgroundColor: "#222118" }}
                  ></span>
                  <span
                    className="text-base leading-relaxed"
                    style={{ color: "#1B1D1F" }}
                  >
                    Contain any material which is malicious or defamatory of any
                    person;
                  </span>
                </li>
                <li className="flex items-start">
                  <span
                    className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0"
                    style={{ backgroundColor: "#222118" }}
                  ></span>
                  <span
                    className="text-base leading-relaxed"
                    style={{ color: "#1B1D1F" }}
                  >
                    Contain any material which is rude, obscene, offensive,
                    hateful or inflammatory.
                  </span>
                </li>
                <li className="flex items-start">
                  <span
                    className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0"
                    style={{ backgroundColor: "#222118" }}
                  ></span>
                  <span
                    className="text-base leading-relaxed"
                    style={{ color: "#1B1D1F" }}
                  >
                    Promote sexually explicit material;
                  </span>
                </li>
                <li className="flex items-start">
                  <span
                    className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0"
                    style={{ backgroundColor: "#222118" }}
                  ></span>
                  <span
                    className="text-base leading-relaxed"
                    style={{ color: "#1B1D1F" }}
                  >
                    Promote violence;
                  </span>
                </li>
                <li className="flex items-start">
                  <span
                    className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0"
                    style={{ backgroundColor: "#222118" }}
                  ></span>
                  <span
                    className="text-base leading-relaxed"
                    style={{ color: "#1B1D1F" }}
                  >
                    Promote discrimination based on race, sex, religion,
                    nationality, disability, sexual orientation or age;
                  </span>
                </li>
                <li className="flex items-start">
                  <span
                    className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0"
                    style={{ backgroundColor: "#222118" }}
                  ></span>
                  <span
                    className="text-base leading-relaxed"
                    style={{ color: "#1B1D1F" }}
                  >
                    Infringe any copyright, database right or trademark of any
                    other person;
                  </span>
                </li>
                <li className="flex items-start">
                  <span
                    className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0"
                    style={{ backgroundColor: "#222118" }}
                  ></span>
                  <span
                    className="text-base leading-relaxed"
                    style={{ color: "#1B1D1F" }}
                  >
                    Be likely to deceive any person;
                  </span>
                </li>
                <li className="flex items-start">
                  <span
                    className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0"
                    style={{ backgroundColor: "#222118" }}
                  ></span>
                  <span
                    className="text-base leading-relaxed"
                    style={{ color: "#1B1D1F" }}
                  >
                    Be made in breach of any legal duty owed to a third party,
                    such as a contractual duty or a duty of confidence;
                  </span>
                </li>
                <li className="flex items-start">
                  <span
                    className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0"
                    style={{ backgroundColor: "#222118" }}
                  ></span>
                  <span
                    className="text-base leading-relaxed"
                    style={{ color: "#1B1D1F" }}
                  >
                    Promote any illegal activity;
                  </span>
                </li>
                <li className="flex items-start">
                  <span
                    className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0"
                    style={{ backgroundColor: "#222118" }}
                  ></span>
                  <span
                    className="text-base leading-relaxed"
                    style={{ color: "#1B1D1F" }}
                  >
                    Be threatening, abuse or invade another&apos;s privacy, or
                    cause annoyance, inconvenience or needless anxiety;
                  </span>
                </li>
                <li className="flex items-start">
                  <span
                    className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0"
                    style={{ backgroundColor: "#222118" }}
                  ></span>
                  <span
                    className="text-base leading-relaxed"
                    style={{ color: "#1B1D1F" }}
                  >
                    Be likely to harass, upset, intimidate, embarrass, alarm or
                    annoy any other person;
                  </span>
                </li>
                <li className="flex items-start">
                  <span
                    className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0"
                    style={{ backgroundColor: "#222118" }}
                  ></span>
                  <span
                    className="text-base leading-relaxed"
                    style={{ color: "#1B1D1F" }}
                  >
                    Be used to impersonate any person, or to misrepresent your
                    identity or affiliation with any person;
                  </span>
                </li>
                <li className="flex items-start">
                  <span
                    className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0"
                    style={{ backgroundColor: "#222118" }}
                  ></span>
                  <span
                    className="text-base leading-relaxed"
                    style={{ color: "#1B1D1F" }}
                  >
                    Give the impression that they emanate from us, if this is
                    not the case;
                  </span>
                </li>
                <li className="flex items-start">
                  <span
                    className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0"
                    style={{ backgroundColor: "#222118" }}
                  ></span>
                  <span
                    className="text-base leading-relaxed"
                    style={{ color: "#1B1D1F" }}
                  >
                    Advocate, promote or assist any unlawful act such as (by way
                    of example only) copyright infringement or computer misuse;
                  </span>
                </li>
                <li className="flex items-start">
                  <span
                    className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0"
                    style={{ backgroundColor: "#222118" }}
                  ></span>
                  <span
                    className="text-base leading-relaxed"
                    style={{ color: "#1B1D1F" }}
                  >
                    Use any third-party intellectual property without prior
                    authorisation;
                  </span>
                </li>
                <li className="flex items-start">
                  <span
                    className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0"
                    style={{ backgroundColor: "#222118" }}
                  ></span>
                  <span
                    className="text-base leading-relaxed"
                    style={{ color: "#1B1D1F" }}
                  >
                    Use the website for political, propaganda or proselytising
                    purposes;
                  </span>
                </li>
                <li className="flex items-start">
                  <span
                    className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0"
                    style={{ backgroundColor: "#222118" }}
                  ></span>
                  <span
                    className="text-base leading-relaxed"
                    style={{ color: "#1B1D1F" }}
                  >
                    Divert the website from its intended purpose, including by
                    using it as a dating service;
                  </span>
                </li>
                <li className="flex items-start">
                  <span
                    className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0"
                    style={{ backgroundColor: "#222118" }}
                  ></span>
                  <span
                    className="text-base leading-relaxed"
                    style={{ color: "#1B1D1F" }}
                  >
                    Disseminate any information or content that may be upsetting
                    for minors;
                  </span>
                </li>
                <li className="flex items-start">
                  <span
                    className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0"
                    style={{ backgroundColor: "#222118" }}
                  ></span>
                  <span
                    className="text-base leading-relaxed"
                    style={{ color: "#1B1D1F" }}
                  >
                    Contain any content advertising or promoting any products
                    and/or services competing with the brand(s) displayed on the
                    website;
                  </span>
                </li>
                <li className="flex items-start">
                  <span
                    className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0"
                    style={{ backgroundColor: "#222118" }}
                  ></span>
                  <span
                    className="text-base leading-relaxed"
                    style={{ color: "#1B1D1F" }}
                  >
                    Disseminate any information that may directly or indirectly
                    allow the nominal and specific identification of an
                    individual without their prior and express consent, such as
                    their last name, postal address, email address, telephone
                    number.
                  </span>
                </li>
              </ul>
              <p
                className="text-base leading-relaxed"
                style={{ color: "#1B1D1F" }}
              >
                Please inform us of any User Content which appears contrary to
                applicable legislation in force and/or to accepted standards of
                morality and/or the Acceptable Standards set forth herein and/or
                which infringes the rights of others, at the following address:
                team@skinbestie.co.
              </p>
            </section>

            {/* Intellectual property */}
            <section id="intellectual-property">
              <h2
                className={`${anton.className} text-2xl lg:text-3xl font-normal uppercase mb-6`}
                style={{ color: "#222118" }}
              >
                Intellectual property
              </h2>
              <p
                className="text-base leading-relaxed mb-4"
                style={{ color: "#1B1D1F" }}
              >
                For any User Content that you upload or you post on the website,
                you grant SkinBestie a perpetual, irrevocable, worldwide,
                royalty-free, fully sub-licensable and transferable right and
                license to use, copy, modify, delete in its entirety, adapt,
                publish, translate, create derivative works from and distribute
                such content and/or incorporate such User Content together with
                your username/name and location into any form, medium or
                technology, including (but not limited to):
              </p>
              <ul className="space-y-3 ml-6 mb-4">
                <li className="flex items-start">
                  <span
                    className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0"
                    style={{ backgroundColor: "#222118" }}
                  ></span>
                  <span
                    className="text-base leading-relaxed"
                    style={{ color: "#1B1D1F" }}
                  >
                    On all electronic, IT, digital, multimedia and internet
                    media including SkinBestie websites, social media pages and
                    other online presences;
                  </span>
                </li>
                <li className="flex items-start">
                  <span
                    className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0"
                    style={{ backgroundColor: "#222118" }}
                  ></span>
                  <span
                    className="text-base leading-relaxed"
                    style={{ color: "#1B1D1F" }}
                  >
                    On all advertising media both online and offline;
                  </span>
                </li>
                <li className="flex items-start">
                  <span
                    className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0"
                    style={{ backgroundColor: "#222118" }}
                  ></span>
                  <span
                    className="text-base leading-relaxed"
                    style={{ color: "#1B1D1F" }}
                  >
                    On internal SkinBestie communications;
                  </span>
                </li>
                <li className="flex items-start">
                  <span
                    className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0"
                    style={{ backgroundColor: "#222118" }}
                  ></span>
                  <span
                    className="text-base leading-relaxed"
                    style={{ color: "#1B1D1F" }}
                  >
                    For corporate, financial communication and public relations
                    communications and disclosures;
                  </span>
                </li>
                <li className="flex items-start">
                  <span
                    className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0"
                    style={{ backgroundColor: "#222118" }}
                  ></span>
                  <span
                    className="text-base leading-relaxed"
                    style={{ color: "#1B1D1F" }}
                  >
                    On retailer-and client-facing media.
                  </span>
                </li>
              </ul>
              <p
                className="text-base leading-relaxed mb-4"
                style={{ color: "#1B1D1F" }}
              >
                Additionally, any User Content that you upload or post on the
                site must be your own sole authorship, and you must be the owner
                of the intellectual property rights of the content.
              </p>
              <p
                className="text-base leading-relaxed mb-4"
                style={{ color: "#1B1D1F" }}
              >
                You are hereby informed that said social networks are platforms
                owned by third parties and, accordingly, the circulation and use
                of User Content via said social networks shall be governed by
                the terms of use defined by said third parties. We can therefore
                not be held responsible for any use of the content by us or any
                third parties in accordance with the terms of use defined by the
                social networks, including without limitation, in terms of the
                scope and duration of licensed rights, and removal of the User
                Content. You shall be responsible for handling any third-party
                claims relating to the use of the User Content in accordance
                with the terms of use defined by the social networks.
              </p>
              <p
                className="text-base leading-relaxed mb-4"
                style={{ color: "#1B1D1F" }}
              >
                In addition, we hereby remind you that any User Content may be
                referenced on a search engine and therefore to be accessed by an
                audience outside the website.
              </p>
              <p
                className="text-base leading-relaxed mb-4"
                style={{ color: "#1B1D1F" }}
              >
                This authorisation allows us to adapt your User Content in order
                in any way we see fit including but not limited to regulatory
                compliance purposes whilst still respecting the original
                sentiment of the original User Content.
              </p>
              <p
                className="text-base leading-relaxed mb-4"
                style={{ color: "#1B1D1F" }}
              >
                Further, the use of User Content may come with such anonymised
                information as your city, country or age, and/or, if you
                expressly authorised it, information allowing your
                identification such as your first name, or your alias.
              </p>
              <p
                className="text-base leading-relaxed"
                style={{ color: "#1B1D1F" }}
              >
                You agree to indemnify and hold SkinBestie (and its officers,
                directors, agents, subsidiaries, joint ventures, employees and
                third-party service providers), harmless from all claims,
                demands, and damages (actual and consequential) of every kind
                and nature, known and unknown including reasonable lawyers&apos;
                fees, arising out of a breach of your representations and
                warranties set forth above, or your violation of any law or the
                rights of a third party.
              </p>
            </section>

            {/* Applicable Law and Jurisdiction */}
            <section id="applicable-law">
              <h2
                className={`${anton.className} text-2xl lg:text-3xl font-normal uppercase mb-6`}
                style={{ color: "#222118" }}
              >
                Applicable Law and Jurisdiction
              </h2>
              <p
                className="text-base leading-relaxed mb-4"
                style={{ color: "#1B1D1F" }}
              >
                The use of this website is subject to the laws of England, which
                shall exclusively govern the interpretation, application, and
                effect of all the above permissions, exclusions, licenses, and
                conditions of use. The courts of England shall have exclusive
                jurisdiction over all claims or disputes arising in relation to,
                out of, or in connection with this website and its use.
              </p>
              <p
                className="text-base leading-relaxed mb-4"
                style={{ color: "#1B1D1F" }}
              >
                These terms and conditions of use contain the entire agreement
                between you and us relating to the use of the website.
              </p>
              <p
                className="text-base leading-relaxed"
                style={{ color: "#1B1D1F" }}
              >
                To contact us, please email team@skinbestie.co. Thank you for
                visiting our website. SkinBestie
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
