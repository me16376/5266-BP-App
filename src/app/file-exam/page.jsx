import React, { Suspense } from 'react';
import FileExamStudio from '../../components/FileExamStudio';

export const metadata = {
  title: 'ফাইল এক্সাম স্টুডিও — CSV বা JSON ফাইল আপলোড করে মডেল টেস্ট দিন | JobSolutions BD',
  description: 'আপনার যেকোনো MCQ প্রশ্নভাণ্ডার (.csv, .json, .xlsx) ফাইল আপলোড করে সরাসরি লাইভ মডেল টেস্ট দিন। টাইমার, নেগেティブ মার্কিং, বিজয় ফন্ট কনভার্সন ও পূর্ণাঙ্গ সমাধান।',
  keywords: 'File Exam, CSV Exam, JSON Quiz, MCQ Model Test, BCS Model Test, Bank Job Exam',
};

export default function FileExamPage() {
  return (
    <Suspense fallback={<div style={{ padding: '80px', textAlign: 'center', color: '#059669', fontWeight: 600 }}>ফাইল এক্সাম স্টুডিও লোড হচ্ছে...</div>}>
      <FileExamStudio />
    </Suspense>
  );
}
