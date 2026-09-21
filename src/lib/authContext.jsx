'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getApiUrl } from './apiConfig';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize from localStorage on mount & verify with Cloudflare D1
  useEffect(() => {
    try {
      const savedToken = localStorage.getItem('js_auth_token');
      const savedUser = localStorage.getItem('js_auth_user');

      if (savedToken && savedUser) {
        setToken(savedToken);
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);

        // Verify active session with live Cloudflare Pages API
        fetch(getApiUrl('/api/auth/me'), {
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
            } else if (data && data.error && (data.error.includes('মেয়াদ উত্তীর্ণ') || data.error.includes('লগইন'))) {
              // Session expired on server
              setUser(null);
              setToken(null);
              localStorage.removeItem('js_auth_token');
              localStorage.removeItem('js_auth_user');
            }
          })
          .catch(() => {
            // Keep local session if temporary network glitch
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
      // Direct API call to Cloudflare Pages Functions (live D1 database)
      const res = await fetch(getApiUrl('/api/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: cleanId, password })
      });

      const contentType = res.headers.get('content-type') || '';
      let data = null;
      if (contentType.includes('application/json')) {
        data = await res.json();
      }

      if (!res.ok) {
        throw new Error((data && data.error) || 'লগইন ব্যর্থ হয়েছে। ইউজারনেম ও পাসওয়ার্ড সঠিক দিন।');
      }

      if (!data || !data.token || !data.user) {
        throw new Error('সার্ভার থেকে সঠিক তথ্য পাওয়া যায়নি');
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
      // Direct API call to Cloudflare Pages Functions (live D1 database)
      const res = await fetch(getApiUrl('/api/auth/register'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), username: cleanUsername, email: cleanEmail, password })
      });

      const contentType = res.headers.get('content-type') || '';
      let data = null;
      if (contentType.includes('application/json')) {
        data = await res.json();
      }

      if (!res.ok) {
        throw new Error((data && data.error) || 'রেজিস্ট্রেশন ব্যর্থ হয়েছে');
      }

      if (!data || !data.token || !data.user) {
        throw new Error('সার্ভার থেকে সঠিক তথ্য পাওয়া যায়নি');
      }

      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('js_auth_token', data.token);
      localStorage.setItem('js_auth_user', JSON.stringify(data.user));
      document.cookie = `auth_token=${data.token}; path=/; max-age=2592000; SameSite=Lax`;

      return { success: true, user: data.user, message: data.message };
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await fetch(getApiUrl('/api/auth/logout'), {
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
