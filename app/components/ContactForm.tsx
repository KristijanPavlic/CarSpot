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
      className="mt-6 p-6 bg-[#212121] rounded-lg shadow-lg max-w-[800px]"
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
        {/* Contact Form */}
        <div className="rounded-lg">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-lg text-[#d6d6d6]">Name</label>
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
              <label className="block text-lg text-[#d6d6d6]">Email</label>
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
              <label className="block text-lg text-[#d6d6d6]">Message</label>
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
              className="w-full bg-[#BBD01A] text-[#212121] mt-8 p-3 rounded-md font-semibold hover:bg-[#525252] hover:text-white transition duration-300"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
