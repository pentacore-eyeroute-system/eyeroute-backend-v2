import { firebaseAuth } from '../config/firebase.js';

export async function authenticateToken(req, res, next) {
    try {
        const authorizationHeader = req.headers.authorization;

        if (!authorizationHeader) return res.status(401).json({ message: 'Missing authorization header' });

        const tokenParts = authorizationHeader.split(' ');
        
        if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
            return res.status(401).json({ message: 'Invalid authorization format' });
        }

        const token = tokenParts[1];

        if (!firebaseAuth) {
            console.error('Firebase Token Verification Failed: Firebase Auth service not initialized');
            
            return res.status(500).json({ message: 'Firebase Auth is not initialized' });
        }

        const decodedToken = await firebaseAuth.verifyIdToken(token);

        req.user = {
            ...decodedToken,
            sub: decodedToken.uid,
            uid: decodedToken.uid, // Standardized sub alias pointing to Firebase UID
        };

        next();
    } catch (err) {
        console.error('Firebase Token Verification Failed:', err.message);
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
}

// Retain exported function name alias for backward compatibility with route definitions
export const authenticateCognitoToken = authenticateToken;