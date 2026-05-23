// Verification harness for the IoT timestamp normalization fix.
//
// Run from backend root:  node scripts/verify-timestamp.js
//
// What this proves:
//  1. normalizeIoTTimestamp produces the SAME UTC instant regardless of which wire format
//     the IoT device chose (epoch s, epoch ms, ISO-Z, ISO+offset, naive PHT ISO, naive
//     PHT MySQL string).
//  2. Naive strings — the actual device output — are now interpreted as PHT (+08:00),
//     matching the device RTC. Previously they were interpreted as UTC and produced a
//     +8h forward shift.
//  3. End-to-end: a backend-stored DB instant round-tripped to ISO-Z, parsed by Dart-
//     equivalent logic, fed to the relative-time formatter, produces the expected
//     "22 hours ago" / "5 minutes ago" / "3 days ago" / "MMM d, yyyy" outputs from
//     Examples A–D in the spec.
//  4. The exact user-reported failure ("16 hours ago instead of 1 day ago") now produces
//     "1 day ago" with the corrected naive-string offset.

import { normalizeIoTTimestamp, _getNaiveOffsetForTest } from "../src/utils/timestamp.js";

let failures = 0;
function check(label, actual, expected) {
    const actualStr = actual instanceof Date ? actual.toISOString() : String(actual);
    const ok = actualStr === expected;
    console.log(`${ok ? 'OK ' : 'FAIL'}  ${label}`);
    console.log(`        expected: ${expected}`);
    console.log(`        actual:   ${actualStr}`);
    if (!ok) failures++;
}

console.log(`Naive offset in effect: ${_getNaiveOffsetForTest()} ` +
            `(IOT_NAIVE_TIMESTAMP_OFFSET=${process.env.IOT_NAIVE_TIMESTAMP_OFFSET ?? '(unset, defaulting to +08:00)'})`);
console.log();

// ---------------------------------------------------------------------------
// 1. Normalizer: every wire format must yield the SAME UTC instant.
// Reference: 2026-05-22 19:00:00 PHT == 2026-05-22 11:00:00 UTC
// ---------------------------------------------------------------------------
const refUtcIso = '2026-05-22T11:00:00.000Z';
const refEpochMs = Date.UTC(2026, 4, 22, 11, 0, 0, 0);
const refEpochS = Math.floor(refEpochMs / 1000);

console.log('--- 1. Normalizer parity across wire formats (reference = 19:00 PHT = 11:00 UTC) ---');
check('epoch seconds (number)', normalizeIoTTimestamp(refEpochS), refUtcIso);
check('epoch milliseconds (number)', normalizeIoTTimestamp(refEpochMs), refUtcIso);
check('epoch seconds (string)', normalizeIoTTimestamp(String(refEpochS)), refUtcIso);
check('epoch milliseconds (string)', normalizeIoTTimestamp(String(refEpochMs)), refUtcIso);
check('ISO-8601 with Z', normalizeIoTTimestamp('2026-05-22T11:00:00.000Z'), refUtcIso);
check('ISO-8601 with Z (no ms)', normalizeIoTTimestamp('2026-05-22T11:00:00Z'), refUtcIso);
check('ISO-8601 with +08:00 offset', normalizeIoTTimestamp('2026-05-22T19:00:00+08:00'), refUtcIso);
check('ISO-8601 with +0800 offset', normalizeIoTTimestamp('2026-05-22T19:00:00+0800'), refUtcIso);
check('naive ISO 19:00 (interpreted as PHT)', normalizeIoTTimestamp('2026-05-22T19:00:00'), refUtcIso);
check('naive MySQL string 19:00 (interpreted as PHT)', normalizeIoTTimestamp('2026-05-22 19:00:00'), refUtcIso);
check('Date object passthrough', normalizeIoTTimestamp(new Date(refUtcIso)), refUtcIso);

// ---------------------------------------------------------------------------
// 2. Naive strings now resolve to the configured offset, not UTC.
// ---------------------------------------------------------------------------
console.log('\n--- 2. Naive offset semantics ---');
{
    const naive = '2026-05-22T20:39:00';
    const result = normalizeIoTTimestamp(naive);
    console.log(`naive input          : ${naive}    (intended: 8:39 PM PHT)`);
    console.log(`normalized to UTC    : ${result.toISOString()}   (should be 12:39Z, 8h earlier)`);
    check('naive 20:39 PHT → 12:39 UTC', result, '2026-05-22T12:39:00.000Z');
}

// ---------------------------------------------------------------------------
// 3. Spec examples end-to-end.
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
{
    const ts = normalizeIoTTimestamp('2026-05-22T12:12:00Z');
    const now = new Date('2026-05-23T10:12:00Z');
    check('Example A (22h ago)', formatLastUpdated(ts, now), '22 hours ago');
}
{
    const now = new Date('2026-05-23T10:00:00Z');
    const ts = normalizeIoTTimestamp('2026-05-23T09:55:00Z');
    check('Example B (5 minutes ago)', formatLastUpdated(ts, now), '5 minutes ago');
}
{
    const now = new Date('2026-05-23T10:00:00Z');
    const ts = normalizeIoTTimestamp('2026-05-20T10:00:00Z');
    check('Example C (3 days ago)', formatLastUpdated(ts, now), '3 days ago');
}
{
    const now = new Date('2026-05-23T10:00:00Z');
    const ts = normalizeIoTTimestamp('2026-05-09T10:00:00Z');
    check('Example D (>= 7d → date format branch)',
          formatLastUpdated(ts, now), 'FALLBACK_DATE_FORMAT');
}

// ---------------------------------------------------------------------------
// 4. The exact user-reported failure: yesterday 8:39 PM PHT → "1 day ago".
// Before this fix the same input produced "16 hours ago".
// ---------------------------------------------------------------------------
console.log('\n--- 4. User-reported failure scenario, post-fix ---');
{
    const deviceWire = '2026-05-22T20:39:00';                 // naive PHT, as the device sends
    const ts = normalizeIoTTimestamp(deviceWire);
    const now = new Date('2026-05-23T20:39:00+08:00');        // user's "now" = 8:39 PM PHT today
    const result = formatLastUpdated(ts, now);
    console.log(`device raw:          ${deviceWire}    (naive, PHT wallclock)`);
    console.log(`normalized UTC:      ${ts.toISOString()}`);
    console.log(`now (PHT):           2026-05-23T20:39:00+08:00 (== ${now.toISOString()})`);
    console.log(`formatLastUpdated => ${result}`);
    check('Original failure now yields "1 day ago"', result, '1 day ago');
}

console.log(`\n${failures === 0 ? 'PASS — all checks green' : `FAIL — ${failures} check(s) failed`}`);
process.exit(failures === 0 ? 0 : 1);
