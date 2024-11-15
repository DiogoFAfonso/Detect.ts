import { Query } from "../../../src/base_query"

export class CounterSumsQuery extends Query {
    constructor() {
        super();
        this.setState(0);
    }

    private entryBinaryExpression(node) {
        if (node.operator === '+')
            this.setState(this.getState() + 1);
    }
}