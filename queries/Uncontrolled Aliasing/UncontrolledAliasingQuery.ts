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

export class UncontrolledAliasingQuery extends Query {
    constructor() {
        super();
        this.setState(new State());
    }

    // Receives a TypeLiteral node => {a:number, b:string}
    private getUnionTypePropertiesFromTypeLiteral(node): Set<string> {
        const members = node.members;
        let properties: Set<string> = new Set();

        for (let i = 0; i < members.length; i++) {
            let member = members[i];

            if (member.type !== NODES.TSPropertySignature || !member.typeAnnotation)
                continue;

            if (member.typeAnnotation!.typeAnnotation!.type == NODES.TSUnionType) {
                properties.add(member.key.name);
            }

            if (member.typeAnnotation!.typeAnnotation!.type == NODES.TSTypeReference) {
                const name = member.typeAnnotation.typeAnnotation.typeName.name;
                const isUnion = this.getState().getScopeStack().isUnionTypeAlias(name);
                if (isUnion) {
                    properties.add(member.key.name);
                }
            }
        }
        return properties;
    }

    private auxProcessVars(node) {
        if (node.type == NODES.Identifier) {
            const name = node.name;

            if (node.typeAnnotation) {
                const typeAnnotation = node.typeAnnotation.typeAnnotation;

                if (typeAnnotation.type == NODES.TSTypeLiteral) {
                    const properties = this.getUnionTypePropertiesFromTypeLiteral(typeAnnotation);
                    if (properties.size > 0) {
                        this.getState().getScopeStack().addUnsafeVar(name, properties);
                    }
                }

                else if (typeAnnotation.type == NODES.TSTypeReference) {
                    const tname = typeAnnotation.typeName.name;
                    const unsafe = this.getState().getScopeStack().isUnsafeType(tname);
                    if (unsafe) {
                        const properties = this.getState().getScopeStack().getUnionTypePropertiesFromUnsafeType(tname);
                        if (properties)
                            this.getState().getScopeStack().addUnsafeVar(name, properties);
                    }
                }
            }
        }
    }

    private processInitValue(left_node, right_node) {
        if (left_node && left_node.type == NODES.Identifier && right_node && right_node.type == NODES.Identifier) {
            const name = left_node.name;
            const init_name = right_node.name;
            const unsafeVar: boolean = this.getState().getScopeStack().isUnsafeVar(init_name);
            if (unsafeVar) {
                this.getState().getScopeStack().addUnsafeAlias(name, init_name);
            }
            const unsafeAlias: boolean = this.getState().getScopeStack().isUnsafeAlias(init_name);
            if (unsafeAlias) {
                const original_vars = this.getState().getScopeStack().getOriginalVarsFromAlias(init_name);
                if (original_vars)
                    this.getState().getScopeStack().setUnsafeAlias(name, original_vars);
            }
        }
    }

    // Object type => {a:number, b:string}
    private entryTSTypeAliasDeclaration(node) {
        const name = node.id.name;

        if (node.typeAnnotation && node.typeAnnotation.type == NODES.TSTypeLiteral) {
            const properties = this.getUnionTypePropertiesFromTypeLiteral(node.typeAnnotation);
            if (properties.size > 0) {
                this.getState().getScopeStack().addUnsafeType(name, properties);
            }
            return;
        }

        if (node.typeAnnotation && node.typeAnnotation.type == NODES.TSUnionType) {
            this.getState().getScopeStack().addUnionTypeAlias(name);
            return;
        }
    }

    private entryVariableDeclarator(node) {
        this.auxProcessVars(node.id)
        this.processInitValue(node.id, node.init);
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
        if (node.operator == "=") {
            this.processInitValue(node.left, node.right);
        }

        if (node.left.type == NODES.MemberExpression) {
            const name = node.left.object.name;
            const propname = node.left.property.type === 'Identifier' ? node.left.property.name : node.left.property.value;

            if (this.getState().getScopeStack().isUnsafeAlias(name)) {
                const properties = this.getState().getScopeStack().getUnionTypePropertiesFromAlias(name);
                if (properties && properties.has(propname))
                    this.getState().addUncontrolledAliasing(node.range[0]);
            }
        }
    }
}