# Phase 7 — Remove AWS Cognito Dependencies

You are continuing the EyeRoute backend migration on the `firebase` branch.

Phases 1–6 have been completed and reviewed.

## Goal

Remove AWS Cognito-specific authentication dependencies now that Firebase Authentication handles authentication.

## Important Rules

- Work ONLY on the `firebase` branch.
- Do NOT modify the `main` branch.
- Do NOT modify the MySQL column `fam_cognito_sub`.
- Do NOT remove AWS services that are still used by EyeRoute.
- Do NOT introduce Firestore or Realtime Database.
- Do not perform unrelated refactoring.

## Identify and Remove

Remove Cognito-specific:

- Dependencies.
- Imports.
- Configuration.
- Environment variables.
- Middleware.
- Registration logic.
- Password-reset logic.
- Verification logic.
- Utility functions.
- Dead code.

Pay particular attention to:

- `aws-jwt-verify`
- Cognito configuration modules.
- Cognito environment variables.
- Cognito-specific helper functions.

## IMPORTANT

Do NOT remove AWS SDK packages or configuration merely because they belong to AWS.

EyeRoute may still use AWS services such as:

- S3
- IoT Core
- SES
- RDS/MySQL infrastructure

Only remove dependencies that are specifically required for Cognito authentication and are no longer used.

## Database

Do NOT rename:

`fam_cognito_sub`

It remains the Firebase UID storage field for compatibility with the shared MySQL database and `main` branch.

## Testing

Verify:

1. Firebase authentication still works.
2. Protected routes still work.
3. Registration still works.
4. Email verification still works.
5. Password reset still works.
6. AWS S3/IoT/other required services still work.
7. No remaining Cognito authentication code exists.

## Output

Report:

- Cognito dependencies removed.
- Files deleted/modified.
- AWS dependencies intentionally retained.
- Remaining Cognito references, if any.
- Tests performed.

STOP after Phase 7.