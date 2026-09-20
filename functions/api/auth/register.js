// functions/api/auth/register.js
import { jsonResponse, corsHeaders, generateSalt, hashPassword } from './_utils.js';

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
    const { name, username, email, password, avatar } = body;

    if (!name || !username || !email || !password) {
      return jsonResponse({ error: 'সকল প্রয়োজনীয় তথ্য (নাম, ইউজারনেম, ইমেইল, পাসওয়ার্ড) প্রদান করুন' }, 400);
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const cleanUsername = String(username).trim().toLowerCase().replace(/\s+/g, '');

    if (password.length < 6) {
      return jsonResponse({ error: 'পাসওয়ার্ড ন্যূনতম ৬ অক্ষরের হতে হবে' }, 400);
    }

    // Check existing user
    const existing = await env.DB.prepare(
      'SELECT id, username, email FROM users WHERE email = ? OR username = ? LIMIT 1'
    ).bind(cleanEmail, cleanUsername).first();

    if (existing) {
      if (existing.email === cleanEmail) {
        return jsonResponse({ error: 'এই ইমেইল দিয়ে ইতোমধ্যে একটি অ্যাকাউন্ট রয়েছে' }, 409);
      }
      if (existing.username === cleanUsername) {
        return jsonResponse({ error: 'এই ইউজারনেমটি ইতোমধ্যে ব্যবহৃত হয়েছে, অন্যটি চেষ্টা করুন' }, 409);
      }
    }

    // Hash password
    const salt = generateSalt(16);
    const passwordHash = await hashPassword(password, salt);

    // Insert user with status 'pending'
    const insertUser = await env.DB.prepare(
      `INSERT INTO users (username, name, email, password_hash, role, status, avatar, last_login)
       VALUES (?, ?, ?, ?, 'user', 'pending', ?, CURRENT_TIMESTAMP)`
    ).bind(
      cleanUsername,
      name.trim(),
      cleanEmail,
      passwordHash,
      avatar || null
    ).run();

    const userId = insertUser.meta?.last_row_id;
    if (!userId) {
      return jsonResponse({ error: 'ব্যবহারকারী সংরক্ষণ করতে সমস্যা হয়েছে' }, 500);
    }

    // Generate Session Token (UUID)
    const token = crypto.randomUUID();
    await env.DB.prepare(
      `INSERT INTO sessions (token, user_id, expires_at)
       VALUES (?, ?, datetime('now', '+30 days'))`
    ).bind(token, userId).run();

    const user = {
      id: userId,
      username: cleanUsername,
      name: name.trim(),
      email: cleanEmail,
      role: 'user',
      status: 'pending',
      avatar: avatar || null,
      created_at: new Date().toISOString()
    };

    return jsonResponse({
      success: true,
      message: 'রেজিস্ট্রেশন সফল হয়েছে! ওনার বা অ্যাডমিন অনুমোদনের পর সম্পূর্ণ সুবিধা পাবেন।',
      token,
      user
    }, 201);

  } catch (err) {
    return jsonResponse({ error: err.message || 'সার্ভার প্রক্রিয়াকরণে সমস্যা হয়েছে' }, 500);
  }
}
