// functions/api/auth/me.js
import { jsonResponse, corsHeaders } from './_utils.js';

export async function onRequestOptions() {
  return new Response(null, { headers: corsHeaders });
}

export async function onRequest(context) {
  const { request, env } = context;

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (!env.DB) {
    return jsonResponse({ error: 'Cloudflare D1 binding (DB) is not configured' }, 500);
  }

  try {
    const authHeader = request.headers.get('Authorization') || '';
    let token = '';

    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.slice(7).trim();
    } else {
      // Check cookies
      const cookieHeader = request.headers.get('Cookie') || '';
      const match = cookieHeader.match(/auth_token=([^;]+)/);
      if (match) {
        token = match[1];
      }
    }

    if (!token) {
      return jsonResponse({ error: 'টোকেন পাওয়া যায়নি, লগইন করুন' }, 401);
    }

    // Verify token and join with user
    const row = await env.DB.prepare(
      `SELECT s.token, s.expires_at, 
              u.id, u.username, u.name, u.email, u.role, u.status, u.avatar, u.created_at, u.last_login
       FROM sessions s
       JOIN users u ON s.user_id = u.id
       WHERE s.token = ? AND datetime(s.expires_at) > datetime('now')
       LIMIT 1`
    ).bind(token).first();

    if (!row) {
      return jsonResponse({ error: 'সেশন মেয়াদোত্তীর্ণ বা অবৈধ, পুনরায় লগইন করুন' }, 401);
    }

    const user = {
      id: row.id,
      username: row.username,
      name: row.name,
      email: row.email,
      role: row.role || 'user',
      status: row.status || 'approved',
      avatar: row.avatar || null,
      created_at: row.created_at,
      last_login: row.last_login
    };

    return jsonResponse({
      success: true,
      user
    });

  } catch (err) {
    return jsonResponse({ error: err.message || 'ইউজার যাচাইকরণে সমস্যা হয়েছে' }, 500);
  }
}
