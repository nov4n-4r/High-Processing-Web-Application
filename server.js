// Dummy High-CPU Test Service
// Run at your own lab/test env only.

const express = require("express");
const crypto = require("crypto");

const app = express();
const PORT = process.env.PORT || 3000;

// 1) PBKDF2 (CPU-bound, blocks event loop)
app.get("/pbkdf2", (req, res) => {
  const iterations = Math.max(1, parseInt(req.query.iter || "300000", 10)); // default 300k
  const parallel = Math.min(16, Math.max(1, parseInt(req.query.par || "1", 10)));
  const keylen = Math.min(64, Math.max(32, parseInt(req.query.keylen || "32", 10)));
  const digest = req.query.digest || "sha512";

  const start = Date.now();
  const password = "dummy-password";
  const salt = crypto.randomBytes(16);

  // Run synchronously N times to burn CPU
  for (let i = 0; i < parallel; i++) {
    crypto.pbkdf2Sync(password, salt, iterations, keylen, digest);
  }

  const ms = Date.now() - start;
  res.json({ op: "pbkdf2", iterations, parallel, keylen, digest, ms });
});

// 2) Prime search (naive), heavy for larger limits
function isPrime(n) {
  if (n < 2) return false;
  if (n % 2 === 0) return n === 2;
  const r = Math.floor(Math.sqrt(n));
  for (let i = 3; i <= r; i += 2) {
    if (n % i === 0) return false;
  }
  return true;
}

app.get("/primes", (req, res) => {
  const limit = Math.min(50_000_000, Math.max(10_000, parseInt(req.query.limit || "300000", 10)));
  const start = Date.now();
  let count = 0;
  for (let i = 2; i <= limit; i++) if (isPrime(i)) count++;
  const ms = Date.now() - start;
  res.json({ op: "primes", limit, count, ms });
});

// 3) Matrix multiply (O(n^3) time), very hot for n >= 600
function createMatrix(n) {
  const m = new Array(n);
  for (let i = 0; i < n; i++) {
    m[i] = new Float64Array(n);
    for (let j = 0; j < n; j++) m[i][j] = (i + j) % 13;
  }
  return m;
}
function multiply(A, B) {
  const n = A.length;
  const C = Array.from({ length: n }, () => new Float64Array(n));
  for (let i = 0; i < n; i++) {
    for (let k = 0; k < n; k++) {
      const aik = A[i][k];
      for (let j = 0; j < n; j++) {
        C[i][j] += aik * B[k][j];
      }
    }
  }
  return C;
}
app.get("/matmul", (req, res) => {
  const n = Math.min(1200, Math.max(50, parseInt(req.query.n || "400", 10)));
  const start = Date.now();
  const A = createMatrix(n);
  const B = createMatrix(n);
  multiply(A, B); // result discarded; this is just for heat
  const ms = Date.now() - start;
  res.json({ op: "matmul", n, ms });
});

// Basic health
app.get("/", (_req, res) => res.send("High-CPU Dummy App. Try /pbkdf2, /primes, /matmul"));

app.listen(PORT, () => {
  console.log(`Dummy app listening on http://0.0.0.0:${PORT}`);
});
