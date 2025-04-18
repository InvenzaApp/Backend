import jwt from 'jsonwebtoken';

require('dotenv').config();

export class TokenManager {
    apiKey: string;

    constructor() {
        this.apiKey = process.env.API_TOKEN as string;
    }

    getAccessToken(userId: number) {
        return jwt.sign({'userId': userId}, this.apiKey);
    }
}
