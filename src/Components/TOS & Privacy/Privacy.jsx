import React, { useRef } from "react";
import { ChevronUpIcon } from "lucide-react";

function Privacy() {
  const topRef = useRef(null);

  const scrollToTop = () => {
    topRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div ref={topRef} className="bg-slate-50 min-h-screen py-8 text-[#0e141b]">
      {/* Container */}
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#0e141b] mb-4">
            Privacy Policy
          </h1>
          <p className="text-[#4e7297]">Effective Date: October 2024</p>
        </div>

        {/* Table of Contents */}
        <div className="mb-12 bg-white rounded-xl border border-[#d0dbe7] p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-[#0e141b]">
            Quick Navigation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              "Introduction",
              "Information We Collect",
              "How We Use Your Information",
              "Sharing Your Information",
              "Data Security",
              "Your Rights",
              "Changes to This Privacy Policy",
              "Contact Us",
            ].map((item, index) => (
              <a
                key={index}
                href={`#section-${index + 1}`}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-[#e7edf3] transition-colors duration-200"
              >
                <span className="w-6 h-6 flex items-center justify-center rounded-full bg-[#d0dbe6] text-[#0e141b] text-sm">
                  {index + 1}
                </span>
                <span className="text-[#4e7297] hover:text-[#0e141b]">
                  {item}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Privacy Policy Sections */}
        <div className="space-y-6">
          {/* Section 1: Introduction */}
          <div
            id="section-1"
            className="bg-white rounded-xl border border-[#d0dbe7] p-6 shadow-sm"
          >
            <h2 className="text-xl font-semibold mb-3 text-[#0e141b]">
              1. Introduction
            </h2>
            <p className="text-[#4e7297]">
              Welcome to{" "}
              <span className="font-medium text-[#0e141b]">Momentum</span> –
              your smart project management companion. We are committed to
              protecting your privacy and ensuring transparency about how we
              handle your personal information. This Privacy Policy outlines how
              Momentum collects, uses, and shares your data when you use our
              platform.
            </p>
          </div>

          {/* Section 2: Information We Collect */}
          <div
            id="section-2"
            className="bg-white rounded-xl border border-[#d0dbe7] p-6 shadow-sm"
          >
            <h2 className="text-xl font-semibold mb-3 text-[#0e141b]">
              2. Information We Collect
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-[#0e141b] mb-2">
                  a. Personal Information:
                </h3>
                <p className="text-[#4e7297] mb-2">
                  We may collect the following personal details when you
                  register or interact with Momentum:
                </p>
                <ul className="list-disc pl-5 text-[#4e7297]">
                  <li>Full name</li>
                  <li>Email address</li>
                  <li>Profile image</li>
                  <li>Organization name (if applicable)</li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium text-[#0e141b] mb-2">
                  b. Project Information:
                </h3>
                <ul className="list-disc pl-5 text-[#4e7297]">
                  <li>
                    Details about the projects you create, manage, or
                    collaborate on (titles, descriptions, timelines, milestones)
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium text-[#0e141b] mb-2">
                  c. Usage Data:
                </h3>
                <p className="text-[#4e7297] mb-2">We may collect data on:</p>
                <ul className="list-disc pl-5 text-[#4e7297]">
                  <li>Pages visited and time spent on the platform</li>
                  <li>Features used (e.g., project creation, task updates)</li>
                  <li>IP address, browser type, device identifiers</li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium text-[#0e141b] mb-2">
                  d. Cookies and Tracking Technologies:
                </h3>
                <p className="text-[#4e7297]">
                  Cookies help us enhance your user experience, remember
                  preferences, and understand usage patterns. You may opt to
                  disable cookies in your browser settings.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: How We Use Your Information */}
          <div
            id="section-3"
            className="bg-white rounded-xl border border-[#d0dbe7] p-6 shadow-sm"
          >
            <h2 className="text-xl font-semibold mb-3 text-[#0e141b]">
              3. How We Use Your Information
            </h2>
            <p className="text-[#4e7297] mb-2">
              We use the information collected to:
            </p>
            <ul className="list-disc pl-5 text-[#4e7297]">
              <li>Provide and maintain your access to the Momentum platform</li>
              <li>Enable seamless collaboration on your projects</li>
              <li>Customize your experience and user interface</li>
              <li>
                Communicate service updates, announcements, or relevant
                notifications
              </li>
              <li>Provide technical support and customer care</li>
              <li>Improve platform features through analytics and feedback</li>
              <li>Ensure platform security and detect potential misuse</li>
            </ul>
          </div>

          {/* Section 4: Sharing Your Information */}
          <div
            id="section-4"
            className="bg-white rounded-xl border border-[#d0dbe7] p-6 shadow-sm"
          >
            <h2 className="text-xl font-semibold mb-3 text-[#0e141b]">
              4. Sharing Your Information
            </h2>
            <p className="text-[#4e7297] mb-3">
              We{" "}
              <span className="font-bold text-[#0e141b]">
                do not sell or rent your personal information
              </span>
              . However, we may share your data:
            </p>
            <ul className="list-disc pl-5 text-[#4e7297]">
              <li>
                With trusted service providers who assist in hosting, analytics,
                or support services
              </li>
              <li>To comply with legal processes or regulatory obligations</li>
              <li>
                To protect the security, rights, or property of Momentum or its
                users
              </li>
              <li>
                With your explicit consent (e.g., sharing a project with
                teammates)
              </li>
            </ul>
          </div>

          {/* Section 5: Data Security */}
          <div
            id="section-5"
            className="bg-white rounded-xl border border-[#d0dbe7] p-6 shadow-sm"
          >
            <h2 className="text-xl font-semibold mb-3 text-[#0e141b]">
              5. Data Security
            </h2>
            <p className="text-[#4e7297]">
              We implement reasonable safeguards to protect your information
              from unauthorized access, alteration, or destruction. However,
              while we strive to secure your data, no method of transmission or
              storage is 100% secure.
            </p>
          </div>

          {/* Section 6: Your Rights */}
          <div
            id="section-6"
            className="bg-white rounded-xl border border-[#d0dbe7] p-6 shadow-sm"
          >
            <h2 className="text-xl font-semibold mb-3 text-[#0e141b]">
              6. Your Rights
            </h2>
            <p className="text-[#4e7297] mb-2">You have the right to:</p>
            <ul className="list-disc pl-5 text-[#4e7297] mb-3">
              <li>Access the personal information we hold about you</li>
              <li>Request updates or corrections</li>
              <li>
                Delete your account or associated data (subject to legal and
                operational requirements)
              </li>
            </ul>
            <p className="text-[#4e7297]">
              To exercise any of these rights, please contact us using the
              details below.
            </p>
          </div>

          {/* Section 7: Changes to Privacy Policy */}
          <div
            id="section-7"
            className="bg-white rounded-xl border border-[#d0dbe7] p-6 shadow-sm"
          >
            <h2 className="text-xl font-semibold mb-3 text-[#0e141b]">
              7. Changes to This Privacy Policy
            </h2>
            <p className="text-[#4e7297]">
              We may periodically update this Privacy Policy to reflect changes
              in our practices or legal requirements. We will post updates on
              this page and indicate the "Effective Date" at the top. Please
              review it periodically.
            </p>
          </div>

          {/* Section 8: Contact Us */}
          <div
            id="section-8"
            className="bg-white rounded-xl border border-[#d0dbe7] p-6 shadow-sm"
          >
            <h2 className="text-xl font-semibold mb-3 text-[#0e141b]">
              8. Contact Us
            </h2>
            <p className="text-[#4e7297] mb-4">
              If you have any questions, feedback, or requests related to this
              Privacy Policy, please reach out to us:
            </p>
            <div className="mt-4 space-y-2">
              <p className="flex items-center space-x-2">
                <span className="font-medium">Email:</span>
                <a
                  href="mailto:adityapoojary07@gmail.com"
                  className="text-blue-600 hover:underline"
                >
                  adityapoojary07@gmail.com
                </a>
              </p>
              <p className="flex items-center space-x-2">
                <span className="font-medium">Phone:</span>
                <a
                  href="tel:+919152004851"
                  className="text-blue-600 hover:underline"
                >
                  +91 91520 04851
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Floating Back to Top Button */}
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-3 bg-white rounded-full shadow-lg border border-[#d0dbe7] hover:bg-[#e7edf3] transition-colors duration-200"
          aria-label="Back to top"
        >
          <ChevronUpIcon className="w-6 h-6 text-[#0e141b]" />
        </button>
      </div>
    </div>
  );
}

export default Privacy;
