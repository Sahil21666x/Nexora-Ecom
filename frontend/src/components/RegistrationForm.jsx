import React, { useState } from "react";
import { Mail, User, CheckCircle } from "lucide-react";

const RegistrationForm = ({ workshop }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [regId, setRegId] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:5000/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    });

    const data = await response.json();
    setMessage(data.message);
    if (data.registrationId) setRegId(data.registrationId);
    setName("");
    setEmail("");
  };

  return (
    <section className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-gray-100 animate-fadeIn">
      <h3 className="text-2xl font-bold mb-5 text-center text-blue-700">
        {workshop.seatsAvailable > 0 ? "🚀 Enroll Now" : "🕓 Join the Waitlist"}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Field */}
        <div className="relative">
          <User className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Full Name"
            className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {/* Email Field */}
        <div className="relative">
          <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="email"
            placeholder="Email Address"
            className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={`w-full py-3 rounded-xl text-white font-semibold shadow-md transition-all ${
            workshop.seatsAvailable > 0
              ? "bg-blue-600 hover:bg-blue-700 active:scale-95"
              : "bg-gray-600 hover:bg-gray-700 active:scale-95"
          }`}
        >
          {workshop.seatsAvailable > 0 ? "Enroll Now" : "Join Waitlist"}
        </button>
      </form>

      {/* Success / Message Box */}
      {message && (
        <div className="mt-5 flex flex-col items-center justify-center text-center p-4 bg-green-50 border border-green-200 rounded-xl animate-fadeIn">
          <CheckCircle className="text-green-600 mb-2" size={28} />
          <p className="text-green-700 font-medium">{message}</p>
          {regId && (
            <p className="font-bold mt-2 text-green-800">🎟 Your ID: {regId}</p>
          )}
        </div>
      )}
    </section>
  );
};

export default RegistrationForm;
