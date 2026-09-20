'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

// Built-in default seed accounts for local development fallback
const DEFAULT_ACCOUNTS = [
  {
    id: 2,
    username: 'mosabber',
    name: 'মোঃ মোসাব্বের',
    email: 'mosabber.tech@gmail.com',
    password: 'ownerpassword1234',
    role: 'owner',
    status: 'approved',
    created_at: '2026-09-20T17:05:00.000Z'
  },
  {
    id: 1,
    username: 'admin',
    name: 'এডমিন ইউজার',
    email: 'admin@jobsolutions.com',
    password: 'admin123',
    role: 'admin',
    status: 'approved',
    created_at: '2026-09-20T17:05:00.000Z'
  }
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize from localStorage on mount
  useEffect(() => {
    try {
      const savedToken = localStorage.getItem('js_auth_token');
      const savedUser = localStorage.getItem('js_auth_user');

      if (savedToken && savedUser) {
        setToken(savedToken);
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);

        // Verify with /api/auth/me if in Cloudflare environment
        fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${savedToken}`
          }
        })
          .then(res => {
            const contentType = res.headers.get('content-type') || '';
            if (contentType.includes('application/json')) {
              return res.json();
            }
            return null;
          })
          .then(data => {
            if (data && data.user) {
              setUser(data.user);
              localStorage.setItem('js_auth_user', JSON.stringify(data.user));
            }
          })
          .catch(() => {
            // Keep local session if network or dev environment
          });
      }
    } catch (e) {
      console.error('Failed to load user session', e);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (identifier, password) => {
    setLoading(true);
    const cleanId = String(identifier).trim().toLowerCase();

    try {
      // 1. Try Cloudflare Pages Functions API
      let data = null;
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ identifier: cleanId, password })
        });

        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          data = await res.json();
          if (!res.ok) {
            throw new Error(data.error || 'লগইন ব্যর্থ হয়েছে');
          }
        }
      } catch (apiErr) {
        // If the API explicitly returned an error message from D1, rethrow it
        if (apiErr.message && !apiErr.message.includes('JSON') && !apiErr.message.includes('fetch')) {
          throw apiErr;
        }
      }

      // 2. Local Dev Fallback (if running Next.js dev server where /functions are not active)
      if (!data || !data.user) {
        const localUsers = JSON.parse(localStorage.getItem('js_local_users') || '[]');
        const allCandidateUsers = [...DEFAULT_ACCOUNTS, ...localUsers];

        const match = allCandidateUsers.find(
          u => (u.username.toLowerCase() === cleanId || u.email.toLowerCase() === cleanId)
        );

        if (!match || match.password !== password) {
          throw new Error('ভুল ইমেইল/ইউজারনেম অথবা পাসওয়ার্ড');
        }

        const safeUser = {
          id: match.id,
          username: match.username,
          name: match.name,
          email: match.email,
          role: match.role || 'user',
          status: match.status || 'approved',
          created_at: match.created_at
        };

        data = {
          success: true,
          token: 'session_' + Math.random().toString(36).substring(2) + Date.now(),
          user: safeUser
        };
      }

      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('js_auth_token', data.token);
      localStorage.setItem('js_auth_user', JSON.stringify(data.user));
      document.cookie = `auth_token=${data.token}; path=/; max-age=2592000; SameSite=Lax`;

      return { success: true, user: data.user };
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async ({ name, username, email, password }) => {
    setLoading(true);
    const cleanEmail = String(email).trim().toLowerCase();
    const cleanUsername = String(username).trim().toLowerCase().replace(/\s+/g, '');

    try {
      // 1. Try Cloudflare Pages Functions API
      let data = null;
      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, username: cleanUsername, email: cleanEmail, password })
        });

        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          data = await res.json();
          if (!res.ok) {
            throw new Error(data.error || 'রেজিস্ট্রেশন ব্যর্থ হয়েছে');
          }
        }
      } catch (apiErr) {
        if (apiErr.message && !apiErr.message.includes('JSON') && !apiErr.message.includes('fetch')) {
          throw apiErr;
        }
      }

      // 2. Local Dev Fallback
      if (!data || !data.user) {
        const localUsers = JSON.parse(localStorage.getItem('js_local_users') || '[]');
        const allCandidateUsers = [...DEFAULT_ACCOUNTS, ...localUsers];

        const exists = allCandidateUsers.find(
          u => u.username.toLowerCase() === cleanUsername || u.email.toLowerCase() === cleanEmail
        );

        if (exists) {
          if (exists.email.toLowerCase() === cleanEmail) {
            throw new Error('এই ইমেইল দিয়ে ইতোমধ্যে একটি অ্যাকাউন্ট রয়েছে');
          }
          if (exists.username.toLowerCase() === cleanUsername) {
            throw new Error('এই ইউজারনেমটি ইতোমধ্যে ব্যবহৃত হয়েছে');
          }
        }

        const newUser = {
          id: Date.now(),
          username: cleanUsername,
          name: name.trim(),
          email: cleanEmail,
          password: password,
          role: 'user',
          status: 'pending',
          created_at: new Date().toISOString()
        };

        localUsers.push(newUser);
        localStorage.setItem('js_local_users', JSON.stringify(localUsers));

        const safeUser = {
          id: newUser.id,
          username: newUser.username,
          name: newUser.name,
          email: newUser.email,
          role: 'user',
          status: 'pending',
          created_at: newUser.created_at
        };

        data = {
          success: true,
          token: 'session_' + Math.random().toString(36).substring(2) + Date.now(),
          user: safeUser
        };
      }

      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('js_auth_token', data.token);
      localStorage.setItem('js_auth_user', JSON.stringify(data.user));
      document.cookie = `auth_token=${data.token}; path=/; max-age=2592000; SameSite=Lax`;

      return { success: true, user: data.user };
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ token })
        }).catch(() => {});
      }
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('js_auth_token');
      localStorage.removeItem('js_auth_user');
      document.cookie = 'auth_token=; path=/; max-age=0';
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
