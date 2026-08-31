import test from "node:test";
import assert from "node:assert/strict";
import { spawn } from "child_process";

const serverProcess = spawn(process.execPath, ["server/index.js"], {
  cwd: process.cwd(),
  stdio: ["ignore", "pipe", "pipe"],
  env: { ...process.env, PORT: "8090" },
});

await new Promise((resolve) => {
  serverProcess.stdout.on("data", () => {
    resolve();
  });
  serverProcess.stderr.on("data", () => {
    resolve();
  });
  setTimeout(resolve, 1000);
});

test("health route returns ok", async () => {
  const response = await fetch("http://localhost:8090/api/health");
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.status, "ok");
});

test("signup creates a new user", async () => {
  const response = await fetch("http://localhost:8090/api/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fullName: "Test User",
      email: "testuser@example.com",
      password: "secret123",
    }),
  });

  const body = await response.json();
  assert.equal(response.status, 201);
  assert.equal(body.user.email, "testuser@example.com");
});

test("login authenticates a registered user", async () => {
  const response = await fetch("http://localhost:8090/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "testuser@example.com",
      password: "secret123",
    }),
  });

  const body = await response.json();
  assert.equal(response.status, 200);
  assert.ok(body.token);
  assert.equal(body.user.email, "testuser@example.com");
});

serverProcess.kill("SIGTERM");
