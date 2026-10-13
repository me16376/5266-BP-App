'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  BookOpen, 
  Layers, 
  Timer, 
  Bookmark, 
  Menu, 
  X, 
  Sparkles,
  User,
  LogIn,
  LogOut,
  ChevronDown,
  ChevronRight,
  Shield,
  Laptop,
  Flame,
  Cpu,
  GraduationCap,
  Zap,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../lib/authContext';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [jobSolutionsDropdownOpen, setJobSolutionsDropdownOpen] = useState(false);
  const [mobileJobSolutionsOpen, setMobileJobSolutionsOpen] = useState(true);
  const [specialDropdownOpen, setSpecialDropdownOpen] = useState(false);
  const [mobileSpecialOpen, setMobileSpecialOpen] = useState(true);
  const [mostImportantDropdownOpen, setMostImportantDropdownOpen] = useState(false);
  const [mobileMostImportantOpen, setMobileMostImportantOpen] = useState(true);
  const [smartAiDropdownOpen, setSmartAiDropdownOpen] = useState(false);
  const [mobileSmartAiOpen, setMobileSmartAiOpen] = useState(true);

  const dropdownRef = useRef(null);
  const jobSolutionsDropdownRef = useRef(null);
  const jobSolutionsTimeoutRef = useRef(null);
  const specialDropdownRef = useRef(null);
  const specialTimeoutRef = useRef(null);
  const mostImportantDropdownRef = useRef(null);
  const mostImportantTimeoutRef = useRef(null);
  const smartAiDropdownRef = useRef(null);
  const smartAiTimeoutRef = useRef(null);

  const { user, logout } = useAuth();

  const isJobSolutionActive = pathname === '/job-solution' || pathname.startsWith('/job-solution') || pathname.startsWith('/question-bank-smart');
  const isIctActive = pathname === '/ict' || pathname.startsWith('/ict');
  const isMostImportantActive = pathname === '/most-important-questions' || pathname.startsWith('/most-important-questions') || pathname.startsWith('/most-important-smart');
  const isAmpibianActive = pathname === '/ampibian-suggestion' || pathname.startsWith('/ampibian-suggestion');
  const isBiddabariActive = pathname === '/biddabari-ntrca' || pathname.startsWith('/biddabari-ntrca');
  const isSmartAiActive = pathname === '/smart-ai' || pathname.startsWith('/smart-ai');
  const isSpecialActive = isIctActive || isAmpibianActive || isBiddabariActive;

  const handleMouseEnterJobSolutions = () => {
    if (jobSolutionsTimeoutRef.current) clearTimeout(jobSolutionsTimeoutRef.current);
    setJobSolutionsDropdownOpen(true);
  };

  const handleMouseLeaveJobSolutions = () => {
    jobSolutionsTimeoutRef.current = setTimeout(() => {
      setJobSolutionsDropdownOpen(false);
    }, 150);
  };

  const handleMouseEnterSpecial = () => {
    if (specialTimeoutRef.current) clearTimeout(specialTimeoutRef.current);
    setSpecialDropdownOpen(true);
  };

  const handleMouseLeaveSpecial = () => {
    specialTimeoutRef.current = setTimeout(() => {
      setSpecialDropdownOpen(false);
    }, 200);
  };

  const handleMouseEnterMostImportant = () => {
    if (mostImportantTimeoutRef.current) clearTimeout(mostImportantTimeoutRef.current);
    setMostImportantDropdownOpen(true);
  };

  const handleMouseLeaveMostImportant = () => {
    mostImportantTimeoutRef.current = setTimeout(() => {
      setMostImportantDropdownOpen(false);
    }, 150);
  };

  const handleMouseEnterSmartAi = () => {
    if (smartAiTimeoutRef.current) clearTimeout(smartAiTimeoutRef.current);
    setSmartAiDropdownOpen(true);
  };

  const handleMouseLeaveSmartAi = () => {
    smartAiTimeoutRef.current = setTimeout(() => {
      setSmartAiDropdownOpen(false);
    }, 150);
  };

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
      if (jobSolutionsDropdownRef.current && !jobSolutionsDropdownRef.current.contains(event.target)) {
        setJobSolutionsDropdownOpen(false);
      }
      if (specialDropdownRef.current && !specialDropdownRef.current.contains(event.target)) {
        setSpecialDropdownOpen(false);
      }
      if (mostImportantDropdownRef.current && !mostImportantDropdownRef.current.contains(event.target)) {
        setMostImportantDropdownOpen(false);
      }
      if (smartAiDropdownRef.current && !smartAiDropdownRef.current.contains(event.target)) {
        setSmartAiDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (jobSolutionsTimeoutRef.current) clearTimeout(jobSolutionsTimeoutRef.current);
      if (specialTimeoutRef.current) clearTimeout(specialTimeoutRef.current);
      if (mostImportantTimeoutRef.current) clearTimeout(mostImportantTimeoutRef.current);
      if (smartAiTimeoutRef.current) clearTimeout(smartAiTimeoutRef.current);
    };
  }, []);

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-subtle)',
      boxShadow: '0 1px 4px rgba(0, 0, 0, 0.04)'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '72px'
      }}>
        {/* Brand Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'var(--gradient-brand)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)'
          }}>
            <BookOpen size={24} color="#ffffff" />
          </div>
          <div>
            <div style={{
              fontWeight: 800,
              fontSize: '1.25rem',
              letterSpacing: '-0.02em',
              color: '#0f172a',
              whiteSpace: 'nowrap'
            }}>
              JobSolutions <span style={{ color: 'var(--emerald-600)' }}>BD</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '-3px', whiteSpace: 'nowrap' }}>
              ২,৫০,০০০+ জব সলিউশনস ও এক্সাম
            </div>
          </div>
        </Link>

        {/* Desktop Nav (Right Aligned with margin before User Button) */}
        <nav 
          className="desktop-nav" 
          style={{ 
            marginLeft: 'auto', 
            marginRight: '10px', 
            alignItems: 'center', 
            gap: '3px',
            flexWrap: 'nowrap',
            whiteSpace: 'nowrap',
            flexShrink: 0
          }}
        >
          {/* Home with FontAwesome House Icon */}
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 11px',
              borderRadius: '8px',
              fontSize: '0.88rem',
              fontWeight: 600,
              whiteSpace: 'nowrap',
              color: pathname === '/' ? '#047857' : '#475569',
              background: pathname === '/' ? '#ecfdf5' : 'transparent',
              border: pathname === '/' ? '1px solid #a7f3d0' : '1px solid transparent',
              transition: 'all 0.2s ease'
            }}
          >
            <i className="fa-solid fa-house" style={{ fontSize: '14px' }}></i>
            <span>হোম</span>
          </Link>

          {/* All Question Bank Dropdown (Layout box & Layout smart) */}
          <div 
            style={{ position: 'relative' }} 
            ref={jobSolutionsDropdownRef}
            onMouseEnter={handleMouseEnterJobSolutions}
            onMouseLeave={handleMouseLeaveJobSolutions}
          >
            <button
              onClick={() => setJobSolutionsDropdownOpen(prev => !prev)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '7px 10px',
                borderRadius: '8px',
                fontSize: '0.88rem',
                fontWeight: 600,
                fontFamily: 'inherit',
                lineHeight: 1.5,
                whiteSpace: 'nowrap',
                color: isJobSolutionActive ? '#047857' : '#475569',
                background: isJobSolutionActive ? '#ecfdf5' : jobSolutionsDropdownOpen ? '#f8fafc' : 'transparent',
                border: isJobSolutionActive ? '1px solid #a7f3d0' : '1px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              aria-expanded={jobSolutionsDropdownOpen}
              aria-haspopup="true"
            >
              <Layers size={15} color={isJobSolutionActive ? '#047857' : '#475569'} />
              <span>সকল প্রশ্ন ব্যাংক</span>
              <ChevronDown 
                size={14} 
                style={{
                  transform: jobSolutionsDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease',
                  opacity: 0.75
                }}
              />
            </button>

            {/* Dropdown Menu */}
            {jobSolutionsDropdownOpen && (
              <div 
                className="dropdown-menu-anim"
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  left: 0,
                  width: '235px',
                  background: '#ffffff',
                  borderRadius: '12px',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.04)',
                  border: '1px solid #e2e8f0',
                  padding: '6px',
                  zIndex: 100
                }}
              >
                {/* Option 1: Layout box */}
                <Link
                  href="/job-solution"
                  onClick={() => setJobSolutionsDropdownOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontSize: '0.92rem',
                    fontWeight: 600,
                    color: pathname === '/job-solution' ? '#047857' : '#1e293b',
                    background: pathname === '/job-solution' ? '#ecfdf5' : 'transparent',
                    border: pathname === '/job-solution' ? '1px solid #a7f3d0' : '1px solid transparent',
                    textDecoration: 'none',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (pathname !== '/job-solution') e.currentTarget.style.background = '#ecfdf5';
                  }}
                  onMouseLeave={(e) => {
                    if (pathname !== '/job-solution') e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <Layers size={16} color={pathname === '/job-solution' ? '#047857' : '#059669'} style={{ marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>Layout box</span>
                    </div>
                    <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 500, display: 'block', marginTop: '1px' }}>
                      পরীক্ষাভিত্তিক প্রশ্নব্যাংক
                    </span>
                  </div>
                </Link>

                {/* Option 2: Layout smart */}
                <Link
                  href="/question-bank-smart/"
                  onClick={() => setJobSolutionsDropdownOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontSize: '0.92rem',
                    fontWeight: 600,
                    color: pathname?.startsWith('/question-bank-smart') ? '#047857' : '#1e293b',
                    background: pathname?.startsWith('/question-bank-smart') ? '#ecfdf5' : 'transparent',
                    border: pathname?.startsWith('/question-bank-smart') ? '1px solid #a7f3d0' : '1px solid transparent',
                    textDecoration: 'none',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!pathname?.startsWith('/question-bank-smart')) e.currentTarget.style.background = '#ecfdf5';
                  }}
                  onMouseLeave={(e) => {
                    if (!pathname?.startsWith('/question-bank-smart')) e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <Sparkles size={16} color={pathname?.startsWith('/question-bank-smart') ? '#047857' : '#0284c7'} style={{ marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>Layout smart</span>
                    </div>
                    <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 500, display: 'block', marginTop: '1px' }}>
                      প্রশ্নভিত্তিক জব সল্যুশন
                    </span>
                  </div>
                </Link>
              </div>
            )}
          </div>

          {/* Special Question Bank Mega Menu (ICT, Ampibian, Biddabari) */}
          <div 
            style={{ position: 'relative' }} 
            ref={specialDropdownRef}
            onMouseEnter={handleMouseEnterSpecial}
            onMouseLeave={handleMouseLeaveSpecial}
          >
            <button
              onClick={() => setSpecialDropdownOpen(prev => !prev)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '7px 10px',
                borderRadius: '8px',
                fontSize: '0.88rem',
                fontWeight: 600,
                fontFamily: 'inherit',
                lineHeight: 1.5,
                whiteSpace: 'nowrap',
                color: isSpecialActive ? '#047857' : '#475569',
                background: isSpecialActive ? '#ecfdf5' : specialDropdownOpen ? '#f8fafc' : 'transparent',
                border: isSpecialActive ? '1px solid #a7f3d0' : '1px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              aria-expanded={specialDropdownOpen}
              aria-haspopup="true"
            >
              <BookOpen size={15} color={isSpecialActive ? '#047857' : '#059669'} />
              <span>স্পেশাল সাজেশন হাব</span>
              <ChevronDown 
                size={14} 
                style={{
                  transform: specialDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease',
                  opacity: 0.75
                }}
              />
            </button>

            {/* Special Question Bank Mega Menu */}
            {specialDropdownOpen && (
              <div 
                className="mega-menu-container dropdown-menu-anim"
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  left: '-70px',
                  width: '800px',
                  background: '#ffffff',
                  borderRadius: '18px',
                  boxShadow: '0 24px 50px -12px rgba(15, 23, 42, 0.16), 0 0 0 1px rgba(15, 23, 42, 0.06)',
                  border: '1px solid #e2e8f0',
                  overflow: 'hidden',
                  zIndex: 1000
                }}
              >
                {/* Sleek Minimalist Top Strip */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '11px 20px',
                  background: '#fafbfc',
                  borderBottom: '1px solid #f1f5f9'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '6px',
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      boxShadow: '0 2px 6px rgba(16, 185, 129, 0.25)'
                    }}>
                      <BookOpen size={13} />
                    </div>
                    <span style={{ fontWeight: 800, fontSize: '0.88rem', color: '#0f172a', letterSpacing: '-0.01em' }}>
                      স্পেশাল সাজেশন হাব
                    </span>
                    <span style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 500 }}>
                      • ৩টি মাস্টার আর্কাইভ
                    </span>
                  </div>
                  <div style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: '#047857',
                    background: '#ecfdf5',
                    padding: '2px 9px',
                    borderRadius: '12px',
                    border: '1px solid #a7f3d0'
                  }}>
                    মোট ১৭,৮৮৯টি MCQ
                  </div>
                </div>

                {/* Body Grid: 3 Distinct Colored Cards Matching Reference Mockup */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '12px',
                  padding: '14px 16px'
                }}>
                  {/* Card 1: ICT (Mint / Green Theme) */}
                  <div style={{
                    background: '#f2faf5',
                    border: '1.5px solid #a7f3d0',
                    borderRadius: '16px',
                    padding: '12px 10px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}>
                    {/* Header */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingBottom: '2px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '11px',
                          background: '#d1fae5',
                          color: '#059669',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          <Laptop size={19} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#0f172a', lineHeight: 1.2 }}>আইসিটি (ICT)</div>
                          <div style={{ fontSize: '0.71rem', color: '#64748b', fontWeight: 500, marginTop: '2px' }}>কম্পিউটার ও তথ্যপ্রযুক্তি</div>
                        </div>
                      </div>
                      <span style={{
                        background: '#d1fae5',
                        color: '#047857',
                        padding: '3px 8px',
                        borderRadius: '20px',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        whiteSpace: 'nowrap'
                      }}>
                        ১,৭৫৮ MCQ
                      </span>
                    </div>

                    {/* Sub-item 1: Layout Box */}
                    <Link
                      href="/ict"
                      onClick={() => setSpecialDropdownOpen(false)}
                      className="mockup-link-card"
                      style={{
                        background: pathname === '/ict' ? '#ecfdf5' : '#ffffff',
                        borderRadius: '12px',
                        padding: '9px 11px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        textDecoration: 'none',
                        border: pathname === '/ict' ? '1px solid #10b981' : '1px solid #e2e8f0',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '9px', minWidth: 0 }}>
                        <div style={{
                          width: '30px',
                          height: '30px',
                          borderRadius: '8px',
                          background: '#d1fae5',
                          color: '#059669',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          <Layers size={15} />
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0f172a', lineHeight: 1.2 }}>
                            Layout box
                          </div>
                          <span style={{ fontSize: '0.71rem', color: '#64748b', fontWeight: 500, display: 'block', marginTop: '1px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            অধ্যায়ভিত্তিক প্রশ্ন ও পরীক্ষা
                          </span>
                        </div>
                      </div>
                      <ChevronRight size={14} color="#94a3b8" className="mockup-chevron" style={{ flexShrink: 0 }} />
                    </Link>

                    {/* Sub-item 2: Layout Smart */}
                    <Link
                      href="/ict-smart/"
                      onClick={() => setSpecialDropdownOpen(false)}
                      className="mockup-link-card"
                      style={{
                        background: pathname?.startsWith('/ict-smart') ? '#ecfdf5' : '#ffffff',
                        borderRadius: '12px',
                        padding: '9px 11px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        textDecoration: 'none',
                        border: pathname?.startsWith('/ict-smart') ? '1px solid #10b981' : '1px solid #e2e8f0',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '9px', minWidth: 0 }}>
                        <div style={{
                          width: '30px',
                          height: '30px',
                          borderRadius: '8px',
                          background: '#d1fae5',
                          color: '#059669',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          <Sparkles size={15} />
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0f172a', lineHeight: 1.2 }}>
                            Layout smart
                          </div>
                          <span style={{ fontSize: '0.71rem', color: '#64748b', fontWeight: 500, display: 'block', marginTop: '1px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            স্মার্ট প্রশ্ন সমাধান ও ফিল্টার
                          </span>
                        </div>
                      </div>
                      <ChevronRight size={14} color="#94a3b8" className="mockup-chevron" style={{ flexShrink: 0 }} />
                    </Link>
                  </div>

                  {/* Card 2: Ampibian (Unified Soft Light Theme) */}
                  <div style={{
                    background: '#f2faf5',
                    border: '1.5px solid #a7f3d0',
                    borderRadius: '16px',
                    padding: '12px 10px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}>
                    {/* Header */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingBottom: '2px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '11px',
                          background: '#d1fae5',
                          color: '#059669',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          <BookOpen size={19} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#0f172a', lineHeight: 1.2 }}>অ্যাম্ফিবিয়ান</div>
                          <div style={{ fontSize: '0.71rem', color: '#64748b', fontWeight: 500, marginTop: '2px' }}>স্পেশাল সাজেশন</div>
                        </div>
                      </div>
                      <span style={{
                        background: '#d1fae5',
                        color: '#047857',
                        padding: '3px 8px',
                        borderRadius: '20px',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        whiteSpace: 'nowrap'
                      }}>
                        ৬,১৫৭ MCQ
                      </span>
                    </div>

                    {/* Sub-item 1: Layout Box */}
                    <Link
                      href="/ampibian-suggestion"
                      onClick={() => setSpecialDropdownOpen(false)}
                      className="mockup-link-card"
                      style={{
                        background: pathname === '/ampibian-suggestion' ? '#ecfdf5' : '#ffffff',
                        borderRadius: '12px',
                        padding: '9px 11px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        textDecoration: 'none',
                        border: pathname === '/ampibian-suggestion' ? '1px solid #10b981' : '1px solid #e2e8f0',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '9px', minWidth: 0 }}>
                        <div style={{
                          width: '30px',
                          height: '30px',
                          borderRadius: '8px',
                          background: '#d1fae5',
                          color: '#059669',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          <Layers size={15} />
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0f172a', lineHeight: 1.2 }}>
                            Layout box
                          </div>
                          <span style={{ fontSize: '0.71rem', color: '#64748b', fontWeight: 500, display: 'block', marginTop: '1px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            অধ্যায়ভিত্তিক সাজেশন ও টেস্ট
                          </span>
                        </div>
                      </div>
                      <ChevronRight size={14} color="#94a3b8" className="mockup-chevron" style={{ flexShrink: 0 }} />
                    </Link>

                    {/* Sub-item 2: Layout Smart */}
                    <Link
                      href="/ampibian-suggestion-smart/"
                      onClick={() => setSpecialDropdownOpen(false)}
                      className="mockup-link-card"
                      style={{
                        background: pathname?.startsWith('/ampibian-suggestion-smart') ? '#ecfdf5' : '#ffffff',
                        borderRadius: '12px',
                        padding: '9px 11px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        textDecoration: 'none',
                        border: pathname?.startsWith('/ampibian-suggestion-smart') ? '1px solid #10b981' : '1px solid #e2e8f0',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '9px', minWidth: 0 }}>
                        <div style={{
                          width: '30px',
                          height: '30px',
                          borderRadius: '8px',
                          background: '#d1fae5',
                          color: '#059669',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          <Sparkles size={15} />
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0f172a', lineHeight: 1.2 }}>
                            Layout smart
                          </div>
                          <span style={{ fontSize: '0.71rem', color: '#64748b', fontWeight: 500, display: 'block', marginTop: '1px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            স্মার্ট সাজেশন রুম ও শর্টকাট
                          </span>
                        </div>
                      </div>
                      <ChevronRight size={14} color="#94a3b8" className="mockup-chevron" style={{ flexShrink: 0 }} />
                    </Link>
                  </div>

                  {/* Card 3: Biddabari NTRCA (Unified Soft Light Theme) */}
                  <div style={{
                    background: '#f2faf5',
                    border: '1.5px solid #a7f3d0',
                    borderRadius: '16px',
                    padding: '12px 10px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}>
                    {/* Header */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingBottom: '2px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '11px',
                          background: '#d1fae5',
                          color: '#059669',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          <GraduationCap size={19} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#0f172a', lineHeight: 1.2 }}>বিদ্যাবাড়ি NTRCA</div>
                          <div style={{ fontSize: '0.71rem', color: '#64748b', fontWeight: 500, marginTop: '2px' }}>শিক্ষক নিবন্ধন ও লেকচার</div>
                        </div>
                      </div>
                      <span style={{
                        background: '#d1fae5',
                        color: '#047857',
                        padding: '3px 8px',
                        borderRadius: '20px',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        whiteSpace: 'nowrap'
                      }}>
                        ৯,৯৭৪ MCQ
                      </span>
                    </div>

                    {/* Sub-item 1: Layout Box */}
                    <Link
                      href="/biddabari-ntrca"
                      onClick={() => setSpecialDropdownOpen(false)}
                      className="mockup-link-card"
                      style={{
                        background: pathname === '/biddabari-ntrca' ? '#ecfdf5' : '#ffffff',
                        borderRadius: '12px',
                        padding: '9px 11px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        textDecoration: 'none',
                        border: pathname === '/biddabari-ntrca' ? '1px solid #10b981' : '1px solid #e2e8f0',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '9px', minWidth: 0 }}>
                        <div style={{
                          width: '30px',
                          height: '30px',
                          borderRadius: '8px',
                          background: '#d1fae5',
                          color: '#059669',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          <Layers size={15} />
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0f172a', lineHeight: 1.2 }}>
                            Layout box
                          </div>
                          <span style={{ fontSize: '0.71rem', color: '#64748b', fontWeight: 500, display: 'block', marginTop: '1px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            লেকচারভিত্তিক প্রশ্ন ও পরীক্ষা
                          </span>
                        </div>
                      </div>
                      <ChevronRight size={14} color="#94a3b8" className="mockup-chevron" style={{ flexShrink: 0 }} />
                    </Link>

                    {/* Sub-item 2: Layout Smart */}
                    <Link
                      href="/biddabari-ntrca-smart/"
                      onClick={() => setSpecialDropdownOpen(false)}
                      className="mockup-link-card"
                      style={{
                        background: pathname?.startsWith('/biddabari-ntrca-smart') ? '#ecfdf5' : '#ffffff',
                        borderRadius: '12px',
                        padding: '9px 11px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        textDecoration: 'none',
                        border: pathname?.startsWith('/biddabari-ntrca-smart') ? '1px solid #10b981' : '1px solid #e2e8f0',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '9px', minWidth: 0 }}>
                        <div style={{
                          width: '30px',
                          height: '30px',
                          borderRadius: '8px',
                          background: '#d1fae5',
                          color: '#059669',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          <Sparkles size={15} />
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0f172a', lineHeight: 1.2 }}>
                            Layout smart
                          </div>
                          <span style={{ fontSize: '0.71rem', color: '#64748b', fontWeight: 500, display: 'block', marginTop: '1px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            শিক্ষক নিবন্ধন স্পেশাল ভিউ
                          </span>
                        </div>
                      </div>
                      <ChevronRight size={14} color="#94a3b8" className="mockup-chevron" style={{ flexShrink: 0 }} />
                    </Link>
                  </div>
                </div>

                {/* Footer Bar */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '9px 18px',
                  background: '#fafbfc',
                  borderTop: '1px solid #f1f5f9',
                  fontSize: '0.75rem'
                }}>
                  <div style={{ color: '#64748b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={13} color="#059669" />
                    <span>আইসিটি, অ্যাম্ফিবিয়ান ও বিদ্যাবাড়ি—সবগুলোতেই প্রশ্নব্যাংক ও স্মার্ট ভিউ মোড উপলব্ধ</span>
                  </div>
                  <span style={{ color: '#047857', fontWeight: 700 }}>
                    ১০০% নির্ভুল সমাধান
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Most Important Questions Dropdown (Layout box & Layout smart) */}
          <div 
            style={{ position: 'relative' }} 
            ref={mostImportantDropdownRef}
            onMouseEnter={handleMouseEnterMostImportant}
            onMouseLeave={handleMouseLeaveMostImportant}
          >
            <button
              onClick={() => setMostImportantDropdownOpen(prev => !prev)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '7px 10px',
                borderRadius: '8px',
                fontSize: '0.88rem',
                fontWeight: 600,
                fontFamily: 'inherit',
                lineHeight: 1.5,
                whiteSpace: 'nowrap',
                color: isMostImportantActive ? '#047857' : '#475569',
                background: isMostImportantActive ? '#ecfdf5' : mostImportantDropdownOpen ? '#f8fafc' : 'transparent',
                border: isMostImportantActive ? '1px solid #a7f3d0' : '1px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              aria-expanded={mostImportantDropdownOpen}
              aria-haspopup="true"
            >
              <Flame size={15} color={isMostImportantActive ? '#047857' : '#e11d48'} />
              <span>সর্বাধিক কমন</span>
              <ChevronDown 
                size={14} 
                style={{
                  transform: mostImportantDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease',
                  opacity: 0.75
                }}
              />
            </button>

            {/* Most Important Dropdown Menu */}
            {mostImportantDropdownOpen && (
              <div 
                className="dropdown-menu-anim"
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  left: 0,
                  width: '240px',
                  background: '#ffffff',
                  borderRadius: '12px',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.04)',
                  border: '1px solid #e2e8f0',
                  padding: '6px',
                  zIndex: 100
                }}
              >
                <Link
                  href="/most-important-questions"
                  onClick={() => setMostImportantDropdownOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontSize: '0.92rem',
                    fontWeight: 600,
                    color: pathname === '/most-important-questions' ? '#047857' : '#1e293b',
                    background: pathname === '/most-important-questions' ? '#ecfdf5' : 'transparent',
                    border: pathname === '/most-important-questions' ? '1px solid #a7f3d0' : '1px solid transparent',
                    textDecoration: 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Layers size={16} color={pathname === '/most-important-questions' ? '#047857' : '#059669'} style={{ marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>Layout box</span>
                    </div>
                    <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 500, display: 'block', marginTop: '1px' }}>
                      বিষয়ভিত্তিক কমন প্রশ্নাবলী
                    </span>
                  </div>
                </Link>

                <Link
                  href="/most-important-smart/"
                  onClick={() => setMostImportantDropdownOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontSize: '0.92rem',
                    fontWeight: 600,
                    color: pathname?.startsWith('/most-important-smart') ? '#047857' : '#1e293b',
                    background: pathname?.startsWith('/most-important-smart') ? '#ecfdf5' : 'transparent',
                    border: pathname?.startsWith('/most-important-smart') ? '1px solid #a7f3d0' : '1px solid transparent',
                    textDecoration: 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Sparkles size={16} color={pathname?.startsWith('/most-important-smart') ? '#047857' : '#0284c7'} style={{ marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>Layout smart</span>
                    </div>
                    <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 500, display: 'block', marginTop: '1px' }}>
                      স্মার্ট সমাধান ও প্র্যাকটিস
                    </span>
                  </div>
                </Link>
              </div>
            )}
          </div>



          {/* Smart AI Dropdown */}
          <div 
            style={{ position: 'relative' }} 
            ref={smartAiDropdownRef}
            onMouseEnter={handleMouseEnterSmartAi}
            onMouseLeave={handleMouseLeaveSmartAi}
          >
            <button
              onClick={() => setSmartAiDropdownOpen(prev => !prev)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '7px 10px',
                borderRadius: '8px',
                fontSize: '0.88rem',
                fontWeight: 600,
                fontFamily: 'inherit',
                lineHeight: 1.5,
                whiteSpace: 'nowrap',
                color: isSmartAiActive ? '#047857' : '#475569',
                background: isSmartAiActive ? '#ecfdf5' : smartAiDropdownOpen ? '#f8fafc' : 'transparent',
                border: isSmartAiActive ? '1px solid #a7f3d0' : '1px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              aria-expanded={smartAiDropdownOpen}
              aria-haspopup="true"
            >
              <Cpu size={15} color={isSmartAiActive ? '#047857' : '#7c3aed'} />
              <span>স্মার্ট AI</span>
              <ChevronDown 
                size={14} 
                style={{
                  transform: smartAiDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease',
                  opacity: 0.75
                }}
              />
            </button>

            {smartAiDropdownOpen && (
              <div 
                className="dropdown-menu-anim"
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  left: 0,
                  width: '240px',
                  background: '#ffffff',
                  borderRadius: '12px',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.04)',
                  border: '1px solid #e2e8f0',
                  padding: '6px',
                  zIndex: 100
                }}
              >
                <Link
                  href="/smart-ai"
                  onClick={() => setSmartAiDropdownOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontSize: '0.92rem',
                    fontWeight: 600,
                    color: pathname === '/smart-ai' ? '#047857' : '#1e293b',
                    background: pathname === '/smart-ai' ? '#ecfdf5' : 'transparent',
                    border: pathname === '/smart-ai' ? '1px solid #a7f3d0' : '1px solid transparent',
                    textDecoration: 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Layers size={16} color={pathname === '/smart-ai' ? '#047857' : '#059669'} style={{ marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>Layout box</span>
                    </div>
                    <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 500, display: 'block', marginTop: '1px' }}>
                      বিপিএসসি ও শিক্ষক নিবন্ধন AI
                    </span>
                  </div>
                </Link>

                <Link
                  href="/smart-ai-smart/"
                  onClick={() => setSmartAiDropdownOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontSize: '0.92rem',
                    fontWeight: 600,
                    color: pathname?.startsWith('/smart-ai-smart') ? '#047857' : '#1e293b',
                    background: pathname?.startsWith('/smart-ai-smart') ? '#ecfdf5' : 'transparent',
                    border: pathname?.startsWith('/smart-ai-smart') ? '1px solid #a7f3d0' : '1px solid transparent',
                    textDecoration: 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Sparkles size={16} color={pathname?.startsWith('/smart-ai-smart') ? '#047857' : '#0284c7'} style={{ marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>Layout smart</span>
                    </div>
                    <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 500, display: 'block', marginTop: '1px' }}>
                      এআই স্পেশাল প্রস্তুতি রুম
                    </span>
                  </div>
                </Link>
              </div>
            )}
          </div>

          {/* Bookmarks */}
          <Link
            href="/bookmarks"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '7px 10px',
              borderRadius: '8px',
              fontSize: '0.88rem',
              fontWeight: 600,
              whiteSpace: 'nowrap',
              color: pathname === '/bookmarks' ? '#047857' : '#475569',
              background: pathname === '/bookmarks' ? '#ecfdf5' : 'transparent',
              border: pathname === '/bookmarks' ? '1px solid #a7f3d0' : '1px solid transparent',
              transition: 'all 0.2s ease'
            }}
          >
            <Bookmark size={15} />
            <span>বুকমার্কস</span>
          </Link>
        </nav>

        {/* Elegant Vertical Divider Before Profile Button */}
        <div 
          className="desktop-divider" 
          style={{ 
            width: '1px', 
            height: '24px', 
            background: '#e2e8f0', 
            marginRight: '12px',
            flexShrink: 0 
          }} 
        />

        {/* Action Button: Login / Profile & Mobile Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          {user ? (
            /* Logged in: Profile Button & Dropdown */
            <div style={{ position: 'relative' }} ref={dropdownRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'var(--bg-primary)',
                  border: '1px solid #cbd5e1',
                  borderRadius: '9999px',
                  padding: '5px 12px 5px 6px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--emerald-500)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(16, 185, 129, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#cbd5e1';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                aria-label="User profile menu"
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'var(--gradient-brand)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  boxShadow: '0 2px 6px rgba(16, 185, 129, 0.25)'
                }}>
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
                  <span style={{
                    fontSize: '0.86rem',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    maxWidth: '100px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {user.name || user.username}
                  </span>
                </div>
                <ChevronDown size={14} color="#64748b" />
              </button>

              {/* Profile Dropdown */}
              {profileDropdownOpen && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: 'calc(100% + 8px)',
                  width: '230px',
                  background: '#ffffff',
                  borderRadius: '12px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.12), 0 1px 3px rgba(0,0,0,0.05)',
                  border: '1px solid var(--border-subtle)',
                  padding: '8px 0',
                  zIndex: 100,
                  animation: 'fadeIn 0.15s ease-out'
                }}>
                  <div style={{ padding: '10px 16px', borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#0f172a' }}>
                      {user.name}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b', wordBreak: 'break-all' }}>
                      {user.email}
                    </div>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginTop: '6px' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '2px 8px',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        borderRadius: '4px',
                        background: user.role === 'owner' ? '#fef3c7' : user.role === 'admin' ? '#e0f2fe' : '#ecfdf5',
                        color: user.role === 'owner' ? '#b45309' : user.role === 'admin' ? '#0369a1' : '#047857',
                        border: user.role === 'owner' ? '1px solid #fde68a' : user.role === 'admin' ? '1px solid #bae6fd' : '1px solid #a7f3d0'
                      }}>
                        {user.role === 'owner' ? '👑 ওনার' : user.role === 'admin' ? '🛡️ এডমিন' : '👤 ইউজার'}
                      </span>
                      {user.status === 'pending' && (
                        <span style={{
                          fontSize: '0.68rem',
                          fontWeight: 600,
                          padding: '2px 6px',
                          borderRadius: '4px',
                          background: '#fef2f2',
                          color: '#dc2626',
                          border: '1px solid #fecaca'
                        }}>
                          অপেক্ষমাণ
                        </span>
                      )}
                    </div>
                  </div>

                  <div style={{ padding: '6px' }}>
                    <Link
                      href="/profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '9px 12px',
                        borderRadius: '8px',
                        fontSize: '0.88rem',
                        fontWeight: 600,
                        color: '#334155',
                        textDecoration: 'none',
                        transition: 'background 0.15s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <User size={16} color="var(--emerald-600)" />
                      <span>আমার প্রোফাইল</span>
                    </Link>

                    <Link
                      href="/bookmarks"
                      onClick={() => setProfileDropdownOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '9px 12px',
                        borderRadius: '8px',
                        fontSize: '0.88rem',
                        fontWeight: 600,
                        color: '#334155',
                        textDecoration: 'none',
                        transition: 'background 0.15s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <Bookmark size={16} color="var(--emerald-600)" />
                      <span>সংরক্ষিত বুকমার্কস</span>
                    </Link>

                    <div style={{ height: '1px', background: '#f1f5f9', margin: '4px 0' }} />

                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        logout();
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        width: '100%',
                        padding: '9px 12px',
                        borderRadius: '8px',
                        fontSize: '0.88rem',
                        fontWeight: 600,
                        color: '#dc2626',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'background 0.15s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#fef2f2'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <LogOut size={16} />
                      <span>লগআউট</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Logged out: Login Button */
            <Link 
              href="/login" 
              className="btn-primary" 
              style={{ 
                padding: '8px 18px', 
                fontSize: '0.88rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                textDecoration: 'none',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)'
              }}
            >
              <LogIn size={16} />
              <span>লগইন</span>
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#f8fafc',
              border: '1px solid #cbd5e1',
              color: 'var(--text-primary)',
              borderRadius: '8px',
              padding: '8px',
              cursor: 'pointer'
            }}
            className="mobile-menu-btn"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div style={{
          background: '#ffffff',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '16px 20px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.08)'
        }}>
          {/* User Auth Card in Mobile Menu */}
          {user ? (
            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              padding: '12px 14px',
              marginBottom: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'var(--gradient-brand)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '1rem'
                }}>
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#0f172a' }}>{user.name}</div>
                  <div style={{ fontSize: '0.74rem', color: '#64748b' }}>{user.email}</div>
                </div>
              </div>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                style={{
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  color: '#dc2626',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                লগআউট
              </button>
            </div>
          ) : (
            <div style={{ marginBottom: '8px' }}>
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="btn-primary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '10px 16px',
                  fontSize: '0.94rem',
                  textDecoration: 'none'
                }}
              >
                <LogIn size={18} />
                <span>লগইন বা রেজিস্টার করুন</span>
              </Link>
            </div>
          )}

          {/* Mobile Navigation Links */}
          {/* 1. Home */}
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: '10px',
              fontSize: '0.95rem',
              fontWeight: 600,
              color: pathname === '/' ? '#047857' : '#1e293b',
              background: pathname === '/' ? '#ecfdf5' : '#f8fafc',
              border: pathname === '/' ? '1px solid #a7f3d0' : '1px solid #e2e8f0'
            }}
          >
            <i className="fa-solid fa-house" style={{ fontSize: '16px', width: '18px', textAlign: 'center' }}></i>
            <span>হোম</span>
          </Link>

          {/* 2. All Question Bank Accordion */}
          <div style={{
            borderRadius: '10px',
            border: isJobSolutionActive ? '1px solid #a7f3d0' : '1px solid #e2e8f0',
            background: isJobSolutionActive ? '#f0fdf4' : '#f8fafc',
            overflow: 'hidden'
          }}>
            <button
              onClick={() => setMobileJobSolutionsOpen(!mobileJobSolutionsOpen)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.95rem',
                fontWeight: 600,
                fontFamily: 'inherit',
                color: isJobSolutionActive ? '#047857' : '#1e293b'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Layers size={18} color={isJobSolutionActive ? '#047857' : '#475569'} />
                <span>সকল প্রশ্ন ব্যাংক</span>
              </div>
              <ChevronDown 
                size={16} 
                style={{
                  transform: mobileJobSolutionsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease',
                  opacity: 0.75
                }} 
              />
            </button>

            {mobileJobSolutionsOpen && (
              <div style={{
                padding: '4px 10px 10px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                borderTop: '1px solid rgba(0,0,0,0.06)'
              }}>
                <Link
                  href="/job-solution"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    color: pathname === '/job-solution' ? '#047857' : '#334155',
                    background: pathname === '/job-solution' ? '#ecfdf5' : '#ffffff',
                    border: pathname === '/job-solution' ? '1px solid #a7f3d0' : '1px solid #e2e8f0',
                    textDecoration: 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Layers size={16} color="var(--emerald-600)" />
                    <span>Layout box</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>পরীক্ষাভিত্তিক</span>
                </Link>

                <Link
                  href="/question-bank-smart/"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    color: pathname?.startsWith('/question-bank-smart') ? '#047857' : '#334155',
                    background: pathname?.startsWith('/question-bank-smart') ? '#ecfdf5' : '#ffffff',
                    border: pathname?.startsWith('/question-bank-smart') ? '1px solid #a7f3d0' : '1px solid #e2e8f0',
                    textDecoration: 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Sparkles size={16} color="#0284c7" />
                    <span>Layout smart</span>
                  </div>
                </Link>
              </div>
            )}
          </div>

          {/* 3. Special Question Bank Accordion (Mobile) */}
          <div style={{
            borderRadius: '10px',
            border: isSpecialActive ? '1px solid #a7f3d0' : '1px solid #e2e8f0',
            background: isSpecialActive ? '#f0fdf4' : '#f8fafc',
            overflow: 'hidden'
          }}>
            <button
              onClick={() => setMobileSpecialOpen(!mobileSpecialOpen)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.95rem',
                fontWeight: 600,
                fontFamily: 'inherit',
                color: isSpecialActive ? '#047857' : '#1e293b'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <BookOpen size={18} color={isSpecialActive ? '#047857' : '#059669'} />
                <span>স্পেশাল সাজেশন হাব</span>
              </div>
              <ChevronDown 
                size={16} 
                style={{
                  transform: mobileSpecialOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease',
                  opacity: 0.75
                }} 
              />
            </button>

            {mobileSpecialOpen && (
              <div style={{
                padding: '8px 10px 12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                borderTop: '1px solid rgba(0,0,0,0.06)'
              }}>
                {/* Category 1: ICT (আইসিটি) */}
                <div style={{
                  background: '#ffffff',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                  padding: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '2px 4px 6px', borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Laptop size={14} color="#059669" />
                      <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0f172a' }}>আইসিটি (ICT)</span>
                    </div>
                    <span style={{ fontSize: '0.68rem', fontWeight: 600, color: '#047857', background: '#ecfdf5', padding: '2px 6px', borderRadius: '10px', border: '1px solid #a7f3d0' }}>
                      ১,৭৫৮ MCQ
                    </span>
                  </div>
                  <Link
                    href="/ict"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 10px',
                      borderRadius: '7px',
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      color: pathname === '/ict' ? '#047857' : '#334155',
                      background: pathname === '/ict' ? '#ecfdf5' : '#f8fafc',
                      border: pathname === '/ict' ? '1px solid #a7f3d0' : '1px solid transparent',
                      textDecoration: 'none'
                    }}
                  >
                    <Layers size={15} color={pathname === '/ict' ? '#047857' : '#64748b'} />
                    <span>Layout box (অধ্যায়ভিত্তিক)</span>
                  </Link>
                  <Link
                    href="/ict-smart/"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 10px',
                      borderRadius: '7px',
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      color: pathname?.startsWith('/ict-smart') ? '#047857' : '#334155',
                      background: pathname?.startsWith('/ict-smart') ? '#ecfdf5' : '#f8fafc',
                      border: pathname?.startsWith('/ict-smart') ? '1px solid #a7f3d0' : '1px solid transparent',
                      textDecoration: 'none'
                    }}
                  >
                    <Sparkles size={15} color={pathname?.startsWith('/ict-smart') ? '#047857' : '#0284c7'} />
                    <span>Layout smart (স্মার্ট প্রশ্নভাণ্ডার)</span>
                  </Link>
                </div>

                {/* Category 2: Ampibian (অ্যাম্ফিবিয়ান) */}
                <div style={{
                  background: '#ffffff',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                  padding: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '2px 4px 6px', borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <BookOpen size={14} color="#059669" />
                      <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0f172a' }}>অ্যাম্ফিবিয়ান সাজেশন</span>
                    </div>
                    <span style={{ fontSize: '0.68rem', fontWeight: 600, color: '#b45309', background: '#fef3c7', padding: '2px 6px', borderRadius: '10px', border: '1px solid #fde68a' }}>
                      ৬,১৫৭ MCQ
                    </span>
                  </div>
                  <Link
                    href="/ampibian-suggestion"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 10px',
                      borderRadius: '7px',
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      color: pathname === '/ampibian-suggestion' ? '#047857' : '#334155',
                      background: pathname === '/ampibian-suggestion' ? '#ecfdf5' : '#f8fafc',
                      border: pathname === '/ampibian-suggestion' ? '1px solid #a7f3d0' : '1px solid transparent',
                      textDecoration: 'none'
                    }}
                  >
                    <Layers size={15} color={pathname === '/ampibian-suggestion' ? '#047857' : '#64748b'} />
                    <span>Layout box (অধ্যায়ভিত্তিক)</span>
                  </Link>
                  <Link
                    href="/ampibian-suggestion-smart/"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 10px',
                      borderRadius: '7px',
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      color: pathname?.startsWith('/ampibian-suggestion-smart') ? '#047857' : '#334155',
                      background: pathname?.startsWith('/ampibian-suggestion-smart') ? '#ecfdf5' : '#f8fafc',
                      border: pathname?.startsWith('/ampibian-suggestion-smart') ? '1px solid #a7f3d0' : '1px solid transparent',
                      textDecoration: 'none'
                    }}
                  >
                    <Sparkles size={15} color={pathname?.startsWith('/ampibian-suggestion-smart') ? '#047857' : '#0284c7'} />
                    <span>Layout smart (স্মার্ট প্রশ্নভাণ্ডার)</span>
                  </Link>
                </div>

                {/* Category 3: Biddabari NTRCA (বিদ্যাবাড়ি NTRCA) */}
                <div style={{
                  background: '#ffffff',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                  padding: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '2px 4px 6px', borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <GraduationCap size={14} color="#2563eb" />
                      <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0f172a' }}>বিদ্যাবাড়ি NTRCA</span>
                    </div>
                    <span style={{ fontSize: '0.68rem', fontWeight: 600, color: '#1d4ed8', background: '#eff6ff', padding: '2px 6px', borderRadius: '10px', border: '1px solid #bfdbfe' }}>
                      ৯,৯৭৪ MCQ
                    </span>
                  </div>
                  <Link
                    href="/biddabari-ntrca"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 10px',
                      borderRadius: '7px',
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      color: pathname === '/biddabari-ntrca' ? '#047857' : '#334155',
                      background: pathname === '/biddabari-ntrca' ? '#ecfdf5' : '#f8fafc',
                      border: pathname === '/biddabari-ntrca' ? '1px solid #a7f3d0' : '1px solid transparent',
                      textDecoration: 'none'
                    }}
                  >
                    <Layers size={15} color={pathname === '/biddabari-ntrca' ? '#047857' : '#64748b'} />
                    <span>Layout box (লেকচারভিত্তিক)</span>
                  </Link>
                  <Link
                    href="/biddabari-ntrca-smart/"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 10px',
                      borderRadius: '7px',
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      color: pathname?.startsWith('/biddabari-ntrca-smart') ? '#047857' : '#334155',
                      background: pathname?.startsWith('/biddabari-ntrca-smart') ? '#ecfdf5' : '#f8fafc',
                      border: pathname?.startsWith('/biddabari-ntrca-smart') ? '1px solid #a7f3d0' : '1px solid transparent',
                      textDecoration: 'none'
                    }}
                  >
                    <Sparkles size={15} color={pathname?.startsWith('/biddabari-ntrca-smart') ? '#047857' : '#0284c7'} />
                    <span>Layout smart (স্মার্ট প্রশ্নভাণ্ডার)</span>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* 4. Most Important Accordion (Mobile) */}
          <div style={{
            borderRadius: '10px',
            border: isMostImportantActive ? '1px solid #a7f3d0' : '1px solid #e2e8f0',
            background: isMostImportantActive ? '#f0fdf4' : '#f8fafc',
            overflow: 'hidden'
          }}>
            <button
              onClick={() => setMobileMostImportantOpen(!mobileMostImportantOpen)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.95rem',
                fontWeight: 600,
                fontFamily: 'inherit',
                color: isMostImportantActive ? '#047857' : '#1e293b'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Flame size={18} color={isMostImportantActive ? '#047857' : '#e11d48'} />
                <span>সর্বাধিক কমন (Most Important)</span>
              </div>
              <ChevronDown 
                size={16} 
                style={{
                  transform: mobileMostImportantOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease',
                  opacity: 0.75
                }} 
              />
            </button>

            {mobileMostImportantOpen && (
              <div style={{
                padding: '4px 10px 10px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                borderTop: '1px solid rgba(0,0,0,0.06)'
              }}>
                <Link
                  href="/most-important-questions"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    color: pathname === '/most-important-questions' ? '#047857' : '#334155',
                    background: pathname === '/most-important-questions' ? '#ecfdf5' : '#ffffff',
                    border: pathname === '/most-important-questions' ? '1px solid #a7f3d0' : '1px solid #e2e8f0',
                    textDecoration: 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Layers size={16} color={pathname === '/most-important-questions' ? '#047857' : '#64748b'} />
                    <span>Layout box (বিষয়ভিত্তিক)</span>
                  </div>
                </Link>

                <Link
                  href="/most-important-smart/"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    color: pathname?.startsWith('/most-important-smart') ? '#047857' : '#334155',
                    background: pathname?.startsWith('/most-important-smart') ? '#ecfdf5' : '#ffffff',
                    border: pathname?.startsWith('/most-important-smart') ? '1px solid #a7f3d0' : '1px solid #e2e8f0',
                    textDecoration: 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Sparkles size={16} color={pathname?.startsWith('/most-important-smart') ? '#047857' : '#0284c7'} />
                    <span>Layout smart (স্মার্ট প্রশ্নভাণ্ডার)</span>
                  </div>
                </Link>
              </div>
            )}
          </div>



          {/* Smart AI Accordion (Mobile) */}
          <div style={{
            borderRadius: '10px',
            border: isSmartAiActive ? '1px solid #a7f3d0' : '1px solid #e2e8f0',
            background: isSmartAiActive ? '#f0fdf4' : '#f8fafc',
            overflow: 'hidden'
          }}>
            <button
              onClick={() => setMobileSmartAiOpen(!mobileSmartAiOpen)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.95rem',
                fontWeight: 600,
                fontFamily: 'inherit',
                color: isSmartAiActive ? '#047857' : '#1e293b'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Cpu size={18} color={isSmartAiActive ? '#047857' : '#7c3aed'} />
                <span>স্মার্ট AI (Smart AI)</span>
              </div>
              <ChevronDown 
                size={16} 
                style={{
                  transform: mobileSmartAiOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease',
                  opacity: 0.75
                }} 
              />
            </button>

            {mobileSmartAiOpen && (
              <div style={{
                padding: '4px 10px 10px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                borderTop: '1px solid rgba(0,0,0,0.06)'
              }}>
                <Link
                  href="/smart-ai"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    color: pathname === '/smart-ai' ? '#047857' : '#334155',
                    background: pathname === '/smart-ai' ? '#ecfdf5' : '#ffffff',
                    border: pathname === '/smart-ai' ? '1px solid #a7f3d0' : '1px solid #e2e8f0',
                    textDecoration: 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Layers size={16} color={pathname === '/smart-ai' ? '#047857' : '#64748b'} />
                    <span>Layout box (বিষয়ভিত্তিক AI)</span>
                  </div>
                </Link>

                <Link
                  href="/smart-ai-smart/"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    color: pathname?.startsWith('/smart-ai-smart') ? '#047857' : '#334155',
                    background: pathname?.startsWith('/smart-ai-smart') ? '#ecfdf5' : '#ffffff',
                    border: pathname?.startsWith('/smart-ai-smart') ? '1px solid #a7f3d0' : '1px solid #e2e8f0',
                    textDecoration: 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Sparkles size={16} color={pathname?.startsWith('/smart-ai-smart') ? '#047857' : '#0284c7'} />
                    <span>Layout smart (স্মার্ট প্রশ্নভাণ্ডার)</span>
                  </div>
                </Link>
              </div>
            )}
          </div>

          {/* Bookmarks */}
          <Link
            href="/bookmarks"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: '10px',
              fontSize: '0.98rem',
              fontWeight: 600,
              color: pathname === '/bookmarks' ? '#047857' : '#1e293b',
              background: pathname === '/bookmarks' ? '#ecfdf5' : '#f8fafc',
              border: pathname === '/bookmarks' ? '1px solid #a7f3d0' : '1px solid #e2e8f0'
            }}
          >
            <Bookmark size={18} />
            <span>বুকমার্কস</span>
          </Link>

          {user && (
            <Link
              href="/profile"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '10px',
                fontSize: '0.98rem',
                fontWeight: 600,
                color: '#047857',
                background: '#ecfdf5',
                border: '1px solid #a7f3d0'
              }}
            >
              <User size={18} />
              <span>আমার প্রোফাইল</span>
            </Link>
          )}
        </div>
      )}

      <style jsx>{`
        @keyframes dropdownFade {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .dropdown-menu-anim {
          animation: dropdownFade 0.18s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .mockup-link-card {
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }
        .mockup-link-card:hover {
          background: #ecfdf5 !important;
          border-color: #86efac !important;
          transform: translateY(-1.5px) !important;
          box-shadow: 0 4px 14px rgba(16, 185, 129, 0.12) !important;
        }
        .mockup-link-card .mockup-chevron {
          transition: transform 0.2s ease, color 0.2s ease;
        }
        .mockup-link-card:hover .mockup-chevron {
          transform: translateX(2px) !important;
          color: #047857 !important;
        }
        @media (min-width: 1120px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-menu-btn {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}
