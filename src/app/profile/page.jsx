'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../lib/authContext';
import { getBookmarks } from '../../lib/storage';
import { getApiUrl } from '../../lib/apiConfig';

export default function ProfilePage() {
  const router = useRouter();
  const { user, token, loading, logout } = useAuth();
  const [bookmarkCount, setBookmarkCount] = useState(0);

  // Management state for Owner/Admin
  const [allUsers, setAllUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [mgmtMessage, setMgmtMessage] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all'); // 'all', 'pending', 'admin'

  useEffect(() => {
    try {
      const bms = getBookmarks();
      setBookmarkCount(Array.isArray(bms) ? bms.length : 0);
    } catch (e) {
      setBookmarkCount(0);
    }
  }, []);

  // Fetch users if user is owner or admin directly from Cloudflare D1
  const fetchUsersList = async () => {
    if (!token || !user || (user.role !== 'owner' && user.role !== 'admin')) return;
    setLoadingUsers(true);
    try {
      const res = await fetch(getApiUrl('/api/auth/users'), {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = await res.json();
        if (res.ok && data.users) {
          setAllUsers(data.users);
          return;
        } else if (!res.ok) {
          throw new Error(data.error || 'ব্যবহারকারী তালিকা লোড করা যায়নি');
        }
      }
    } catch (err) {
      console.error('Failed to fetch users from API', err);
      setMgmtMessage({ type: 'error', text: err.message || 'ইউজার তালিকা লোড করতে সমস্যা হয়েছে' });
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (user && (user.role === 'owner' || user.role === 'admin')) {
      fetchUsersList();
    }
  }, [user, token]);

  // Action 1: Update Status (Owner and Admin can both approve/reject)
  const handleUpdateStatus = async (targetUserId, newStatus) => {
    setActionLoadingId(`status-${targetUserId}`);
    setMgmtMessage(null);
    try {
      const res = await fetch(getApiUrl('/api/auth/users'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          targetUserId,
          action: 'update_status',
          newStatus
        })
      });

      const contentType = res.headers.get('content-type') || '';
      let data = null;
      if (contentType.includes('application/json')) {
        data = await res.json();
      }

      if (!res.ok) {
        throw new Error((data && data.error) || 'স্ট্যাটাস আপডেট ব্যর্থ হয়েছে');
      }

      setMgmtMessage({ 
        type: 'success', 
        text: (data && data.message) || `ইউজারের স্ট্যাটাস সফলভাবে '${newStatus === 'approved' ? 'অনুমোদিত' : 'স্থগিত'}' করা হয়েছে` 
      });
      await fetchUsersList();
    } catch (err) {
      setMgmtMessage({ type: 'error', text: err.message });
    } finally {
      setActionLoadingId(null);
    }
  };

  // Action 2: Update Role (ONLY Owner can create or demote admin)
  const handleUpdateRole = async (targetUserId, newRole) => {
    if (user.role !== 'owner') {
      alert('শুধুমাত্র মূল ওনার (Owner) নতুন অ্যাডমিন তৈরি বা পরিবর্তন করতে পারবেন।');
      return;
    }

    setActionLoadingId(`role-${targetUserId}`);
    setMgmtMessage(null);
    try {
      const res = await fetch(getApiUrl('/api/auth/users'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          targetUserId,
          action: 'update_role',
          newRole
        })
      });

      const contentType = res.headers.get('content-type') || '';
      let data = null;
      if (contentType.includes('application/json')) {
        data = await res.json();
      }

      if (!res.ok) {
        throw new Error((data && data.error) || 'রোল পরিবর্তন ব্যর্থ হয়েছে');
      }

      setMgmtMessage({ 
        type: 'success', 
        text: (data && data.message) || `ব্যবহারকারীর পদবী সফলভাবে '${newRole === 'admin' ? 'অ্যাডমিন' : 'সাধারণ ইউজার'}' করা হয়েছে` 
      });
      await fetchUsersList();
    } catch (err) {
      setMgmtMessage({ type: 'error', text: err.message });
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  // Filtered users
  const filteredUsers = useMemo(() => {
    return allUsers.filter(u => {
      const matchesSearch = 
        (u.name && u.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (u.username && u.username.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (u.email && u.email.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      if (roleFilter === 'pending') return u.status === 'pending';
      if (roleFilter === 'admin') return u.role === 'admin' || u.role === 'owner';
      return true;
    });
  }, [allUsers, searchQuery, roleFilter]);

  // Loading State
  if (loading) {
    return (
      <div style={{ minHeight: '75vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', padding: '24px' }}>
        <div style={{
          background: 'var(--bg-secondary)',
          borderRadius: '20px',
          padding: '48px 36px',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-subtle)',
          textAlign: 'center',
          maxWidth: '380px',
          width: '100%'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'rgba(16, 185, 129, 0.1)',
            color: 'var(--emerald-600)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.75rem',
            margin: '0 auto 20px'
          }}>
            <i className="fa-solid fa-circle-notch fa-spin"></i>
          </div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
            প্রোফাইল লোড হচ্ছে
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: 0 }}>
            অনুগ্রহ করে একটু অপেক্ষা করুন...
          </p>
        </div>
      </div>
    );
  }

  // Unauthenticated (Guest) State
  if (!user) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', padding: '40px 16px' }}>
        <div style={{
          background: 'var(--bg-secondary)',
          borderRadius: '24px',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-subtle)',
          maxWidth: '520px',
          width: '100%',
          overflow: 'hidden'
        }}>
          {/* Top Decorative Header */}
          <div style={{
            background: 'linear-gradient(135deg, #047857 0%, #059669 50%, #0891b2 100%)',
            padding: '36px 24px',
            textAlign: 'center',
            color: '#ffffff'
          }}>
            <div style={{
              width: '76px',
              height: '76px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(8px)',
              border: '2px solid rgba(255, 255, 255, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.2rem',
              margin: '0 auto 16px',
              boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)'
            }}>
              <i className="fa-solid fa-circle-user"></i>
            </div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(255, 255, 255, 0.25)',
              padding: '4px 14px',
              borderRadius: '9999px',
              fontSize: '0.78rem',
              fontWeight: 700,
              letterSpacing: '0.02em',
              marginBottom: '10px'
            }}>
              <i className="fa-solid fa-shield-halved"></i>
              নিরাপদ শিক্ষার্থী পোর্টাল
            </div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 800, margin: 0 }}>
              প্রোফাইল দেখতে লগইন করুন
            </h2>
          </div>

          {/* Body Content */}
          <div style={{ padding: '32px 28px' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', textAlign: 'center', lineHeight: '1.6', marginBottom: '24px' }}>
              আপনার সংরক্ষিত বুকমার্কস, পরীক্ষার ফলাফল এবং ব্যক্তিগত প্রস্তুতি ট্র্যাকিং দেখতে আপনার অ্যাকাউন্টে সাইন ইন করুন।
            </p>

            {/* Feature Highlights */}
            <div style={{ display: 'grid', gap: '12px', marginBottom: '28px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 14px',
                borderRadius: '12px',
                background: '#f8fafc',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: '#ecfdf5',
                  color: 'var(--emerald-600)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1rem'
                }}>
                  <i className="fa-solid fa-bookmark"></i>
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)' }}>সংরক্ষিত প্রশ্নব্যাংক</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>যে কোনো সময় রিভিশনের জন্য ফেভারিট লিস্ট</div>
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 14px',
                borderRadius: '12px',
                background: '#f8fafc',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: '#e0f2fe',
                  color: 'var(--cyan-600)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1rem'
                }}>
                  <i className="fa-solid fa-chart-line"></i>
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)' }}>মডেল টেস্ট ও পারফরম্যান্স</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>লাইভ স্কোর এবং নেগেটিভ মার্কিং ট্র্যাকিং</div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link
                href="/login"
                style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: '#ffffff',
                  padding: '13px 20px',
                  borderRadius: '12px',
                  fontSize: '0.96rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  textDecoration: 'none',
                  boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)',
                  transition: 'all 0.2s ease'
                }}
              >
                <i className="fa-solid fa-arrow-right-to-bracket"></i>
                <span>লগইন পেজে যান</span>
              </Link>

              <Link
                href="/"
                style={{
                  background: '#f1f5f9',
                  color: 'var(--text-secondary)',
                  padding: '12px 20px',
                  borderRadius: '12px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  textDecoration: 'none',
                  transition: 'background 0.2s'
                }}
              >
                <i className="fa-solid fa-house"></i>
                <span>হোমপেজে ফিরে যান</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated State Values
  const formattedDate = user.created_at
    ? new Date(user.created_at).toLocaleDateString('bn-BD', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'সম্প্রতি যুক্ত';

  const isOwner = user.role === 'owner';
  const isAdmin = user.role === 'admin';
  const canManage = isOwner || isAdmin;

  const totalCount = allUsers.length;
  const pendingCount = allUsers.filter(u => u.status === 'pending').length;
  const adminCount = allUsers.filter(u => u.role === 'admin' || u.role === 'owner').length;

  return (
    <div style={{ minHeight: '85vh', padding: '36px 16px 60px', background: 'var(--bg-primary)' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Profile Card Wrapper */}
        <div style={{
          background: 'var(--bg-secondary)',
          borderRadius: '24px',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-subtle)',
          overflow: 'hidden'
        }}>

          {/* Top Hero Banner with Website Colors */}
          <div style={{
            background: 'linear-gradient(135deg, #047857 0%, #059669 45%, #0891b2 100%)',
            padding: '28px 32px',
            color: '#ffffff',
            position: 'relative'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '20px'
            }}>
              {/* User Identity on Top Banner */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                {/* Avatar Circle */}
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
                  border: '3px solid rgba(255, 255, 255, 0.7)',
                  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2.4rem',
                  fontWeight: 800,
                  flexShrink: 0,
                  fontFamily: "'Hind Siliguri', 'Noto Sans Bengali', sans-serif"
                }}>
                  {user.name ? user.name.charAt(0) : <i className="fa-solid fa-user"></i>}
                </div>

                {/* User Info */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '6px' }}>
                    <h1 style={{
                      fontSize: '1.65rem',
                      fontWeight: 800,
                      color: '#ffffff',
                      margin: 0,
                      fontFamily: "'Hind Siliguri', 'Anek Bangla', sans-serif",
                      lineHeight: 1.2
                    }}>
                      {user.name}
                    </h1>

                    {/* Role Badge */}
                    <span style={{
                      background: isOwner ? '#fffbeb' : isAdmin ? '#f0f9ff' : '#ecfdf5',
                      color: isOwner ? '#b45309' : isAdmin ? '#0284c7' : '#059669',
                      border: `1px solid ${isOwner ? '#fde68a' : isAdmin ? '#bae6fd' : '#a7f3d0'}`,
                      padding: '4px 12px',
                      borderRadius: '9999px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      fontFamily: "'Hind Siliguri', sans-serif"
                    }}>
                      {isOwner ? (
                        <>
                          <i className="fa-solid fa-crown" style={{ color: '#d97706', fontSize: '0.82rem' }}></i>
                          <span>সিস্টেম ওনার (Owner)</span>
                        </>
                      ) : isAdmin ? (
                        <>
                          <i className="fa-solid fa-shield-halved" style={{ color: '#0284c7', fontSize: '0.82rem' }}></i>
                          <span>অ্যাডমিনিস্ট্রেটর</span>
                        </>
                      ) : (
                        <>
                          <i className="fa-solid fa-graduation-cap" style={{ color: '#059669', fontSize: '0.82rem' }}></i>
                          <span>শিক্ষার্থী / সদস্য</span>
                        </>
                      )}
                    </span>

                    {/* Status Badge */}
                    <span style={{
                      background: user.status === 'approved' ? '#f0fdf4' : '#fff1f2',
                      color: user.status === 'approved' ? '#15803d' : '#e11d48',
                      border: `1px solid ${user.status === 'approved' ? '#bbf7d0' : '#fecdd3'}`,
                      padding: '4px 12px',
                      borderRadius: '9999px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      fontFamily: "'Hind Siliguri', sans-serif"
                    }}>
                      <i 
                        className={user.status === 'approved' ? "fa-solid fa-circle-check" : "fa-solid fa-hourglass-half"} 
                        style={{ color: user.status === 'approved' ? '#16a34a' : '#e11d48', fontSize: '0.82rem' }}
                      ></i>
                      <span>{user.status === 'approved' ? 'অ্যাকাউন্ট অনুমোদিত' : 'অনুমোদনের অপেক্ষায়'}</span>
                    </span>
                  </div>

                  {/* Handle, Email */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontSize: '0.88rem',
                    flexWrap: 'wrap',
                    fontFamily: "'Hind Siliguri', 'Inter', sans-serif"
                  }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                      <i className="fa-solid fa-at" style={{ opacity: 0.85, fontSize: '0.8rem' }}></i>
                      {user.username}
                    </span>
                    <span style={{ opacity: 0.6 }}>•</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <i className="fa-solid fa-envelope" style={{ opacity: 0.85, fontSize: '0.8rem' }}></i>
                      {user.email}
                    </span>
                  </div>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(255, 255, 255, 0.18)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.35)',
                  color: '#ffffff',
                  padding: '9px 18px',
                  borderRadius: '10px',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontFamily: "'Hind Siliguri', sans-serif"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#ef4444';
                  e.currentTarget.style.borderColor = '#ef4444';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.18)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.35)';
                }}
              >
                <i className="fa-solid fa-arrow-right-from-bracket"></i>
                <span>লগআউট</span>
              </button>
            </div>
          </div>

          {/* Profile Content Body */}
          <div style={{ padding: '28px 32px 32px' }}>

            {/* Overview Information Cards Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '16px',
              marginTop: '16px',
              marginBottom: '32px'
            }}>
              {/* Card 1: Email */}
              <div style={{
                background: '#f8fafc',
                border: '1px solid var(--border-subtle)',
                borderRadius: '16px',
                padding: '18px 20px',
                transition: 'all 0.2s ease'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)', fontSize: '0.84rem', marginBottom: '8px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: '#ecfdf5',
                    color: 'var(--emerald-600)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.9rem'
                  }}>
                    <i className="fa-solid fa-envelope"></i>
                  </div>
                  <span style={{ fontWeight: 600 }}>ইমেইল অ্যাড্রেস</span>
                </div>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.96rem', wordBreak: 'break-all' }}>
                  {user.email}
                </div>
              </div>

              {/* Card 2: Join Date */}
              <div style={{
                background: '#f8fafc',
                border: '1px solid var(--border-subtle)',
                borderRadius: '16px',
                padding: '18px 20px',
                transition: 'all 0.2s ease'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)', fontSize: '0.84rem', marginBottom: '8px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: '#e0f2fe',
                    color: 'var(--cyan-600)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.9rem'
                  }}>
                    <i className="fa-solid fa-calendar-check"></i>
                  </div>
                  <span style={{ fontWeight: 600 }}>যুক্ত হওয়ার তারিখ</span>
                </div>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.96rem' }}>
                  {formattedDate}
                </div>
              </div>

              {/* Card 3: Saved Bookmarks */}
              <div style={{
                background: '#f8fafc',
                border: '1px solid var(--border-subtle)',
                borderRadius: '16px',
                padding: '18px 20px',
                transition: 'all 0.2s ease'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)', fontSize: '0.84rem', marginBottom: '8px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: '#ecfdf5',
                    color: 'var(--emerald-600)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.9rem'
                  }}>
                    <i className="fa-solid fa-bookmark"></i>
                  </div>
                  <span style={{ fontWeight: 600 }}>সংরক্ষিত প্রশ্নব্যাংক</span>
                </div>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.96rem' }}>
                  {bookmarkCount} টি প্রশ্ন সংরক্ষিত
                </div>
              </div>

              {/* Card 4: Account Tier */}
              <div style={{
                background: '#f8fafc',
                border: '1px solid var(--border-subtle)',
                borderRadius: '16px',
                padding: '18px 20px',
                transition: 'all 0.2s ease'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)', fontSize: '0.84rem', marginBottom: '8px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: isOwner ? '#fffbeb' : '#f0fdf4',
                    color: isOwner ? '#d97706' : 'var(--emerald-600)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.9rem'
                  }}>
                    <i className={isOwner ? "fa-solid fa-crown" : "fa-solid fa-shield-halved"}></i>
                  </div>
                  <span style={{ fontWeight: 600 }}>নিরাপত্তা স্তর</span>
                </div>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.96rem' }}>
                  {isOwner ? 'সর্বোচ্চ নিয়ন্ত্রক (Root)' : isAdmin ? 'প্রশাসনিক এক্সেস' : 'সাধারণ সদস্য'}
                </div>
              </div>
            </div>

            {/* ======================================================== */}
            {/* USER & ROLE MANAGEMENT HUB (Visible to Owner & Admin)     */}
            {/* ======================================================== */}
            {canManage && (
              <div style={{
                marginTop: '32px',
                marginBottom: '36px',
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '20px',
                padding: '28px',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)'
              }}>
                {/* Hub Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      background: isOwner ? '#fffbeb' : '#e0f2fe',
                      color: isOwner ? '#d97706' : '#0284c7',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.25rem'
                    }}>
                      <i className="fa-solid fa-users-gear"></i>
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                        ইউজার ও পারমিশন কন্ট্রোল প্যানেল
                      </h3>
                      <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
                        {isOwner 
                          ? 'ওনার ক্ষমতা: যে কোনো ইউজারের অ্যাকাউন্ট অনুমোদন/স্থগিত এবং অ্যাডমিন নিয়োগ বা বাতিল করতে পারেন।' 
                          : 'অ্যাডমিন ক্ষমতা: অপেক্ষমাণ ইউজার অনুমোদন বা অননুমোদিত ইউজার স্থগিত করতে পারেন।'}
                      </p>
                    </div>
                  </div>

                  {/* Refresh Button */}
                  <button
                    onClick={fetchUsersList}
                    disabled={loadingUsers}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '9px 16px',
                      borderRadius: '10px',
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border-subtle)',
                      fontSize: '0.84rem',
                      fontWeight: 600,
                      color: 'var(--text-secondary)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--emerald-500)'}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
                  >
                    <i className={`fa-solid fa-arrows-rotate ${loadingUsers ? 'fa-spin' : ''}`} style={{ color: 'var(--emerald-600)' }}></i>
                    <span>তালিক রিফ্রেশ</span>
                  </button>
                </div>

                {/* Status Feedback Message */}
                {mgmtMessage && (
                  <div style={{
                    padding: '12px 18px',
                    borderRadius: '12px',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: mgmtMessage.type === 'success' ? '#f0fdf4' : '#fff1f2',
                    color: mgmtMessage.type === 'success' ? '#166534' : '#e11d48',
                    border: `1px solid ${mgmtMessage.type === 'success' ? '#bbf7d0' : '#fecdd3'}`
                  }}>
                    <i className={mgmtMessage.type === 'success' ? "fa-solid fa-circle-check" : "fa-solid fa-triangle-exclamation"}></i>
                    <span>{mgmtMessage.text}</span>
                  </div>
                )}

                {/* Filter Controls & Search */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '14px',
                  marginBottom: '20px'
                }}>
                  {/* Filter Pills */}
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => setRoleFilter('all')}
                      style={{
                        padding: '7px 16px',
                        borderRadius: '9999px',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        border: '1px solid',
                        borderColor: roleFilter === 'all' ? 'var(--emerald-600)' : '#e2e8f0',
                        background: roleFilter === 'all' ? 'var(--emerald-600)' : '#ffffff',
                        color: roleFilter === 'all' ? '#ffffff' : 'var(--text-secondary)',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <span>সকল ইউজার</span>
                      <span style={{
                        background: roleFilter === 'all' ? 'rgba(255,255,255,0.3)' : '#f1f5f9',
                        padding: '1px 7px',
                        borderRadius: '10px',
                        fontSize: '0.74rem'
                      }}>{totalCount}</span>
                    </button>

                    <button
                      onClick={() => setRoleFilter('pending')}
                      style={{
                        padding: '7px 16px',
                        borderRadius: '9999px',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        border: '1px solid',
                        borderColor: roleFilter === 'pending' ? '#e11d48' : '#fecdd3',
                        background: roleFilter === 'pending' ? '#e11d48' : '#fff1f2',
                        color: roleFilter === 'pending' ? '#ffffff' : '#e11d48',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <i className="fa-solid fa-hourglass-half" style={{ fontSize: '0.75rem' }}></i>
                      <span>অপেক্ষমাণ</span>
                      <span style={{
                        background: roleFilter === 'pending' ? 'rgba(255,255,255,0.3)' : '#ffffff',
                        padding: '1px 7px',
                        borderRadius: '10px',
                        fontSize: '0.74rem'
                      }}>{pendingCount}</span>
                    </button>

                    <button
                      onClick={() => setRoleFilter('admin')}
                      style={{
                        padding: '7px 16px',
                        borderRadius: '9999px',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        border: '1px solid',
                        borderColor: roleFilter === 'admin' ? '#0284c7' : '#bae6fd',
                        background: roleFilter === 'admin' ? '#0284c7' : '#f0f9ff',
                        color: roleFilter === 'admin' ? '#ffffff' : '#0284c7',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <i className="fa-solid fa-shield-halved" style={{ fontSize: '0.75rem' }}></i>
                      <span>অ্যাডমিন ও ওনার</span>
                      <span style={{
                        background: roleFilter === 'admin' ? 'rgba(255,255,255,0.3)' : '#ffffff',
                        padding: '1px 7px',
                        borderRadius: '10px',
                        fontSize: '0.74rem'
                      }}>{adminCount}</span>
                    </button>
                  </div>

                  {/* Search Bar */}
                  <div style={{ position: 'relative', minWidth: '240px' }}>
                    <i className="fa-solid fa-magnifying-glass" style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--text-muted)',
                      fontSize: '0.82rem'
                    }}></i>
                    <input
                      type="text"
                      placeholder="ইউজার খুঁজুন (নাম, ইমেইল)..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 12px 8px 34px',
                        fontSize: '0.84rem',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '10px',
                        outline: 'none',
                        background: '#ffffff',
                        color: 'var(--text-primary)'
                      }}
                    />
                  </div>
                </div>

                {/* Modern Users Table */}
                <div style={{
                  overflowX: 'auto',
                  borderRadius: '14px',
                  border: '1px solid var(--border-subtle)',
                  background: '#ffffff'
                }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: 'var(--text-secondary)' }}>
                        <th style={{ padding: '14px 16px', fontWeight: 700 }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            <i className="fa-solid fa-user" style={{ color: 'var(--emerald-600)' }}></i>
                            ব্যবহারকারী
                          </span>
                        </th>
                        <th style={{ padding: '14px 16px', fontWeight: 700 }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            <i className="fa-solid fa-envelope" style={{ color: 'var(--cyan-600)' }}></i>
                            ইমেইল
                          </span>
                        </th>
                        <th style={{ padding: '14px 16px', fontWeight: 700 }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            <i className="fa-solid fa-user-tag" style={{ color: 'var(--emerald-600)' }}></i>
                            রোল (Role)
                          </span>
                        </th>
                        <th style={{ padding: '14px 16px', fontWeight: 700 }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            <i className="fa-solid fa-shield" style={{ color: 'var(--emerald-600)' }}></i>
                            স্ট্যাটাস
                          </span>
                        </th>
                        <th style={{ padding: '14px 16px', textAlign: 'center', fontWeight: 700 }}>অনুমোদন একশন</th>
                        <th style={{ padding: '14px 16px', textAlign: 'center', fontWeight: 700 }}>রোল একশন (Owner Only)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan={6} style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)' }}>
                            <i className="fa-solid fa-user-slash" style={{ fontSize: '2rem', marginBottom: '8px', opacity: 0.5, display: 'block' }}></i>
                            কোনো ব্যবহারকারী পাওয়া যায়নি
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map((u) => {
                          const isTargetOwner = u.role === 'owner';
                          const isTargetAdmin = u.role === 'admin';
                          const isTargetApproved = u.status === 'approved';

                          return (
                            <tr
                              key={u.id}
                              style={{
                                borderBottom: '1px solid #f1f5f9',
                                background: isTargetOwner ? '#fffdf5' : 'transparent',
                                transition: 'background 0.15s ease'
                              }}
                            >
                              {/* User Info */}
                              <td style={{ padding: '14px 16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                  <div style={{
                                    width: '34px',
                                    height: '34px',
                                    borderRadius: '50%',
                                    background: isTargetOwner
                                      ? '#fffbeb'
                                      : isTargetAdmin
                                      ? '#f0f9ff'
                                      : '#ecfdf5',
                                    color: isTargetOwner
                                      ? '#d97706'
                                      : isTargetAdmin
                                      ? '#0284c7'
                                      : 'var(--emerald-600)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 700,
                                    fontSize: '0.85rem'
                                  }}>
                                    {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                                  </div>
                                  <div>
                                    <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{u.name}</div>
                                    <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>@{u.username}</div>
                                  </div>
                                </div>
                              </td>

                              {/* Email */}
                              <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>
                                {u.email}
                              </td>

                              {/* Role */}
                              <td style={{ padding: '14px 16px' }}>
                                <span style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '5px',
                                  padding: '3px 10px',
                                  borderRadius: '9999px',
                                  fontSize: '0.75rem',
                                  fontWeight: 700,
                                  background: isTargetOwner ? '#fffbeb' : isTargetAdmin ? '#f0f9ff' : '#ecfdf5',
                                  color: isTargetOwner ? '#b45309' : isTargetAdmin ? '#0284c7' : 'var(--emerald-600)',
                                  border: `1px solid ${isTargetOwner ? '#fde68a' : isTargetAdmin ? '#bae6fd' : '#a7f3d0'}`
                                }}>
                                  <i className={isTargetOwner ? "fa-solid fa-crown" : isTargetAdmin ? "fa-solid fa-shield-halved" : "fa-solid fa-user"}></i>
                                  <span>{isTargetOwner ? 'ওনার' : isTargetAdmin ? 'এডমিন' : 'ইউজার'}</span>
                                </span>
                              </td>

                              {/* Status */}
                              <td style={{ padding: '14px 16px' }}>
                                <span style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '5px',
                                  padding: '3px 10px',
                                  borderRadius: '9999px',
                                  fontSize: '0.75rem',
                                  fontWeight: 700,
                                  background: isTargetApproved ? '#f0fdf4' : '#fff1f2',
                                  color: isTargetApproved ? '#166534' : '#e11d48',
                                  border: `1px solid ${isTargetApproved ? '#bbf7d0' : '#fecdd3'}`
                                }}>
                                  <i className={isTargetApproved ? "fa-solid fa-circle-check" : "fa-solid fa-hourglass-half"}></i>
                                  <span>{isTargetApproved ? 'অনুমোদিত' : 'অপেক্ষমাণ'}</span>
                                </span>
                              </td>

                              {/* Status Actions */}
                              <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                                {isTargetOwner ? (
                                  <span style={{ fontSize: '0.76rem', color: '#94a3b8', fontStyle: 'italic' }}>অপরিবর্তনযোগ্য</span>
                                ) : (
                                  <div style={{ display: 'inline-flex', gap: '6px' }}>
                                    {u.status !== 'approved' ? (
                                      <button
                                        onClick={() => handleUpdateStatus(u.id, 'approved')}
                                        disabled={actionLoadingId === `status-${u.id}`}
                                        style={{
                                          background: '#ecfdf5',
                                          border: '1px solid #a7f3d0',
                                          color: 'var(--emerald-600)',
                                          padding: '5px 12px',
                                          borderRadius: '8px',
                                          fontSize: '0.78rem',
                                          fontWeight: 700,
                                          cursor: 'pointer',
                                          display: 'inline-flex',
                                          alignItems: 'center',
                                          gap: '6px',
                                          transition: 'all 0.15s ease'
                                        }}
                                        title="অ্যাকাউন্ট অনুমোদন করুন"
                                      >
                                        <i className={`fa-solid ${actionLoadingId === `status-${u.id}` ? 'fa-spinner fa-spin' : 'fa-check'}`}></i>
                                        <span>অনুমোদন</span>
                                      </button>
                                    ) : (
                                      <button
                                        onClick={() => handleUpdateStatus(u.id, 'pending')}
                                        disabled={actionLoadingId === `status-${u.id}`}
                                        style={{
                                          background: '#fff1f2',
                                          border: '1px solid #fecdd3',
                                          color: '#e11d48',
                                          padding: '5px 12px',
                                          borderRadius: '8px',
                                          fontSize: '0.78rem',
                                          fontWeight: 700,
                                          cursor: 'pointer',
                                          display: 'inline-flex',
                                          alignItems: 'center',
                                          gap: '6px',
                                          transition: 'all 0.15s ease'
                                        }}
                                        title="অ্যাকাউন্ট স্থগিত করুন"
                                      >
                                        <i className={`fa-solid ${actionLoadingId === `status-${u.id}` ? 'fa-spinner fa-spin' : 'fa-ban'}`}></i>
                                        <span>স্থগিত</span>
                                      </button>
                                    )}
                                  </div>
                                )}
                              </td>

                              {/* Role Actions */}
                              <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                                {isTargetOwner ? (
                                  <span style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '5px',
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    color: '#b45309',
                                    background: '#fffbeb',
                                    border: '1px solid #fde68a',
                                    padding: '3px 10px',
                                    borderRadius: '6px'
                                  }}>
                                    <i className="fa-solid fa-lock"></i>
                                    ফিক্সড ওনার
                                  </span>
                                ) : isOwner ? (
                                  u.role === 'admin' ? (
                                    <button
                                      onClick={() => handleUpdateRole(u.id, 'user')}
                                      disabled={actionLoadingId === `role-${u.id}`}
                                      style={{
                                        background: '#fff1f2',
                                        border: '1px solid #fecdd3',
                                        color: '#e11d48',
                                        padding: '5px 12px',
                                        borderRadius: '8px',
                                        fontSize: '0.78rem',
                                        fontWeight: 700,
                                        cursor: 'pointer',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '6px'
                                      }}
                                      title="অ্যাডমিন পদ থেকে সাধারণ ইউজার করুন"
                                    >
                                      <i className={`fa-solid ${actionLoadingId === `role-${u.id}` ? 'fa-spinner fa-spin' : 'fa-user-minus'}`}></i>
                                      <span>অ্যাডমিন বাতিল</span>
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => handleUpdateRole(u.id, 'admin')}
                                      disabled={actionLoadingId === `role-${u.id}`}
                                      style={{
                                        background: '#f0f9ff',
                                        border: '1px solid #bae6fd',
                                        color: '#0284c7',
                                        padding: '5px 12px',
                                        borderRadius: '8px',
                                        fontSize: '0.78rem',
                                        fontWeight: 700,
                                        cursor: 'pointer',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '6px'
                                      }}
                                      title="এই ইউজারকে অ্যাডমিন করুন"
                                    >
                                      <i className={`fa-solid ${actionLoadingId === `role-${u.id}` ? 'fa-spinner fa-spin' : 'fa-shield'}`}></i>
                                      <span>অ্যাডমিন বানান</span>
                                    </button>
                                  )
                                ) : (
                                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                                    (ওনারের ক্ষমতা)
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Quick Access Study Hub Section */}
            <div style={{ marginTop: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <i className="fa-solid fa-compass" style={{ color: 'var(--emerald-600)', fontSize: '1.1rem' }}></i>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                  আপনার স্টাডি ও একশন হাব
                </h3>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '16px'
              }}>
                {/* Hub Card 1: Bookmarks */}
                <Link
                  href="/bookmarks"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '18px 20px',
                    background: '#ffffff',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '16px',
                    textDecoration: 'none',
                    color: 'var(--text-primary)',
                    boxShadow: 'var(--shadow-subtle)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--emerald-500)';
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-hover)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-subtle)';
                  }}
                >
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                    flexShrink: 0
                  }}>
                    <i className="fa-solid fa-bookmark"></i>
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.96rem', color: 'var(--text-primary)' }}>বুকমার্কস রিভিশন</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>সংরক্ষিত প্রশ্নগুলো পড়ুন</div>
                  </div>
                </Link>

                {/* Hub Card 2: Exams */}
                <Link
                  href="/exams"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '18px 20px',
                    background: '#ffffff',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '16px',
                    textDecoration: 'none',
                    color: 'var(--text-primary)',
                    boxShadow: 'var(--shadow-subtle)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--cyan-500)';
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-hover)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-subtle)';
                  }}
                >
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #06b6d4 0%, #0284c7 100%)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                    flexShrink: 0
                  }}>
                    <i className="fa-solid fa-layer-group"></i>
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.96rem', color: 'var(--text-primary)' }}>সকল প্রশ্নব্যাংক</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>২,১১১+ জব সলিউশনস</div>
                  </div>
                </Link>

                {/* Hub Card 3: Model Test */}
                <Link
                  href="/model-test"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '18px 20px',
                    background: '#ffffff',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '16px',
                    textDecoration: 'none',
                    color: 'var(--text-primary)',
                    boxShadow: 'var(--shadow-subtle)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--amber-500)';
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-hover)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-subtle)';
                  }}
                >
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                    flexShrink: 0
                  }}>
                    <i className="fa-solid fa-stopwatch"></i>
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.96rem', color: 'var(--text-primary)' }}>লাইভ মডেল টেস্ট</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>টাইমার ও নেগেটিভ মার্কিং</div>
                  </div>
                </Link>

                {/* Hub Card 4: Studio */}
                <Link
                  href="/file-studio"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '18px 20px',
                    background: '#ffffff',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '16px',
                    textDecoration: 'none',
                    color: 'var(--text-primary)',
                    boxShadow: 'var(--shadow-subtle)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#8b5cf6';
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-hover)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-subtle)';
                  }}
                >
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                    flexShrink: 0
                  }}>
                    <i className="fa-solid fa-table"></i>
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.96rem', color: 'var(--text-primary)' }}>ফাইল ও টেবিল স্টুডিও</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>কাস্টম SQLite ও এক্সেল</div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Cloudflare D1 Diagnostic Info Bar */}
            <div style={{
              marginTop: '32px',
              padding: '16px 20px',
              background: '#f8fafc',
              border: '1px dashed #cbd5e1',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{
                  display: 'inline-block',
                  width: '9px',
                  height: '9px',
                  borderRadius: '50%',
                  background: 'var(--emerald-500)',
                  boxShadow: '0 0 8px rgba(16, 185, 129, 0.8)'
                }}></span>
                <i className="fa-solid fa-circle-nodes" style={{ color: 'var(--emerald-600)' }}></i>
                <span style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                  Cloudflare D1 ডেটাবেজ: <strong style={{ color: 'var(--text-primary)' }}>bp-app-db</strong> (APAC Edge) সেশন সক্রিয়
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                <i className="fa-solid fa-fingerprint"></i>
                <span>UUID: 07a4f37d-d04d-406d-ac5c-c71a59eba141</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
