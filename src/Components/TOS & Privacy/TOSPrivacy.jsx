import React, { useRef } from "react";
import { ChevronUpIcon } from "lucide-react"; // Make sure to install lucide-react if not already installed

function TOS() {
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
            Terms of Service
          </h1>
          <p className="text-[#4e7297]">Last Updated: 16/10/2024</p>
        </div>

        {/* Table of Contents */}
        <div className="mb-12 bg-white rounded-xl border border-[#d0dbe7] p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-[#0e141b]">
            Quick Navigation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              "Acceptance of Terms",
              "Eligibility",
              "Account Registration",
              "Use of Services",
              "Intellectual Property",
              "Pricing and Payments",
              "Privacy Policy",
              "Third-Party Links",
              "Termination",
              "Disclaimer of Warranties",
              "Limitation of Liability",
              "Indemnification",
              "Changes to Terms",
              "Governing Law",
              "Contact Us",
            ].map((item, index) => (
              <a
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

        {/* Terms Sections */}
        <div className="space-y-6">
          {[
            {
              title: "1. Acceptance of Terms",
              text: "By using our Services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and any future amendments. If you do not agree to these terms, please do not use our Services.",
            },
            {
              title: "2. Eligibility",
              text: "You must be at least 18 years old to use our Services. By using our website, you represent and warrant that you meet this eligibility requirement.",
            },
            {
              title: "3. Account Registration",
              text: "To access certain features of our Services, you may be required to create an account. You agree to provide accurate, current, and complete information during registration and keep your account information updated.",
            },
            {
              title: "4. Use of Services",
              text: "You agree to use our Services in compliance with all applicable laws and regulations. You may not use our Services for any unlawful purpose or attempt to gain unauthorized access to our systems.",
            },
            {
              title: "5. Intellectual Property",
              text: "All content, logos, trademarks, and designs related to CortexDynamics are our exclusive property. You may not reproduce or distribute our intellectual property without permission.",
            },
            {
              title: "6. Pricing and Payments",
              text: "For any paid services, the price, payment terms, and additional conditions will be specified at the point of purchase. All fees are non-refundable unless stated otherwise.",
            },
            {
              title: "7. Privacy Policy",
              text: "Your use of our Services is also governed by our Privacy Policy, which outlines how we collect, use, and protect your personal information.",
            },
            {
              title: "8. Third-Party Links",
              text: "Our Services may contain links to third-party websites. We are not responsible for the content or practices of those third-party websites.",
            },
            {
              title: "9. Termination",
              text: "We reserve the right to suspend or terminate your account or access to our Services at any time, with or without cause, and with or without notice.",
            },
            {
              title: "10. Disclaimer of Warranties",
              text: "Our Services are provided 'as-is' and 'as-available.' We make no warranties regarding the operation or availability of our Services.",
            },
            {
              title: "11. Limitation of Liability",
              text: "In no event shall CortexDynamics or its affiliates be liable for any direct, indirect, or incidental damages arising from your use of our Services.",
            },
            {
              title: "12. Indemnification",
              text: "You agree to indemnify and hold harmless CortexDynamics from any claims or liabilities arising from your use of our Services.",
            },
            {
              title: "13. Changes to Terms",
              text: "We reserve the right to modify these Terms of Service at any time. Your continued use of our Services after updates constitutes acceptance of the new terms.",
            },
            {
              title: "14. Governing Law",
              text: "These Terms of Service shall be governed by and construed in accordance with the laws of India, without regard to conflict of law principles.",
            },
            {
              title: "15. Contact Us",
              text: "If you have any questions regarding these Terms, contact us at:",
              contact: {
                email: "adityapoojary07@gmail.com",
                phone: "+91 91520 04851",
                location: "Mumbai, Maharashtra, India",
              },
            },
          ].map((section, index) => (
            <div
              key={index}
              id={`section-${index + 1}`}
              className="bg-white rounded-xl border border-[#d0dbe7] p-6 shadow-sm"
            >
              <h2 className="text-xl font-semibold mb-3 text-[#0e141b]">
                {section.title}
              </h2>
              <p className="text-[#4e7297]">{section.text}</p>
              {section.contact && (
                <div className="mt-4 space-y-2">
                  <p className="flex items-center space-x-2">
                    <span className="font-medium">Email:</span>
                    <a
                      href={`mailto:${section.contact.email}`}
                      className="text-blue-600 hover:underline"
                    >
                      {section.contact.email}
                    </a>
                  </p>
                  <p className="flex items-center space-x-2">
                    <span className="font-medium">Phone:</span>
                    <a
                      href={`tel:${section.contact.phone}`}
                      className="text-blue-600 hover:underline"
                    >
                      {section.contact.phone}
                    </a>
                  </p>
                  <p className="flex items-center space-x-2">
                    <span className="font-medium">Location:</span>
                    <span>{section.contact.location}</span>
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Floating Back to Top Button */}
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-3 bg-white rounded-full shadow-lg border border-[#d0dbe7] hover:bg-[#e7edf3] transition-colors duration-200"
        >
          <ChevronUpIcon className="w-6 h-6 text-[#0e141b]" />
        </button>
      </div>
    </div>
  );
}

export default TOS;
