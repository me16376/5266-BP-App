// functions/api/auth/logout.js
import { jsonResponse, corsHeaders } from './_utils.js';

export async function onRequestOptions() {
  return new Response(null, { headers: corsHeaders });
}

export async function onRequestPost(context) {
  const { request, env } = context;

  if (!env.DB) {
    return jsonResponse({ error: 'Cloudflare D1 binding (DB) is not configured' }, 500);
  }

  try {
    const authHeader = request.headers.get('Authorization') || '';
    let token = '';

    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.slice(7).trim();
    }

    if (!token) {
      try {
        const body = await request.json();
        token = body.token;
      } catch (e) {
        // body might be empty
      }
    }

    if (token) {
      await env.DB.prepare('DELETE FROM sessions WHERE token = ?').bind(token).run();
    }

    return jsonResponse({
      success: true,
      message: 'লগআউট সফল হয়েছে'
    });

  } catch (err) {
    return jsonResponse({ error: err.message || 'লগআউটে ত্রুটি হয়েছে' }, 500);
  }
}
