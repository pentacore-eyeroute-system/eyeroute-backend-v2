# Phase 6 — Migrate Forgot Password to Firebase Authentication

You are continuing the EyeRoute backend migration on the `firebase` branch.

## Goal

Replace the existing AWS Cognito forgot-password/password-reset flow with Firebase Authentication's native password-reset email/link mechanism.

## Important Change from the Existing System

The existing Cognito implementation may use a custom 6-digit email OTP for password recovery.

Do NOT preserve that custom OTP flow.

For the Firebase branch, use Firebase Authentication's native password-reset email/link flow.

## Important Rules

- Work ONLY on the `firebase` branch.
- Do NOT modify the `main` branch.
- Do NOT rename `fam_cognito_sub`.
- Do NOT introduce Firestore or Realtime Database.
- Do NOT store passwords in MySQL.
- Do NOT implement a custom password-reset OTP.
- Do NOT implement custom OTP hashing or expiration for password recovery.
- Preserve controller/service separation.
- Preserve the REST API structure where practical.
- Do not perform unrelated refactoring.

## Expected Password Reset Flow

The general flow should be:

1. Client submits the account email.
2. Backend requests Firebase Authentication to send a password-reset email.
3. Firebase sends the user a password-reset link.
4. User opens the link.
5. User completes the password reset through Firebase's flow.
6. Firebase updates the user's password.

The backend must NOT receive or store the user's new password in MySQL.

## Inspect Existing Implementation

Before modifying the code, identify:

1. Cognito forgot-password APIs.
2. Cognito password-reset confirmation APIs.
3. Custom OTP generation.
4. OTP hashing.
5. OTP expiration.
6. OTP verification.
7. Password update logic.
8. Related database fields/tables.
9. Related email-sending utilities.
10. Frontend/API expectations for the existing OTP flow.

Determine which components are used exclusively for Cognito password recovery.

## Firebase Implementation

Replace the Cognito-specific password recovery mechanism with Firebase Authentication's native password-reset mechanism.

Do not recreate the Cognito OTP flow.

If the existing endpoint structure can be preserved cleanly, do so.

If Firebase's flow requires a different API response or endpoint behavior, make the smallest necessary change and clearly document it.

## Remove Only Obsolete Logic

After the Firebase password-reset flow is working:

Remove Cognito-specific password-reset logic that is no longer needed.

Do NOT remove shared email utilities if they are still used by other features.

Do NOT remove AWS SES if another part of the system still depends on it.

Do NOT remove unrelated AWS services.

## Testing

Test:

1. Existing Firebase user requests password reset.
2. Firebase password-reset email is triggered.
3. Password-reset link works.
4. User can set a new password.
5. User can log in using the new password.
6. Invalid/nonexistent email handling is appropriate.
7. No password is stored in MySQL.
8. No custom OTP is required.

## Output

Report:

- Files changed.
- Cognito password-reset logic removed/replaced.
- Firebase password-reset implementation.
- Any custom OTP logic removed.
- Any API behavior changes.
- Tests performed.

STOP after Phase 6.