import jwt from 'jsonwebtoken';

require('dotenv').config();

export class TokenManager {
    apiKey: string;

    constructor() {
        this.apiKey = process.env.API_TOKEN as string;
    }

    getOrganizationToken(userId: number){
        return jwt.sign({'userId': userId}, this.apiKey);
    }

    getAccessToken(userId: number, organizationId: number) {
        return jwt.sign({'userId': userId, 'organizationId': organizationId}, this.apiKey);
    }
}
