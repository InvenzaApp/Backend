import { TokenCreatePayload } from "../payload/token-create-payload";
import { TokenJson } from "./token-json";

export class Token{
    public userId: number;
    public token: string;

    constructor(payload: TokenCreatePayload){
        this.userId = payload.userId;
        this.token = payload.token;
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