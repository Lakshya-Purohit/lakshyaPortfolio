#!/usr/bin/env node
/**
 * Stress test for /api/chat endpoint.
 * Run with: node scripts/stress-test.mjs [baseUrl] [concurrency]
 *
 * Example:
 *   node scripts/stress-test.mjs http://localhost:3000 100
 */

const BASE_URL = process.argv[2] || 'http://localhost:3000';
const CONCURRENCY = parseInt(process.argv[3] || '100', 10);
const ENDPOINT = `${BASE_URL}/api/chat`;

const MESSAGES = [
    'Who is Lakshya?',
    'What are his skills?',
    'Tell me about his projects',
    'What is the Schema Drift Tool?',
    'How does Lakshya use AI?',
    'Where does he work?',
    'What is Video e-KYC?',
    'Describe the OCR Invoice Engine',
    'What technologies does he use?',
    'Contact info?',
];

function randomMessage() {
    return MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
}

async function sendRequest(id) {
    const start = performance.now();
    try {
        const res = await fetch(ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: randomMessage() }),
        });
        const elapsed = performance.now() - start;
        const data = await res.json();
        return {
            id,
            status: res.status,
            elapsed: Math.round(elapsed),
            ok: res.ok,
            rateLimited: res.status === 429,
            reply: data.reply?.slice(0, 60) || data.error || 'no reply',
        };
    } catch (err) {
        const elapsed = performance.now() - start;
        return {
            id,
            status: 0,
            elapsed: Math.round(elapsed),
            ok: false,
            rateLimited: false,
            reply: `ERROR: ${err.message}`,
        };
    }
}

function percentile(arr, p) {
    const sorted = [...arr].sort((a, b) => a - b);
    const idx = Math.ceil((p / 100) * sorted.length) - 1;
    return sorted[Math.max(0, idx)];
}

async function runStressTest() {
    console.log('═══════════════════════════════════════════════');
    console.log(`  STRESS TEST: ${ENDPOINT}`);
    console.log(`  Concurrency: ${CONCURRENCY} simultaneous requests`);
    console.log('═══════════════════════════════════════════════\n');

    const startTime = performance.now();

    // Fire all requests concurrently
    const promises = Array.from({ length: CONCURRENCY }, (_, i) => sendRequest(i));
    const results = await Promise.all(promises);

    const totalTime = Math.round(performance.now() - startTime);

    // Analyze
    const successful = results.filter((r) => r.ok && !r.rateLimited);
    const rateLimited = results.filter((r) => r.rateLimited);
    const failed = results.filter((r) => !r.ok && !r.rateLimited);
    const times = results.map((r) => r.elapsed);

    console.log('── RESULTS ──────────────────────────────────\n');
    console.log(`  Total requests:     ${results.length}`);
    console.log(`  Successful (2xx):   ${successful.length}`);
    console.log(`  Rate limited (429): ${rateLimited.length}`);
    console.log(`  Failed:             ${failed.length}`);
    console.log(`  Total wall time:    ${totalTime}ms`);
    console.log();
    console.log('── LATENCIES ────────────────────────────────\n');
    console.log(`  Min:  ${Math.min(...times)}ms`);
    console.log(`  p50:  ${percentile(times, 50)}ms`);
    console.log(`  p95:  ${percentile(times, 95)}ms`);
    console.log(`  p99:  ${percentile(times, 99)}ms`);
    console.log(`  Max:  ${Math.max(...times)}ms`);
    console.log();

    if (failed.length > 0) {
        console.log('── FAILURES ─────────────────────────────────\n');
        failed.slice(0, 5).forEach((f) => {
            console.log(`  Request #${f.id}: status=${f.status} (${f.elapsed}ms) — ${f.reply}`);
        });
        if (failed.length > 5) {
            console.log(`  ... and ${failed.length - 5} more`);
        }
        console.log();
    }

    // Summary
    console.log('── ASSESSMENT ───────────────────────────────\n');

    const rateOk = rateLimited.length > 0;
    const noFails = failed.length === 0;
    const fastEnough = percentile(times, 95) < 2000;

    console.log(`  Rate limiter working:  ${rateOk ? '✅ YES' : '⚠️  NO (no requests were rate-limited)'}`);
    console.log(`  Zero failures:         ${noFails ? '✅ YES' : '❌ NO'}`);
    console.log(`  p95 < 2s:              ${fastEnough ? '✅ YES' : '❌ NO'} (${percentile(times, 95)}ms)`);
    console.log();

    if (rateOk && noFails && fastEnough) {
        console.log('  🎉 ALL CHECKS PASSED\n');
    } else {
        console.log('  ⚠️  SOME CHECKS FAILED — review above\n');
    }
}

runStressTest().catch(console.error);
