import { jest } from '@jest/globals';
import { authenticateToken, authenticateCognitoToken } from '../../src/middleware/authenticateToken.js';
import * as firebaseConfig from '../../src/config/firebase.js';

describe('Firebase authenticateToken middleware', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            headers: {},
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
        next = jest.fn();
    });

    it('should reject request when Authorization header is missing', async () => {
        await authenticateToken(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Missing authorization header' });
        expect(next).not.toHaveBeenCalled();
    });

    it('should reject request when Authorization header format is invalid', async () => {
        req.headers.authorization = 'Basic invalidtoken';

        await authenticateToken(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid authorization format' });
        expect(next).not.toHaveBeenCalled();
    });

    it('should reject request when Firebase ID token verification fails (invalid/expired)', async () => {
        req.headers.authorization = 'Bearer invalid-token';
        
        jest.spyOn(firebaseConfig.firebaseAuth, 'verifyIdToken').mockRejectedValue(new Error('Token expired'));

        await authenticateToken(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid or expired token' });
        expect(next).not.toHaveBeenCalled();
    });

    it('should authenticate successfully and set req.user with uid and sub when token is valid', async () => {
        req.headers.authorization = 'Bearer valid-firebase-token';
        
        const mockDecodedToken = {
            uid: 'firebase-uid-12345',
            email: 'test@example.com',
            auth_time: 123456789,
        };

        jest.spyOn(firebaseConfig.firebaseAuth, 'verifyIdToken').mockResolvedValue(mockDecodedToken);

        await authenticateToken(req, res, next);

        expect(req.user).toBeDefined();
        expect(req.user.uid).toBe('firebase-uid-12345');
        expect(req.user.sub).toBe('firebase-uid-12345');
        expect(req.user.email).toBe('test@example.com');
        expect(next).toHaveBeenCalled();
    });
});
