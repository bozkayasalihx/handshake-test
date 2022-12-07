class ParseError {
    private regex: RegExp;

    private error: string;

    constructor() {
        this.regex = /\(.*?\)/gi;
    }

    public setError(error: string) {
        this.error = error;
    }

    public get getError() {
        return this.error;
    }

    public parser() {
        const error = this.getError;
        return error.match(this.regex);
    }
}

export default new ParseError();
