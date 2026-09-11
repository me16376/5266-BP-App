import './globals.css';
import 'katex/dist/katex.min.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export const metadata = {
  title: 'JobSolutions BD — বিসিএস, ব্যাংক ও সরকারি চাকরির ২,৫০,০০০+ MCQ প্রশ্নব্যাংক',
  description: 'বাংলাদেশের সকল বিসিএস, সরকারি ও বেসরকারি ব্যাংক, প্রাথমিক শিক্ষক নিয়োগ এবং মন্ত্রণালয়ের ২,৫০,০০০+ MCQ প্রশ্ন, বিস্তারিত ব্যাখ্যা, রিভিশন ও লাইভ মডেল টেস্ট।',
  keywords: 'Job Solutions, BCS MCQ, Bank Job Question Bank, NTRCA, Primary Exam, Next.js, Cloudflare Pages',
};

export default function RootLayout({ children }) {
  return (
    <html lang="bn">
      <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.maateen.me" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Anek+Bangla:wght@300;400;500;600;700&family=Hind+Siliguri:wght@300;400;500;600;700&family=Noto+Sans+Bengali:wght@300;400;500;600;700&family=Noto+Serif+Bengali:wght@400;600;700&family=Tiro+Bangla&family=Inter:wght@300;400;500;600;700;800&display=swap" 
          rel="stylesheet" 
        />
        <link href="https://fonts.maateen.me/kalpurush/font.css" rel="stylesheet" />
        <link href="https://fonts.maateen.me/solaiman-lipi/font.css" rel="stylesheet" />
        <link href="https://fonts.maateen.me/nikosh/font.css" rel="stylesheet" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <main style={{ flex: 1 }}>
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
