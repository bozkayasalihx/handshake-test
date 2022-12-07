type ValueType = string | number | Array<Record<string, string | number>>;

class Search<T extends Array<Record<string, ValueType>>> {
    private data: T;
    private columns: Record<string, boolean>;

    public whichColumns(cols: Record<string, boolean>) {
        this.columns = cols;
    }

    private goDownLevel() {
        
    }
}
