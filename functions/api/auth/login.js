// functions/api/auth/login.js
import { jsonResponse, corsHeaders, verifyPassword } from './_utils.js';

export async function onRequestOptions() {
  return new Response(null, { headers: corsHeaders });
}

export async function onRequestPost(context) {
  const { request, env } = context;

  if (!env.DB) {
    return jsonResponse({ error: 'Cloudflare D1 binding (DB) is not configured' }, 500);
  }

  try {
    const body = await request.json();
    const { identifier, password } = body;

    if (!identifier || !password) {
      return jsonResponse({ error: 'ইউজারনেম/ইমেইল এবং পাসওয়ার্ড প্রদান করুন' }, 400);
    }

    const cleanIdentifier = String(identifier).trim().toLowerCase();

    // Query user by email or username
    const userRow = await env.DB.prepare(
      `SELECT id, username, name, email, password_hash, role, status, avatar, created_at, last_login 
       FROM users 
       WHERE email = ? OR username = ? 
       LIMIT 1`
    ).bind(cleanIdentifier, cleanIdentifier).first();

    if (!userRow) {
      return jsonResponse({ error: 'ভুল ইমেইল/ইউজারনেম অথবা পাসওয়ার্ড' }, 401);
    }

    // Verify Password
    const isValid = await verifyPassword(password, userRow.password_hash);
    if (!isValid) {
      return jsonResponse({ error: 'ভুল ইমেইল/ইউজারনেম অথবা পাসওয়ার্ড' }, 401);
    }

    // Generate Session Token
    const token = crypto.randomUUID();
    await env.DB.prepare(
      `INSERT INTO sessions (token, user_id, expires_at)
       VALUES (?, ?, datetime('now', '+30 days'))`
    ).bind(token, userRow.id).run();

    // Update last_login
    await env.DB.prepare(
      `UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?`
    ).bind(userRow.id).run();

    const user = {
      id: userRow.id,
      username: userRow.username,
      name: userRow.name,
      email: userRow.email,
      role: userRow.role || 'user',
      status: userRow.status || 'approved',
      avatar: userRow.avatar || null,
      created_at: userRow.created_at,
      last_login: new Date().toISOString()
    };

    return jsonResponse({
      success: true,
      message: 'লগইন সফল হয়েছে',
      token,
      user
    });

  } catch (err) {
    return jsonResponse({ error: err.message || 'লগইন প্রক্রিয়ায় সার্ভার ত্রুটি হয়েছে' }, 500);
  }
}
