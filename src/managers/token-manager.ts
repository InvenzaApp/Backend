import jwt from 'jsonwebtoken';

require('dotenv').config();

class TokenManager {
    apiKey: string;

    constructor() {
        this.apiKey = process.env.API_TOKEN as string;
    }

    getAccessToken(username: string) {
        return jwt.sign(username, this.apiKey);
    }
}

export default TokenManager;