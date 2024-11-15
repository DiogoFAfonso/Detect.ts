import { State } from "./state"
import { Query } from "../../../src/base_query"

enum NODES {
    TSUnionType = "TSUnionType",
    TSTypeLiteral = "TSTypeLiteral",
    TSTypeReference = "TSTypeReference",
    Identifier = "Identifier",
    MemberExpression = "MemberExpression",
    ArrowFunctionExpression = "ArrowFunctionExpression",
}

export class ControlledDynamicAccessQuery extends Query {
    constructor() {
        super();
        this.setState(new State());
    }

    private getIdentifiersFromExpression(expression, identifiers = new Set()): Set<string> {
        if (!expression) return identifiers as Set<string>;

        if (Array.isArray(expression)) {
            expression.forEach(exp => this.getIdentifiersFromExpression(exp, identifiers));
        }

        if (typeof expression === 'object') {
            switch (expression.type) {
                case 'Identifier':
                    identifiers.add(expression.name);
                    break;
                case 'BinaryExpression':
                case 'LogicalExpression':
                    this.getIdentifiersFromExpression(expression.left, identifiers);
                    this.getIdentifiersFromExpression(expression.right, identifiers);
                    break;
                case 'UnaryExpression':
                    this.getIdentifiersFromExpression(expression.argument, identifiers);
                    break;
                case 'MemberExpression':
                    if (expression.computed) {
                        this.getIdentifiersFromExpression(expression.property, identifiers);
                    }
                    if (expression.object.type == NODES.MemberExpression) {
                        this.getIdentifiersFromExpression(expression.object, identifiers);
                    }
                    break;
                case 'CallExpression':
                    expression.arguments.forEach(arg => this.getIdentifiersFromExpression(arg, identifiers));
                    if (expression.callee.type == NODES.MemberExpression) {
                        this.getIdentifiersFromExpression(expression.callee, identifiers);
                    }
                    break;
                case 'VariableDeclaration':
                    expression.declarations.forEach(declaration => this.getIdentifiersFromExpression(declaration, identifiers));
                    break;
                case 'VariableDeclarator':
                    this.getIdentifiersFromExpression(expression.id, identifiers);
                    this.getIdentifiersFromExpression(expression.init, identifiers);
                    break;
                case 'ArrayPattern':
                    expression.elements.forEach(element => this.getIdentifiersFromExpression(element, identifiers));
                    break;
                case 'UpdateExpression':
                    this.getIdentifiersFromExpression(expression.argument, identifiers);
                    break;
                case 'ChainExpression':
                    this.getIdentifiersFromExpression(expression.expression, identifiers);
                    break;
                case 'ObjectPattern':
                    expression.properties.forEach(property => this.getIdentifiersFromExpression(property.key, identifiers));
                    break;
                default:
                    break;
            }
            return identifiers as Set<string>;
        }
    }

    private isIterationCallExpression(node): boolean {
        if (node.callee && node.callee.type == NODES.MemberExpression &&
            node.callee.property && node.callee.property.type == NODES.Identifier &&
            (node.callee.property.name == 'forEach' || node.callee.property.name == 'map' || node.callee.property.name == 'flatMap' || node.callee.property.name == 'filter'
                || node.callee.property.name == 'reduce' || node.callee.property.name == 'reduceRight' || node.callee.property.name == 'some' || node.callee.property.name == 'every'
                || node.callee.property.name == 'find' || node.callee.property.name == 'findIndex' || node.callee.property.name == 'findLast' || node.callee.property.name == 'findLastIndex')) {
            return true;
        }
        return false;
    }

    private hasThrowOrReturnInsideIfBranch(node): boolean {
        if (node.consequent && (node.consequent.type == 'ThrowStatement' || node.consequent.type == 'ReturnStatement')) {
            return true;
        }

        if (node.consequent && node.consequent.type == "BlockStatement" && node.consequent.body) {
            return node.consequent.body.some((child) => {
                if (child.type == 'ThrowStatement' || child.type == 'ReturnStatement') {
                    return true;
                }
                return false;
            });
        }
        return false;
    }

    private entryAssignmentExpression(node, traverse_control: Function) {
        traverse_control(node.right);
        return true;
    }

    private entryFunctionDeclaration(node) {
        this.getState().getScopeStack().push();
    }

    private exitFunctionDeclaration(node) {
        this.getState().getScopeStack().pop();
    }

    private entryArrowFunctionExpression(node) {
        this.getState().getScopeStack().push();
    }

    private exitArrowFunctionExpression(node) {
        this.getState().getScopeStack().pop();
    }

    private entryFunctionExpression(node) {
        this.getState().getScopeStack().push();
    }

    private exitFunctionExpression(node) {
        this.getState().getScopeStack().pop();
    }

    private entryMethodDefinition(node) {
        this.getState().getScopeStack().push();
    }

    private exitMethodDefinition(node) {
        this.getState().getScopeStack().pop();
    }

    private entryIfStatement(node, traverse_control: Function) {
        const identifiers = this.getIdentifiersFromExpression(node.test);
        this.getState().getScopeStack().pushGuard(identifiers);
        traverse_control(node.consequent);
        traverse_control(node.alternate);
        return true;
    }

    private exitIfStatement(node) {
        if (!this.hasThrowOrReturnInsideIfBranch(node)) {
            this.getState().getScopeStack().popGuard();
        }
        else {
            this.getState().getScopeStack().refreshGuards();
        }
    }

    private entryConditionalExpression(node) {
        const identifiers = this.getIdentifiersFromExpression(node.test);
        this.getState().getScopeStack().pushGuard(identifiers);
    }

    private exitConditionalExpression(node) {
        this.getState().getScopeStack().popGuard();
    }

    private entrySwitchStatement(node) {
        const identifiers = this.getIdentifiersFromExpression(node.discriminant);
        this.getState().getScopeStack().pushGuard(identifiers);
    }

    private exitSwitchStatement(node) {
        this.getState().getScopeStack().popGuard();
    }

    private entryForStatement(node) {
        const identifiers = this.getIdentifiersFromExpression(node.test);
        this.getState().getScopeStack().pushGuard(identifiers);
    }

    private exitForStatement(node) {
        this.getState().getScopeStack().popGuard();
    }

    private entryForInStatement(node) {
        const identifiers = this.getIdentifiersFromExpression(node.left);
        this.getState().getScopeStack().pushGuard(identifiers);
    }

    private exitForInStatement(node) {
        this.getState().getScopeStack().popGuard();
    }

    private entryForOfStatement(node) {
        const identifiers = this.getIdentifiersFromExpression(node.left);
        this.getState().getScopeStack().pushGuard(identifiers);
    }

    private exitForOfStatement(node) {
        this.getState().getScopeStack().popGuard();
    }

    private entryWhileStatement(node) {
        const identifiers = this.getIdentifiersFromExpression(node.test);
        this.getState().getScopeStack().pushGuard(identifiers);
    }

    private exitWhileStatement(node) {
        this.getState().getScopeStack().popGuard();
    }

    private entryDoWhileStatement(node) {
        const identifiers = this.getIdentifiersFromExpression(node.test);
        this.getState().getScopeStack().pushGuard(identifiers);
    }

    private exitDoWhileStatement(node) {
        this.getState().getScopeStack().popGuard();
    }

    private entryCallExpression(node) {
        if (this.isIterationCallExpression(node)) {
            node.arguments.forEach((arg) => {
                if (arg.type == NODES.ArrowFunctionExpression) {
                    let identifiers = this.getIdentifiersFromExpression(arg.params);
                    this.getState().getScopeStack().pushGuard(identifiers);
                }
            });
        }
    }

    private exitCallExpression(node) {
        if (this.isIterationCallExpression(node)) {
            node.arguments.forEach((arg) => {
                if (arg.type == NODES.ArrowFunctionExpression) {
                    this.getState().getScopeStack().popGuard();
                }
            });
        }
    }

    private entryMemberExpression(node) {
        if (node.property && node.computed && node.property.type != "Literal") {
            const identifiers = this.getIdentifiersFromExpression(node.property);
            let identifiersArray = Array.from(identifiers);

            const isUnsafe = identifiersArray.some(identifier =>
                !this.getState().getScopeStack().isGuard(identifier));
            if (!isUnsafe)
                this.getState().addControlledDynamicAccess(node.property.range[0]);
        }
    }
}