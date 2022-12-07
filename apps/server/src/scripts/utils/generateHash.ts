import bcrypt from "bcryptjs";

class GenHash {
    private crypt = bcrypt;

    public gen(pass: string) {
        return this.crypt.hash(pass, +process.env.SALT);
    }
}

export default new GenHash();
