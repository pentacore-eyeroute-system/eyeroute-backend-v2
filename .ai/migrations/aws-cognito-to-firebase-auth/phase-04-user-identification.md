# Phase 4 — Migrate Application User Identification

You are continuing the EyeRoute backend migration on the `firebase` branch.

The project has two backend branches:

- `main` — AWS Cognito + MySQL
- `firebase` — Firebase Authentication + MySQL

## Goal

Update the Firebase branch so that Firebase Authentication's UID is used as the authenticated user's external identifier while keeping the existing MySQL schema compatible with the `main` branch.

## Critical Database Rule

DO NOT rename, remove, or modify the existing MySQL column:

`fam_cognito_sub`

The `main` branch still depends on this exact field name.

Do NOT create a database migration that renames it to:

`fam_firebase_uid`

Do NOT add a replacement column unless there is a demonstrated technical requirement.

For this migration, keep the existing column.

## Intended Behavior

On the `main` branch:

`fam_cognito_sub` → Cognito user's `sub`

On the `firebase` branch:

`fam_cognito_sub` → Firebase user's `uid`

The column name is historical and should remain unchanged for branch/database compatibility.

Treat this field in the Firebase branch as the application's external authentication UID.

## Tasks

Inspect every use of:

`fam_cognito_sub`

including:

- Sequelize models
- controllers
- services
- registration
- account lookup
- profile lookup
- notifications
- PVI-related operations
- IoT-related operations
- route history
- location
- any other authenticated-user queries

Determine how the current Cognito `sub` is obtained and used.

Then update the `firebase` branch so that:

1. Firebase UID is obtained from the verified Firebase ID token.
2. Firebase UID is used when creating the application's MySQL user record.
3. Firebase UID is stored in `fam_cognito_sub`.
4. Existing MySQL queries using `fam_cognito_sub` continue to work.
5. Authenticated users can still be correctly located in MySQL.
6. No database column rename is performed.

## Important

Do not assume:

`Firebase UID = MySQL primary key`

They are separate identifiers.

The Firebase UID should only replace the role previously played by the Cognito `sub`.

## Branch Compatibility

The shared MySQL schema must remain compatible with the existing `main` branch.

Do not make schema changes that would break the Cognito implementation.

A future cleanup could rename:

`fam_cognito_sub`

to something more generic such as:

`fam_auth_uid`

but that is OUT OF SCOPE for this migration.

## Testing

Verify:

1. A Firebase-authenticated user can be found using the Firebase UID.
2. The UID is correctly stored in `fam_cognito_sub`.
3. Existing authenticated API endpoints can retrieve the correct MySQL user.
4. Existing relationships continue to work.
5. No schema changes were made that would break `main`.

## Output

Report:

- Files changed.
- How Firebase UID is obtained.
- Where Firebase UID is stored.
- All important `fam_cognito_sub` usages updated.
- Database schema changes, if any.

There should normally be NO database schema change in this phase.

STOP after Phase 4.