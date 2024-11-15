class Scope {
    private unsafe_types: { [name: string]: Array<string> } = {};
    private union_types: Array<string> = [];
    private unsafe_vars: { [name: string]: Array<string> } = {};

    public add_unsafe_type(type: string, properties: Array<string>): void {
        this.unsafe_types[type] = properties;
    }
    public get_unsafe_types(): { [name: string]: Array<string> } {
        return this.unsafe_types;
    }
    public isUnsafeType(type: string): boolean {
        return this.unsafe_types.hasOwnProperty(type);
    }
    public getProperty(type: string): Array<string> {
        if (this.isUnsafeType(type))
            return this.unsafe_types[type];
        return [];
    }

    public add_union_type(type: string): void {
        this.union_types.push(type);
    }
    public get_union_types(): Array<string> {
        return this.union_types;
    }
    public isUnionType(type: string): boolean {
        return this.union_types.includes(type);
    }

    public add_unsafe_var(variable: string, properties: Array<string>): void {
        this.unsafe_vars[variable] = properties;
    }
    public get_unsafe_vars(): { [name: string]: Array<string> } {
        return this.unsafe_vars;
    }
    public isUnsafeVar(variable: string): boolean {
        return this.unsafe_vars.hasOwnProperty(variable);
    }
    public getPropertyVar(variable: string): Array<string> {
        if (this.isUnsafeVar(variable))
            return this.unsafe_vars[variable];
        return [];
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


    private search_scope_prop(method: string, value: string): boolean {
        for (let i = this.stack.length - 1; i >= 0; i--) {
            const scope = this.stack[i];
            if (scope[method](value)) {
                return true;
            }
        }
        return false;
    }

    private get_all_scopes(method: string) {
        let result = [];
        for (let i = 0; i < this.stack.length; i++) {
            const scope = this.stack[i];
            result.push(scope[method]());
        }
        return result;
    }

    public addUnsafeType(type: string, properties: Array<string>) {
        this.current().add_unsafe_type(type, properties);
    }
    public isUnsafeType(type: string): boolean {
        return this.search_scope_prop("isUnsafeType", type);
    }
    public getPropertiesType(type: string): Array<string> {
        for (let i = this.stack.length - 1; i >= 0; i--) {
            const scope = this.stack[i];
            if (scope.isUnsafeType(type)) {
                return scope.getProperty(type);
            }
        }
        return [];
    }
    public getUnsafeTypes() {
        return this.get_all_scopes("get_unsafe_types");
    }

    public addUnionType(type: string) {
        this.current().add_union_type(type);
    }
    public isUnionType(type: string): boolean {
        return this.search_scope_prop("isUnionType", type);
    }
    public getUnionTypes() {
        return this.get_all_scopes("get_union_types");
    }

    public addUnsafeVar(varName: string, properties: Array<string>) {
        this.current().add_unsafe_var(varName, properties);
    }
    public isUnsafeVar(varName: string): boolean {
        return this.search_scope_prop("isUnsafeVar", varName);
    }
    public getPropertiesVar(varName: string): Array<string> {
        for (let i = this.stack.length - 1; i >= 0; i--) {
            const scope = this.stack[i];
            if (scope.isUnsafeVar(varName)) {
                return scope.getPropertyVar(varName);
            }
        }
        return [];
    }
    public getUnsafeVars() {
        return this.get_all_scopes("get_unsafe_vars");
    }
}


class State {
    private scopeStack: ScopeStack;
    private unionTypePropertyMod: Array<number> = [];

    constructor() {
        this.scopeStack = new ScopeStack();
    }

    public getScopeStack() {
        return this.scopeStack;
    }

    public addUnionTypePropModification(pos: number) {
        this.unionTypePropertyMod.push(pos);
    }
    public getUnionTypePropModifications() {
        return this.unionTypePropertyMod;
    }
}

export { State };