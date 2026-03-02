import { CognitoJwtVerifier } from 'aws-jwt-verify';
import config from '../config/env.js';

const COGNITO_USER_POOL_ID = config.cognito.userPoolId;
const COGNITO_CLIENT_ID = config.cognito.clientId;

const verifier = CognitoJwtVerifier.create({
    userPoolId: COGNITO_USER_POOL_ID,
    tokenUse: "id",
    clientId: COGNITO_CLIENT_ID,
});

export async function authenticateCognitoToken(req, res, next) {
    try {       
        const authorizationHeader = req.headers.authorization;

        if (!authorizationHeader) return res.status(401).json({ message: 'Missing token' });

        const token = authorizationHeader.split(' ')[1];
        
        const payload = await verifier.verify(token);

        req.user = payload;

        next();
    } catch (err) {
        console.error('JWT Verification Failed:', err); 
        return res.status(401).json({ message: 'Invalid or expired token', error: err.message });
    }
};

// Log config on startup (safety check)
console.log('Cognito Middleware Config:', {
    userPoolId: COGNITO_USER_POOL_ID,
    clientId: COGNITO_CLIENT_ID ? COGNITO_CLIENT_ID.substring(0, 5) + '...' : 'undefined'
});