# EyeRoute — Cognito to Firebase Authentication Migration

This directory contains the phased migration instructions for replacing
AWS Cognito with Firebase Authentication in the EyeRoute backend.

## Branches

- `main` — AWS Cognito + MySQL
- `firebase` — Firebase Authentication + MySQL

## Important Database Constraint

The existing MySQL column `fam_cognito_sub` must NOT be renamed or removed
during this migration.

On `main`:

`fam_cognito_sub` stores the Cognito user's `sub`.

On `firebase`:

`fam_cognito_sub` stores the Firebase user's `uid`.

The column name is intentionally preserved so that the shared MySQL database
remains compatible with both branches.

## Migration Phases

1. Inspect existing Cognito authentication
2. Add Firebase Admin SDK
3. Replace Cognito token middleware
4. Migrate application user identification
5. Migrate registration and email verification
6. Migrate forgot-password
7. Remove Cognito dependencies
8. Configure environment and deployment
9. Perform authentication regression testing
10. Final migration review

Each phase should be executed separately and reviewed before proceeding
to the next phase.