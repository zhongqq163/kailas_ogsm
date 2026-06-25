const STATE_KEY = "agsm-dashboard-state";

const jsonHeaders = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store"
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: jsonHeaders
  });
}

function validateState(state) {
  return Boolean(
    state &&
      typeof state === "object" &&
      typeof state.object === "string" &&
      Array.isArray(state.goals)
  );
}

export async function onRequestGet({ env }) {
  if (!env.DB) {
    return json({ error: "D1 binding DB is not configured" }, 500);
  }

  const row = await env.DB.prepare("SELECT value, updated_at FROM app_state WHERE key = ?")
    .bind(STATE_KEY)
    .first();

  if (!row) {
    return json({ state: null, updatedAt: null });
  }

  try {
    return json({
      state: JSON.parse(row.value),
      updatedAt: row.updated_at
    });
  } catch (error) {
    return json({ error: "Saved state JSON is invalid" }, 500);
  }
}

export async function onRequestPost({ request, env }) {
  if (!env.DB) {
    return json({ error: "D1 binding DB is not configured" }, 500);
  }

  let body;
  try {
    body = await request.json();
  } catch (error) {
    return json({ error: "Request body must be JSON" }, 400);
  }

  const state = body.state || body;
  if (!validateState(state)) {
    return json({ error: "Invalid AGSM state payload" }, 400);
  }

  const value = JSON.stringify(state);
  await env.DB.prepare(
    `INSERT INTO app_state (key, value, updated_at)
     VALUES (?, ?, datetime('now'))
     ON CONFLICT(key) DO UPDATE SET
       value = excluded.value,
       updated_at = datetime('now')`
  )
    .bind(STATE_KEY, value)
    .run();

  return json({ ok: true });
}
