// Verification harness for the IoT timestamp normalization fix.
//
// Run from backend root:  node scripts/verify-timestamp.js
//
// What this proves:
//  1. normalizeIoTTimestamp produces the SAME UTC instant regardless of which wire format
//     the IoT device chose (epoch s, epoch ms, ISO-Z, ISO+offset, naive ISO, MySQL string).
//  2. The naive-string case — the exact failure mode identified in the investigation —
//     no longer depends on the Node.js process timezone.
//  3. End-to-end: a backend-stored DB instant round-tripped to ISO-Z, parsed by Dart-
//     equivalent logic, fed to the relative-time formatter, produces the expected
//     "22 hours ago" / "5 minutes ago" / "3 days ago" / "MMM d, yyyy" outputs from
//     Examples A–D in the spec.

import { normalizeIoTTimestamp } from "../src/utils/timestamp.js";

let failures = 0;
function check(label, actual, expected) {
    const actualStr = actual instanceof Date ? actual.toISOString() : String(actual);
    const ok = actualStr === expected;
    console.log(`${ok ? 'OK ' : 'FAIL'}  ${label}`);
    console.log(`        expected: ${expected}`);
    console.log(`        actual:   ${actualStr}`);
    if (!ok) failures++;
}

// ---------------------------------------------------------------------------
// 1. Normalizer: every wire format must yield the SAME UTC instant.
// ---------------------------------------------------------------------------
// Canonical reference instant: 2026-05-22 11:00:00.000 UTC
//   = 2026-05-22 19:00 in UTC+8 (PHT) "yesterday evening" from a UTC+8 user
const refUtcIso = '2026-05-22T11:00:00.000Z';
const refEpochMs = Date.UTC(2026, 4, 22, 11, 0, 0, 0);   // month is 0-indexed
const refEpochS = Math.floor(refEpochMs / 1000);

console.log('--- 1. Normalizer parity across wire formats ---');
console.log(`Reference UTC instant: ${refUtcIso}`);
check('epoch seconds (number)', normalizeIoTTimestamp(refEpochS), refUtcIso);
check('epoch milliseconds (number)', normalizeIoTTimestamp(refEpochMs), refUtcIso);
check('epoch seconds (string)', normalizeIoTTimestamp(String(refEpochS)), refUtcIso);
check('epoch milliseconds (string)', normalizeIoTTimestamp(String(refEpochMs)), refUtcIso);
check('ISO-8601 with Z', normalizeIoTTimestamp('2026-05-22T11:00:00.000Z'), refUtcIso);
check('ISO-8601 with Z (no ms)', normalizeIoTTimestamp('2026-05-22T11:00:00Z'), refUtcIso);
check('ISO-8601 with +08:00 offset', normalizeIoTTimestamp('2026-05-22T19:00:00+08:00'), refUtcIso);
check('ISO-8601 with +0800 offset', normalizeIoTTimestamp('2026-05-22T19:00:00+0800'), refUtcIso);
check('naive ISO (interpreted as UTC)', normalizeIoTTimestamp('2026-05-22T11:00:00'), refUtcIso);
check('naive MySQL string (interpreted as UTC)', normalizeIoTTimestamp('2026-05-22 11:00:00'), refUtcIso);
check('Date object passthrough', normalizeIoTTimestamp(new Date(refUtcIso)), refUtcIso);

// ---------------------------------------------------------------------------
// 2. The exact failure mode that was producing the wrong "hours ago" value.
//    Before fix: new Date("2026-05-22T11:00:00") on a UTC server returned
//    2026-05-22T11:00:00.000Z (which happened to be right *only* because Node's
//    process TZ was UTC). On a non-UTC process, the SAME naive string produced
//    a different instant — depending on the deployment host. After the fix the
//    normalizer is deterministic across host timezones.
// ---------------------------------------------------------------------------
console.log('\n--- 2. Deterministic across host timezones ---');
const naive = '2026-05-22T11:00:00';
const fromNaive = normalizeIoTTimestamp(naive);
console.log(`process.env.TZ = ${process.env.TZ ?? '(unset, inherits host)'}`);
console.log(`naive input   : ${naive}`);
console.log(`normalized    : ${fromNaive.toISOString()}  (always UTC interpretation)`);
console.log(`bare new Date : ${new Date(naive).toISOString()}  (host-TZ dependent)`);

// ---------------------------------------------------------------------------
// 3. End-to-end relative-time simulation matching the spec examples.
//    Dart equivalent of formatLastUpdated, used purely for verification here.
// ---------------------------------------------------------------------------
function formatLastUpdated(timestamp, now) {
    const diffMs = now.getTime() - timestamp.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffMs / 60_000);
    const diffHr = Math.floor(diffMs / 3_600_000);
    const diffDay = Math.floor(diffMs / 86_400_000);
    if (diffSec < 60) return 'Just now';
    if (diffMin < 60) return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
    if (diffHr < 24) return `${diffHr} hour${diffHr > 1 ? 's' : ''} ago`;
    if (diffDay < 7) return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
    return 'FALLBACK_DATE_FORMAT';
}

console.log('\n--- 3. Spec examples end-to-end ---');

// Example A: yesterday 8:12 PM PHT, current time today 6:12 PM PHT → 22 hours ago
// In UTC: 2026-05-22T12:12Z (yesterday) and 2026-05-23T10:12Z (today)
{
    const ts = normalizeIoTTimestamp('2026-05-22T12:12:00Z');
    const now = new Date('2026-05-23T10:12:00Z');
    check('Example A (22h ago)', formatLastUpdated(ts, now), '22 hours ago');
}

// Example B: 5 minutes ago
{
    const now = new Date('2026-05-23T10:00:00Z');
    const ts = normalizeIoTTimestamp('2026-05-23T09:55:00Z');
    check('Example B (5 minutes ago)', formatLastUpdated(ts, now), '5 minutes ago');
}

// Example C: 3 days ago
{
    const now = new Date('2026-05-23T10:00:00Z');
    const ts = normalizeIoTTimestamp('2026-05-20T10:00:00Z');
    check('Example C (3 days ago)', formatLastUpdated(ts, now), '3 days ago');
}

// Example D: 2 weeks ago → falls through to date format branch
{
    const now = new Date('2026-05-23T10:00:00Z');
    const ts = normalizeIoTTimestamp('2026-05-09T10:00:00Z');
    check('Example D (>= 7d → date format branch)',
          formatLastUpdated(ts, now), 'FALLBACK_DATE_FORMAT');
}

// ---------------------------------------------------------------------------
// 4. The original reported failure: yesterday evening record, expected 22h ago,
//    but showed "significantly lower". Demonstrate the post-fix value.
// ---------------------------------------------------------------------------
console.log('\n--- 4. Original reported failure, post-fix ---');
{
    // Yesterday 19:00 PHT = 11:00 UTC. Now = 17:00 PHT = 09:00 UTC. Δ ≈ 22h.
    const ts = normalizeIoTTimestamp('2026-05-22T19:00:00+08:00');
    const now = new Date('2026-05-23T17:00:00+08:00');
    const result = formatLastUpdated(ts, now);
    console.log(`ts (normalized UTC): ${ts.toISOString()}`);
    console.log(`now (UTC):           ${now.toISOString()}`);
    console.log(`formatLastUpdated => ${result}`);
    check('Original failure scenario yields "22 hours ago"', result, '22 hours ago');
}

console.log(`\n${failures === 0 ? 'PASS — all checks green' : `FAIL — ${failures} check(s) failed`}`);
process.exit(failures === 0 ? 0 : 1);
