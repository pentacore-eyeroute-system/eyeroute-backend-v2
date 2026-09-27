# Phase 3 — Replace Cognito Token Middleware with Firebase Authentication

You are continuing the EyeRoute backend migration on the `firebase` branch.

## Goal

Replace the existing AWS Cognito ID-token verification middleware with Firebase Authentication ID-token verification.

The middleware is especially important because many existing protected routes depend on it.

## Important Rules

- Work ONLY on the `firebase` branch.
- Do NOT modify the `main` branch.
- Do NOT rename `fam_cognito_sub`.
- Do NOT migrate registration yet.
- Do NOT migrate forgot-password yet.
- Do NOT remove unrelated AWS services such as S3, IoT Core, or SES.
- Do NOT introduce Firestore or Realtime Database.
- Preserve the existing Express REST API.
- Preserve the existing controller/service structure.
- Avoid unrelated refactoring.

## Existing Authentication

The current system uses AWS Cognito and `aws-jwt-verify`.

The existing middleware likely:

1. Reads the `Authorization` header.
2. Extracts the Bearer token.
3. Verifies the Cognito ID token.
4. Extracts the authenticated user's identity.
5. Places the identity in `req.user`.

Inspect the actual implementation before changing it.

## Firebase Implementation

Replace Cognito token verification with Firebase Admin SDK token verification.

The middleware should:

1. Read the `Authorization` header.
2. Require the Bearer token.
3. Extract the Firebase ID token.
4. Verify it using Firebase Admin Authentication.
5. Extract the Firebase user's UID.
6. Store the authenticated user's information in `req.user`.

Maintain the existing error-handling behavior as much as practical.

## Important Identity Change

Cognito previously provided:

`req.user.sub`

Firebase provides:

`req.user.uid`

Inspect the existing codebase and determine whether controllers/services currently depend on:

- `req.user.sub`
- `req.user.uid`
- another user identifier
- the complete `req.user` object

Do NOT blindly replace every `sub` reference with `uid`.

Update the code only where required for the Firebase authentication flow.

## MySQL Compatibility

The existing MySQL field:

`fam_cognito_sub`

MUST remain unchanged.

Do NOT rename it.

In the Firebase branch, the Firebase UID will eventually be stored in this existing field.

For this phase, only update authentication/token handling. Do not change registration logic yet.

## Testing

Test at minimum:

### Valid Firebase ID Token

A valid Firebase ID token should authenticate successfully.

### Missing Authorization Header

The request should be rejected.

### Invalid Token

The request should be rejected.

### Expired Token

The request should be rejected.

### Protected Route

At least one existing protected API route should successfully recognize the Firebase-authenticated user.

## Output

Report:

- Middleware files changed.
- How Firebase tokens are verified.
- What is now stored in `req.user`.
- Any `req.user.sub` dependencies discovered.
- Protected routes tested.
- Any remaining Cognito dependencies.

STOP after Phase 3.

Do not migrate registration or password reset yet.