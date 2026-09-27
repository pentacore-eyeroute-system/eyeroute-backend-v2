# Phase 8 — Firebase Environment and Deployment Configuration

You are continuing the EyeRoute backend migration on the `firebase` branch.

## Goal

Make the Firebase Authentication migration ready for the project's actual development/deployment environment.

## Important Rules

- Work ONLY on the `firebase` branch.
- Do NOT modify the `main` branch.
- Do NOT commit Firebase credentials or private keys.
- Do NOT rename `fam_cognito_sub`.
- Do NOT change unrelated AWS configuration.

## Tasks

Review all Firebase environment variables required by the backend.

Ensure:

1. Local development environment is configured.
2. Production environment is configured.
3. Firebase credentials are stored securely.
4. Private keys are not committed.
5. `.env.example` contains placeholders only.
6. Deployment configuration contains the required Firebase variables.

Check the project's existing deployment setup, including:

- EC2
- Nginx
- Node.js process
- Environment variables
- Build/deployment scripts

Do not change deployment architecture unless necessary for Firebase Authentication.

## Testing

Verify the backend can:

1. Start successfully.
2. Initialize Firebase Admin.
3. Verify Firebase ID tokens.
4. Access MySQL.
5. Continue using required AWS services.
6. Run protected API endpoints.

## Output

Report:

- Required environment variables.
- Deployment changes.
- Security considerations.
- Local testing result.
- Production/deployment considerations.

STOP after Phase 8.