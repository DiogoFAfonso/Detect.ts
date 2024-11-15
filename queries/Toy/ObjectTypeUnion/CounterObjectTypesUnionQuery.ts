import { Query } from "../../../src/base_query"
import { CounterUnionTypesQuery } from "../CountUnionTypes/CounterUnionTypesQuery"

export class CounterObjectTypesUnionQuery extends Query {
    constructor() {
        super();
        this.setState(0);
    }

    private entryTSTypeLiteral(node) {
        const cut_query = new CounterUnionTypesQuery();
        cut_query.run(node);
        if (cut_query.getState() > 0)
            this.setState(this.getState() + 1);
    }
}