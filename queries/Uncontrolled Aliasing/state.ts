class Scope {
    private union_types_aliases: Set<string> = new Set();
    private unsafe_types: { [name: string]: Set<string> } = {};
    private unsafe_vars: { [name: string]: Set<string> } = {};
    private unsafe_aliases: { [name: string]: Set<string> } = {};

    public add_union_type(type: string): void {
        this.union_types_aliases.add(type);
    }
    public get_union_types_aliases(): Set<string> {
        return this.union_types_aliases;
    }
    public isUnionType(type: string): boolean {
        return this.union_types_aliases.has(type);
    }

    public add_unsafe_type(type: string, properties: Set<string>): void {
        this.unsafe_types[type] = properties;
    }
    public get_unsafe_types(): { [name: string]: Set<string> } {
        return this.unsafe_types;
    }
    public isUnsafeType(type: string): boolean {
        return this.unsafe_types.hasOwnProperty(type);
    }
    public getPropertiesFromUnsafeType(type: string): Set<string> | null {
        if (this.isUnsafeType(type))
            return this.unsafe_types[type];
        return null;
    }

    public add_unsafe_var(variable: string, properties: Set<string>): void {
        this.unsafe_vars[variable] = properties;
    }
    public get_unsafe_vars(): { [name: string]: Set<string> } {
        return this.unsafe_vars;
    }
    public isUnsafeVar(variable: string): boolean {
        return this.unsafe_vars.hasOwnProperty(variable);
    }
    public getPropertiesFromUnsafeVar(variable: string): Set<string> | null {
        if (this.isUnsafeVar(variable))
            return this.unsafe_vars[variable];
        return null;
    }

    public add_unsafe_alias(alias: string, original_var: string): void {
        if (!this.unsafe_aliases[alias]) {
            this.unsafe_aliases[alias] = new Set<string>();
        }
        this.unsafe_aliases[alias].add(original_var);
    }
    public set_unsafe_alias(alias: string, original_vars: Set<string>): void {
        this.unsafe_aliases[alias] = original_vars;
    }
    public get_unsafe_aliases(): { [name: string]: Set<string> } {
        return this.unsafe_aliases;
    }
    public isUnsafeAlias(alias: string): boolean {
        return this.unsafe_aliases.hasOwnProperty(alias);
    }
    public getOriginalVarsFromAlias(alias: string): Set<string> | null {
        if (this.isUnsafeAlias(alias))
            return new Set([...this.unsafe_aliases[alias]]);
        return null;
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

    public addUnionTypeAlias(type: string) {
        this.current().add_union_type(type);
    }
    public isUnionTypeAlias(type: string): boolean {
        return this.search_scope_prop("isUnionType", type);
    }
    public getUnionTypeAliases() {
        return this.get_all_scopes("get_union_types_aliases");
    }

    public addUnsafeType(type: string, properties: Set<string>) {
        this.current().add_unsafe_type(type, properties);
    }
    public isUnsafeType(type: string): boolean {
        return this.search_scope_prop("isUnsafeType", type);
    }
    public getUnionTypePropertiesFromUnsafeType(type: string): Set<string> | null {
        for (let i = this.stack.length - 1; i >= 0; i--) {
            const scope = this.stack[i];
            if (scope.isUnsafeType(type))
                return scope.getPropertiesFromUnsafeType(type);
        }
        return null;
    }
    public getUnsafeTypes() {
        return this.get_all_scopes("get_unsafe_types");
    }

    public addUnsafeVar(varName: string, properties: Set<string>) {
        this.current().add_unsafe_var(varName, properties);
    }
    public isUnsafeVar(varName: string): boolean {
        return this.search_scope_prop("isUnsafeVar", varName);
    }
    public getUnionTypePropertiesFromUnsafeVar(varName: string): Set<string> | null {
        for (let i = this.stack.length - 1; i >= 0; i--) {
            const scope = this.stack[i];
            if (scope.isUnsafeVar(varName))
                return scope.getPropertiesFromUnsafeVar(varName);
        }
        return null;
    }
    public getUnsafeVars() {
        return this.get_all_scopes("get_unsafe_vars");
    }

    public addUnsafeAlias(alias: string, original_var: string) {
        this.current().add_unsafe_alias(alias, original_var);
    }
    public setUnsafeAlias(alias: string, original_vars: Set<string>) {
        this.current().set_unsafe_alias(alias, original_vars);
    }
    public isUnsafeAlias(alias: string): boolean {
        return this.search_scope_prop("isUnsafeAlias", alias);
    }
    public getOriginalVarsFromAlias(alias: string): Set<string> | null {
        for (let i = this.stack.length - 1; i >= 0; i--) {
            const scope = this.stack[i];
            if (scope.isUnsafeAlias(alias))
                return scope.getOriginalVarsFromAlias(alias);
        }
        return null;
    }
    public getUnionTypePropertiesFromAlias(alias: string): Set<string> | null {
        let original_vars = this.getOriginalVarsFromAlias(alias);
        let properties = new Set<string>();
        if (original_vars) {
            for (let original_var of original_vars) {
                let props = this.getUnionTypePropertiesFromUnsafeVar(original_var);
                if (props) {
                    for (let prop of props) {
                        properties.add(prop);
                    }
                }
            }
            return properties;
        }
    }
    public getUnsafeAliases() {
        return this.get_all_scopes("get_unsafe_aliases");
    }
}


class State {
    private scopeStack: ScopeStack;
    private uncontrolledAliasing: Array<number> = [];

    constructor() {
        this.scopeStack = new ScopeStack();
    }

    public getScopeStack() {
        return this.scopeStack;
    }

    public addUncontrolledAliasing(pos: number) {
        this.uncontrolledAliasing.push(pos);
    }
    public getUncontrolledAliasing() {
        return this.uncontrolledAliasing;
    }
}

export { State };