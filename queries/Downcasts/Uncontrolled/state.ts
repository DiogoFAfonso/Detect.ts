class Scope {
    private guards: Array<Set<string>> = [];

    public add_guard(vars: Set<string>): void {
        this.guards.push(vars);
    }
    public get_guards(): string[][] {
        return this.guards.map((set) => Array.from(set.values()));
    }
    public is_guard(vari: string): boolean {
        for (const set of this.guards) {
            if (set.has(vari)) {
                return true;
            }
        }
        return false;
    }
    public pop_guard(): void {
        this.guards.pop();
    }
    public move_last_to_first(): void {
        if (this.guards.length > 1) {
            this.guards.unshift(this.guards.pop());
        }
    }
}


class ScopeStack {
    private stack: Scope[] = []

    constructor() {
        this.push();
    }

    private current() {
        return this.stack[this.stack.length - 1]
    }

    public get_scope() {
        return this.stack;
    }

    public push() {
        var scope = new Scope();
        this.stack.push(scope);
    }

    public pop() {
        this.stack.pop();
    }


    private search_scope_prop(vari: string): boolean {
        for (let i = this.stack.length - 1; i >= 0; i--) {
            const scope = this.stack[i];
            if (scope.is_guard(vari)) {
                return true;
            }
        }
        return false;
    }

    private get_all_scopes(): string[][][] {
        let result: string[][][] = [];
        for (let i = 0; i < this.stack.length; i++) {
            const scope = this.stack[i];
            result.push(scope.get_guards());
        }
        return result;
    }


    public pushGuard(variables: Set<string>): void {
        this.current().add_guard(variables);
    }
    public isGuard(variable: string): boolean {
        return this.search_scope_prop(variable);
    }
    public getGuards(): string[][][] {
        return this.get_all_scopes();
    }
    public popGuard(): void {
        this.current().pop_guard();
    }
    public refreshGuards(): void {
        this.current().move_last_to_first();
    }
}


class State {
    private scopeStack: ScopeStack;
    private uncontrolledDowncast: number[] = [];

    constructor() {
        this.scopeStack = new ScopeStack();
    }

    public getScopeStack() {
        return this.scopeStack;
    }

    public addUncontrolledDowncast(pos: number) {
        this.uncontrolledDowncast.push(pos);
    }

    public getUncontrolledDowncasts() {
        return this.uncontrolledDowncast;
    }
}

export { State };