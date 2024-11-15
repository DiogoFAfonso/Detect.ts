import { TraverseAST } from "./traverse"

export class Query {
    private state: any;

    public getState() {
        return this.state;
    }

    public setState(state) {
        this.state = state;
    }

    public run(ast) {
        TraverseAST.traverse(this, ast);
    }

    public enter(node, traverse_control: Function) {
        if (node)
            return this.entry_node(node, traverse_control);
    }

    public exit(node) {
        if (node)
            return this.exit_node(node);
    }

    private entry_node(node, traverse_control: Function) {
        const name = "entry" + node.type;
        const method = this.getNodeProcessor(name);
        if (method)
            return method.apply(this, [node, traverse_control]);
        return;
    }

    private exit_node(node) {
        const name = "exit" + node.type;
        const method = this.getNodeProcessor(name);
        if (method)
            return method.apply(this, [node]);
        return;
    }

    private getNodeProcessor(name: string) {
        const proto = Object.getPrototypeOf(this);
        return Object.getOwnPropertyNames(proto).includes(name) ? this[name] : undefined;
    }
}