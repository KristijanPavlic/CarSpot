"use client";

import React, { useState } from "react";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ContactSection: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.loading("Sending message...");
    try {
      const res = await fetch("/api/resend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, message }),
      });

      if (res.ok) {
        toast.dismiss();
        toast.success("Message sent! We will get back to you soon.");
        setName("");
        setEmail("");
        setMessage("");
      } else {
        toast.error("Failed to send message. Please try again.");
      }
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    }
  };

  return (
    <section
      id="contact"
      className="py-16 px-6 md:px-12 lg:px-24 mt-6 bg-[#212121] rounded-lg shadow-lg"
    >
      <ToastContainer
        position="top-center"
        pauseOnHover
        theme="dark"
        newestOnTop
      />
      <div>
        <p className="text-lg text-white mb-12">
          If you have any questions or suggestions or want to share your
          car-spotting experience, feel free to contact us.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Info */}
          {/* <div className="flex flex-col space-y-6">
            <div className="flex items-center space-x-4">
              <div className="text-white">
                <span className="material-symbols-outlined">location_on</span>
              </div>
              <div>
                <h4 className="text-xl font-semibold text-white">Location</h4>
                <p className="text-white">
                  Car Spot, Main Street, Your City, Country
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-white">
                <span className="material-symbols-outlined">email</span>
              </div>
              <div>
                <h4 className="text-xl font-semibold text-white">Email</h4>
                <p className="text-white">contact@car-spot.com</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-white">
                <span className="material-symbols-outlined">phone</span>
              </div>
              <div>
                <h4 className="text-xl font-semibold text-white">Phone</h4>
                <p className="text-white">+123 456 789</p>
              </div>
            </div>
          </div> */}

          {/* Contact Form */}
          <div className="bg-white p-8 shadow-lg rounded-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-lg font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-[#bbd01a86]"
                  required
                />
              </div>
              <div>
                <label className="block text-lg font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  title="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-[#bbd01a86]"
                  required
                />
              </div>
              <div>
                <label className="block text-lg font-medium text-gray-700">
                  Message
                </label>
                <textarea
                  id="message"
                  title="Message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter your message"
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-[#bbd01a86]"
                  rows={4}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#BBD01A] text-[#212121] p-3 rounded-md font-semibold hover:bg-[#212121] hover:text-white transition duration-300"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
