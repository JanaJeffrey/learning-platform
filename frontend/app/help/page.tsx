"use client";

import { useState } from "react";
import Link from "next/link";

export default function HelpPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      id: 1,
      question: "How do I enroll in a course?",
      answer: "To enroll in a course, simply browse our course catalog, click on the course you're interested in, and click the 'Enroll Now' button. You'll need to create an account or log in first. Free courses are available immediately, while paid courses require payment."
    },
    {
      id: 2,
      question: "How do I track my progress?",
      answer: "Your progress is automatically tracked as you watch lessons. You can view your overall progress on your Student Dashboard, which shows completion percentage for each enrolled course."
    },
    {
      id: 3,
      question: "Can I get a refund?",
      answer: "We offer a 30-day money-back guarantee for paid courses. If you're not satisfied, contact our support team within 30 days of purchase for a full refund."
    },
    {
      id: 4,
      question: "How do I become an instructor?",
      answer: "To become an instructor, register as an instructor when creating your account. Once approved, you can create and upload your own courses through the Instructor Dashboard."
    },
    {
      id: 5,
      question: "Do I get a certificate after completing a course?",
      answer: "Yes! Upon completing all lessons in a course, you'll receive a certificate of completion that you can download and share on LinkedIn or your resume."
    },
    {
      id: 6,
      question: "What payment methods do you accept?",
      answer: "We accept major credit cards (Visa, MasterCard, American Express) and PayPal. All payments are secure and encrypted."
    }
  ];

  const toggleFaq = (id: number) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Help Center
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Find answers to common questions
          </p>
        </div>

        {/* Contact Options - UPDATED with your real email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Email Support - FIXED */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 text-center">
            <div className="text-4xl mb-3">📧</div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Email Support</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">Get help within 24 hours</p>
            <a 
              href="mailto:nyigbajeffrey@gmail.com" 
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              nyigbajeffrey@gmail.com
            </a>
          </div>
          
          {/* WhatsApp Support - UPDATED */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 text-center">
            <div className="text-4xl mb-3">💬</div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">WhatsApp Support</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">Chat with me directly</p>
            <a 
              href="https://wa.me/2349165361515" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 dark:text-green-400 hover:underline"
            >
              +234 916 536 1515
            </a>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Frequently Asked Questions</h2>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {faqs.map((faq) => (
              <div key={faq.id} className="px-6 py-4">
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full text-left flex justify-between items-center"
                >
                  <span className="font-medium text-gray-900 dark:text-white">{faq.question}</span>
                  <span className="text-gray-400 dark:text-gray-500 text-xl">
                    {openFaq === faq.id ? "−" : "+"}
                  </span>
                </button>
                {openFaq === faq.id && (
                  <p className="mt-3 text-gray-600 dark:text-gray-400 leading-relaxed">
                    {faq.answer}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Still Need Help */}
        <div className="mt-8 text-center">
          <Link
            href="/contact"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Still need help? Contact me directly →
          </Link>
        </div>
      </div>
    </div>
  );
}