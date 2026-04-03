import config from '../config/env.js';

const IOT_X_API_KEY = config.iot.xApiKey;

export async function authenticateXApiKey(req, res, next) {
    try {
        const inputXApiKey = req.headers['x-api-key'];

        if (!inputXApiKey) {
            return res.status(401).json({ message: 'Missing x-api-key header' });
        }

        if (inputXApiKey !== IOT_X_API_KEY) {
            return res.status(403).json({ message: 'Invalid x-api-key' });
        }

        next();
    } catch (err) {
        console.log('X API Key Verification Failed:', err); 
        return res.status(500).json({ message: 'Internal server error', error: err.message });
    }
};