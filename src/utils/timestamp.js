// Normalize an IoT-supplied timestamp to a JS Date representing an unambiguous UTC instant.
//
// WHY THIS EXISTS:
// The IoT device's `req.body.timestamp` used to flow straight into Sequelize's DATE column.
// Sequelize's DATE._sanitize wraps non-Date inputs in `new Date(value)`, and V8 interprets
// timezone-naive ISO/MySQL strings against the Node.js process TZ. That meant the same
// payload produced different stored instants depending on the deploy host's clock setting —
// the "Last Updated" displayed an instant 8h off on the EC2 host. Centralizing normalization
// here makes the controller — not the ORM, not the host TZ — the single arbiter of the
// instant. Both the DB write path and the WebSocket broadcast path now read the same Date
// object, so REST and WS can no longer disagree about what "now" the device meant.
//
// THE NAIVE-STRING ASSUMPTION (this is the load-bearing line):
// IoT firmware formats wallclock with `localtime()` against the device's RTC, which is set
// to Asia/Manila (UTC+08:00). Those naive strings represent PHT, NOT UTC. The default
// `IOT_NAIVE_TIMESTAMP_OFFSET` is therefore '+08:00'. If you deploy this backend in a
// region where the device is in a different timezone, override via env var. The IoT team
// should eventually update firmware to emit ISO-with-offset or epoch milliseconds — at
// which point this fallback becomes dead code.
//
// WIRE CONTRACT (any of these must produce the same UTC instant):
//   - epoch number or numeric string (seconds OR milliseconds), OR
//   - ISO-8601 with an explicit timezone designator (Z or +HH:MM / -HH:MM), OR
//   - timezone-naive ISO ("YYYY-MM-DDTHH:mm:ss") or MySQL ("YYYY-MM-DD HH:mm:ss") — these
//     are interpreted as IOT_NAIVE_TIMESTAMP_OFFSET (default +08:00).
const DEFAULT_NAIVE_OFFSET = '+08:00';
const naiveOffset = resolveNaiveOffset(process.env.IOT_NAIVE_TIMESTAMP_OFFSET);

function resolveNaiveOffset(raw) {
    if (!raw) return DEFAULT_NAIVE_OFFSET;
    const trimmed = String(raw).trim();
    // Accept Z, +HH, +HHMM, +HH:MM (and minus variants).
    if (trimmed === 'Z') return '+00:00';
    const m = /^([+-])(\d{2}):?(\d{2})?$/.exec(trimmed);
    if (!m) {
        console.warn(
            `[timestamp] Ignoring invalid IOT_NAIVE_TIMESTAMP_OFFSET=${JSON.stringify(raw)}; ` +
            `falling back to ${DEFAULT_NAIVE_OFFSET}.`
        );
        return DEFAULT_NAIVE_OFFSET;
    }
    return `${m[1]}${m[2]}:${m[3] ?? '00'}`;
}

export function normalizeIoTTimestamp(value) {
    if (value === null || value === undefined || value === '') {
        throw new Error('Missing timestamp');
    }
    if (value instanceof Date) {
        if (Number.isNaN(value.getTime())) throw new Error(`Invalid Date object: ${value}`);
        return value;
    }
    if (typeof value === 'number') {
        return epochToDate(value);
    }
    if (typeof value === 'string') {
        const trimmed = value.trim();

        if (/^\d+(\.\d+)?$/.test(trimmed)) {
            return epochToDate(Number(trimmed));
        }

        // Detect explicit TZ markers. If none, append the configured offset rather than
        // 'Z' — naive strings are device wallclock, NOT UTC. This is the line that fixes
        // the +8h forward shift seen in the UI ("16 hours ago" instead of "1 day ago").
        const hasTz = /(Z|[+-]\d{2}:?\d{2})$/.test(trimmed);
        const isoLike = trimmed.includes('T') ? trimmed : trimmed.replace(' ', 'T');
        if (!hasTz) {
            console.warn(
                `[timestamp] Naive timestamp received from IoT (no Z / offset): ${JSON.stringify(value)}. ` +
                `Interpreting as ${naiveOffset}. Firmware should emit ISO-with-offset or epoch ms.`
            );
        }
        const candidate = hasTz ? isoLike : `${isoLike}${naiveOffset}`;
        const date = new Date(candidate);
        if (Number.isNaN(date.getTime())) {
            throw new Error(`Invalid timestamp string: ${value}`);
        }
        return date;
    }
    throw new Error(`Unsupported timestamp type ${typeof value}: ${value}`);
}

// Some firmware reports epoch seconds (10 digits), others ms (13 digits). 1e11 ms ≈ year 1973
// and 1e11 s ≈ year 5138, so the threshold cleanly separates the two units for any plausible
// "now" value — letting us accept either dialect without making the firmware re-declare it.
function epochToDate(n) {
    if (!Number.isFinite(n) || n < 0) throw new Error(`Invalid epoch: ${n}`);
    const date = n <= 1e11 ? new Date(n * 1000) : new Date(n);
    if (Number.isNaN(date.getTime())) throw new Error(`Invalid epoch value: ${n}`);
    return date;
}

// Exported for tests so they can verify the resolved offset.
export function _getNaiveOffsetForTest() {
    return naiveOffset;
}
