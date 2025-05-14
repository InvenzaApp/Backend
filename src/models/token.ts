interface TokenParams {
    userId: number;
    token: string;
}

export type TokenJson = {
    userId: number;
    token: string;
}

export class Token{
    public userId: number;
    public token: string;

    constructor(params: TokenParams){
        this.userId = params.userId;
        this.token = params.token;
    }

    static fromJson(json: TokenJson): Token{
        return new Token({
            userId: json.userId,
            token: json.token,
        });
    }

    toJson(): TokenJson{
        return {
            userId: this.userId,
            token: this.token,
        }
    }
}