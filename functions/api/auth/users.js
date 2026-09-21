// functions/api/auth/users.js
import { jsonResponse, corsHeaders, verifyJwt } from './_utils.js';

export async function onRequestOptions() {
  return new Response(null, { headers: corsHeaders });
}

// Helper to authenticate requester
async function getRequester(request, env) {
  const authHeader = request.headers.get('Authorization') || '';
  let token = '';

  if (authHeader.startsWith('Bearer ')) {
    token = authHeader.slice(7).trim();
  } else {
    const cookieHeader = request.headers.get('Cookie') || '';
    const match = cookieHeader.match(/auth_token=([^;]+)/);
    if (match) token = match[1];
  }

  if (!token) return null;

  // 1. First try verifying JWT
  const jwtPayload = env.JWT_SECRET ? await verifyJwt(token, env.JWT_SECRET) : null;
  if (jwtPayload && jwtPayload.userId) {
    const user = await env.DB.prepare(
      `SELECT id, username, name, email, role, status
       FROM users
       WHERE id = ?
       LIMIT 1`
    ).bind(jwtPayload.userId).first();
    if (user) return user;
  }

  // 2. Fallback to sessions table (legacy tokens)
  return await env.DB.prepare(
    `SELECT u.id, u.username, u.name, u.email, u.role, u.status
     FROM sessions s
     JOIN users u ON s.user_id = u.id
     WHERE s.token = ? AND datetime(s.expires_at) > datetime('now')
     LIMIT 1`
  ).bind(token).first();
}

export async function onRequestGet(context) {
  const { request, env } = context;

  if (!env.DB) {
    return jsonResponse({ error: 'Cloudflare D1 binding (DB) is not configured' }, 500);
  }

  const requester = await getRequester(request, env);
  if (!requester || (requester.role !== 'owner' && requester.role !== 'admin')) {
    return jsonResponse({ error: 'ব্যবহারকারী তালিকা দেখার অনুমতি শুধুমাত্র ওনার এবং অ্যাডমিনের রয়েছে' }, 403);
  }

  try {
    const { results } = await env.DB.prepare(
      `SELECT id, username, name, email, role, status, created_at, last_login 
       FROM users 
       ORDER BY id ASC`
    ).all();

    return jsonResponse({
      success: true,
      users: results || []
    });
  } catch (err) {
    return jsonResponse({ error: err.message || 'ইউজার লোড করতে সমস্যা হয়েছে' }, 500);
  }
}

export async function onRequestPost(context) {
  const { request, env } = context;

  if (!env.DB) {
    return jsonResponse({ error: 'Cloudflare D1 binding (DB) is not configured' }, 500);
  }

  const requester = await getRequester(request, env);
  if (!requester || (requester.role !== 'owner' && requester.role !== 'admin')) {
    return jsonResponse({ error: 'অ্যাকশনটি সম্পন্ন করার অনুমতি নেই' }, 403);
  }

  try {
    const body = await request.json();
    const { targetUserId, action, newStatus, newRole } = body;

    if (!targetUserId || !action) {
      return jsonResponse({ error: 'প্রয়োজনীয় প্যারামিটার দেওয়া হয়নি' }, 400);
    }

    // Fetch target user
    const target = await env.DB.prepare(
      `SELECT id, username, name, role, status FROM users WHERE id = ? LIMIT 1`
    ).bind(targetUserId).first();

    if (!target) {
      return jsonResponse({ error: 'ব্যবহারকারী খুঁজে পাওয়া যায়নি' }, 404);
    }

    // Protection: Owner is fixed and cannot be changed or demoted
    if (target.role === 'owner') {
      return jsonResponse({ error: 'ওনার অ্যাকাউন্ট অপরিবর্তনযোগ্য ও ফিক্সড' }, 403);
    }

    // 1. APPROVE / REJECT USER (Allowed for BOTH Owner and Admin)
    if (action === 'update_status') {
      if (!['approved', 'pending', 'rejected'].includes(newStatus)) {
        return jsonResponse({ error: 'অবৈধ স্ট্যাটাস ভ্যালু' }, 400);
      }

      await env.DB.prepare(
        `UPDATE users SET status = ? WHERE id = ?`
      ).bind(newStatus, targetUserId).run();

      return jsonResponse({
        success: true,
        message: `ইউজারের স্ট্যাটাস সফলভাবে '${newStatus}' করা হয়েছে`
      });
    }

    // 2. CREATE / PROMOTE ADMIN (ONLY Owner can create or change admin!)
    if (action === 'update_role') {
      if (requester.role !== 'owner') {
        return jsonResponse({ error: 'শুধুমাত্র মূল ওনার (Owner) নতুন অ্যাডমিন তৈরি বা পদ পরিবর্তন করতে পারবেন' }, 403);
      }

      if (!['admin', 'user'].includes(newRole)) {
        return jsonResponse({ error: 'অবৈধ রোল নির্বাচন করা হয়েছে' }, 400);
      }

      await env.DB.prepare(
        `UPDATE users SET role = ? WHERE id = ?`
      ).bind(newRole, targetUserId).run();

      return jsonResponse({
        success: true,
        message: `ব্যবহারকারীর রোল সফলভাবে '${newRole}' করা হয়েছে`
      });
    }

    return jsonResponse({ error: 'অবৈধ অ্যাকশন' }, 400);

  } catch (err) {
    return jsonResponse({ error: err.message || 'অ্যাকশন সম্পন্ন করতে সমস্যা হয়েছে' }, 500);
  }
}
