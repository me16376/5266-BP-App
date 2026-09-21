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
  Table,
  FileSpreadsheet,
  FolderOpen,
  User,
  LogIn,
  LogOut,
  ChevronDown,
  Shield
} from 'lucide-react';
import { useAuth } from '../lib/authContext';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const [mobileToolsOpen, setMobileToolsOpen] = useState(true);

  const dropdownRef = useRef(null);
  const toolsDropdownRef = useRef(null);
  const toolsTimeoutRef = useRef(null);

  const { user, logout } = useAuth();

  const isToolsActive = pathname === '/file-exam' || pathname === '/file-studio' || pathname.startsWith('/file-tools');

  const handleMouseEnterTools = () => {
    if (toolsTimeoutRef.current) clearTimeout(toolsTimeoutRef.current);
    setToolsDropdownOpen(true);
  };

  const handleMouseLeaveTools = () => {
    toolsTimeoutRef.current = setTimeout(() => {
      setToolsDropdownOpen(false);
    }, 150);
  };

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
      if (toolsDropdownRef.current && !toolsDropdownRef.current.contains(event.target)) {
        setToolsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (toolsTimeoutRef.current) clearTimeout(toolsTimeoutRef.current);
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
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
              color: '#0f172a'
            }}>
              JobSolutions <span style={{ color: 'var(--emerald-600)' }}>BD</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '-3px' }}>
              ২,৫০,০০০+ জব সলিউশনস ও এক্সাম
            </div>
          </div>
        </Link>

        {/* Desktop Nav (Right Aligned with margin before User Button) */}
        <nav 
          className="desktop-nav" 
          style={{ 
            marginLeft: 'auto', 
            marginRight: '14px', 
            alignItems: 'center', 
            gap: '6px' 
          }}
        >
          {/* Home with FontAwesome House Icon */}
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              padding: '8px 14px',
              borderRadius: '8px',
              fontSize: '0.92rem',
              fontWeight: 600,
              color: pathname === '/' ? '#047857' : '#475569',
              background: pathname === '/' ? '#ecfdf5' : 'transparent',
              border: pathname === '/' ? '1px solid #a7f3d0' : '1px solid transparent',
              transition: 'all 0.2s ease'
            }}
          >
            <i className="fa-solid fa-house" style={{ fontSize: '15px' }}></i>
            <span>হোম</span>
          </Link>

          {/* All Question Bank */}
          <Link
            href="/job-solution"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '8px',
              fontSize: '0.92rem',
              fontWeight: 600,
              color: pathname === '/job-solution' ? '#047857' : '#475569',
              background: pathname === '/job-solution' ? '#ecfdf5' : 'transparent',
              border: pathname === '/job-solution' ? '1px solid #a7f3d0' : '1px solid transparent',
              transition: 'all 0.2s ease'
            }}
          >
            <Layers size={16} />
            <span>সকল প্রশ্ন ব্যাংক</span>
          </Link>

          {/* File Tools Dropdown */}
          <div 
            style={{ position: 'relative' }} 
            ref={toolsDropdownRef}
            onMouseEnter={handleMouseEnterTools}
            onMouseLeave={handleMouseLeaveTools}
          >
            <button
              onClick={() => setToolsDropdownOpen(prev => !prev)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '0.92rem',
                fontWeight: 600,
                fontFamily: 'inherit',
                lineHeight: 1.5,
                color: isToolsActive ? '#047857' : '#475569',
                background: isToolsActive ? '#ecfdf5' : toolsDropdownOpen ? '#f8fafc' : 'transparent',
                border: isToolsActive ? '1px solid #a7f3d0' : '1px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              aria-expanded={toolsDropdownOpen}
              aria-haspopup="true"
            >
              <FolderOpen size={16} color={isToolsActive ? '#047857' : '#475569'} />
              <span>ফাইল টুলস</span>
              <ChevronDown 
                size={14} 
                style={{
                  transform: toolsDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease',
                  opacity: 0.75
                }}
              />
            </button>

            {/* Dropdown Menu - Exact Matching 0.92rem Font Size */}
            {toolsDropdownOpen && (
              <div 
                className="dropdown-menu-anim"
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  left: 0,
                  width: '210px',
                  background: '#ffffff',
                  borderRadius: '12px',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.04)',
                  border: '1px solid #e2e8f0',
                  padding: '6px',
                  zIndex: 100
                }}
              >
                {/* Option 1: File Exam */}
                <Link
                  href="/file-exam"
                  onClick={() => setToolsDropdownOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontSize: '0.92rem',
                    fontWeight: 600,
                    color: pathname === '/file-exam' ? '#047857' : '#1e293b',
                    background: pathname === '/file-exam' ? '#ecfdf5' : 'transparent',
                    border: pathname === '/file-exam' ? '1px solid #a7f3d0' : '1px solid transparent',
                    textDecoration: 'none',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (pathname !== '/file-exam') e.currentTarget.style.background = '#f8fafc';
                  }}
                  onMouseLeave={(e) => {
                    if (pathname !== '/file-exam') e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <FileSpreadsheet size={16} color={pathname === '/file-exam' ? '#047857' : '#059669'} />
                  <span>ফাইল এক্সাম</span>
                </Link>

                {/* Option 2: Table Studio */}
                <Link
                  href="/file-studio"
                  onClick={() => setToolsDropdownOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontSize: '0.92rem',
                    fontWeight: 600,
                    color: pathname === '/file-studio' ? '#047857' : '#1e293b',
                    background: pathname === '/file-studio' ? '#ecfdf5' : 'transparent',
                    border: pathname === '/file-studio' ? '1px solid #a7f3d0' : '1px solid transparent',
                    textDecoration: 'none',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (pathname !== '/file-studio') e.currentTarget.style.background = '#f8fafc';
                  }}
                  onMouseLeave={(e) => {
                    if (pathname !== '/file-studio') e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <Table size={16} color={pathname === '/file-studio' ? '#047857' : '#059669'} />
                  <span>টেবিল স্টুডিও</span>
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
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '8px',
              fontSize: '0.92rem',
              fontWeight: 600,
              color: pathname === '/bookmarks' ? '#047857' : '#475569',
              background: pathname === '/bookmarks' ? '#ecfdf5' : 'transparent',
              border: pathname === '/bookmarks' ? '1px solid #a7f3d0' : '1px solid transparent',
              transition: 'all 0.2s ease'
            }}
          >
            <Bookmark size={16} />
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
            marginRight: '16px' 
          }} 
        />

        {/* Action Button: Login / Profile & Mobile Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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

          {/* 2. All Question Bank */}
          <Link
            href="/job-solution"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: '10px',
              fontSize: '0.95rem',
              fontWeight: 600,
              color: pathname === '/job-solution' ? '#047857' : '#1e293b',
              background: pathname === '/job-solution' ? '#ecfdf5' : '#f8fafc',
              border: pathname === '/job-solution' ? '1px solid #a7f3d0' : '1px solid #e2e8f0'
            }}
          >
            <Layers size={18} />
            <span>সকল প্রশ্ন ব্যাংক</span>
          </Link>

          {/* 3. File Tools Accordion */}
          <div style={{
            borderRadius: '10px',
            border: isToolsActive ? '1px solid #a7f3d0' : '1px solid #e2e8f0',
            background: isToolsActive ? '#f0fdf4' : '#f8fafc',
            overflow: 'hidden'
          }}>
            <button
              onClick={() => setMobileToolsOpen(!mobileToolsOpen)}
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
                color: isToolsActive ? '#047857' : '#1e293b'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <FolderOpen size={18} color={isToolsActive ? '#047857' : '#475569'} />
                <span>ফাইল টুলস</span>
              </div>
              <ChevronDown 
                size={16} 
                style={{
                  transform: mobileToolsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease',
                  opacity: 0.75
                }} 
              />
            </button>

            {mobileToolsOpen && (
              <div style={{
                padding: '4px 10px 10px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                borderTop: '1px solid rgba(0,0,0,0.06)'
              }}>
                <Link
                  href="/file-exam"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    color: pathname === '/file-exam' ? '#047857' : '#334155',
                    background: pathname === '/file-exam' ? '#ecfdf5' : '#ffffff',
                    border: pathname === '/file-exam' ? '1px solid #a7f3d0' : '1px solid #e2e8f0',
                    textDecoration: 'none'
                  }}
                >
                  <FileSpreadsheet size={16} color="var(--emerald-600)" />
                  <span>ফাইল এক্সাম</span>
                </Link>

                <Link
                  href="/file-studio"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    color: pathname === '/file-studio' ? '#047857' : '#334155',
                    background: pathname === '/file-studio' ? '#ecfdf5' : '#ffffff',
                    border: pathname === '/file-studio' ? '1px solid #a7f3d0' : '1px solid #e2e8f0',
                    textDecoration: 'none'
                  }}
                >
                  <Table size={16} color="var(--emerald-600)" />
                  <span>টেবিল স্টুডিও</span>
                </Link>
              </div>
            )}
          </div>

          {/* 4. Bookmarks */}
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
        @media (min-width: 900px) {
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
