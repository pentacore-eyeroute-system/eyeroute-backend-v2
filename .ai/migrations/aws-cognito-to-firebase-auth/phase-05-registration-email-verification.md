# Phase 5 — Migrate Registration to Firebase Authentication

You are continuing the EyeRoute backend migration on the `firebase` branch.

## Goal

Replace AWS Cognito account registration with Firebase Authentication while using Firebase's native email verification link.

## Important Change from the Existing System

The existing Cognito implementation may use a custom 6-digit email OTP.

Do NOT preserve that custom email OTP flow.

For the Firebase branch, use Firebase Authentication's native email verification mechanism.

The user should receive a Firebase email containing a verification link.

## Important Rules

- Work ONLY on the `firebase` branch.
- Do NOT modify the `main` branch.
- Do NOT rename `fam_cognito_sub`.
- Do NOT introduce Firestore or Realtime Database.
- Do NOT store passwords in MySQL.
- Do NOT implement custom email OTP for registration.
- Do NOT implement custom OTP hashing/expiration for email verification.
- Preserve the existing Express REST API structure where practical.
- Preserve controller/service separation.
- Do not perform unrelated refactoring.

## Registration Flow

Implement the following general flow:

1. Client submits email and password to the backend.
2. Backend creates the Firebase Authentication account.
3. Firebase returns the Firebase user information, including UID.
4. Backend creates the corresponding MySQL user/profile record.
5. Store the Firebase UID in the existing:
   
   `fam_cognito_sub`

6. Trigger Firebase's native email verification mechanism.
7. Firebase sends the user a verification email/link.
8. User clicks the verification link.
9. Firebase marks the email as verified.

## Email Verification

Do NOT create:

- Custom 6-digit verification codes.
- Custom OTP tables.
- Custom OTP hashing.
- Custom OTP expiration.
- Custom OTP verification endpoints.

Use Firebase Authentication's native email verification system.

Inspect the existing backend to determine how email verification status is currently represented.

If the backend needs to check whether an authenticated user's email is verified, use the appropriate Firebase Authentication user/token information rather than recreating the Cognito verification mechanism.

## Existing MySQL User Record

Preserve the existing MySQL user/profile structure where practical.

Do not change:

`fam_cognito_sub`

The Firebase UID should be stored there.

Do not assume the Firebase UID is the MySQL primary key.

## Existing Cognito Logic

Identify and replace Cognito-specific registration functionality.

Remove Cognito-specific account creation only after the Firebase implementation is working.

Do not remove AWS services that are unrelated to authentication.

For example, do not remove AWS S3, AWS IoT Core, or SES if they are still used elsewhere.

## Error Handling

Preserve appropriate existing registration validation such as:

- Invalid email.
- Invalid password.
- Duplicate account.
- Missing required fields.

Map Firebase Authentication errors into appropriate API responses without exposing unnecessary internal details.

## Testing

Test:

1. New email/password registration.
2. Firebase user creation.
3. MySQL user creation.
4. Firebase UID stored in `fam_cognito_sub`.
5. Verification email generation/sending.
6. Email verification link flow.
7. Duplicate email registration.
8. Invalid registration input.
9. Authentication before and after email verification, according to the application's intended verification policy.

## Output

Report:

- Registration files changed.
- Cognito registration code replaced.
- Firebase registration implementation.
- Email verification implementation.
- MySQL behavior.
- Any removed custom OTP logic.
- API behavior changes, if any.
- Tests performed.

STOP after Phase 5.