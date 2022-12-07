class IdRemover {
    private body: Record<string, any>;

    public set setBody(params: Record<string, any>) {
        this.body = params;
    }

    removeId() {
        const hashMap = new Map<string, any>(Object.entries(this.body));
        if ("id" in this.body) {
            hashMap.delete("id");
        }
        return Object.fromEntries(hashMap);
    }
}
export default new IdRemover();
