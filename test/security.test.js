const { test, before, after } = require('node:test');
const assert = require('node:assert');

const { app, requireObjectBody } = require('../index');

// Test-only routes (NOT production endpoints). They exercise the same JSON
// parsing + sanitization the app mounts globally, plus the reusable object
// shape guard, so future POST routes can rely on the same behavior.
app.post('/__test/json', (req, res) => res.json({ ok: true, body: req.body }));
app.post('/__test/object', requireObjectBody, (req, res) => res.json({ ok: true }));

let server;
let base;

before(async () => {
  await new Promise((resolve) => {
    server = app.listen(0, () => {
      base = `http://127.0.0.1:${server.address().port}`;
      resolve();
    });
  });
});

after(async () => {
  await new Promise((resolve) => server.close(resolve));
});

function post(path, body, { raw = false } = {}) {
  return fetch(base + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: raw ? body : JSON.stringify(body)
  });
}

test('GET / behavior is unchanged', async () => {
  const res = await fetch(base + '/');
  assert.strictEqual(res.status, 200);
  const json = await res.json();
  assert.strictEqual(json.project, 'Grant Stream');
  assert.strictEqual(json.status, 'Tracking Grants');
});

test('valid JSON body passes', async () => {
  const res = await post('/__test/json', { name: 'Agricultural Grant Fund' });
  assert.strictEqual(res.status, 200);
  const json = await res.json();
  assert.strictEqual(json.ok, true);
  assert.strictEqual(json.body.name, 'Agricultural Grant Fund');
});

test('payload over 10kb returns 413', async () => {
  const big = { data: 'x'.repeat(11 * 1024) };
  const res = await post('/__test/json', big);
  assert.strictEqual(res.status, 413);
  const json = await res.json();
  assert.strictEqual(json.error, 'Payload too large');
});

test('malformed JSON returns 400', async () => {
  const res = await post('/__test/json', '{ "name": ', { raw: true });
  assert.strictEqual(res.status, 400);
  const json = await res.json();
  assert.strictEqual(json.error, 'Invalid JSON payload');
});

for (const key of ['__proto__', 'constructor', 'prototype']) {
  test(`payload containing ${key} returns 400`, async () => {
    const res = await post('/__test/json', `{ "${key}": { "polluted": true } }`, { raw: true });
    assert.strictEqual(res.status, 400);
    const json = await res.json();
    assert.strictEqual(json.error, 'Forbidden key in JSON payload');
  });

  test(`nested ${key} returns 400`, async () => {
    const res = await post('/__test/json', `{ "outer": { "${key}": { "x": 1 } } }`, { raw: true });
    assert.strictEqual(res.status, 400);
  });
}

test('invalid body shape (array) returns 400', async () => {
  const res = await post('/__test/object', [1, 2, 3]);
  assert.strictEqual(res.status, 400);
  const json = await res.json();
  assert.strictEqual(json.error, 'Invalid request body');
});

test('error responses do not leak internals', async () => {
  const res = await post('/__test/json', '{ bad', { raw: true });
  const text = await res.text();
  assert.ok(!/\/Users\/|node_modules|SyntaxError|at \w+ \(/.test(text), 'response leaked internals');
});
