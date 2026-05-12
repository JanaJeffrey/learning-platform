"use client";

import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
            <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
            <p className="text-blue-100 mt-1">Last updated: May 12, 2025</p>
          </div>
          
          <div className="p-8 space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Information We Collect</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                We collect information you provide directly to us, such as your name, email address, 
                and course progress data when you register for an account or enroll in a course.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">How We Use Your Information</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                We use your information to provide and improve our services, process enrollments, 
                track your learning progress, and respond to your inquiries.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Data Security</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                We implement industry-standard security measures to protect your personal information. 
                However, no method of transmission over the internet is 100% secure.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Cookies</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                We use cookies to remember your login status, track your course progress, 
                and analyze how you use our platform to improve your experience.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Third-Party Services</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                We may use third-party services for payment processing and analytics. These services 
                have their own privacy policies governing your data.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Your Rights</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                You may request to view, update, or delete your personal information at any time 
                by contacting our support team.
              </p>
            </section>
            
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 text-center text-sm text-gray-500 dark:text-gray-400">
              For privacy questions, contact us at <a href="mailto:nyigbajeffery@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline">nyigbajeffrey@gmail.com</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}