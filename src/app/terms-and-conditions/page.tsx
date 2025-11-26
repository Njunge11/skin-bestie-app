"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { anton } from "../fonts";

export default function TermsAndConditionsPage() {
  const [activeSection, setActiveSection] = useState("introduction");

  const sections = [
    { id: "introduction", label: "Introduction" },
    { id: "who-we-are", label: "Who we are and how to contact us" },
    { id: "what-we-do", label: "What we do (and what we don't do)" },
    {
      id: "account-eligibility",
      label: "Account, eligibility and your information",
    },
    { id: "your-subscription", label: "Your Subscription" },
    { id: "booking-payments", label: "Booking & payments" },
    { id: "changing-cancelling", label: "Changing or cancelling your booking" },
    {
      id: "coaching-calls-zoom",
      label: "Coaching Calls on Zoom and recordings",
    },
    {
      id: "personalised-routines",
      label: "Personalised routines & third‑party products",
    },
    { id: "your-responsibilities", label: "Your responsibilities" },
    { id: "service-availability", label: "Service availability and changes" },
    { id: "intellectual-property", label: "Intellectual property" },
    { id: "communications", label: "Communications" },
    { id: "complaints", label: "Complaints" },
    { id: "our-responsibility", label: "Our responsibility to you" },
    { id: "events-outside-control", label: "Events outside our control" },
    { id: "personal-data", label: "How we use your personal data" },
    {
      id: "governing-law",
      label: "Governing law and where you can bring legal proceedings",
    },
    { id: "other-terms", label: "Other important terms" },
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
            Terms and Conditions
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
          <main className="lg:col-span-3">
            <div className="prose prose-lg max-w-none">
              {/* Introduction */}
              <section id="introduction" className="mb-12">
                <h2
                  className="text-2xl font-bold mb-4"
                  style={{ color: "#222118" }}
                >
                  Introduction
                </h2>
                <p className="mb-4" style={{ color: "#222118" }}>
                  These are the terms and conditions on which we provide online
                  skincare coaching services to you. Please read them carefully
                  before booking. By placing a booking or creating an account
                  you agree to these terms.
                </p>
                <p className="mb-4" style={{ color: "#222118" }}>
                  These terms sit alongside our other policies available on our
                  website, including our Privacy Policy, Terms of Use, and
                  Cookie Settings.
                </p>
              </section>

              {/* Who we are */}
              <section id="who-we-are" className="mb-12">
                <h2
                  className="text-2xl font-bold mb-4"
                  style={{ color: "#222118" }}
                >
                  Who we are and how to contact us
                </h2>
                <p className="mb-4" style={{ color: "#222118" }}>
                  SkinBestie is a trading name of Gentle Human Ltd, a company
                  registered in England and Wales (company number 14448690).
                  Registered office: Huckletree (Priory House) Limited, 6
                  Wrights Lane, London, W8 6TA.
                </p>
                <p className="mb-4" style={{ color: "#222118" }}>
                  General enquiries: team@skinbestie.co and/or WhatsApp: +44 (0)
                  7507 646 467.
                </p>
                <p className="mb-4" style={{ color: "#222118" }}>
                  Privacy enquiries (data protection/recordings):
                  privacy@skinbestie.co.
                </p>
                <p className="mb-4" style={{ color: "#222118" }}>
                  When we say &quot;SkinBestie&quot;, &quot;we&quot;,
                  &quot;us&quot;, or &quot;our&quot;, we mean Gentle Human Ltd.
                  When we say &quot;you&quot; or &quot;your&quot;, we mean the
                  person placing a booking or using our services.
                </p>
                <p className="mb-4" style={{ color: "#222118" }}>
                  These Client Terms apply to our online skincare coaching
                  services. Your use of the website is governed by our separate
                  Terms of Use; our Privacy Policy explains how we handle your
                  personal data.
                </p>
              </section>

              {/* What we do */}
              <section id="what-we-do" className="mb-12">
                <h2
                  className="text-2xl font-bold mb-4"
                  style={{ color: "#222118" }}
                >
                  What we do (and what we don&apos;t do)
                </h2>
                <p className="mb-4" style={{ color: "#222118" }}>
                  We provide online skincare coaching calls (&quot;Coaching
                  Calls&quot;) delivered by certified skincare coaches
                  (&quot;Coaches&quot;).
                </p>
                <p className="mb-4" style={{ color: "#222118" }}>
                  Medical disclaimer: We do not provide medical advice. All
                  content, recommendations, and routines we provide are for
                  information only and are not a substitute for professional
                  medical advice, diagnosis, or treatment. Always seek the
                  advice of a qualified healthcare provider with any questions
                  regarding a medical condition. Never disregard or delay
                  seeking professional medical advice because of something you
                  hear or read via our services.
                </p>
                <p className="mb-4" style={{ color: "#222118" }}>
                  We do not sell products. After a Coaching Call, your Coach may
                  share links to third‑party websites for you to purchase your
                  products directly from them. We are not a party to those
                  purchases and are not responsible for third‑party products,
                  websites, or their terms.
                </p>
                <p className="mb-4" style={{ color: "#222118" }}>
                  If you experience an adverse reaction to any product, stop use
                  immediately and inform your skincare coach.
                </p>
              </section>

              {/* Account, eligibility */}
              <section id="account-eligibility" className="mb-12">
                <h2
                  className="text-2xl font-bold mb-4"
                  style={{ color: "#222118" }}
                >
                  Account, eligibility and your information
                </h2>
                <p className="mb-4" style={{ color: "#222118" }}>
                  You must be 18 years or older to book a Coaching Call. If you
                  are under 18, a parent or legal guardian must book on your
                  behalf and attend the Coaching Call with you.
                </p>
                <p className="mb-4" style={{ color: "#222118" }}>
                  To activate your subscription and booking, you must provide
                  the following information (all mandatory): name, email, phone
                  number, birthdate, how you describe your skin type, your skin
                  concerns, and any information you&apos;d like your Coach to
                  know, plus booking time and payment.
                </p>
                <p className="mb-4" style={{ color: "#222118" }}>
                  You confirm that all information you provide is accurate,
                  current, and complete. You agree to update your details if
                  they change.
                </p>
              </section>

              {/* Your Subscription */}
              <section id="your-subscription" className="mb-12">
                <h2
                  className="text-2xl font-bold mb-4"
                  style={{ color: "#222118" }}
                >
                  Your Subscription
                </h2>
                <p className="mb-4" style={{ color: "#222118" }}>
                  You can access our services by purchasing a recurring
                  subscription (your &quot;Subscription&quot;). Your
                  Subscription gives you:
                </p>
                <ul
                  className="list-disc pl-6 mb-4"
                  style={{ color: "#222118" }}
                >
                  <li>one Coaching Call per monthly billing period; and</li>
                  <li>
                    access to Subscriber-only resources and any community
                    features we make available from time to time.
                  </li>
                </ul>
                <p className="mb-4" style={{ color: "#222118" }}>
                  Details of what is included, the price, and the start date of
                  your Subscription will be shown on our website and at checkout
                  before you confirm your purchase. This information forms part
                  of these terms, so please read it carefully before you
                  subscribe.
                </p>

                <h3
                  className="text-xl font-semibold mb-3 mt-6"
                  style={{ color: "#222118" }}
                >
                  Rolling contract and auto-renewal
                </h3>
                <p className="mb-4" style={{ color: "#222118" }}>
                  Your Subscription is a rolling monthly contract. By starting a
                  Subscription, you agree that:
                </p>
                <ul
                  className="list-disc pl-6 mb-4"
                  style={{ color: "#222118" }}
                >
                  <li>
                    we will continue to provide the services included in your
                    Subscription on a month-to-month basis; and
                  </li>
                  <li>
                    your Subscription will automatically renew each month, and
                    we will continue to take payment unless and until you cancel
                    or pause in line with these terms.
                  </li>
                </ul>

                <h3
                  className="text-xl font-semibold mb-3 mt-6"
                  style={{ color: "#222118" }}
                >
                  Subscription payments
                </h3>
                <p className="mb-4" style={{ color: "#222118" }}>
                  Subscription payments are taken monthly in advance. You
                  authorise Stripe (or any replacement payment provider we may
                  use) to take monthly payments using your chosen payment method
                  for:
                </p>
                <ul
                  className="list-disc pl-6 mb-4"
                  style={{ color: "#222118" }}
                >
                  <li>
                    your first month&apos;s Subscription fee when you sign up;
                    and
                  </li>
                  <li>
                    subsequent monthly renewals, until you cancel or pause.
                  </li>
                </ul>
                <p className="mb-4" style={{ color: "#222118" }}>
                  Prices include VAT where applicable. If we change the price of
                  your Subscription, we will give you reasonable notice
                  (normally at least 30 days) by email or another appropriate
                  method. If you do not wish to continue at the new price, you
                  can cancel your Subscription before the change takes effect.
                </p>

                <h3
                  className="text-xl font-semibold mb-3 mt-6"
                  style={{ color: "#222118" }}
                >
                  Cooling-off period (online/phone sales)
                </h3>
                <p className="mb-4" style={{ color: "#222118" }}>
                  If you are a consumer in the UK or EEA and you buy your
                  Subscription online or by phone, you may have a legal right to
                  change your mind within 14 days of first subscribing and
                  receive a refund. When you subscribe, you can ask us to start
                  providing services straight away (for example, by booking your
                  first Coaching Call or accessing Subscriber-only resources).
                  If you exercise your right to change your mind within the
                  14-day period:
                </p>
                <ul
                  className="list-disc pl-6 mb-4"
                  style={{ color: "#222118" }}
                >
                  <li>
                    we will refund your Subscription fee, minus a reasonable
                    amount for the services you have already received (such as
                    any Coaching Call you have attended or resources you have
                    accessed); and
                  </li>
                  <li>
                    if we have fully completed the services for that first month
                    within the 14-day period (for example, you have already
                    taken your Coaching Call and used the Subscription services
                    for the month), you may lose your right to change your mind,
                    and we may not be able to offer a refund.
                  </li>
                </ul>

                <h3
                  className="text-xl font-semibold mb-3 mt-6"
                  style={{ color: "#222118" }}
                >
                  Using your monthly Coaching Call and no roll-over
                </h3>
                <p className="mb-4" style={{ color: "#222118" }}>
                  Your Subscription entitles you to one Coaching Call per
                  monthly billing period. You must book and attend that Coaching
                  Call within the same billing period; unused Coaching Calls do
                  not roll over to future months and are non-refundable, unless
                  we are required to provide a refund by law or under these
                  terms.
                </p>

                <h3
                  className="text-xl font-semibold mb-3 mt-6"
                  style={{ color: "#222118" }}
                >
                  Cancelling your Subscription after the cooling-off period
                </h3>
                <p className="mb-4" style={{ color: "#222118" }}>
                  After the 14-day cooling-off period, you can still cancel your
                  Subscription at any time:
                </p>
                <ul
                  className="list-disc pl-6 mb-4"
                  style={{ color: "#222118" }}
                >
                  <li>via your online account; or</li>
                  <li>by emailing us at team@skinbestie.co; or</li>
                  <li>by contracting us via WhatsApp +44 (0) 7507 646 467</li>
                </ul>
                <p className="mb-4" style={{ color: "#222118" }}>
                  Unless we agree otherwise with you in writing, cancellation
                  will take effect at the end of your current monthly billing
                  period. You will continue to have access to your Subscription
                  (including the ability to book any remaining Coaching Call for
                  that month) until then. We do not normally provide refunds for
                  a month that has already started, except where:
                </p>
                <ul
                  className="list-disc pl-6 mb-4"
                  style={{ color: "#222118" }}
                >
                  <li>we are required to do so by law; or</li>
                  <li>
                    we have materially failed to provide the Subscription
                    services to you
                  </li>
                </ul>

                <h3
                  className="text-xl font-semibold mb-3 mt-6"
                  style={{ color: "#222118" }}
                >
                  Pausing or changing your Subscription
                </h3>
                <p className="mb-4" style={{ color: "#222118" }}>
                  We may from time to time offer options to pause, upgrade or
                  downgrade your Subscription. Where available, the rules for
                  pausing or changing your Subscription will be explained on our
                  website or at checkout or in you online account and may vary
                  by offer. Any change to your Subscription may affect the price
                  you pay from your next billing period.
                </p>

                <h3
                  className="text-xl font-semibold mb-3 mt-6"
                  style={{ color: "#222118" }}
                >
                  Ending your Subscription by us
                </h3>
                <p className="mb-4" style={{ color: "#222118" }}>
                  We may suspend or end your Subscription (and any future
                  Coaching Calls) if:
                </p>
                <ul
                  className="list-disc pl-6 mb-4"
                  style={{ color: "#222118" }}
                >
                  <li>
                    you do not make a payment when it is due and still do not
                    make payment within 14 days after we remind you;
                  </li>
                  <li>
                    you do not, within a reasonable time of us asking, provide
                    information we need in order to deliver the services;
                  </li>
                  <li>
                    you misuse your account or our services, act abusively,
                    unlawfully, or in a way that risks harm to you, our Coaches,
                    or others; or
                  </li>
                  <li>
                    we reasonably believe that it is no longer appropriate or
                    safe to continue providing services to you.
                  </li>
                </ul>
                <p className="mb-4" style={{ color: "#222118" }}>
                  If we end your Subscription for one of the reasons above, we
                  may deduct or charge a reasonable amount to cover services
                  already provided and our costs, in line with applicable
                  consumer laws
                </p>

                <h3
                  className="text-xl font-semibold mb-3 mt-6"
                  style={{ color: "#222118" }}
                >
                  Subscription and your personal data
                </h3>
                <p className="mb-4" style={{ color: "#222118" }}>
                  We use your personal data (for example, your contact details,
                  payment information, and information about your skin concerns)
                  to manage your Subscription and deliver Coaching Calls,
                  resources, and community features. For details of how we
                  collect, use, store, and share your personal data—including
                  recordings—please see our Privacy Policy.
                </p>
                <p className="mb-4" style={{ color: "#222118" }}>
                  Opting out of marketing emails or messages does not cancel
                  your Subscription. To stop monthly payments, you must cancel
                  your Subscription as described above.
                </p>
              </section>

              {/* Booking & payments */}
              <section id="booking-payments" className="mb-12">
                <h2
                  className="text-2xl font-bold mb-4"
                  style={{ color: "#222118" }}
                >
                  Booking & payments
                </h2>
                <p className="mb-4" style={{ color: "#222118" }}>
                  Bookings are made via our scheduling tool (e.g., Calendly) and
                  confirmed once payment is received (processed by Stripe). We
                  may decline a booking and will notify you if this happens.
                </p>
                <p className="mb-4" style={{ color: "#222118" }}>
                  Prices include VAT where applicable. You authorise Stripe to
                  charge your chosen payment method for the amount shown at
                  checkout and any agreed subscription renewals.
                </p>
              </section>

              {/* Changing or cancelling */}
              <section id="changing-cancelling" className="mb-12">
                <h2
                  className="text-2xl font-bold mb-4"
                  style={{ color: "#222118" }}
                >
                  Changing or cancelling your booking (Coaching Calls)
                </h2>

                <h3
                  className="text-xl font-semibold mb-3 mt-6"
                  style={{ color: "#222118" }}
                >
                  Rescheduling a Coaching Call
                </h3>
                <p className="mb-4" style={{ color: "#222118" }}>
                  You may reschedule a Coaching Call (whether booked under a
                  Subscription or as a standalone service, if we offer that)
                  once free of charge if you give us at least 24 hours&apos;
                  notice before the scheduled start time. You can do this:
                </p>
                <ul
                  className="list-disc pl-6 mb-4"
                  style={{ color: "#222118" }}
                >
                  <li>via your online profile;</li>
                  <li>by emailing team@skinbestie.co; or</li>
                  <li>by contacting us via WhatsApp +44 (0) 7507 646 467</li>
                </ul>

                <h3
                  className="text-xl font-semibold mb-3 mt-6"
                  style={{ color: "#222118" }}
                >
                  Late cancellations and no-shows
                </h3>
                <p className="mb-4" style={{ color: "#222118" }}>
                  If you cancel or attempt to reschedule with less than 24
                  hours&apos; notice, or you do not attend your Coaching Call:
                </p>
                <ul
                  className="list-disc pl-6 mb-4"
                  style={{ color: "#222118" }}
                >
                  <li>we may treat that Coaching Call as used; and</li>
                  <li>
                    we will not usually refund the fee for that session or
                    re-credit it to your Subscription, unless we are required to
                    do so by law.
                  </li>
                </ul>
                <p className="mb-4" style={{ color: "#222118" }}>
                  If you are more than 10 minutes late to your Coaching Call,
                  the Coach may be unable to accommodate the session, and it may
                  be treated as used. If you are less than 10 minutes late, we
                  will do our best to proceed, but your session time may be
                  reduced and will still count as one full Coaching Call for
                  that month.
                </p>

                <h3
                  className="text-xl font-semibold mb-3 mt-6"
                  style={{ color: "#222118" }}
                >
                  If we need to change or cancel a Coaching Call
                </h3>
                <p className="mb-4" style={{ color: "#222118" }}>
                  If we need to reschedule or cancel a Coaching Call for reasons
                  beyond our reasonable control (for example, illness,
                  technology failures, or other events outside our control), we
                  will:
                </p>
                <ul
                  className="list-disc pl-6 mb-4"
                  style={{ color: "#222118" }}
                >
                  <li>give you as much notice as we reasonably can; and</li>
                  <li>
                    offer you either:
                    <ul className="list-disc pl-6 mt-2">
                      <li>a rescheduled Coaching Call; or</li>
                      <li>
                        a credit of that Coaching Call back to your
                        Subscription; or
                      </li>
                      <li>
                        where rescheduling is not reasonably possible, a refund
                        of a reasonable proportion of the amount you paid
                        relating to that Coaching Call.
                      </li>
                    </ul>
                  </li>
                </ul>

                <h3
                  className="text-xl font-semibold mb-3 mt-6"
                  style={{ color: "#222118" }}
                >
                  Cancelling your Subscription vs cancelling a booking
                </h3>
                <p className="mb-4" style={{ color: "#222118" }}>
                  Cancelling or missing an individual Coaching Call does not
                  automatically cancel your Subscription. To stop monthly
                  payments, you must cancel your Subscription as explained in
                  the &quot;Your subscription&quot; section.
                </p>
                <p className="mb-4" style={{ color: "#222118" }}>
                  Opting out of marketing communications also does not cancel
                  your Subscription or any Coaching Call bookings.
                </p>

                <h3
                  className="text-xl font-semibold mb-3 mt-6"
                  style={{ color: "#222118" }}
                >
                  Refunds
                </h3>
                <p className="mb-4" style={{ color: "#222118" }}>
                  Where a refund is due under these terms or under applicable
                  law, we will refund you to your original payment method within
                  14 days of confirming that a refund is payable.
                </p>
                <p className="mb-4" style={{ color: "#222118" }}>
                  If you have already received some services (for example, a
                  Coaching Call or access to Subscriber-only content), we may
                  deduct a reasonable amount to reflect the value of the
                  services you have already received up to the date you told us
                  you wished to cancel, as permitted by law
                </p>
              </section>

              {/* Coaching Calls on Zoom */}
              <section id="coaching-calls-zoom" className="mb-12">
                <h2
                  className="text-2xl font-bold mb-4"
                  style={{ color: "#222118" }}
                >
                  Coaching Calls on Zoom and recordings
                </h2>
                <p className="mb-4" style={{ color: "#222118" }}>
                  Coaching Calls are held via Zoom.
                </p>
                <p className="mb-4" style={{ color: "#222118" }}>
                  Recording: We record Coaching Calls for service delivery,
                  quality assurance, safeguarding, and to help prepare your
                  personalised routine. Your Coach will inform you before the
                  session starts. If you do not wish to be recorded, please tell
                  us before your session so we can discuss alternatives (which
                  may include re‑booking or not proceeding).
                </p>
                <p className="mb-4" style={{ color: "#222118" }}>
                  We may use recordings to train our Coaches and improve our
                  services. We do not publish recordings publicly.
                </p>
                <p className="mb-4" style={{ color: "#222118" }}>
                  Retention & access: Recordings are stored securely and
                  accessible only to authorised personnel who need them for the
                  purposes above. Retention period: 90 days.
                </p>
                <p className="mb-4" style={{ color: "#222118" }}>
                  For how we handle personal data (including recordings), see
                  our Privacy Policy.
                </p>
              </section>

              {/* Personalised routines */}
              <section id="personalised-routines" className="mb-12">
                <h2
                  className="text-2xl font-bold mb-4"
                  style={{ color: "#222118" }}
                >
                  Personalised routines & third‑party products
                </h2>
                <p className="mb-4" style={{ color: "#222118" }}>
                  After your Coaching Call, your Coach will create a
                  personalised routine based on your goals and information you
                  share.
                </p>
                <p className="mb-4" style={{ color: "#222118" }}>
                  Your Coach may send you links to third‑party websites to
                  purchase products. Those purchases are between you and the
                  third party. Please review the third party&apos;s terms,
                  privacy policy, and returns policy before buying.
                </p>
                <p className="mb-4" style={{ color: "#222118" }}>
                  We make no guarantees that any routine or product will achieve
                  a particular result and we are not liable for third‑party
                  products.
                </p>
              </section>

              {/* Your responsibilities */}
              <section id="your-responsibilities" className="mb-12">
                <h2
                  className="text-2xl font-bold mb-4"
                  style={{ color: "#222118" }}
                >
                  Your responsibilities
                </h2>
                <ul
                  className="list-disc pl-6 mb-4"
                  style={{ color: "#222118" }}
                >
                  <li>
                    Participate in Coaching Calls in a considerate and lawful
                    manner.
                  </li>
                  <li>
                    Share accurate, relevant information about your skin
                    concerns and product history.
                  </li>
                  <li>
                    Disclose any known allergies, sensitivities, or
                    contraindications relevant to skincare products.
                  </li>
                  <li>
                    Follow product instructions and discontinue use if
                    irritation occurs.
                  </li>
                </ul>
                <p className="mb-4" style={{ color: "#222118" }}>
                  We may suspend or end a session if you act abusively,
                  unlawfully, or in a way that risks harm to you, our Coaches,
                  or others.
                </p>
              </section>

              {/* Service availability */}
              <section id="service-availability" className="mb-12">
                <h2
                  className="text-2xl font-bold mb-4"
                  style={{ color: "#222118" }}
                >
                  Service availability and changes
                </h2>
                <p className="mb-4" style={{ color: "#222118" }}>
                  Coaching Calls are subject to availability and may change to
                  reflect updates in laws or our operational requirements.
                </p>
                <p className="mb-4" style={{ color: "#222118" }}>
                  We may change these terms from time to time. Changes will not
                  affect an existing paid booking unless we are required to make
                  the change by law; we will notify you of material changes.
                </p>
              </section>

              {/* Intellectual property */}
              <section id="intellectual-property" className="mb-12">
                <h2
                  className="text-2xl font-bold mb-4"
                  style={{ color: "#222118" }}
                >
                  Intellectual property
                </h2>
                <p className="mb-4" style={{ color: "#222118" }}>
                  We (or our licensors) own all intellectual property in our
                  website, branding, and materials. We grant you a personal,
                  non‑exclusive, non‑transferable licence to use your
                  personalised routine and any materials we provide for your
                  personal use only.
                </p>
                <p className="mb-4" style={{ color: "#222118" }}>
                  You must not copy, distribute, resell, or make commercial use
                  of our materials without our prior written consent.
                </p>
              </section>

              {/* Communications */}
              <section id="communications" className="mb-12">
                <h2
                  className="text-2xl font-bold mb-4"
                  style={{ color: "#222118" }}
                >
                  Communications
                </h2>
                <p className="mb-4" style={{ color: "#222118" }}>
                  We will contact you using the methods you choose when creating
                  your profile (e.g., your profile, email, SMS, or WhatsApp) for
                  booking confirmations, reminders, service updates, and
                  follow‑ups.
                </p>
                <p className="mb-4" style={{ color: "#222118" }}>
                  Marketing: We only send promotional emails/SMS/WhatsApp
                  messages if you opt in. You can withdraw consent at any time
                  via the unsubscribe link or by contacting us. Service‑related
                  messages will still be sent where necessary.
                </p>
                <p className="mb-4" style={{ color: "#222118" }}>
                  You may contact us to make changes to your booking via your
                  profile, by email, or via WhatsApp.
                </p>
              </section>

              {/* Complaints */}
              <section id="complaints" className="mb-12">
                <h2
                  className="text-2xl font-bold mb-4"
                  style={{ color: "#222118" }}
                >
                  Complaints
                </h2>
                <p className="mb-4" style={{ color: "#222118" }}>
                  If you are unhappy with our service, please contact
                  team@skinbestie.co. We will acknowledge your complaint and aim
                  to resolve it promptly.
                </p>
              </section>

              {/* Our responsibility */}
              <section id="our-responsibility" className="mb-12">
                <h2
                  className="text-2xl font-bold mb-4"
                  style={{ color: "#222118" }}
                >
                  Our responsibility to you
                </h2>
                <p className="mb-4" style={{ color: "#222118" }}>
                  Nothing in these terms excludes or limits our liability for
                  death or personal injury caused by our negligence, fraud or
                  fraudulent misrepresentation, or any other liability that
                  cannot be excluded by law.
                </p>
                <p className="mb-4" style={{ color: "#222118" }}>
                  We are not liable for losses that were not reasonably
                  foreseeable to both parties when the contract was formed,
                  business losses (including loss of profit, business,
                  goodwill), or losses caused by third‑party products or
                  websites.
                </p>
                <p className="mb-4" style={{ color: "#222118" }}>
                  Subject to the above, our total liability for any claims
                  arising out of or in connection with the services will be
                  limited to the amount you paid for the Coaching Call giving
                  rise to the claim.
                </p>
              </section>

              {/* Events outside our control */}
              <section id="events-outside-control" className="mb-12">
                <h2
                  className="text-2xl font-bold mb-4"
                  style={{ color: "#222118" }}
                >
                  Events outside our control
                </h2>
                <p className="mb-4" style={{ color: "#222118" }}>
                  We are not liable for delays or failure to perform due to
                  events beyond our reasonable control (for example, internet
                  outages, platform downtime, illness, or changes in law). If
                  such an event affects your booking, we will contact you and
                  either reschedule or refund amounts paid for services not yet
                  provided.
                </p>
              </section>

              {/* How we use your personal data */}
              <section id="personal-data" className="mb-12">
                <h2
                  className="text-2xl font-bold mb-4"
                  style={{ color: "#222118" }}
                >
                  How we use your personal data
                </h2>
                <p className="mb-4" style={{ color: "#222118" }}>
                  Please see our Privacy Policy for details on how we collect
                  and use your personal data—including data shared during
                  Coaching Calls and any recordings—and how to contact us at
                  privacy@skinbestie.co to exercise your data protection rights.
                </p>
              </section>

              {/* Governing law */}
              <section id="governing-law" className="mb-12">
                <h2
                  className="text-2xl font-bold mb-4"
                  style={{ color: "#222118" }}
                >
                  Governing law and where you can bring legal proceedings
                </h2>
                <p className="mb-4" style={{ color: "#222118" }}>
                  These terms are governed by English law, and you can bring
                  legal proceedings in the English courts. If you live in
                  Scotland or Northern Ireland, you can bring legal proceedings
                  in your local courts.
                </p>
              </section>

              {/* Other important terms */}
              <section id="other-terms" className="mb-12">
                <h2
                  className="text-2xl font-bold mb-4"
                  style={{ color: "#222118" }}
                >
                  Other important terms
                </h2>
                <p className="mb-4" style={{ color: "#222118" }}>
                  If a court finds part of these terms illegal, the rest will
                  continue in force.
                </p>
                <p className="mb-4" style={{ color: "#222118" }}>
                  Even if we delay enforcing these terms, we can still enforce
                  them later.
                </p>
                <p className="mb-4" style={{ color: "#222118" }}>
                  You may not transfer your rights under these terms to another
                  person without our consent.
                </p>
              </section>
            </div>
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
