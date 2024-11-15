import { Query } from "../../../src/base_query"

export class CounterUnionTypesQuery extends Query {
    constructor() {
        super();
        this.setState(0);
    }

    private entryTSUnionType() {
        this.setState(this.getState() + 1);
    }
}