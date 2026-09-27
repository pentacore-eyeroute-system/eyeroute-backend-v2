# Phase 9 — Firebase Authentication Regression Testing

You are continuing the EyeRoute backend migration on the `firebase` branch.

## Goal

Perform a complete authentication regression test after migrating from AWS Cognito to Firebase Authentication.

## Test the following

### Authentication

- Firebase email/password account creation.
- Firebase ID token generation.
- Firebase ID token verification.
- Protected API requests.
- Invalid token.
- Expired token.
- Missing token.

### Email Verification

- Verification email.
- Verification link.
- Verified email state.
- Unverified email behavior.

### Password Reset

- Password-reset email.
- Password-reset link.
- New password.
- Login with new password.

### MySQL

Verify:

- Firebase UID is stored in `fam_cognito_sub`.
- Existing user lookup works.
- Existing user relationships work.
- No schema rename was performed.

### Existing EyeRoute Features

Test authenticated operations that depend on the current user, especially:

- Account/profile.
- PVI.
- Notifications.
- IoT wearable.
- Location.
- Route history.
- Streaming-related authenticated endpoints.

## Important

Do not modify code simply to make a test pass without first identifying the root cause.

Do not perform unrelated refactoring.

## Output

Provide a test report containing:

- Test.
- Expected result.
- Actual result.
- Pass/fail.
- Relevant error.
- File/code location if a failure occurs.
- Recommended fix.

If failures are found, STOP and report them before making broad changes.