'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  LogIn, 
  UserPlus, 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle, 
  Database,
  ShieldCheck,
  AtSign,
  KeyRound
} from 'lucide-react';
import { useAuth } from '../../lib/authContext';

export default function LoginPage() {
  const router = useRouter();
  const { user, login, register } = useAuth();

  const [isLoginTab, setIsLoginTab] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Login Form State
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register Form State
  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  // If already logged in, show quick redirect option
  if (user) {
    return (
      <div className="container" style={{ padding: '60px 20px', maxWidth: '520px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '36px 24px',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-subtle)'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: '#ecfdf5',
            color: 'var(--emerald-600)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px'
          }}>
            <CheckCircle2 size={36} />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
            আপনি ইতোমধ্যে লগইন আছেন!
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.94rem', marginBottom: '24px' }}>
            স্বাগতম, <strong>{user.name}</strong> ({user.email})
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button
              onClick={() => router.push('/profile')}
              className="btn-primary"
              style={{ padding: '10px 20px', fontSize: '0.94rem' }}
            >
              প্রোফাইলে যান
            </button>
            <button
              onClick={() => router.push('/')}
              className="btn-secondary"
              style={{ padding: '10px 20px', fontSize: '0.94rem' }}
            >
              হোমে ফিরুন
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!loginIdentifier.trim() || !loginPassword) {
      setErrorMessage('অনুগ্রহ করে ইউজারনেম/ইমেইল এবং পাসওয়ার্ড দিন');
      return;
    }

    setIsLoading(true);
    try {
      await login(loginIdentifier.trim(), loginPassword);
      setSuccessMessage('লগইন সফল হয়েছে! প্রোফাইলে রিডাইরেক্ট হচ্ছে...');
      setTimeout(() => {
        router.push('/profile');
      }, 1000);
    } catch (err) {
      setErrorMessage(err.message || 'লগইন ব্যর্থ হয়েছে। ক্রেডেনশিয়াল পরীক্ষা করুন।');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!regName.trim() || !regUsername.trim() || !regEmail.trim() || !regPassword) {
      setErrorMessage('সকল প্রয়োজনীয় ঘর পূরণ করুন');
      return;
    }

    if (regPassword.length < 6) {
      setErrorMessage('পাসওয়ার্ড ন্যূনতম ৬ অক্ষরের হতে হবে');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setErrorMessage('পাসওয়ার্ড ও কনফার্ম পাসওয়ার্ড মিলছে না');
      return;
    }

    setIsLoading(true);
    try {
      await register({
        name: regName.trim(),
        username: regUsername.trim(),
        email: regEmail.trim(),
        password: regPassword
      });
      setSuccessMessage('রেজিস্ট্রেশন সফল হয়েছে! প্রোফাইলে রিডাইরেক্ট হচ্ছে...');
      setTimeout(() => {
        router.push('/profile');
      }, 1000);
    } catch (err) {
      setErrorMessage(err.message || 'রেজিস্ট্রেশন ব্যর্থ হয়েছে।');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 16px',
      background: 'radial-gradient(ellipse at top, rgba(16, 185, 129, 0.06), transparent 70%)'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '460px',
        background: '#ffffff',
        borderRadius: '20px',
        border: '1px solid var(--border-subtle)',
        boxShadow: '0 12px 36px -4px rgba(0, 0, 0, 0.08), 0 4px 12px -2px rgba(0,0,0,0.03)',
        overflow: 'hidden'
      }}>
        {/* Top Header Card */}
        <div style={{
          background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
          padding: '28px 24px 20px',
          textAlign: 'center',
          borderBottom: '1px solid #d1fae5'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: '#ffffff',
            padding: '4px 12px',
            borderRadius: '9999px',
            border: '1px solid #a7f3d0',
            fontSize: '0.76rem',
            fontWeight: 700,
            color: 'var(--emerald-700)',
            marginBottom: '12px'
          }}>
            <Database size={13} />
            Cloudflare D1 অথেনটিকেশন
          </div>

          <h1 style={{
            fontSize: '1.45rem',
            fontWeight: 800,
            color: '#0f172a',
            marginBottom: '6px'
          }}>
            {isLoginTab ? 'অ্যাকাউন্টে লগইন করুন' : 'নতুন অ্যাকাউন্ট তৈরি করুন'}
          </h1>
          <p style={{ fontSize: '0.86rem', color: '#64748b' }}>
            JobSolutions BD ব্যক্তিগত স্টাডি ও অনুশীলন প্ল্যাটফর্ম
          </p>

          {/* Tab Switcher */}
          <div style={{
            display: 'flex',
            background: 'rgba(0, 0, 0, 0.05)',
            borderRadius: '10px',
            padding: '4px',
            marginTop: '18px'
          }}>
            <button
              onClick={() => {
                setIsLoginTab(true);
                setErrorMessage('');
                setSuccessMessage('');
              }}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '8px',
                border: 'none',
                background: isLoginTab ? '#ffffff' : 'transparent',
                color: isLoginTab ? 'var(--emerald-700)' : '#64748b',
                fontWeight: isLoginTab ? 700 : 500,
                fontSize: '0.9rem',
                cursor: 'pointer',
                boxShadow: isLoginTab ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              লগইন
            </button>
            <button
              onClick={() => {
                setIsLoginTab(false);
                setErrorMessage('');
                setSuccessMessage('');
              }}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '8px',
                border: 'none',
                background: !isLoginTab ? '#ffffff' : 'transparent',
                color: !isLoginTab ? 'var(--emerald-700)' : '#64748b',
                fontWeight: !isLoginTab ? 700 : 500,
                fontSize: '0.9rem',
                cursor: 'pointer',
                boxShadow: !isLoginTab ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              রেজিস্ট্রেশন
            </button>
          </div>
        </div>

        {/* Feedback Messages & Forms */}
        <div style={{ padding: '24px 28px' }}>
          {errorMessage && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 14px',
              borderRadius: '8px',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#dc2626',
              fontSize: '0.88rem',
              marginBottom: '18px'
            }}>
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 14px',
              borderRadius: '8px',
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              color: '#15803d',
              fontSize: '0.88rem',
              marginBottom: '18px'
            }}>
              <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
              <span>{successMessage}</span>
            </div>
          )}

          {/* LOGIN FORM */}
          {isLoginTab ? (
            <form onSubmit={handleLoginSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  ইমেইল অথবা ইউজারনেম
                </label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  height: '46px',
                  background: '#ffffff',
                  border: '1.5px solid #cbd5e1',
                  borderRadius: '10px',
                  padding: '0 14px',
                  gap: '10px',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
                }}>
                  <Mail size={18} color="#94a3b8" style={{ flexShrink: 0 }} />
                  <input
                    type="text"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="e.g. user@example.com বা username"
                    required
                    style={{
                      flex: 1,
                      height: '100%',
                      border: 'none',
                      outline: 'none',
                      background: 'transparent',
                      fontSize: '0.94rem',
                      color: '#0f172a',
                      fontFamily: 'inherit',
                      padding: 0
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '0.86rem', fontWeight: 600, color: '#334155' }}>
                    পাসওয়ার্ড
                  </label>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  height: '46px',
                  background: '#ffffff',
                  border: '1.5px solid #cbd5e1',
                  borderRadius: '10px',
                  padding: '0 14px',
                  gap: '10px',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
                }}>
                  <Lock size={18} color="#94a3b8" style={{ flexShrink: 0 }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    style={{
                      flex: 1,
                      height: '100%',
                      border: 'none',
                      outline: 'none',
                      background: 'transparent',
                      fontSize: '0.94rem',
                      color: '#0f172a',
                      fontFamily: 'inherit',
                      padding: 0
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#94a3b8',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '4px'
                    }}
                    aria-label="Toggle password"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary"
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '0.98rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  opacity: isLoading ? 0.7 : 1,
                  cursor: isLoading ? 'not-allowed' : 'pointer'
                }}
              >
                {isLoading ? (
                  <span>যাচাই করা হচ্ছে...</span>
                ) : (
                  <>
                    <LogIn size={18} />
                    <span>লগইন করুন</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            /* REGISTER FORM */
            <form onSubmit={handleRegisterSubmit}>
              {/* Full Name */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  আপনার পূর্ণ নাম
                </label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  height: '46px',
                  background: '#ffffff',
                  border: '1.5px solid #cbd5e1',
                  borderRadius: '10px',
                  padding: '0 14px',
                  gap: '10px',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
                }}>
                  <User size={18} color="#94a3b8" style={{ flexShrink: 0 }} />
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. মোঃ তানভীর আহমেদ"
                    required
                    style={{
                      flex: 1,
                      height: '100%',
                      border: 'none',
                      outline: 'none',
                      background: 'transparent',
                      fontSize: '0.94rem',
                      color: '#0f172a',
                      fontFamily: 'inherit',
                      padding: 0
                    }}
                  />
                </div>
              </div>

              {/* Username */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  ইউজারনেম (ইংরেজি ছোট অক্ষর ও সংখ্যা)
                </label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  height: '46px',
                  background: '#ffffff',
                  border: '1.5px solid #cbd5e1',
                  borderRadius: '10px',
                  padding: '0 14px',
                  gap: '10px',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
                }}>
                  <AtSign size={18} color="#94a3b8" style={{ flexShrink: 0 }} />
                  <input
                    type="text"
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                    placeholder="e.g. user123"
                    required
                    style={{
                      flex: 1,
                      height: '100%',
                      border: 'none',
                      outline: 'none',
                      background: 'transparent',
                      fontSize: '0.94rem',
                      color: '#0f172a',
                      fontFamily: 'inherit',
                      padding: 0
                    }}
                  />
                </div>
              </div>

              {/* Email */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  ইমেইল অ্যাড্রেস
                </label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  height: '46px',
                  background: '#ffffff',
                  border: '1.5px solid #cbd5e1',
                  borderRadius: '10px',
                  padding: '0 14px',
                  gap: '10px',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
                }}>
                  <Mail size={18} color="#94a3b8" style={{ flexShrink: 0 }} />
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="e.g. user@example.com"
                    required
                    style={{
                      flex: 1,
                      height: '100%',
                      border: 'none',
                      outline: 'none',
                      background: 'transparent',
                      fontSize: '0.94rem',
                      color: '#0f172a',
                      fontFamily: 'inherit',
                      padding: 0
                    }}
                  />
                </div>
              </div>

              {/* Password */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  পাসওয়ার্ড (ন্যূনতম ৬ অক্ষর)
                </label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  height: '46px',
                  background: '#ffffff',
                  border: '1.5px solid #cbd5e1',
                  borderRadius: '10px',
                  padding: '0 14px',
                  gap: '10px',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
                }}>
                  <Lock size={18} color="#94a3b8" style={{ flexShrink: 0 }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    style={{
                      flex: 1,
                      height: '100%',
                      border: 'none',
                      outline: 'none',
                      background: 'transparent',
                      fontSize: '0.94rem',
                      color: '#0f172a',
                      fontFamily: 'inherit',
                      padding: 0
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#94a3b8',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '4px'
                    }}
                    aria-label="Toggle password"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  পাসওয়ার্ড নিশ্চিত করুন
                </label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  height: '46px',
                  background: '#ffffff',
                  border: '1.5px solid #cbd5e1',
                  borderRadius: '10px',
                  padding: '0 14px',
                  gap: '10px',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
                }}>
                  <KeyRound size={18} color="#94a3b8" style={{ flexShrink: 0 }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    style={{
                      flex: 1,
                      height: '100%',
                      border: 'none',
                      outline: 'none',
                      background: 'transparent',
                      fontSize: '0.94rem',
                      color: '#0f172a',
                      fontFamily: 'inherit',
                      padding: 0
                    }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary"
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '0.98rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  opacity: isLoading ? 0.7 : 1,
                  cursor: isLoading ? 'not-allowed' : 'pointer'
                }}
              >
                {isLoading ? (
                  <span>অ্যাকাউন্ট তৈরি হচ্ছে...</span>
                ) : (
                  <>
                    <UserPlus size={18} />
                    <span>রেজিস্ট্রেশন সম্পন্ন করুন</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Privacy & Security Note */}
          <div style={{
            marginTop: '24px',
            paddingTop: '16px',
            borderTop: '1px solid #f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            color: '#64748b',
            fontSize: '0.78rem',
            textAlign: 'center'
          }}>
            <ShieldCheck size={16} color="var(--emerald-600)" />
            <span>সকল ডাটা Cloudflare Edge D1 এনক্রিপশনে সুরক্ষিত</span>
          </div>
        </div>
      </div>
    </div>
  );
}
