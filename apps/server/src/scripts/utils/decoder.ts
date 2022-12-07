import jwt from "jsonwebtoken";
import { IGenerateToken } from "./generateToken";

class Decoder {
    private Value: string;

    private jwt = jwt;

    public setValue(token: string) {
        this.Value = token;
    }

    decode() {
        return this.jwt.decode(this.Value) as jwt.JwtPayload & IGenerateToken;
    }
}

export default new Decoder();
