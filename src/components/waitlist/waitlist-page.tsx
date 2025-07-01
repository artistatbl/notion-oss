'use client';

import { useState } from 'react';
import { Mail, Users, Sparkles, ArrowRight } from 'lucide-react';

export default function WaitlistPage() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form is disabled - no submission logic
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Something Amazing is Coming
          </h1>
          <p className="text-gray-600 text-lg">
            We're building the future of productivity. Be the first to know when we launch.
          </p>
        </div>

        {/* Waitlist Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center space-x-2 text-blue-600">
              <Users className="h-5 w-5" />
              <span className="text-sm font-medium">Join the Waitlist</span>
            </div>
            <p className="text-gray-500 text-sm">
              Get early access and exclusive updates
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                disabled
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 text-gray-400 cursor-not-allowed"
              />
            </div>
            
            <button
              type="submit"
              disabled
              className="w-full bg-gray-300 text-gray-500 py-3 px-4 rounded-xl font-medium transition-all duration-200 cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <span>Join Waitlist</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Status Message */}
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-amber-50 text-amber-700 px-4 py-2 rounded-lg border border-amber-200">
              <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Not accepting signups yet</span>
            </div>
          </div>
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-2">What to expect:</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                <span>Early access to beta features</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                <span>Exclusive updates and insights</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                <span>Priority support and feedback</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          <p>We respect your privacy. No spam, ever.</p>
        </div>
      </div>
    </div>
  );
}