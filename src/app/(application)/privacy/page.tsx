"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";

export default function PrivacyPage() {
  const [activeSection, setActiveSection] = useState("important-info");

  const sections = [
    { id: "important-info", label: "Important information and who we are" },
    { id: "info-collect", label: "Information we collect" },
    { id: "how-collected", label: "How is your personal data collected?" },
    { id: "how-we-use", label: "How we use your personal data" },
    { id: "how-we-share", label: "How we share your information" },
    { id: "international-transfers", label: "International data transfers" },
    { id: "data-security", label: "Data security" },
    { id: "data-retention", label: "Data retention" },
    { id: "your-rights", label: "Your rights" },
    { id: "cookies", label: "Cookies" },
    { id: "children", label: "Children's privacy" },
    { id: "changes", label: "Changes to this Privacy Policy" },
    { id: "contact", label: "Contact Information" },
    { id: "third-party", label: "Third party links" },
  ];

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl">
      {/* Header Banner */}
      <div className="bg-skinbestie-primary-light rounded-t-lg py-8 px-6 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Privacy Policy
        </h1>
        <p className="text-lg text-gray-700">Last Updated: October 2025</p>
      </div>

      {/* Main Content */}
      <Card className="p-6 rounded-t-none rounded-b-lg border-t-0 shadow-none">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-1">
            <div className="sticky top-8 space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`block w-full text-left py-2 transition text-sm border-l-2 pl-4 ${
                    activeSection === section.id
                      ? "border-skinbestie-primary font-medium text-gray-900"
                      : "border-transparent hover:border-gray-300 text-gray-600"
                  }`}
                >
                  {section.label}
                </button>
              ))}
            </div>
          </aside>

          {/* Content Area */}
          <main className="lg:col-span-3 space-y-12">
            {/* Important information and who we are */}
            <section id="important-info">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                1. Important information and who we are
              </h2>
              <p className="text-base leading-relaxed mb-4 text-gray-700">
                Gentle Human T/A SkinBestie is the controller and responsible
                for your personal data (referred to as &quot;SkinBestie&quot;,
                &quot;we&quot;, &quot;us&quot; or &quot;our&quot;). We are
                registered in England and Wales under company number 14448690
                and have our registered office at Huckletree (Priory House)
                Limited, 6 Wrights Lane, London, W8 6TA.
              </p>
              <p className="text-base leading-relaxed mb-4 text-gray-700">
                At SkinBestie, we are committed to protecting and respecting
                your privacy. Please read this privacy policy carefully as it
                contains important information on who we are and how and why we
                collect, use, and safeguard your personal data when you use our
                virtual skin coaching services and website. Please note that we
                are not medical professionals, and our services do not
                constitute medical advice.
              </p>
              <p className="text-base leading-relaxed mb-4 text-gray-700">
                When we collect and process your personal data, we are subject
                to the UK General Data Protection Regulation (UK GDPR). We are
                also subject to the EU General Data Protection Regulation (EU
                GDPR) in relation to any services we provide to individuals in
                the European Economic Area (EEA).
              </p>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-6">
                Privacy Policy
              </h3>
              <p className="text-base leading-relaxed mb-4 text-gray-700">
                This privacy policy gives you information about how SkinBestie
                collects and uses your personal data through your use of this
                website, including any data you may provide when you register
                with us, sign up to our marketing communications, use our
                virtual skin coaching services, purchase a product or service,
                or take part in a competition.
              </p>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-6">
                Meaning of personal data
              </h3>
              <p className="text-base leading-relaxed mb-4 text-gray-700">
                Personal data means any information relating to an identified or
                identifiable individual (known as the data subject). Personal
                data includes information irrespective of how it is stored.
                Different pieces of information, which collected together can
                lead to the identification of a particular person, also
                constitute personal data. Common examples of personal data
                include an individual&apos;s name, address, contact information,
                photograph, IP address and information about the individual such
                as their age or employment status.
              </p>
              <p className="text-base leading-relaxed text-gray-700">
                Special category personal data means personal data revealing
                racial or ethnic origin, political opinions, religious beliefs,
                philosophical beliefs or trade union membership, genetic and
                biometric data (when processed to uniquely identify an
                individual), or data concerning health, sex life or sexual
                orientation.
              </p>
            </section>

            {/* Information we collect */}
            <section id="info-collect">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                2. Information we collect
              </h2>
              <p className="text-base leading-relaxed mb-4 text-gray-700">
                We may collect, use, store, and transfer the following types of
                personal data:
              </p>
              <ul className="space-y-3 ml-6 mb-6">
                <li className="flex items-start">
                  <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0 bg-gray-900"></span>
                  <span className="text-base leading-relaxed text-gray-700">
                    <strong>Identity Data:</strong> Name, username, date of
                    birth, gender.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0 bg-gray-900"></span>
                  <span className="text-base leading-relaxed text-gray-700">
                    <strong>Contact Data:</strong> Email address, telephone
                    number, home address.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0 bg-gray-900"></span>
                  <span className="text-base leading-relaxed text-gray-700">
                    <strong>Skin Information:</strong> Details related to your
                    skin concerns, skincare routine, photos of your skin (if
                    voluntarily provided), and any relevant lifestyle
                    information.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0 bg-gray-900"></span>
                  <span className="text-base leading-relaxed text-gray-700">
                    <strong>Coaching Call Data:</strong> notes from your
                    coaching sessions and, where applicable, audio and video
                    recordings of your Coaching Class
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0 bg-gray-900"></span>
                  <span className="text-base leading-relaxed text-gray-700">
                    <strong>Technical Data:</strong> IP address, browser type,
                    time zone settings, and usage data.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0 bg-gray-900"></span>
                  <span className="text-base leading-relaxed text-gray-700">
                    <strong>Profile Data:</strong> Includes your account
                    password, purchases or orders made by you, your interests,
                    preferences, feedback and survey responses.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0 bg-gray-900"></span>
                  <span className="text-base leading-relaxed text-gray-700">
                    <strong>Financial Data:</strong> Payment card details or
                    other financial information necessary to process payments.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0 bg-gray-900"></span>
                  <span className="text-base leading-relaxed text-gray-700">
                    <strong>Marketing and Communications Data:</strong> Includes
                    your preferences in receiving marketing from us and our
                    third parties and information from your interactions with us
                    via emails, messages, and consultations.
                  </span>
                </li>
              </ul>
              <p className="text-base leading-relaxed mb-4 text-gray-700">
                The above list is not exhaustive, and SkinBestie may also
                collect and process other personal data to the extent that this
                is considered necessary for providing our services or compliance
                with legal requirements.
              </p>
              <p className="text-base leading-relaxed mb-4 text-gray-700">
                If you do not provide personal data we ask for where it is
                requested (for example, at point of sale), it may delay or
                prevent us from providing services to you.
              </p>
              <p className="text-base leading-relaxed mb-4 text-gray-700">
                We also collect, use and share aggregated data such as
                statistical or demographic data which is not personal data as it
                does not directly (or indirectly) reveal your identity. For
                example, we may aggregate individuals&apos; Usage Data to
                calculate the percentage of users accessing a specific website
                feature in order to analyse general trends in how users are
                interacting with our website to help improve the website and our
                service offering.
              </p>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-6">
                Special categories of personal data we collect about you
              </h3>
              <p className="text-base leading-relaxed text-gray-700">
                The processing of special categories of personal data (or
                &apos;sensitive personal data&apos;) is limited to data made
                public by you or a third party on your behalf, or where you have
                given us consent to use such information. For example, we may
                need to understand certain health-related conditions when asking
                you to fill out an online form or handling a query or complaint
                made by you. We will always check such requirements with you,
                and you only need to provide the information you are comfortable
                with us using.
              </p>
            </section>

            {/* How is your personal data collected? */}
            <section id="how-collected">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                3. How is your personal data collected?
              </h2>
              <p className="text-base leading-relaxed text-gray-700">
                We might collect or receive personal data from you in a number
                of ways, including via our website and forms. Sometimes you give
                this to us directly (e.g. when you create an account, when you
                contact us, when you purchase from our website), sometimes we
                collect it (e.g. using cookies to understand how you use our
                websites and apps) or sometimes we receive your personal data
                from other third parties or publicly available sources.
              </p>
            </section>

            {/* How we use your personal data */}
            <section id="how-we-use">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                4. How we use your personal data
              </h2>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Legal Basis for Processing
              </h3>
              <p className="text-base leading-relaxed mb-4 text-gray-700">
                We process your personal data on the following legal bases:
              </p>
              <ul className="space-y-3 ml-6 mb-6">
                <li className="flex items-start">
                  <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0 bg-gray-900"></span>
                  <span className="text-base leading-relaxed text-gray-700">
                    <strong>Consent:</strong> Where you have explicitly provided
                    consent for us to collect and process specific information,
                    such as skin details or marketing communications.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0 bg-gray-900"></span>
                  <span className="text-base leading-relaxed text-gray-700">
                    <strong>Contractual Necessity:</strong> When processing is
                    necessary to fulfil the service you have requested (e.g.,
                    virtual consultations).
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0 bg-gray-900"></span>
                  <span className="text-base leading-relaxed text-gray-700">
                    <strong>Legal Obligations:</strong> When processing is
                    necessary to comply with legal requirements.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0 bg-gray-900"></span>
                  <span className="text-base leading-relaxed text-gray-700">
                    <strong>Legitimate Interests:</strong> For our legitimate
                    interests in improving our services and managing customer
                    relationships, provided that your fundamental rights do not
                    override these interests.
                  </span>
                </li>
              </ul>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-6">
                Purposes for which we will use your personal data
              </h3>
              <p className="text-base leading-relaxed mb-4 text-gray-700">
                We will only use your personal data where the law allows us to
                do so. Typical uses of your data include:
              </p>
              <ul className="space-y-3 ml-6 mb-6">
                <li className="flex items-start">
                  <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0 bg-gray-900"></span>
                  <span className="text-base leading-relaxed text-gray-700">
                    <strong>Providing Virtual Skin Coaching Services:</strong>{" "}
                    To conduct virtual skin consultations and offer personalised
                    skincare guidance.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0 bg-gray-900"></span>
                  <span className="text-base leading-relaxed text-gray-700">
                    <strong>Customer Support:</strong> To respond to inquiries,
                    manage appointments, and resolve issues.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0 bg-gray-900"></span>
                  <span className="text-base leading-relaxed text-gray-700">
                    <strong>
                      Account management, subscriptions and billing:
                    </strong>{" "}
                    To create and manage your account, process payments, manage
                    your Subscription (including renewals, upgrades, downgrades
                    and cancellations), and send you service-related
                    communications such as booking confirmations and renewal
                    notices.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0 bg-gray-900"></span>
                  <span className="text-base leading-relaxed text-gray-700">
                    <strong>Marketing Communications:</strong> To send updates,
                    promotional content, and relevant skincare information (only
                    if you have provided consent).
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0 bg-gray-900"></span>
                  <span className="text-base leading-relaxed text-gray-700">
                    <strong>Service Improvement:</strong> To analyse trends and
                    improve the quality of our services.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0 bg-gray-900"></span>
                  <span className="text-base leading-relaxed text-gray-700">
                    <strong>Legal Compliance:</strong> To comply with legal
                    obligations such as tax or regulatory reporting.
                  </span>
                </li>
              </ul>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-6">
                Direct marketing
              </h3>
              <p className="text-base leading-relaxed mb-4 text-gray-700">
                During the account creation process on our website when your
                personal data is collected, you will be asked to indicate your
                preferences for receiving direct marketing communications from
                SkinBestie via email or SMS.
              </p>
              <p className="text-base leading-relaxed mb-6 text-gray-700">
                We may also analyse your Identity, Contact, Technical, Usage and
                Profile Data to form a view of which products, services and
                offers may be of interest to you so that we can then send you
                relevant marketing communications.
              </p>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-6">
                Third-party marketing
              </h3>
              <p className="text-base leading-relaxed mb-6 text-gray-700">
                We will get your express consent before we share your personal
                data with any third party for their own direct marketing
                purposes.
              </p>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-6">
                Opting out of marketing
              </h3>
              <p className="text-base leading-relaxed text-gray-700">
                You can ask to stop sending you marketing communications at any
                time by following the opt-out links within any marketing
                communication sent to you or by contacting us at
                privacy@skinbestie.co. If you opt out of receiving marketing
                communications, you will still receive service-related
                communications that are essential for administrative or customer
                service purposes for example relating to order confirmations,
                updates to our Terms and Conditions, or checking that your
                contact details are correct.
              </p>
            </section>

            {/* How we share your information */}
            <section id="how-we-share">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                5. How we share your information
              </h2>
              <p className="text-base leading-relaxed mb-4 text-gray-700">
                We respect your privacy and will not sell or trade your personal
                data. However, we may share your personal data with:
              </p>
              <ul className="space-y-3 ml-6">
                <li className="flex items-start">
                  <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0 bg-gray-900"></span>
                  <span className="text-base leading-relaxed text-gray-700">
                    <strong>Service Providers:</strong> Companies providing
                    services such as payment processing (for example, our
                    payment gateways), IT and hosting, communication tools (for
                    example, email and messaging platforms), and customer
                    support on our behalf.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0 bg-gray-900"></span>
                  <span className="text-base leading-relaxed text-gray-700">
                    <strong>Legal Authorities:</strong> If required to do so by
                    law or to protect our rights, property, or the safety of
                    others.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0 bg-gray-900"></span>
                  <span className="text-base leading-relaxed text-gray-700">
                    <strong>Business Transfers:</strong> In the event of a
                    business merger or sale, your data may be transferred as
                    part of the transaction, but it will remain subject to this
                    policy.
                  </span>
                </li>
              </ul>
            </section>

            {/* International data transfers */}
            <section id="international-transfers">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                6. International data transfers
              </h2>
              <p className="text-base leading-relaxed mb-4 text-gray-700">
                In some instances, your data may be transferred to and processed
                in countries outside the UK or European Economic Area (EEA) that
                have laws that do not provide the same level of data protection
                as the UK law. Under data protection law, we can only transfer
                your personal data to a country or international organisation
                outside the UK/EEA where:
              </p>
              <ul className="space-y-3 ml-6">
                <li className="flex items-start">
                  <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0 bg-gray-900"></span>
                  <span className="text-base leading-relaxed text-gray-700">
                    the UK government (or, where the EU GDPR applies, the
                    European Commission) has decided the particular country or
                    international organisation ensures an adequate level of
                    protection of personal data (known as an &apos;adequacy
                    decision&apos;);
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0 bg-gray-900"></span>
                  <span className="text-base leading-relaxed text-gray-700">
                    there are appropriate safeguards in place, together with
                    enforceable rights and effective legal remedies for data
                    subjects; or
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0 bg-gray-900"></span>
                  <span className="text-base leading-relaxed text-gray-700">
                    a specific exception applies under data protection law.
                  </span>
                </li>
              </ul>
            </section>

            {/* Data security */}
            <section id="data-security">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                7. Data security
              </h2>
              <p className="text-base leading-relaxed text-gray-700">
                We have put in place appropriate security measures to prevent
                your personal data from being accidentally lost, used or
                accessed in an unauthorised way, altered or disclosed. In
                addition, we limit access to your personal data to those
                employees, agents, contractors and other third parties who have
                a business need to know. They will only process your personal
                data on our instructions, and they are subject to a duty of
                confidentiality.
              </p>
            </section>

            {/* Data Retention */}
            <section id="data-retention">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                8. Data Retention
              </h2>
              <p className="text-base leading-relaxed text-gray-700">
                We will only retain your personal data for as long as necessary
                to fulfil the purposes we collected it for, including any legal,
                accounting, or reporting requirements. When it is no longer
                needed, we will securely delete or anonymise your data. For
                example, we usually retain recordings of Coaching Calls for up
                to 90 days, unless we need to keep them longer for legal,
                regulatory or dispute-resolution purposes.
              </p>
            </section>

            {/* Your Rights */}
            <section id="your-rights">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                9. Your Rights
              </h2>
              <p className="text-base leading-relaxed mb-4 text-gray-700">
                You have rights regarding your personal data under data
                protection laws, including:
              </p>
              <ul className="space-y-3 ml-6 mb-6">
                <li className="flex items-start">
                  <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0 bg-gray-900"></span>
                  <span className="text-base leading-relaxed text-gray-700">
                    <strong>Right to Access:</strong> Obtain access to your
                    personal data and request a copy.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0 bg-gray-900"></span>
                  <span className="text-base leading-relaxed text-gray-700">
                    <strong>Right to Rectification:</strong> Correct any
                    inaccurate or incomplete data.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0 bg-gray-900"></span>
                  <span className="text-base leading-relaxed text-gray-700">
                    <strong>Right to Erasure:</strong> Request that we delete
                    your data under certain circumstances.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0 bg-gray-900"></span>
                  <span className="text-base leading-relaxed text-gray-700">
                    <strong>Right to Restrict Processing:</strong> Request a
                    restriction on the processing of your data in certain
                    situations.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0 bg-gray-900"></span>
                  <span className="text-base leading-relaxed text-gray-700">
                    <strong>Right to Data Portability:</strong> Request your
                    personal data in a structured, machine-readable format.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0 bg-gray-900"></span>
                  <span className="text-base leading-relaxed text-gray-700">
                    <strong>Right to Object:</strong> Object to the processing
                    of your data, including for direct marketing purposes.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0 bg-gray-900"></span>
                  <span className="text-base leading-relaxed text-gray-700">
                    <strong>Right to Withdraw Consent:</strong> Withdraw your
                    consent where we are relying on it to process your data.
                  </span>
                </li>
              </ul>
              <p className="text-base leading-relaxed text-gray-700">
                To exercise any of these rights, please contact us at
                privacy@skinbestie.co.
              </p>
            </section>

            {/* Cookies */}
            <section id="cookies">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                10. Cookies
              </h2>
              <p className="text-base leading-relaxed text-gray-700">
                The settings from Internet browsers are usually programmed by
                default to accept cookies, but you can easily adjust it by
                changing the settings of your browser or, where available, by
                using the tools on our website. Many cookies are used to enhance
                the usability or functionality of a website; therefore,
                disabling some types of cookies may prevent you from using
                certain parts of our website. If you wish to manage your
                preferences regarding the cookies that are set by our website,
                please use the tool available on the website or refer to the
                Help function within your browser to learn how to manage your
                settings within your browser. For more information, please
                consult the following link:{" "}
                <a
                  href="https://allaboutcookies.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-skinbestie-primary hover:underline"
                >
                  https://allaboutcookies.org/
                </a>
              </p>
            </section>

            {/* Children's privacy */}
            <section id="children">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                11. Children&apos;s privacy
              </h2>
              <p className="text-base leading-relaxed text-gray-700">
                Our services are not directed at children under the age of 18,
                and we do not knowingly collect personal data from children. If
                you believe that we have unintentionally collected data from a
                child, please contact us, and we will take steps to delete such
                data.
              </p>
            </section>

            {/* Changes to this Privacy Policy */}
            <section id="changes">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                12. Changes to this Privacy Policy
              </h2>
              <p className="text-base leading-relaxed text-gray-700">
                We may update this privacy policy from time to time in response
                to legal, technical, or business changes. Any updates will be
                reflected by revising the &quot;Last Updated&quot; date at the
                top of this policy. You are encouraged to review this policy
                periodically.
              </p>
            </section>

            {/* Contact Information */}
            <section id="contact">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                13. Contact Information
              </h2>
              <p className="text-base leading-relaxed mb-4 text-gray-700">
                If you have any questions or concerns about this privacy policy
                or our data practices, please contact us at
                privacy@skinbestie.co.
              </p>
              <p className="text-base leading-relaxed text-gray-700">
                Alternatively, you have the right to lodge a complaint with the
                Information Commissioner&apos;s Office (ICO), the UK&apos;s
                supervisory authority for data protection, via their website at{" "}
                <a
                  href="https://www.ico.org.uk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-skinbestie-primary hover:underline"
                >
                  www.ico.org.uk
                </a>
                .
              </p>
            </section>

            {/* Third party links */}
            <section id="third-party">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                14. Third party links
              </h2>
              <p className="text-base leading-relaxed text-gray-700">
                This website may include links to third-party websites, plug-ins
                and applications when sending you your personal routine.
                Clicking on those links or enabling those connections may allow
                third parties to collect or share data about you. We do not
                control these third-party websites and are not responsible for
                their privacy statements. When you leave our website, we
                encourage you to read the privacy policy of every website you
                visit.
              </p>
            </section>
          </main>
        </div>
      </Card>
    </div>
  );
}
