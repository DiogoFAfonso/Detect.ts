import { State } from "./state"
import { Query } from "../../src/base_query"

enum NODES {
    TSUnionType = "TSUnionType",
    TSTypeLiteral = "TSTypeLiteral",
    TSTypeReference = "TSTypeReference",
    Identifier = "Identifier",
    MemberExpression = "MemberExpression",
    ArrowFunctionExpression = "ArrowFunctionExpression",
    TSPropertySignature = "TSPropertySignature"
}

export class UnionTypePropModificationQuery extends Query {
    constructor() {
        super();
        this.setState(new State());
    }

    // Receives a TypeLiteral node => {a:number, b:string}
    private isUnsafeLiteralType(node): [boolean, Array<string>] {
        const members = node.members;
        let unsafe = false;
        let properties: Array<string> = [];
        for (let i = 0; i < members.length; i++) {
            let member = members[i];

            if (member.type !== NODES.TSPropertySignature || !member.typeAnnotation)
                continue;

            if (member.typeAnnotation!.typeAnnotation!.type == NODES.TSUnionType) {
                unsafe = true;
                properties.push(member.key.name);
            }

            if (member.typeAnnotation!.typeAnnotation!.type == NODES.TSTypeReference) {
                const name = member.typeAnnotation.typeAnnotation.typeName.name;
                const isUnion = this.getState().getScopeStack().isUnionType(name);
                if (isUnion) {
                    unsafe = true;
                    properties.push(member.key.name);
                }
            }
        }
        return [unsafe, properties];
    }

    private auxProcessVars(node) {
        if (node.type == NODES.Identifier) {
            const name = node.name;

            if (node.typeAnnotation) {
                const typeAnnotation = node.typeAnnotation.typeAnnotation;

                if (typeAnnotation.type == NODES.TSTypeLiteral) {
                    const [unsafe, properties] = this.isUnsafeLiteralType(typeAnnotation);
                    if (unsafe) {
                        this.getState().getScopeStack().addUnsafeVar(name, properties);
                    }
                }

                else if (typeAnnotation.type == NODES.TSTypeReference) {
                    const tname = typeAnnotation.typeName.name;
                    const unsafe = this.getState().getScopeStack().isUnsafeType(tname);
                    if (unsafe) {
                        const properties = this.getState().getScopeStack().getPropertiesType(tname);
                        this.getState().getScopeStack().addUnsafeVar(name, properties);
                    }
                }
            }
        }
    }

    // Object type => {a:number, b:string}
    private entryTSTypeAliasDeclaration(node) {
        const name = node.id.name;

        if (node.typeAnnotation && node.typeAnnotation.type == NODES.TSTypeLiteral) {
            const [unsafe, properties] = this.isUnsafeLiteralType(node.typeAnnotation);
            if (unsafe) {
                this.getState().getScopeStack().addUnsafeType(name, properties);
            }
            return;
        }

        if (node.typeAnnotation && node.typeAnnotation.type == NODES.TSUnionType) {
            this.getState().getScopeStack().addUnionType(name);
            return;
        }
    }

    private entryVariableDeclarator(node) {
        this.auxProcessVars(node.id)
    }

    private entryFunctionDeclaration(node) {
        this.getState().getScopeStack().push();
        for (let param of node.params) {
            this.auxProcessVars(param)
        }
    }

    private exitFunctionDeclaration(node) {
        this.getState().getScopeStack().pop();
    }

    private entryArrowFunctionExpression(node) {
        this.getState().getScopeStack().push();
        for (let param of node.params) {
            this.auxProcessVars(param)
        }
    }

    private exitArrowFunctionExpression(node) {
        this.getState().getScopeStack().pop();
    }

    private entryFunctionExpression(node) {
        this.getState().getScopeStack().push();
        for (let param of node.params) {
            this.auxProcessVars(param)
        }
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

    private entryAssignmentExpression(node) {
        if (node.left.type == NODES.MemberExpression) {
            const name = node.left.object.name;
            const propname = node.left.property.type === 'Identifier' ? node.left.property.name : node.left.property.value;
            if (this.getState().getScopeStack().isUnsafeVar(name)) {
                const var_properties = this.getState().getScopeStack().getPropertiesVar(name);

                if (var_properties.includes(propname))
                    this.getState().addUnionTypePropModification(node.range[0]);
            }
        }
    }
}