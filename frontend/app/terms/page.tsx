"use client";

import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
            <h1 className="text-3xl font-bold text-white">Terms of Service</h1>
            <p className="text-blue-100 mt-1">Last updated: May 12, 2025</p>
          </div>
          
          <div className="p-8 space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">1. Acceptance of Terms</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                By accessing and using LearnHub, you agree to be bound by these Terms of Service. 
                If you do not agree, please do not use our platform.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">2. User Accounts</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                You are responsible for maintaining the confidentiality of your account credentials. 
                You agree to accept responsibility for all activities that occur under your account.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">3. Course Enrollment</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Free courses are accessible immediately upon enrollment. Paid courses require payment 
                before access is granted.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">4. Refund Policy</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                We offer a 30-day money-back guarantee for paid courses. Contact our support team 
                within 30 days of purchase for a full refund.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">5. Intellectual Property</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                All course content is owned by LearnHub or its instructors and is protected by copyright law.
              </p>
            </section>
            
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 text-center text-sm text-gray-500 dark:text-gray-400">
              For questions about these terms, contact us at <a href="mailto:nyigbajeffery@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline">nyigbajeffrey@gmail.com</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}