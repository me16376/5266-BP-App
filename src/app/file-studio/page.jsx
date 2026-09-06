'use client';

import React from 'react';
import { 
  FileSpreadsheet, 
  Shield, 
  Zap, 
  Search, 
  ArrowUpDown,
  Download,
  Printer,
  Languages
} from 'lucide-react';
import TableStudio from '../../components/TableStudio';

export default function FileStudioPage() {
  return (
    <div style={{ padding: '40px 0 80px' }}>
      <div className="container">
        {/* Header Section */}
        <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 36px' }}>
          <div style={{ display: 'inline-flex', gap: '8px', marginBottom: '12px' }}>
            <span className="badge badge-emerald">
              <Zap size={12} /> ১০০% ক্লায়েন্ট-সাইড প্রসেসিং
            </span>
            <span className="badge badge-cyan">
              <Shield size={12} /> জিরো সার্ভার আপলোড • সম্পূর্ণ নিরাপদ
            </span>
          </div>

          <h1 style={{
            fontSize: '2.4rem',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            color: '#0f172a',
            marginBottom: '10px'
          }}>
            ডাটা, ডকুমেন্ট ও টেবিল স্টুডিও
          </h1>

          <p style={{
            fontSize: '1.2rem',
            fontWeight: 700,
            background: 'var(--gradient-brand)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '12px'
          }}>
            Word (.docx), Excel (.xlsx), CSV এবং JSON রিডার ও PDF এক্সপোর্টার
          </p>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.96rem', lineHeight: '1.6' }}>
            আপনার যেকোনো Word ডকুমেন্ট, স্প্রেডশিট বা ডেটা ফাইল ড্রপ করুন — সাথে সাথে ব্রাউজারে রিড ও টেবিল আকারে ওপেন হবে। <strong>যেকোনো ফাইল এক ক্লিকে প্রিন্ট ও নিখুঁত বাংলা ফন্টে PDF হিসেবে সেভ বা এক্সপোর্ট করুন।</strong>
          </p>
        </div>

        {/* Core Table Studio Component */}
        <TableStudio />

        {/* Feature Highlights Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '20px',
          marginTop: '40px'
        }}>
          <div className="glass-panel" style={{ padding: '24px', background: '#ffffff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <div style={{ padding: '8px', borderRadius: '8px', background: '#ecfdf5', color: '#059669' }}>
                <FileSpreadsheet size={20} />
              </div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>মাল্টি-ফরম্যাট সাপোর্ট</h4>
            </div>
            <p style={{ fontSize: '0.86rem', color: '#475569', lineHeight: '1.6' }}>
              মাইক্রোসফট এক্সেল (.xlsx, .xls), কমা সেপারেটেড ভ্যালু (.csv) এবং আধুনিক ওয়েব ডেটা (.json) ফাইল সহজেই পার্স করে।
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '24px', background: '#ffffff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <div style={{ padding: '8px', borderRadius: '8px', background: '#f0fdfa', color: '#0891b2' }}>
                <Search size={20} />
              </div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>লাইভ সার্চ ও সর্টিং</h4>
            </div>
            <p style={{ fontSize: '0.86rem', color: '#475569', lineHeight: '1.6' }}>
              যেকোনো কলামের হেডার ক্লিক করে ছোট থেকে বড় বা বড় থেকে ছোট ক্রমানুসারে সাজান এবং রিয়েল-টাইমে যেকোনো ডেটা ফিল্টার করুন।
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '24px', background: '#ffffff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <div style={{ padding: '8px', borderRadius: '8px', background: '#ecfdf5', color: '#059669' }}>
                <Printer size={20} />
              </div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>নিখুঁত PDF এক্সপোর্ট</h4>
            </div>
            <p style={{ fontSize: '0.86rem', color: '#475569', lineHeight: '1.6' }}>
              যেকোনো Word ডকুমেন্ট বা স্প্রেডশিট টেবিল ১০০% স্পষ্ট বাংলা ফন্ট সহ সরাসরি PDF ফাইলে সেভ ও ডাউনলোড করুন।
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '24px', background: '#ffffff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <div style={{ padding: '8px', borderRadius: '8px', background: '#fef3c7', color: '#d97706' }}>
                <Languages size={20} />
              </div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>বাংলা ফন্ট ও বিজয় রিডার</h4>
            </div>
            <p style={{ fontSize: '0.86rem', color: '#475569', lineHeight: '1.6' }}>
              হিন্দ শিলিগুড়ি, কালপুরুষ, সোলাইমানলিপিসহ ৭টি বাংলা ফন্ট নির্বাচন এবং পুরাতন বিজয় (SutonnyMJ) ফাইলকে এক ক্লিকে স্পষ্ট ইউনিকোডে রূপান্তর।
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
