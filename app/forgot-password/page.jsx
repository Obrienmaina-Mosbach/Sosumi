// app/forgot-password/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { toast } from 'react-toastify'; // Import toast

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Even if response.ok is false, the backend might send a generic message
        // for security reasons (e.g., if email not found).
        // Check if the message is the generic success message from backend.
        if (data.message && data.message.includes("If a matching account is found")) {
            toast.success(data.message); // Still show as success for generic message
        } else {
            toast.error(data.message || 'Failed to send reset email.');
        }
        throw new Error(data.message || 'Failed to send reset email.'); // Still throw to enter catch block for console.error
      }

      // If response.ok is true, it's definitely a success
      toast.success(data.message);
      setEmail(''); // Clear the email field
    } catch (err) {
      console.error('Forgot Password Error:', err);
      // Only show a generic error if the toast wasn't already shown by specific backend message
      if (!err.message.includes("If a matching account is found")) {
          toast.error(err.message || 'An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white p-8 md:p-12 rounded-lg shadow-xl w-full max-w-md">
        <h1 className="text-4xl font-semibold mb-8 text-gray-800 text-center">Forgot Password</h1>

        <p className="text-center text-gray-600 mb-6">
          Enter your email address below and we'll send you a link to reset your password.
        </p>

        {/* Removed direct message/error divs, toast will handle notifications */}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="email" className="block text-lg font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-4 py-3 bg-gray-200 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-lg"
              placeholder="your@example.com"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full px-6 py-3 bg-[#5936BB] text-white font-medium rounded-full hover:bg-[#4a2bb2] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5936BB] text-lg transition-colors"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-700 text-base">
          <Link href="/signin" className="text-indigo-600 font-semibold hover:underline">
            Back to Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
