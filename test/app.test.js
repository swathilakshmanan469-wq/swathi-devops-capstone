
const { test, before, after } = require('node:test');
const assert = require('node:assert');
const { spawn } = require('node:child_process');

let server;

before(async () => {
    server = spawn('node', ['server.js'], {
        env: { ...process.env, PORT: '3100' },
        stdio: 'ignore'
    });

    let ready = false;

    for (let i = 0; i < 30; i++) {
        try {
            const response = await fetch('http://127.0.0.1:3100/health');
            if (response.ok) {
                ready = true;
                break;
            }
        } catch (error) {
            await new Promise(resolve => setTimeout(resolve, 500));
        }
    }

    assert.ok(ready, 'Server failed to start');
});

after(() => {
    if (server) server.kill();
});

test('Health endpoint should return UP', async () => {
    const response = await fetch('http://127.0.0.1:3100/health');
    const data = await response.json();

    assert.strictEqual(response.status, 200);
    assert.strictEqual(data.status, 'UP');
});

test('Home page should load successfully', async () => {
    const response = await fetch('http://127.0.0.1:3100/');

    assert.strictEqual(response.status, 200);
});
