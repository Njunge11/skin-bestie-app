"use client";

import React, { useState } from 'react';
import { anton } from '../fonts';

export default function TermsAndConditionsPage() {
  const [activeSection, setActiveSection] = useState('introduction');

  const sections = [
    { id: 'introduction', label: 'Introduction' },
    { id: 'who-we-are', label: 'Who we are and how to contact us' },
    { id: 'what-we-do', label: 'What we do (and what we don\'t do)' },
    { id: 'account-eligibility', label: 'Account, eligibility and your information' },
    { id: 'booking-payments', label: 'Booking & payments' },
    { id: 'changing-cancelling', label: 'Changing or cancelling your booking' },
    { id: 'coaching-calls', label: 'Coaching Calls on Zoom and recordings' },
    { id: 'personalised-routines', label: 'Personalised routines & third-party products' },
    { id: 'your-responsibilities', label: 'Your responsibilities' },
    { id: 'service-availability', label: 'Service availability and changes' },
    { id: 'intellectual-property', label: 'Intellectual property' },
    { id: 'communications', label: 'Communications' },
    { id: 'complaints', label: 'Complaints' },
    { id: 'our-responsibility', label: 'Our responsibility to you' },
    { id: 'events-outside-control', label: 'Events outside our control' },
    { id: 'personal-data', label: 'How we use your personal data' },
    { id: 'governing-law', label: 'Governing law and legal proceedings' },
    { id: 'other-terms', label: 'Other important terms' }
  ];

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFFBE7' }}>
      {/* Hero Section */}
      <div
        className="relative overflow-hidden"
        style={{
          background: 'radial-gradient(circle at 50% 50%, #F4E5A6 0%, #F3ECC7 100%)'
        }}
      >
        {/* Logo */}
        <div className="pt-8 px-4 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <a href="/" className="inline-block focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#222118] rounded transition-opacity hover:opacity-70" aria-label="Go to home page">
              <img
                src="/logo.svg"
                alt="SkinBestie Logo"
                className="object-contain h-6 lg:h-[24px] w-auto"
                style={{ filter: 'brightness(0) saturate(100%)' }}
              />
            </a>
          </div>
        </div>

        {/* Title */}
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-16 text-center">
          <h1 className={`${anton.className} text-5xl lg:text-6xl font-normal uppercase mb-6`} style={{ color: '#222118' }}>
            Terms and Conditions
          </h1>
        </div>

        {/* Curved Bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 30" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 0C240 20 480 30 720 30C960 30 1200 20 1440 0V30H0V0Z" fill="#FFFBE7"/>
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
                      ? 'border-black font-medium'
                      : 'border-transparent hover:border-gray-300'
                  }`}
                  style={{
                    color: '#222118'
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
              <p className="text-base leading-relaxed mb-4" style={{ color: '#1B1D1F' }}>
                These are the terms and conditions on which we provide online skincare coaching services to you. Please read them carefully before booking. By placing a booking or creating an account you agree to these terms.
              </p>
              <p className="text-base leading-relaxed" style={{ color: '#1B1D1F' }}>
                These terms sit alongside our other policies available on our website, including our <a href="/privacy-policy" className="underline hover:opacity-70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#222118] transition-opacity" style={{ color: '#222118' }}>Privacy Policy</a>, <a href="/terms-of-use" className="underline hover:opacity-70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#222118] transition-opacity" style={{ color: '#222118' }}>Terms of Use</a>, and Cookie Settings.
              </p>
            </section>

            {/* Who we are */}
            <section id="who-we-are">
              <h2 className={`${anton.className} text-2xl lg:text-3xl font-normal uppercase mb-6`} style={{ color: '#222118' }}>
                Who we are and how to contact us
              </h2>
              <p className="text-base leading-relaxed mb-4" style={{ color: '#1B1D1F' }}>
                SkinBestie is a trading name of Gentle Human Ltd, a company registered in England and Wales (company number 14448690). Registered office: Huckletree (Priory House) Limited, 6 Wrights Lane, London, W8 6TA.
              </p>
              <p className="text-base leading-relaxed mb-4" style={{ color: '#1B1D1F' }}>
                General enquiries: team@skinbestie.co and/or WhatsApp: +44 (0) 7507 646 467.
              </p>
              <p className="text-base leading-relaxed mb-4" style={{ color: '#1B1D1F' }}>
                Privacy enquiries (data protection/recordings): privacy@skinbestie.co.
              </p>
              <p className="text-base leading-relaxed" style={{ color: '#1B1D1F' }}>
                When we say "SkinBestie", "we", "us", or "our", we mean Gentle Human Ltd. When we say "you" or "your", we mean the person placing a booking or using our services. These Client Terms apply to our online skincare coaching services. Your use of the website is governed by our separate Terms of Use; our Privacy Policy explains how we handle your personal data.
              </p>
            </section>

            {/* What we do */}
            <section id="what-we-do">
              <h2 className={`${anton.className} text-2xl lg:text-3xl font-normal uppercase mb-6`} style={{ color: '#222118' }}>
                What we do (and what we don't do)
              </h2>
              <p className="text-base leading-relaxed mb-4" style={{ color: '#1B1D1F' }}>
                We provide online skincare coaching calls ("Coaching Calls") delivered by certified skincare coaches ("Coaches").
              </p>
              <p className="text-base leading-relaxed mb-4" style={{ color: '#1B1D1F' }}>
                <strong>Medical disclaimer:</strong> We do not provide medical advice. All content, recommendations, and routines we provide are for information only and are not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of a qualified healthcare provider with any questions regarding a medical condition. Never disregard or delay seeking professional medical advice because of something you hear or read via our services.
              </p>
              <p className="text-base leading-relaxed mb-4" style={{ color: '#1B1D1F' }}>
                We do not sell products. After a Coaching Call, your Coach may share links to third-party websites for you to purchase your products directly from them. We are not a party to those purchases and are not responsible for third-party products, websites, or their terms.
              </p>
              <p className="text-base leading-relaxed" style={{ color: '#1B1D1F' }}>
                If you experience an adverse reaction to any product, stop use immediately and inform your skincare coach.
              </p>
            </section>

            {/* Account eligibility */}
            <section id="account-eligibility">
              <h2 className={`${anton.className} text-2xl lg:text-3xl font-normal uppercase mb-6`} style={{ color: '#222118' }}>
                Account, eligibility and your information
              </h2>
              <p className="text-base leading-relaxed mb-4" style={{ color: '#1B1D1F' }}>
                You must be 18 years or older to book a Coaching Call. If you are under 18, a parent or legal guardian must book on your behalf and attend the Coaching Call with you.
              </p>
              <p className="text-base leading-relaxed mb-4" style={{ color: '#1B1D1F' }}>
                To activate your subscription and booking, you must provide the following information (all mandatory): name, email, phone number, birthdate, how you describe your skin type, your skin concerns, and any information you'd like your Coach to know, plus booking time and payment.
              </p>
              <p className="text-base leading-relaxed" style={{ color: '#1B1D1F' }}>
                You confirm that all information you provide is accurate, current, and complete. You agree to update your details if they change.
              </p>
            </section>

            {/* Booking & payments */}
            <section id="booking-payments">
              <h2 className={`${anton.className} text-2xl lg:text-3xl font-normal uppercase mb-6`} style={{ color: '#222118' }}>
                Booking & payments
              </h2>
              <p className="text-base leading-relaxed mb-4" style={{ color: '#1B1D1F' }}>
                Bookings are made via our scheduling tool (e.g., Calendly) and confirmed once payment is received (processed by Stripe). We may decline a booking and will notify you if this happens.
              </p>
              <p className="text-base leading-relaxed" style={{ color: '#1B1D1F' }}>
                Prices include VAT where applicable. You authorise Stripe to charge your chosen payment method for the amount shown at checkout and any agreed subscription renewals.
              </p>
            </section>

            {/* Changing or cancelling */}
            <section id="changing-cancelling">
              <h2 className={`${anton.className} text-2xl lg:text-3xl font-normal uppercase mb-6`} style={{ color: '#222118' }}>
                Changing or cancelling your booking
              </h2>
              <p className="text-base leading-relaxed mb-4" style={{ color: '#1B1D1F' }}>
                You may reschedule once free of charge if you give us at least 48 hours' notice. You can do this via your profile, by emailing team@skinbestie.co, or via WhatsApp.
              </p>
              <p className="text-base leading-relaxed mb-4" style={{ color: '#1B1D1F' }}>
                If you cancel or attempt to reschedule with less than 48 hours' notice, you will be charged in full for the scheduled Coaching Call.
              </p>
              <p className="text-base leading-relaxed mb-4" style={{ color: '#1B1D1F' }}>
                If you are more than 10 minutes late, the Coach may be unable to accommodate the session, and you will be charged in full. If you are late by less than 10 minutes, your session length may be reduced accordingly.
              </p>
              <p className="text-base leading-relaxed mb-4" style={{ color: '#1B1D1F' }}>
                If we cancel for reasons beyond our reasonable control, we will notify you and refund any amounts you have paid for services not yet provided.
              </p>
              <p className="text-base leading-relaxed" style={{ color: '#1B1D1F' }}>
                <strong>Refunds:</strong> Where a refund is due, we will refund you to your original payment method within 14 days of your request. If you purchased services that have already begun or been delivered, we may deduct a reasonable amount for services received up to the date you told us you wished to cancel.
              </p>
            </section>

            {/* Coaching Calls */}
            <section id="coaching-calls">
              <h2 className={`${anton.className} text-2xl lg:text-3xl font-normal uppercase mb-6`} style={{ color: '#222118' }}>
                Coaching Calls on Zoom and recordings
              </h2>
              <p className="text-base leading-relaxed mb-4" style={{ color: '#1B1D1F' }}>
                Coaching Calls are held via Zoom.
              </p>
              <p className="text-base leading-relaxed mb-4" style={{ color: '#1B1D1F' }}>
                <strong>Recording:</strong> We record Coaching Calls for service delivery, quality assurance, safeguarding, and to help prepare your personalised routine. Your Coach will inform you before the session starts. If you do not wish to be recorded, please tell us before your session so we can discuss alternatives (which may include re-booking or not proceeding).
              </p>
              <p className="text-base leading-relaxed mb-4" style={{ color: '#1B1D1F' }}>
                We may use recordings to train our Coaches and improve our services. We do not publish recordings publicly.
              </p>
              <p className="text-base leading-relaxed mb-4" style={{ color: '#1B1D1F' }}>
                <strong>Retention & access:</strong> Recordings are stored securely and accessible only to authorised personnel who need them for the purposes above. Retention period: 90 days.
              </p>
              <p className="text-base leading-relaxed" style={{ color: '#1B1D1F' }}>
                For how we handle personal data (including recordings), see our Privacy Policy.
              </p>
            </section>

            {/* Personalised routines */}
            <section id="personalised-routines">
              <h2 className={`${anton.className} text-2xl lg:text-3xl font-normal uppercase mb-6`} style={{ color: '#222118' }}>
                Personalised routines & third-party products
              </h2>
              <p className="text-base leading-relaxed mb-4" style={{ color: '#1B1D1F' }}>
                After your Coaching Call, your Coach will create a personalised routine based on your goals and information you share.
              </p>
              <p className="text-base leading-relaxed mb-4" style={{ color: '#1B1D1F' }}>
                Your Coach may send you links to third-party websites to purchase products. Those purchases are between you and the third party. Please review the third party's terms, privacy policy, and returns policy before buying.
              </p>
              <p className="text-base leading-relaxed" style={{ color: '#1B1D1F' }}>
                We make no guarantees that any routine or product will achieve a particular result and we are not liable for third-party products.
              </p>
            </section>

            {/* Your responsibilities */}
            <section id="your-responsibilities">
              <h2 className={`${anton.className} text-2xl lg:text-3xl font-normal uppercase mb-6`} style={{ color: '#222118' }}>
                Your responsibilities
              </h2>
              <ul className="space-y-3 ml-6 mb-4">
                <li className="flex items-start">
                  <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0" style={{ backgroundColor: '#222118' }}></span>
                  <span className="text-base leading-relaxed" style={{ color: '#1B1D1F' }}>
                    Participate in Coaching Calls in a considerate and lawful manner.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0" style={{ backgroundColor: '#222118' }}></span>
                  <span className="text-base leading-relaxed" style={{ color: '#1B1D1F' }}>
                    Share accurate, relevant information about your skin concerns and product history.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0" style={{ backgroundColor: '#222118' }}></span>
                  <span className="text-base leading-relaxed" style={{ color: '#1B1D1F' }}>
                    Disclose any known allergies, sensitivities, or contraindications relevant to skincare products.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0" style={{ backgroundColor: '#222118' }}></span>
                  <span className="text-base leading-relaxed" style={{ color: '#1B1D1F' }}>
                    Follow product instructions and discontinue use if irritation occurs.
                  </span>
                </li>
              </ul>
              <p className="text-base leading-relaxed" style={{ color: '#1B1D1F' }}>
                We may suspend or end a session if you act abusively, unlawfully, or in a way that risks harm to you, our Coaches, or others.
              </p>
            </section>

            {/* Service availability */}
            <section id="service-availability">
              <h2 className={`${anton.className} text-2xl lg:text-3xl font-normal uppercase mb-6`} style={{ color: '#222118' }}>
                Service availability and changes
              </h2>
              <p className="text-base leading-relaxed mb-4" style={{ color: '#1B1D1F' }}>
                Coaching Calls are subject to availability and may change to reflect updates in laws or our operational requirements.
              </p>
              <p className="text-base leading-relaxed" style={{ color: '#1B1D1F' }}>
                We may change these terms from time to time. Changes will not affect an existing paid booking unless we are required to make the change by law; we will notify you of material changes.
              </p>
            </section>

            {/* Intellectual property */}
            <section id="intellectual-property">
              <h2 className={`${anton.className} text-2xl lg:text-3xl font-normal uppercase mb-6`} style={{ color: '#222118' }}>
                Intellectual property
              </h2>
              <p className="text-base leading-relaxed mb-4" style={{ color: '#1B1D1F' }}>
                We (or our licensors) own all intellectual property in our website, branding, and materials. We grant you a personal, non-exclusive, non-transferable licence to use your personalised routine and any materials we provide for your personal use only.
              </p>
              <p className="text-base leading-relaxed" style={{ color: '#1B1D1F' }}>
                You must not copy, distribute, resell, or make commercial use of our materials without our prior written consent.
              </p>
            </section>

            {/* Communications */}
            <section id="communications">
              <h2 className={`${anton.className} text-2xl lg:text-3xl font-normal uppercase mb-6`} style={{ color: '#222118' }}>
                Communications
              </h2>
              <p className="text-base leading-relaxed mb-4" style={{ color: '#1B1D1F' }}>
                We will contact you using the methods you choose when creating your profile (e.g., your profile, email, SMS, or WhatsApp) for booking confirmations, reminders, service updates, and follow-ups.
              </p>
              <p className="text-base leading-relaxed mb-4" style={{ color: '#1B1D1F' }}>
                <strong>Marketing:</strong> We only send promotional emails/SMS/WhatsApp messages if you opt in. You can withdraw consent at any time via the unsubscribe link or by contacting us. Service-related messages will still be sent where necessary.
              </p>
              <p className="text-base leading-relaxed" style={{ color: '#1B1D1F' }}>
                You may contact us to make changes to your booking via your profile, by email, or via WhatsApp.
              </p>
            </section>

            {/* Complaints */}
            <section id="complaints">
              <h2 className={`${anton.className} text-2xl lg:text-3xl font-normal uppercase mb-6`} style={{ color: '#222118' }}>
                Complaints
              </h2>
              <p className="text-base leading-relaxed" style={{ color: '#1B1D1F' }}>
                If you are unhappy with our service, please contact team@skinbestie.co. We will acknowledge your complaint and aim to resolve it promptly.
              </p>
            </section>

            {/* Our responsibility */}
            <section id="our-responsibility">
              <h2 className={`${anton.className} text-2xl lg:text-3xl font-normal uppercase mb-6`} style={{ color: '#222118' }}>
                Our responsibility to you
              </h2>
              <p className="text-base leading-relaxed mb-4" style={{ color: '#1B1D1F' }}>
                Nothing in these terms excludes or limits our liability for death or personal injury caused by our negligence, fraud or fraudulent misrepresentation, or any other liability that cannot be excluded by law.
              </p>
              <p className="text-base leading-relaxed mb-4" style={{ color: '#1B1D1F' }}>
                We are not liable for losses that were not reasonably foreseeable to both parties when the contract was formed, business losses (including loss of profit, business, goodwill), or losses caused by third-party products or websites.
              </p>
              <p className="text-base leading-relaxed" style={{ color: '#1B1D1F' }}>
                Subject to the above, our total liability for any claims arising out of or in connection with the services will be limited to the amount you paid for the Coaching Call giving rise to the claim.
              </p>
            </section>

            {/* Events outside our control */}
            <section id="events-outside-control">
              <h2 className={`${anton.className} text-2xl lg:text-3xl font-normal uppercase mb-6`} style={{ color: '#222118' }}>
                Events outside our control
              </h2>
              <p className="text-base leading-relaxed" style={{ color: '#1B1D1F' }}>
                We are not liable for delays or failure to perform due to events beyond our reasonable control (for example, internet outages, platform downtime, illness, or changes in law). If such an event affects your booking, we will contact you and either reschedule or refund amounts paid for services not yet provided.
              </p>
            </section>

            {/* Personal data */}
            <section id="personal-data">
              <h2 className={`${anton.className} text-2xl lg:text-3xl font-normal uppercase mb-6`} style={{ color: '#222118' }}>
                How we use your personal data
              </h2>
              <p className="text-base leading-relaxed" style={{ color: '#1B1D1F' }}>
                Please see our <a href="/privacy-policy" className="underline hover:opacity-70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#222118] transition-opacity" style={{ color: '#222118' }}>Privacy Policy</a> for details on how we collect and use your personal data—including data shared during Coaching Calls and any recordings—and how to contact us at privacy@skinbestie.co to exercise your data protection rights.
              </p>
            </section>

            {/* Governing law */}
            <section id="governing-law">
              <h2 className={`${anton.className} text-2xl lg:text-3xl font-normal uppercase mb-6`} style={{ color: '#222118' }}>
                Governing law and where you can bring legal proceedings
              </h2>
              <p className="text-base leading-relaxed" style={{ color: '#1B1D1F' }}>
                These terms are governed by English law, and you can bring legal proceedings in the English courts. If you live in Scotland or Northern Ireland, you can bring legal proceedings in your local courts.
              </p>
            </section>

            {/* Other important terms */}
            <section id="other-terms">
              <h2 className={`${anton.className} text-2xl lg:text-3xl font-normal uppercase mb-6`} style={{ color: '#222118' }}>
                Other important terms
              </h2>
              <ul className="space-y-3 ml-6">
                <li className="flex items-start">
                  <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0" style={{ backgroundColor: '#222118' }}></span>
                  <span className="text-base leading-relaxed" style={{ color: '#1B1D1F' }}>
                    If a court finds part of these terms illegal, the rest will continue in force.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0" style={{ backgroundColor: '#222118' }}></span>
                  <span className="text-base leading-relaxed" style={{ color: '#1B1D1F' }}>
                    Even if we delay enforcing these terms, we can still enforce them later.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0" style={{ backgroundColor: '#222118' }}></span>
                  <span className="text-base leading-relaxed" style={{ color: '#1B1D1F' }}>
                    You may not transfer your rights under these terms to another person without our consent.
                  </span>
                </li>
              </ul>
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
