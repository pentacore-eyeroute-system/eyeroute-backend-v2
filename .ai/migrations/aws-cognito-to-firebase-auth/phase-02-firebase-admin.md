# Phase 2 — Add Firebase Authentication Backend Configuration

You are continuing the EyeRoute backend migration on the `firebase` branch.

Phase 1 has already been reviewed.

## Goal

Add the backend-side Firebase Admin SDK configuration required to verify Firebase Authentication ID tokens.

## Important Rules

- Work ONLY on the `firebase` branch.
- Do NOT modify the `main` branch.
- Do NOT remove AWS Cognito yet.
- Do NOT modify `fam_cognito_sub`.
- Do NOT migrate registration yet.
- Do NOT migrate forgot-password yet.
- Do NOT introduce Firestore or Realtime Database.
- Preserve the existing Express controller/service architecture.
- Do not perform unrelated refactoring.

## Tasks

### 1. Install Firebase Admin

Add the appropriate Firebase Admin SDK dependency to the backend.

### 2. Create Firebase Configuration

Create a dedicated Firebase Admin configuration module following the project's existing configuration structure.

Use environment variables for Firebase credentials.

The implementation should support the required Firebase Admin credentials without hardcoding secrets.

At minimum, inspect whether the project should use:

- Firebase project ID
- Firebase client email
- Firebase private key

Use the appropriate Firebase Admin SDK initialization method for the project's environment.

### 3. Environment Variables

Add the required Firebase environment variable names to the project's environment configuration/documentation.

Do NOT commit real credentials.

If the project has an example environment file, update it with placeholder values only.

### 4. Keep Cognito Temporarily

Do not remove:

- `aws-jwt-verify`
- Cognito environment variables
- Cognito middleware
- Cognito registration logic
- Cognito password-reset logic

Those will be removed/replaced in later phases.

## Verification

Confirm that:

1. Firebase Admin initializes successfully.
2. The backend can access the Firebase Admin Authentication service.
3. No credentials are hardcoded.
4. Existing Cognito functionality remains untouched.

## Output

Report:

- Files created/modified.
- Dependencies added.
- Environment variables added.
- How Firebase Admin is initialized.
- Any configuration concerns.

STOP after Phase 2.

Do not proceed to token middleware migration until I explicitly approve this phase.