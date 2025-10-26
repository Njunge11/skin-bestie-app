"use client";

import React, { useState } from 'react';
import { anton } from '../fonts';

export default function PrivacyPolicyPage() {
  const [activeSection, setActiveSection] = useState('important-info');

  const sections = [
    { id: 'important-info', label: 'Important information and who we are' },
    { id: 'info-collect', label: 'Information we collect' },
    { id: 'how-collected', label: 'How is your personal data collected?' },
    { id: 'how-we-use', label: 'How we use your personal data' },
    { id: 'how-we-share', label: 'How we share your information' },
    { id: 'international-transfers', label: 'International data transfers' },
    { id: 'data-security', label: 'Data security' },
    { id: 'data-retention', label: 'Data retention' },
    { id: 'your-rights', label: 'Your rights' },
    { id: 'cookies', label: 'Cookies' },
    { id: 'children', label: "Children's privacy" },
    { id: 'changes', label: 'Changes to this Privacy Policy' },
    { id: 'contact', label: 'Contact Information' },
    { id: 'third-party', label: 'Third party links' }
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
            Privacy Policy
          </h1>
          <p className="text-lg font-medium" style={{ color: '#1B1D1F' }}>Last Updated: October 2025</p>
        </div>

        {/* Curved Bottom - Less curved */}
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
            {/* Important information and who we are */}
            <section id="important-info">
              <h2 className={`${anton.className} text-2xl lg:text-3xl font-normal uppercase mb-6`} style={{ color: '#222118' }}>
                1. Important information and who we are
              </h2>
              <p className="text-base leading-relaxed mb-4" style={{ color: '#1B1D1F' }}>
                Gentle Human T/A SkinBestie is the controller and responsible for your personal data (referred to as "SkinBestie", "we", "us" or "our"). We are registered in England and Wales under company number 14448690 and have our registered office at Huckletree (Priory House) Limited, 6 Wrights Lane, London, W8 6TA.
              </p>
              <p className="text-base leading-relaxed mb-4" style={{ color: '#1B1D1F' }}>
                At SkinBestie, we are committed to protecting and respecting your privacy. Please read this privacy policy carefully as it contains important information on who we are and how and why we collect, use, and safeguard your personal data when you use our virtual skin coaching services and website. Please note that we are not medical professionals, and our services do not constitute medical advice.
              </p>
              <p className="text-base leading-relaxed mb-4" style={{ color: '#1B1D1F' }}>
                When we collect and process your personal data, we are subject to the UK General Data Protection Regulation (UK GDPR). We are also subject to the EU General Data Protection Regulation (EU GDPR) in relation to any services we provide to individuals in the European Economic Area (EEA).
              </p>
              <p className="text-base leading-relaxed" style={{ color: '#1B1D1F' }}>
                This privacy policy gives you information about how SkinBestie collects and uses your personal data through your use of this website, including any data you may provide when you register with us, sign up to our marketing communications, use our virtual skin coaching services, purchase a product or service, or take part in a competition.
              </p>
            </section>

            {/* Information we collect */}
            <section id="info-collect">
              <h2 className={`${anton.className} text-2xl lg:text-3xl font-normal uppercase mb-6`} style={{ color: '#222118' }}>
                2. Information we collect
              </h2>
              <p className="text-base leading-relaxed mb-4" style={{ color: '#1B1D1F' }}>
                We may collect, use, store, and transfer the following types of personal data:
              </p>
              <ul className="space-y-3 ml-6 mb-6">
                <li className="flex items-start">
                  <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0" style={{ backgroundColor: '#222118' }}></span>
                  <span className="text-base leading-relaxed" style={{ color: '#1B1D1F' }}>
                    <strong>Identity Data:</strong> Name, username, date of birth, gender.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0" style={{ backgroundColor: '#222118' }}></span>
                  <span className="text-base leading-relaxed" style={{ color: '#1B1D1F' }}>
                    <strong>Contact Data:</strong> Email address, telephone number, home address.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0" style={{ backgroundColor: '#222118' }}></span>
                  <span className="text-base leading-relaxed" style={{ color: '#1B1D1F' }}>
                    <strong>Skin Information:</strong> Details related to your skin concerns, skincare routine, photos of your skin (if voluntarily provided), and any relevant lifestyle information.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0" style={{ backgroundColor: '#222118' }}></span>
                  <span className="text-base leading-relaxed" style={{ color: '#1B1D1F' }}>
                    <strong>Technical Data:</strong> IP address, browser type, time zone settings, and usage data.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0" style={{ backgroundColor: '#222118' }}></span>
                  <span className="text-base leading-relaxed" style={{ color: '#1B1D1F' }}>
                    <strong>Profile Data:</strong> Includes your account password, purchases or orders made by you, your interests, preferences, feedback and survey responses.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0" style={{ backgroundColor: '#222118' }}></span>
                  <span className="text-base leading-relaxed" style={{ color: '#1B1D1F' }}>
                    <strong>Financial Data:</strong> Payment card details or other financial information necessary to process payments.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0" style={{ backgroundColor: '#222118' }}></span>
                  <span className="text-base leading-relaxed" style={{ color: '#1B1D1F' }}>
                    <strong>Marketing and Communications Data:</strong> Includes your preferences in receiving marketing from us and our third parties and information from your interactions with us via emails, messages, and consultations.
                  </span>
                </li>
              </ul>
              <p className="text-base leading-relaxed mb-4" style={{ color: '#1B1D1F' }}>
                If you do not provide personal data we ask for where it is requested (for example, at point of sale), it may delay or prevent us from providing services to you.
              </p>
              <h3 className={`${anton.className} text-xl lg:text-2xl font-normal uppercase mb-4 mt-8`} style={{ color: '#222118' }}>
                Special categories of personal data we collect about you
              </h3>
              <p className="text-base leading-relaxed" style={{ color: '#1B1D1F' }}>
                The processing of special categories of personal data (or 'sensitive personal data') is limited to data made public by you or a third party on your behalf, or where you have given us consent to use such information. For example, we may need to understand certain health-related conditions when asking you to fill out an online form or handling a query or complaint made by you. We will always check such requirements with you, and you only need to provide the information you are comfortable with us using.
              </p>
            </section>

            {/* How is your personal data collected? */}
            <section id="how-collected">
              <h2 className={`${anton.className} text-2xl lg:text-3xl font-normal uppercase mb-6`} style={{ color: '#222118' }}>
                3. How is your personal data collected?
              </h2>
              <p className="text-base leading-relaxed" style={{ color: '#1B1D1F' }}>
                We might collect or receive personal data from you in a number of ways, including via our website and forms. Sometimes you give this to us directly (e.g. when you create an account, when you contact us, when you purchase from our website), sometimes we collect it (e.g. using cookies to understand how you use our websites and apps) or sometimes we receive your personal data from other third parties or publicly available sources.
              </p>
            </section>

            {/* How we use your personal data */}
            <section id="how-we-use">
              <h2 className={`${anton.className} text-2xl lg:text-3xl font-normal uppercase mb-6`} style={{ color: '#222118' }}>
                4. How we use your personal data
              </h2>
              <h3 className={`${anton.className} text-xl lg:text-2xl font-normal uppercase mb-4`} style={{ color: '#222118' }}>
                Legal Basis for Processing
              </h3>
              <p className="text-base leading-relaxed mb-4" style={{ color: '#1B1D1F' }}>
                We process your personal data on the following legal bases:
              </p>
              <ul className="space-y-3 ml-6 mb-6">
                <li className="flex items-start">
                  <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0" style={{ backgroundColor: '#222118' }}></span>
                  <span className="text-base leading-relaxed" style={{ color: '#1B1D1F' }}>
                    <strong>Consent:</strong> Where you have explicitly provided consent for us to collect and process specific information, such as skin details or marketing communications.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0" style={{ backgroundColor: '#222118' }}></span>
                  <span className="text-base leading-relaxed" style={{ color: '#1B1D1F' }}>
                    <strong>Contractual Necessity:</strong> When processing is necessary to fulfil the service you have requested (e.g., virtual consultations).
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0" style={{ backgroundColor: '#222118' }}></span>
                  <span className="text-base leading-relaxed" style={{ color: '#1B1D1F' }}>
                    <strong>Legal Obligations:</strong> When processing is necessary to comply with legal requirements.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0" style={{ backgroundColor: '#222118' }}></span>
                  <span className="text-base leading-relaxed" style={{ color: '#1B1D1F' }}>
                    <strong>Legitimate Interests:</strong> For our legitimate interests in improving our services and managing customer relationships, provided that your fundamental rights do not override these interests.
                  </span>
                </li>
              </ul>
              <h3 className={`${anton.className} text-xl lg:text-2xl font-normal uppercase mb-4 mt-8`} style={{ color: '#222118' }}>
                Purposes for which we will use your personal data
              </h3>
              <p className="text-base leading-relaxed mb-4" style={{ color: '#1B1D1F' }}>
                We will only use your personal data where the law allows us to do so. Typical uses of your data include:
              </p>
              <ul className="space-y-3 ml-6 mb-6">
                <li className="flex items-start">
                  <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0" style={{ backgroundColor: '#222118' }}></span>
                  <span className="text-base leading-relaxed" style={{ color: '#1B1D1F' }}>
                    <strong>Providing Virtual Skin Coaching Services:</strong> To conduct virtual skin consultations and offer personalised skincare guidance.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0" style={{ backgroundColor: '#222118' }}></span>
                  <span className="text-base leading-relaxed" style={{ color: '#1B1D1F' }}>
                    <strong>Customer Support:</strong> To respond to inquiries, manage appointments, and resolve issues.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0" style={{ backgroundColor: '#222118' }}></span>
                  <span className="text-base leading-relaxed" style={{ color: '#1B1D1F' }}>
                    <strong>Marketing Communications:</strong> To send updates, promotional content, and relevant skincare information (only if you have provided consent).
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0" style={{ backgroundColor: '#222118' }}></span>
                  <span className="text-base leading-relaxed" style={{ color: '#1B1D1F' }}>
                    <strong>Service Improvement:</strong> To analyse trends and improve the quality of our services.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0" style={{ backgroundColor: '#222118' }}></span>
                  <span className="text-base leading-relaxed" style={{ color: '#1B1D1F' }}>
                    <strong>Legal Compliance:</strong> To comply with legal obligations such as tax or regulatory reporting.
                  </span>
                </li>
              </ul>
              <h3 className={`${anton.className} text-xl lg:text-2xl font-normal uppercase mb-4 mt-8`} style={{ color: '#222118' }}>
                Direct marketing
              </h3>
              <p className="text-base leading-relaxed mb-4" style={{ color: '#1B1D1F' }}>
                During the account creation process on our website when your personal data is collected, you will be asked to indicate your preferences for receiving direct marketing communications from SkinBestie via email or SMS.
              </p>
              <p className="text-base leading-relaxed mb-6" style={{ color: '#1B1D1F' }}>
                We may also analyse your Identity, Contact, Technical, Usage and Profile Data to form a view of which products, services and offers may be of interest to you so that we can then send you relevant marketing communications.
              </p>
              <h3 className={`${anton.className} text-xl lg:text-2xl font-normal uppercase mb-4 mt-8`} style={{ color: '#222118' }}>
                Opting out of marketing
              </h3>
              <p className="text-base leading-relaxed" style={{ color: '#1B1D1F' }}>
                You can ask to stop sending you marketing communications at any time by following the opt-out links within any marketing communication sent to you or by contacting us at privacy@skinbestie.co. If you opt out of receiving marketing communications, you will still receive service-related communications that are essential for administrative or customer service purposes for example relating to order confirmations, updates to our Terms and Conditions, or checking that your contact details are correct.
              </p>
            </section>

            {/* How we share your information */}
            <section id="how-we-share">
              <h2 className={`${anton.className} text-2xl lg:text-3xl font-normal uppercase mb-6`} style={{ color: '#222118' }}>
                5. How we share your information
              </h2>
              <p className="text-base leading-relaxed mb-4" style={{ color: '#1B1D1F' }}>
                We respect your privacy and will not sell or trade your personal data. However, we may share your personal data with:
              </p>
              <ul className="space-y-3 ml-6">
                <li className="flex items-start">
                  <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0" style={{ backgroundColor: '#222118' }}></span>
                  <span className="text-base leading-relaxed" style={{ color: '#1B1D1F' }}>
                    <strong>Service Providers:</strong> Companies providing services such as payment processing, IT services, and customer support on our behalf.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0" style={{ backgroundColor: '#222118' }}></span>
                  <span className="text-base leading-relaxed" style={{ color: '#1B1D1F' }}>
                    <strong>Legal Authorities:</strong> If required to do so by law or to protect our rights, property, or the safety of others.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0" style={{ backgroundColor: '#222118' }}></span>
                  <span className="text-base leading-relaxed" style={{ color: '#1B1D1F' }}>
                    <strong>Business Transfers:</strong> In the event of a business merger or sale, your data may be transferred as part of the transaction, but it will remain subject to this policy.
                  </span>
                </li>
              </ul>
            </section>

            {/* International data transfers */}
            <section id="international-transfers">
              <h2 className={`${anton.className} text-2xl lg:text-3xl font-normal uppercase mb-6`} style={{ color: '#222118' }}>
                6. International data transfers
              </h2>
              <p className="text-base leading-relaxed" style={{ color: '#1B1D1F' }}>
                In some instances, your data may be transferred to and processed in countries outside the UK or European Economic Area (EEA) that have laws that do not provide the same level of data protection as the UK law. Under data protection law, we can only transfer your personal data to a country or international organisation outside the UK/EEA where the UK government (or, where the EU GDPR applies, the European Commission) has decided the particular country or international organisation ensures an adequate level of protection of personal data (known as an 'adequacy decision'); there are appropriate safeguards in place, together with enforceable rights and effective legal remedies for data subjects; or a specific exception applies under data protection law.
              </p>
            </section>

            {/* Data security */}
            <section id="data-security">
              <h2 className={`${anton.className} text-2xl lg:text-3xl font-normal uppercase mb-6`} style={{ color: '#222118' }}>
                7. Data security
              </h2>
              <p className="text-base leading-relaxed" style={{ color: '#1B1D1F' }}>
                We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorised way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know. They will only process your personal data on our instructions, and they are subject to a duty of confidentiality.
              </p>
            </section>

            {/* Data Retention */}
            <section id="data-retention">
              <h2 className={`${anton.className} text-2xl lg:text-3xl font-normal uppercase mb-6`} style={{ color: '#222118' }}>
                8. Data Retention
              </h2>
              <p className="text-base leading-relaxed" style={{ color: '#1B1D1F' }}>
                We will only retain your personal data for as long as necessary to fulfil the purposes we collected it for, including any legal, accounting, or reporting requirements. When it is no longer needed, we will securely delete or anonymise your data.
              </p>
            </section>

            {/* Your Rights */}
            <section id="your-rights">
              <h2 className={`${anton.className} text-2xl lg:text-3xl font-normal uppercase mb-6`} style={{ color: '#222118' }}>
                9. Your Rights
              </h2>
              <p className="text-base leading-relaxed mb-4" style={{ color: '#1B1D1F' }}>
                You have rights regarding your personal data under data protection laws, including:
              </p>
              <ul className="space-y-3 ml-6 mb-6">
                <li className="flex items-start">
                  <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0" style={{ backgroundColor: '#222118' }}></span>
                  <span className="text-base leading-relaxed" style={{ color: '#1B1D1F' }}>
                    <strong>Right to Access:</strong> Obtain access to your personal data and request a copy.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0" style={{ backgroundColor: '#222118' }}></span>
                  <span className="text-base leading-relaxed" style={{ color: '#1B1D1F' }}>
                    <strong>Right to Rectification:</strong> Correct any inaccurate or incomplete data.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0" style={{ backgroundColor: '#222118' }}></span>
                  <span className="text-base leading-relaxed" style={{ color: '#1B1D1F' }}>
                    <strong>Right to Erasure:</strong> Request that we delete your data under certain circumstances.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0" style={{ backgroundColor: '#222118' }}></span>
                  <span className="text-base leading-relaxed" style={{ color: '#1B1D1F' }}>
                    <strong>Right to Restrict Processing:</strong> Request a restriction on the processing of your data in certain situations.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0" style={{ backgroundColor: '#222118' }}></span>
                  <span className="text-base leading-relaxed" style={{ color: '#1B1D1F' }}>
                    <strong>Right to Data Portability:</strong> Request your personal data in a structured, machine-readable format.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0" style={{ backgroundColor: '#222118' }}></span>
                  <span className="text-base leading-relaxed" style={{ color: '#1B1D1F' }}>
                    <strong>Right to Object:</strong> Object to the processing of your data, including for direct marketing purposes.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0" style={{ backgroundColor: '#222118' }}></span>
                  <span className="text-base leading-relaxed" style={{ color: '#1B1D1F' }}>
                    <strong>Right to Withdraw Consent:</strong> Withdraw your consent where we are relying on it to process your data.
                  </span>
                </li>
              </ul>
              <p className="text-base leading-relaxed" style={{ color: '#1B1D1F' }}>
                To exercise any of these rights, please contact us at privacy@skinbestie.co.
              </p>
            </section>

            {/* Cookies */}
            <section id="cookies">
              <h2 className={`${anton.className} text-2xl lg:text-3xl font-normal uppercase mb-6`} style={{ color: '#222118' }}>
                10. Cookies
              </h2>
              <p className="text-base leading-relaxed" style={{ color: '#1B1D1F' }}>
                The settings from Internet browsers are usually programmed by default to accept cookies, but you can easily adjust it by changing the settings of your browser or, where available, by using the tools on our website. Many cookies are used to enhance the usability or functionality of a website; therefore, disabling some types of cookies may prevent you from using certain parts of our website. If you wish to manage your preferences regarding the cookies that are set by our website, please use the tool available on the website or refer to the Help function within your browser to learn how to manage your settings within your browser. For more information, please consult the following link: <a href="https://allaboutcookies.org/" target="_blank" rel="noopener noreferrer" className="underline hover:opacity-70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#222118] transition-opacity" style={{ color: '#222118' }}>https://allaboutcookies.org/</a>
              </p>
            </section>

            {/* Children's privacy */}
            <section id="children">
              <h2 className={`${anton.className} text-2xl lg:text-3xl font-normal uppercase mb-6`} style={{ color: '#222118' }}>
                11. Children's privacy
              </h2>
              <p className="text-base leading-relaxed" style={{ color: '#1B1D1F' }}>
                Our services are not directed at children under the age of 18, and we do not knowingly collect personal data from children. If you believe that we have unintentionally collected data from a child, please contact us, and we will take steps to delete such data.
              </p>
            </section>

            {/* Changes to this Privacy Policy */}
            <section id="changes">
              <h2 className={`${anton.className} text-2xl lg:text-3xl font-normal uppercase mb-6`} style={{ color: '#222118' }}>
                12. Changes to this Privacy Policy
              </h2>
              <p className="text-base leading-relaxed" style={{ color: '#1B1D1F' }}>
                We may update this privacy policy from time to time in response to legal, technical, or business changes. Any updates will be reflected by revising the "Last Updated" date at the top of this policy. You are encouraged to review this policy periodically.
              </p>
            </section>

            {/* Contact Information */}
            <section id="contact">
              <h2 className={`${anton.className} text-2xl lg:text-3xl font-normal uppercase mb-6`} style={{ color: '#222118' }}>
                13. Contact Information
              </h2>
              <p className="text-base leading-relaxed mb-4" style={{ color: '#1B1D1F' }}>
                If you have any questions or concerns about this privacy policy or our data practices, please contact us at privacy@skinbestie.co.
              </p>
              <p className="text-base leading-relaxed" style={{ color: '#1B1D1F' }}>
                Alternatively, you have the right to lodge a complaint with the Information Commissioner's Office (ICO), the UK's supervisory authority for data protection, via their website at <a href="https://www.ico.org.uk" target="_blank" rel="noopener noreferrer" className="underline hover:opacity-70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#222118] transition-opacity" style={{ color: '#222118' }}>www.ico.org.uk</a>.
              </p>
            </section>

            {/* Third party links */}
            <section id="third-party">
              <h2 className={`${anton.className} text-2xl lg:text-3xl font-normal uppercase mb-6`} style={{ color: '#222118' }}>
                14. Third party links
              </h2>
              <p className="text-base leading-relaxed" style={{ color: '#1B1D1F' }}>
                This website may include links to third-party websites, plug-ins and applications when sending you your personal routine. Clicking on those links or enabling those connections may allow third parties to collect or share data about you. We do not control these third-party websites and are not responsible for their privacy statements. When you leave our website, we encourage you to read the privacy policy of every website you visit.
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
