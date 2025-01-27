import React, { useState } from "react";
import { saveContactForm } from "../../../../Firestore/UserDocument";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [dialog, setDialog] = useState({
    isOpen: false,
    message: "",
    isSuccess: false,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await saveContactForm(formData);
      setDialog({
        isOpen: true,
        message: "Message sent successfully!",
        isSuccess: true,
      });
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      setDialog({
        isOpen: true,
        message: "Failed to send message. Please try again.",
        isSuccess: false,
      });
    }
  };

  const closeDialog = () => {
    setDialog({ ...dialog, isOpen: false });
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-6 space-y-12">
      {/* Contact Info Card */}
      <Card className="shadow-lg border border-gray-300 bg-gradient-to-br from-blue-100 to-white">
        <CardHeader className="text-center">
          <h2 className="text-3xl font-bold text-blue-600 mb-4">Contact Info</h2>
          <p className="text-gray-600 ">
            Reach out to us directly through the contact details below.
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full">
                📞
              </div>
              <p className="text-lg font-semibold text-gray-700">
                +91 91520 04851
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full">
                📧
              </div>
              <p className="text-lg font-semibold text-gray-700">
                adityapoojary07@gmail.com
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Form */}
      
        <CardHeader className="text-center">
          <h2 className="text-4xl font-bold text-blue-600 mb-2">Contact Us</h2>
          <p className="text-gray-600 pt-10">
            We'd love to hear from you! Fill out the form below and we’ll get
            back to you shortly.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Full Name"
                required
                className="border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your Email Address"
                required
                className="border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Your Phone Number"
                required
                className="border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
              <Input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Subject of Your Inquiry"
                required
                className="border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Write your message here..."
              required
              className="border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
            <div className="text-center">
              <Button
                type="submit"
                className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white text-lg rounded-lg shadow-md transition duration-300"
              >
                Submit
              </Button>
            </div>
          </form>
        </CardContent>
      

      {/* Dialog for Success/Error */}
      {dialog.isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm mx-auto text-center">
            <h3
              className={`text-xl font-bold mb-4 ${
                dialog.isSuccess ? "text-green-500" : "text-red-500"
              }`}
            >
              {dialog.isSuccess ? "Success" : "Error"}
            </h3>
            <p className="text-gray-700 mb-6">{dialog.message}</p>
            <Button
              onClick={closeDialog}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
