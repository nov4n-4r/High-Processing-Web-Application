# High-Processing-Web-Application

This is a **deliberately CPU-intensive dummy web application** built with Node.js + Express.  
It is intended for **load testing, stress testing, and denial-of-service simulation** **in a safe, controlled environment** you own or have permission to test.

⚠ **Warning:**  
Do **not** deploy this application to any public-facing server without strict access controls.  
Running heavy load tests against systems you do not own or manage is illegal in most countries.

---

## Features

The app exposes several endpoints that perform CPU-bound work:

| Endpoint   | Description                                                      | Query Params                                                   |
|------------|------------------------------------------------------------------|----------------------------------------------------------------|
| `/pbkdf2`  | Runs PBKDF2 password hashing multiple times.                     | `iter` (iterations), `par` (parallel loops), `keylen`, `digest`|
| `/primes`  | Counts prime numbers up to a given limit using naive algorithm.  | `limit` (max number to test)                                   |
| `/matmul`  | Multiplies two NxN matrices (O(n³) time complexity).             | `n` (matrix size)                                              |
| `/`        | Basic health check message.                                      | —                                                              |

---

## Example Usage

### Local Run
```bash
npm install
node server.js
```

Test endpoints:
```bash
curl "http://localhost:3000/pbkdf2?iter=400000&par=4"
curl "http://localhost:3000/primes?limit=800000"
curl "http://localhost:3000/matmul?n=600"
```

---

## Docker Usage

Build the image:
```bash
docker build -t dummy-high-cpu-app .
```

Run with resource limits:
```bash
docker run --rm -p 3000:3000 --cpus=1 --memory=512m dummy-high-cpu-app
```

---

## Stress Testing

Use tools like **Apache JMeter**, **k6**, or **Locust** to send requests at high rates.

Example with ApacheBench:
```bash
ab -n 1000 -c 50 "http://localhost:3000/pbkdf2?iter=400000&par=4"
```

---

## Safety Guidelines

- Always run in **isolated lab environments** (VM, container, private network).
- Use **CPU and memory limits** to avoid crashing your host machine.
- Never expose the app to the internet during load testing.
- Ensure you have **explicit written permission** before running heavy tests on any target.

---

## License

This project is provided **"as is"** without warranty of any kind.  
Use at your own risk and only for authorized testing purposes.
