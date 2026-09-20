'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  User, 
  Mail, 
  Shield, 
  Calendar, 
  Clock, 
  Database, 
  Bookmark, 
  Layers, 
  LogOut, 
  CheckCircle,
  FileSpreadsheet,
  Crown,
  Users,
  Check,
  X,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../../lib/authContext';
import { getBookmarks } from '../../lib/storage';

export default function ProfilePage() {
  const router = useRouter();
  const { user, token, loading, logout } = useAuth();
  const [bookmarkCount, setBookmarkCount] = useState(0);

  // Management state for Owner/Admin
  const [allUsers, setAllUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [mgmtMessage, setMgmtMessage] = useState(null);

  useEffect(() => {
    try {
      const bms = getBookmarks();
      setBookmarkCount(Array.isArray(bms) ? bms.length : 0);
    } catch (e) {
      setBookmarkCount(0);
    }
  }, []);

  // Fetch users if user is owner or admin
  const fetchUsersList = async () => {
    if (!token || !user || (user.role !== 'owner' && user.role !== 'admin')) return;
    setLoadingUsers(true);
    try {
      let data = null;
      try {
        const res = await fetch('/api/auth/users', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          data = await res.json();
          if (res.ok && data.users) {
            setAllUsers(data.users);
            return;
          }
        }
      } catch (e) {
        // Fallback to local dev data if next dev mode
      }

      // Local dev fallback
      const localUsers = JSON.parse(localStorage.getItem('js_local_users') || '[]');
      const defaultList = [
        { id: 2, username: 'mosabber', name: 'মোঃ মোসাব্বের', email: 'mosabber.tech@gmail.com', role: 'owner', status: 'approved', created_at: '2026-09-20T17:05:00.000Z' },
        { id: 1, username: 'admin', name: 'এডমিন ইউজার', email: 'admin@jobsolutions.com', role: 'admin', status: 'approved', created_at: '2026-09-20T17:05:00.000Z' },
        ...localUsers.map(u => ({ id: u.id, username: u.username, name: u.name, email: u.email, role: u.role || 'user', status: u.status || 'pending', created_at: u.created_at }))
      ];
      setAllUsers(defaultList);
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
      let successMsg = `ইউজারের স্ট্যাটাস সফলভাবে '${newStatus}' করা হয়েছে`;
      try {
        const res = await fetch('/api/auth/users', {
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
        if (contentType.includes('application/json')) {
          const data = await res.json();
          if (!res.ok) {
            throw new Error(data.error || 'স্ট্যাটাস আপডেট ব্যর্থ হয়েছে');
          }
          successMsg = data.message;
        }
      } catch (apiErr) {
        if (apiErr.message && !apiErr.message.includes('JSON') && !apiErr.message.includes('fetch')) {
          throw apiErr;
        }
      }

      // Local storage sync for dev mode
      const localUsers = JSON.parse(localStorage.getItem('js_local_users') || '[]');
      const updated = localUsers.map(u => u.id === targetUserId ? { ...u, status: newStatus } : u);
      localStorage.setItem('js_local_users', JSON.stringify(updated));

      setMgmtMessage({ type: 'success', text: successMsg });
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
      let successMsg = `ব্যবহারকারীর রোল সফলভাবে '${newRole}' করা হয়েছে`;
      try {
        const res = await fetch('/api/auth/users', {
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
        if (contentType.includes('application/json')) {
          const data = await res.json();
          if (!res.ok) {
            throw new Error(data.error || 'রোল পরিবর্তন ব্যর্থ হয়েছে');
          }
          successMsg = data.message;
        }
      } catch (apiErr) {
        if (apiErr.message && !apiErr.message.includes('JSON') && !apiErr.message.includes('fetch')) {
          throw apiErr;
        }
      }

      // Local storage sync for dev mode
      const localUsers = JSON.parse(localStorage.getItem('js_local_users') || '[]');
      const updated = localUsers.map(u => u.id === targetUserId ? { ...u, role: newRole } : u);
      localStorage.setItem('js_local_users', JSON.stringify(updated));

      setMgmtMessage({ type: 'success', text: successMsg });
      await fetchUsersList();
    } catch (err) {
      setMgmtMessage({ type: 'error', text: err.message });
    } finally {
      setActionLoadingId(null);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: '4px solid #e2e8f0',
          borderTopColor: 'var(--emerald-600)',
          borderRadius: '50%',
          margin: '0 auto 16px',
          animation: 'spin 1s linear infinite'
        }} />
        <p style={{ color: '#64748b', fontSize: '0.95rem' }}>প্রোফাইল লোড হচ্ছে...</p>
        <style jsx>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container" style={{ padding: '80px 20px', maxWidth: '480px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '40px 24px',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-subtle)'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: '#f1f5f9',
            color: '#64748b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px'
          }}>
            <User size={32} />
          </div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
            প্রোফাইল দেখতে অনুগ্রহ করে লগইন করুন
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '24px' }}>
            আপনার সেভ করা প্রশ্ন, বুকমার্কস ও পরীক্ষার ফলাফল দেখতে সাইটে সাইন ইন করুন।
          </p>
          <Link
            href="/login"
            className="btn-primary"
            style={{
              padding: '12px 24px',
              fontSize: '0.95rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              textDecoration: 'none'
            }}
          >
            <span>লগইন পেজে যান</span>
          </Link>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.push('/');
  };

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

  // Counters
  const totalCount = allUsers.length;
  const pendingCount = allUsers.filter(u => u.status === 'pending').length;
  const adminCount = allUsers.filter(u => u.role === 'admin' || u.role === 'owner').length;

  return (
    <div style={{ minHeight: '80vh', padding: '40px 16px', background: 'var(--bg-primary)' }}>
      <div className="container" style={{ maxWidth: '1300px', margin: '0 auto' }}>
        
        {/* Profile Header Banner */}
        <div style={{
          background: isOwner
            ? 'linear-gradient(135deg, #78350f 0%, #b45309 50%, #d97706 100%)'
            : isAdmin
            ? 'linear-gradient(135deg, #0c4a6e 0%, #0284c7 50%, #0369a1 100%)'
            : 'linear-gradient(135deg, #065f46 0%, #047857 50%, #059669 100%)',
          borderRadius: '20px 20px 0 0',
          padding: '36px 32px 64px',
          color: '#ffffff',
          position: 'relative'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(8px)',
                padding: '4px 12px',
                borderRadius: '9999px',
                fontSize: '0.78rem',
                fontWeight: 600,
                marginBottom: '10px'
              }}>
                <Database size={13} />
                Cloudflare D1 Verified Account
              </div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
                ব্যবহারকারী ড্যাশবোর্ড
              </h1>
            </div>

            <button
              onClick={handleLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(239, 68, 68, 0.85)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: '#ffffff',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '0.88rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#dc2626'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.85)'}
            >
              <LogOut size={16} />
              <span>লগআউট</span>
            </button>
          </div>
        </div>

        {/* Profile Card Main Body */}
        <div style={{
          background: '#ffffff',
          borderRadius: '0 0 20px 20px',
          border: '1px solid var(--border-subtle)',
          borderTop: 'none',
          padding: '0 32px 36px',
          boxShadow: 'var(--shadow-subtle)',
          position: 'relative'
        }}>
          {/* Avatar & User Details */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: '20px',
            transform: 'translateY(-36px)',
            flexWrap: 'wrap'
          }}>
            <div style={{
              width: '88px',
              height: '88px',
              borderRadius: '50%',
              background: isOwner
                ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                : isAdmin
                ? 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)'
                : 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
              border: '4px solid #ffffff',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.4rem',
              fontWeight: 800,
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)'
            }}>
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>

            <div style={{ paddingBottom: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  {user.name}
                </h2>

                {/* Role Badge */}
                <span style={{
                  background: isOwner ? '#fef3c7' : isAdmin ? '#e0f2fe' : '#ecfdf5',
                  color: isOwner ? '#92400e' : isAdmin ? '#0369a1' : '#047857',
                  border: isOwner ? '1px solid #fde68a' : isAdmin ? '1px solid #bae6fd' : '1px solid #a7f3d0',
                  padding: '3px 12px',
                  borderRadius: '9999px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px'
                }}>
                  {isOwner ? <Crown size={14} color="#d97706" /> : isAdmin ? <Shield size={14} color="#0284c7" /> : null}
                  {isOwner ? '👑 সিস্টেম ওনার (Owner - ফিক্সড)' : isAdmin ? '🛡️ অ্যাডমিনিস্ট্রেটর' : '👤 শিক্ষার্থী / সাধারণ ইউজার'}
                </span>

                {/* Status Badge */}
                <span style={{
                  background: user.status === 'approved' ? '#f0fdf4' : '#fef2f2',
                  color: user.status === 'approved' ? '#166534' : '#dc2626',
                  border: user.status === 'approved' ? '1px solid #bbf7d0' : '1px solid #fecaca',
                  padding: '3px 10px',
                  borderRadius: '9999px',
                  fontSize: '0.74rem',
                  fontWeight: 600
                }}>
                  {user.status === 'approved' ? '✅ অ্যাকাউন্ট অনুমোদিত' : '⏳ অনুমোদনের অপেক্ষায়'}
                </span>
              </div>
              <p style={{ color: '#64748b', fontSize: '0.92rem', marginTop: '4px' }}>
                @{user.username} • {user.email}
              </p>
            </div>
          </div>

          {/* User Details Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
            marginTop: '-10px',
            marginBottom: '32px'
          }}>
            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#64748b', fontSize: '0.84rem', marginBottom: '6px' }}>
                <Mail size={16} color="var(--emerald-600)" />
                <span>ইমেইল অ্যাড্রেস</span>
              </div>
              <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.95rem' }}>
                {user.email}
              </div>
            </div>

            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#64748b', fontSize: '0.84rem', marginBottom: '6px' }}>
                <Calendar size={16} color="var(--emerald-600)" />
                <span>যুক্ত হওয়ার তারিখ</span>
              </div>
              <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.95rem' }}>
                {formattedDate}
              </div>
            </div>

            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#64748b', fontSize: '0.84rem', marginBottom: '6px' }}>
                <Bookmark size={16} color="var(--emerald-600)" />
                <span>সংরক্ষিত বুকমার্কস</span>
              </div>
              <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.95rem' }}>
                {bookmarkCount} টি সংরক্ষিত প্রশ্ন
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* USER & ROLE MANAGEMENT HUB (Visible to Owner & Admin)     */}
          {/* ======================================================== */}
          {canManage && (
            <div style={{
              marginTop: '20px',
              marginBottom: '36px',
              background: '#f8fafc',
              border: '1px solid #cbd5e1',
              borderRadius: '16px',
              padding: '24px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '18px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Users size={22} color={isOwner ? '#d97706' : '#0284c7'} />
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                      ইউজার ও পারমিশন কন্ট্রোল
                    </h3>
                  </div>
                  <p style={{ fontSize: '0.84rem', color: '#64748b', marginTop: '3px' }}>
                    {isOwner 
                      ? '👑 ওনার হিসেবে আপনি ইউজার অনুমোদন এবং অ্যাডমিন তৈরি/বাতিল করতে পারবেন।' 
                      : '🛡️ অ্যাডমিন হিসেবে আপনি ইউজার অনুমোদন বা স্থগিত করতে পারবেন (অ্যাডমিন তৈরি শুধুমাত্র ওনারের ক্ষমতা)।'}
                  </p>
                </div>

                <button
                  onClick={fetchUsersList}
                  disabled={loadingUsers}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.84rem',
                    fontWeight: 600,
                    color: '#334155',
                    cursor: 'pointer'
                  }}
                >
                  <RefreshCw size={14} className={loadingUsers ? 'animate-spin' : ''} />
                  <span>রিফ্রেশ করুন</span>
                </button>
              </div>

              {/* Status Message */}
              {mgmtMessage && (
                <div style={{
                  padding: '10px 14px',
                  borderRadius: '8px',
                  fontSize: '0.86rem',
                  fontWeight: 600,
                  marginBottom: '16px',
                  background: mgmtMessage.type === 'success' ? '#f0fdf4' : '#fef2f2',
                  color: mgmtMessage.type === 'success' ? '#166534' : '#dc2626',
                  border: `1px solid ${mgmtMessage.type === 'success' ? '#bbf7d0' : '#fecaca'}`
                }}>
                  {mgmtMessage.text}
                </div>
              )}

              {/* Stat Pills */}
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '8px 14px', fontSize: '0.82rem' }}>
                  মোট নিবন্ধিত: <strong style={{ color: '#0f172a' }}>{totalCount}</strong>
                </div>
                <div style={{ background: '#ffffff', border: '1px solid #fecaca', borderRadius: '10px', padding: '8px 14px', fontSize: '0.82rem' }}>
                  অপেক্ষমাণ (Pending): <strong style={{ color: '#dc2626' }}>{pendingCount}</strong>
                </div>
                <div style={{ background: '#ffffff', border: '1px solid #bae6fd', borderRadius: '10px', padding: '8px 14px', fontSize: '0.82rem' }}>
                  অ্যাডমিন ও ওনার: <strong style={{ color: '#0284c7' }}>{adminCount}</strong>
                </div>
              </div>

              {/* Users Table */}
              <div style={{ overflowX: 'auto', background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: '#f1f5f9', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
                      <th style={{ padding: '12px 14px' }}>ব্যবহারকারী</th>
                      <th style={{ padding: '12px 14px' }}>ইমেইল</th>
                      <th style={{ padding: '12px 14px' }}>রোল (Role)</th>
                      <th style={{ padding: '12px 14px' }}>স্ট্যাটাস (Status)</th>
                      <th style={{ padding: '12px 14px', textAlign: 'center' }}>অনুমোদন একশন</th>
                      <th style={{ padding: '12px 14px', textAlign: 'center' }}>রোল একশন (Owner Only)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allUsers.map((u) => {
                      const isTargetOwner = u.role === 'owner';
                      const isTargetAdmin = u.role === 'admin';
                      const isTargetApproved = u.status === 'approved';

                      return (
                        <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9', background: isTargetOwner ? '#fffbeb' : 'transparent' }}>
                          <td style={{ padding: '12px 14px' }}>
                            <div style={{ fontWeight: 700, color: '#0f172a' }}>{u.name}</div>
                            <div style={{ fontSize: '0.76rem', color: '#64748b' }}>@{u.username}</div>
                          </td>
                          <td style={{ padding: '12px 14px', color: '#334155' }}>
                            {u.email}
                          </td>
                          <td style={{ padding: '12px 14px' }}>
                            <span style={{
                              display: 'inline-block',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontSize: '0.74rem',
                              fontWeight: 700,
                              background: isTargetOwner ? '#fef3c7' : isTargetAdmin ? '#e0f2fe' : '#ecfdf5',
                              color: isTargetOwner ? '#b45309' : isTargetAdmin ? '#0369a1' : '#047857'
                            }}>
                              {isTargetOwner ? '👑 ওনার' : isTargetAdmin ? '🛡️ এডমিন' : '👤 ইউজার'}
                            </span>
                          </td>
                          <td style={{ padding: '12px 14px' }}>
                            <span style={{
                              display: 'inline-block',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontSize: '0.74rem',
                              fontWeight: 600,
                              background: isTargetApproved ? '#f0fdf4' : '#fef2f2',
                              color: isTargetApproved ? '#166534' : '#dc2626'
                            }}>
                              {isTargetApproved ? '✅ অনুমোদিত' : '⏳ অপেক্ষমাণ'}
                            </span>
                          </td>

                          {/* Status Actions: Owner AND Admin can both approve/reject */}
                          <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                            {isTargetOwner ? (
                              <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontStyle: 'italic' }}>অপরিবর্তনযোগ্য</span>
                            ) : (
                              <div style={{ display: 'inline-flex', gap: '6px' }}>
                                {u.status !== 'approved' ? (
                                  <button
                                    onClick={() => handleUpdateStatus(u.id, 'approved')}
                                    disabled={actionLoadingId === `status-${u.id}`}
                                    style={{
                                      background: '#ecfdf5',
                                      border: '1px solid #a7f3d0',
                                      color: '#047857',
                                      padding: '4px 10px',
                                      borderRadius: '6px',
                                      fontSize: '0.78rem',
                                      fontWeight: 600,
                                      cursor: 'pointer',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '4px'
                                    }}
                                    title="অ্যাকাউন্ট অনুমোদন করুন"
                                  >
                                    <Check size={13} />
                                    <span>অনুমোদন দিন</span>
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleUpdateStatus(u.id, 'pending')}
                                    disabled={actionLoadingId === `status-${u.id}`}
                                    style={{
                                      background: '#fef2f2',
                                      border: '1px solid #fecaca',
                                      color: '#dc2626',
                                      padding: '4px 10px',
                                      borderRadius: '6px',
                                      fontSize: '0.78rem',
                                      fontWeight: 600,
                                      cursor: 'pointer',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '4px'
                                    }}
                                    title="অ্যাকাউন্ট স্থগিত করুন"
                                  >
                                    <X size={13} />
                                    <span>স্থগিত</span>
                                  </button>
                                )}
                              </div>
                            )}
                          </td>

                          {/* Role Actions: ONLY Owner can promote/demote Admin */}
                          <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                            {isTargetOwner ? (
                              <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontSize: '0.74rem',
                                fontWeight: 700,
                                color: '#b45309',
                                background: '#fef3c7',
                                padding: '2px 8px',
                                borderRadius: '4px'
                              }}>
                                🔒 ফিক্সড ওনার
                              </span>
                            ) : isOwner ? (
                              /* Current user is Owner: can change roles */
                              u.role === 'admin' ? (
                                <button
                                  onClick={() => handleUpdateRole(u.id, 'user')}
                                  disabled={actionLoadingId === `role-${u.id}`}
                                  style={{
                                    background: '#fef2f2',
                                    border: '1px solid #fecaca',
                                    color: '#b91c1c',
                                    padding: '4px 10px',
                                    borderRadius: '6px',
                                    fontSize: '0.78rem',
                                    fontWeight: 600,
                                    cursor: 'pointer'
                                  }}
                                  title="অ্যাডমিন পদ থেকে সাধারণ ইউজার করুন"
                                >
                                  অ্যাডমিন বাতিল
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleUpdateRole(u.id, 'admin')}
                                  disabled={actionLoadingId === `role-${u.id}`}
                                  style={{
                                    background: '#f0f9ff',
                                    border: '1px solid #bae6fd',
                                    color: '#0369a1',
                                    padding: '4px 10px',
                                    borderRadius: '6px',
                                    fontSize: '0.78rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                  }}
                                  title="এই ইউজারকে অ্যাডমিন করুন"
                                >
                                  <Shield size={13} />
                                  <span>অ্যাডমিন বানান</span>
                                </button>
                              )
                            ) : (
                              /* Current user is Admin: cannot change roles */
                              <span style={{ fontSize: '0.74rem', color: '#94a3b8', fontStyle: 'italic' }}>
                                (শুধুমাত্র ওনারের ক্ষমতা)
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Quick Access Cards */}
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>
            আপনার স্টাডি ও অ্যাকশন হাব
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '14px'
          }}>
            <Link
              href="/bookmarks"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px 16px',
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                textDecoration: 'none',
                color: '#1e293b',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: '#ecfdf5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Bookmark size={20} color="var(--emerald-600)" />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>বুকমার্কস রিভিশন</div>
                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>সংরক্ষিত প্রশ্নগুলো পড়ুন</div>
              </div>
            </Link>

            <Link
              href="/exams"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px 16px',
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                textDecoration: 'none',
                color: '#1e293b',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: '#eff6ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Layers size={20} color="#2563eb" />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>সকল পরীক্ষা</div>
                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>২,১১১+ জব সলিউশনস</div>
              </div>
            </Link>

            <Link
              href="/model-test"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px 16px',
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                textDecoration: 'none',
                color: '#1e293b',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: '#fef3c7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Clock size={20} color="#d97706" />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>লাইভ মডেল টেস্ট</div>
                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>টাইমার ও নেগেটিভ মার্কিং</div>
              </div>
            </Link>

            <Link
              href="/file-studio"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px 16px',
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                textDecoration: 'none',
                color: '#1e293b',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: '#f3e8ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <FileSpreadsheet size={20} color="#7c3aed" />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>ফাইল স্টুডিও</div>
                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>কাস্টম SQLite ও XAPK</div>
              </div>
            </Link>
          </div>

          {/* Database System Diagnostic Info */}
          <div style={{
            marginTop: '32px',
            padding: '16px 20px',
            background: '#f8fafc',
            border: '1px dashed #cbd5e1',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CheckCircle size={18} color="var(--emerald-600)" />
              <span style={{ fontSize: '0.84rem', color: '#475569' }}>
                Cloudflare D1 ডেটাবেজ: <strong>bp-app-db</strong> (APAC Edge) সেশন সক্রিয়
              </span>
            </div>
            <span style={{ fontSize: '0.76rem', color: '#94a3b8', fontFamily: 'monospace' }}>
              DB: 07a4f37d-d04d-406d-ac5c-c71a59eba141
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}
