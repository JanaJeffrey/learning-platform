"use client";

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface CertificateCardProps {
  certificate: {
    id: string;
    certificate_number: string;
    course_title: string;
    issued_at: string;
    downloaded_at: string | null;
  };
  onDownload?: () => void;
}

export default function CertificateCard({ certificate, onDownload }: CertificateCardProps) {
  const { token } = useAuth();
  const [downloading, setDownloading] = useState(false);

  // SAFETY CHECK - prevents the undefined error
  if (!certificate || !certificate.certificate_number) {
    return null;
  }

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const response = await fetch(`${API_URL}/certificates/download/${certificate.certificate_number}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) throw new Error('Download failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Certificate-${certificate.certificate_number}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      
      if (onDownload) onDownload();
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download certificate');
    } finally {
      setDownloading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'Invalid date';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="text-white">
            <div className="text-2xl mb-1">🎓</div>
            <h3 className="font-bold text-lg">Certificate of Completion</h3>
          </div>
          <div className="text-right">
            <div className="text-white/80 text-xs">Certificate ID</div>
            <div className="text-white text-sm font-mono">{certificate.certificate_number}</div>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <h4 className="font-semibold text-gray-900 dark:text-white text-lg mb-2">
          {certificate.course_title}
        </h4>
        
        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Issued: {formatDate(certificate.issued_at)}</span>
          </div>
          {certificate.downloaded_at && (
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Downloaded: {formatDate(certificate.downloaded_at)}</span>
            </div>
          )}
        </div>
        
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {downloading ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download Certificate
            </>
          )}
        </button>
      </div>
    </div>
  );
}