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
// WIRE CONTRACT (any of these must produce the same UTC instant):
//   - epoch number or numeric string (seconds OR milliseconds), OR
//   - ISO-8601 with an explicit timezone designator (Z or +HH:MM / -HH:MM), OR
//   - timezone-naive ISO ("YYYY-MM-DDTHH:mm:ss") or MySQL ("YYYY-MM-DD HH:mm:ss") — these
//     are interpreted as UTC (documented assumption; the IoT firmware must comply).
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

        // Detect explicit TZ markers. If none, append 'Z' so V8 cannot fall back to
        // process-local interpretation — this is the line that closes the original bug.
        const hasTz = /(Z|[+-]\d{2}:?\d{2})$/.test(trimmed);
        const isoLike = trimmed.includes('T') ? trimmed : trimmed.replace(' ', 'T');
        const candidate = hasTz ? isoLike : `${isoLike}Z`;
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
