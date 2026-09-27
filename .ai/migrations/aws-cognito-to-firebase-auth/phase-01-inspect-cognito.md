# Phase 1 — Inspect Existing Authentication

You are working on the EyeRoute backend.

The project currently has two branches:

- `main` — existing production/development implementation using AWS Cognito + MySQL
- `firebase` — migration branch that will replace AWS Cognito with Firebase Authentication

We are currently working ONLY on the `firebase` branch.

## Goal

Inspect the existing authentication implementation and identify everything that depends on AWS Cognito before making any changes.

## Important Rules

- Do NOT modify any files yet.
- Do NOT install or remove dependencies yet.
- Do NOT modify the database schema.
- Do NOT rename `fam_cognito_sub`.
- Do NOT modify the `main` branch.
- Do NOT introduce Firestore or Realtime Database.
- Preserve the existing Express REST API architecture.
- Preserve the existing controller/service separation.
- Do not perform unrelated refactoring.

## Inspect the following

Find and document:

1. AWS Cognito configuration.
2. `aws-jwt-verify` usage.
3. Authentication/token middleware.
4. How the Bearer token is extracted from the request.
5. How the Cognito ID token is verified.
6. How `req.user` is populated.
7. How `req.user.sub` is used throughout the backend.
8. Registration routes/controllers/services.
9. Login-related logic.
10. Email verification logic.
11. Forgot-password logic.
12. Password-reset logic.
13. Any custom email OTP logic.
14. OTP database fields/tables if present.
15. MySQL user/account fields related to Cognito.
16. All references to `fam_cognito_sub`.
17. Any Cognito-specific environment variables.
18. Any Cognito-specific dependencies in `package.json`.
19. Any tests related to authentication.
20. Any frontend/API assumptions that depend on Cognito authentication.

## Important Database Constraint

The MySQL database is shared by the existing Cognito implementation and the Firebase migration.

The existing column:

`fam_cognito_sub`

MUST NOT be renamed, removed, or changed during this migration.

The `main` branch depends on this column.

## Output

After inspection, provide:

### 1. Authentication Flow

Describe the current authentication flow from client → backend → Cognito → MySQL.

### 2. Cognito Dependencies

List every file that directly or indirectly depends on Cognito.

### 3. Token Flow

Explain how the Cognito token reaches the middleware and how the authenticated user's identity becomes available to controllers/services.

### 4. Database Usage

Explain how `fam_cognito_sub` is currently used.

### 5. Registration Flow

Explain the current registration and email-verification process.

### 6. Forgot Password Flow

Explain the current password-reset process.

### 7. Migration Risks

Identify anything that could break when replacing Cognito with Firebase Authentication.

### 8. Recommended Migration Order

Suggest the safest order for implementing the Firebase migration.

STOP after this inspection.

Do not modify anything until I explicitly approve Phase 1 and ask you to proceed.