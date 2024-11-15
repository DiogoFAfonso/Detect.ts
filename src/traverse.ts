import { Query } from "./base_query"

export class TraverseAST {
    private static multiTraverse(query: Query, nodes: any[]) {
        if (!nodes) return;

        for (var i = 0; i < nodes.length; i++) {
            const element = nodes[i];
            if (Array.isArray(element))
                TraverseAST.multiTraverse(query, element);
            else
                TraverseAST.traverse(query, element);
        }
    }

    public static traverse(query: Query, node) {
        if (node) {
            let control_lock = query.enter(node, (n) => TraverseAST.traverse(query, n));                                    // Flow Control for query
            if (!control_lock)
                TraverseAST.getVisitor(node)(query, node);
            query.exit(node);
        }
    }

    private static getVisitor(node) {
        let name = "traverse_" + node.type;
        return TraverseAST[name];
    }

    // private static traverse_Generic(_, node) {
    //     console.log("Generic Traverse in: " + node.type)
    //     return;
    // }

    private static traverse_Program(query: Query, node) {                          // SourceFile
        return TraverseAST.multiTraverse(query, node.body);
    }

    //////////////////
    // DECLARATIONS //
    //////////////////

    private static traverse_ClassDeclaration(query: Query, node) {                 // ClassDeclaration
        return TraverseAST.multiTraverse(query, [node.body, node.decorators, node.id, node.implements, node.superClass, node.superTypeArguments, node.superTypeParameters, node.typeParameters]);
    }

    private static traverse_ExportAllDeclaration(query: Query, node) {             // ExportAllDeclaration
        return TraverseAST.multiTraverse(query, [node.attributes, node.exported, node.source]);
    }

    private static traverse_ExportDefaultDeclaration(query: Query, node) {         // ExportDefaultDeclaration
        return TraverseAST.multiTraverse(query, [node.declaration]);
    }

    private static traverse_ExportNamedDeclaration(query: Query, node) {           // ExportNamedDeclaration
        return TraverseAST.multiTraverse(query, [node.attributes, node.declaration, node.source, node.specifiers]);
    }

    private static traverse_FunctionDeclaration(query: Query, node) {              // FunctionDeclaration
        return TraverseAST.multiTraverse(query, [node.body, node.id, node.params, node.returnType, node.typeParameters]);
    }

    private static traverse_ImportDeclaration(query: Query, node) {               // ImportDeclaration
        return TraverseAST.multiTraverse(query, [node.attributes, node.source, node.specifiers]);
    }

    private static traverse_TSDeclareFunction(query: Query, node) {               // TSDeclareFunction
        return TraverseAST.multiTraverse(query, [node.body, node.id, node.params, node.returnType, node.typeParameters]);
    }

    private static traverse_TSEnumDeclaration(query: Query, node) {               // TSEnumDeclaration
        return TraverseAST.multiTraverse(query, [node.id, node.members]);
    }

    private static traverse_TSImportEqualsDeclaration(query: Query, node) {       // TSImportEqualsDeclaration
        return TraverseAST.multiTraverse(query, [node.id, node.moduleReference]);
    }

    private static traverse_TSInterfaceDeclaration(query: Query, node) {          // TSInterfaceDeclaration
        return TraverseAST.multiTraverse(query, [node.body, node.extends, node.id, node.typeParameters]);
    }

    private static traverse_TSModuleDeclaration(query: Query, node) {             // TSModuleDeclaration
        return TraverseAST.multiTraverse(query, [node.id, node.body]);
    }

    private static traverse_TSNamespaceExportDeclaration(query: Query, node) {    // TSNamespaceExportDeclaration
        return TraverseAST.multiTraverse(query, [node.id]);
    }

    private static traverse_TSTypeAliasDeclaration(query: Query, node) {          // TSTypeAliasDeclaration
        return TraverseAST.multiTraverse(query, [node.id, node.typeAnnotation, node.typeParameters]);
    }

    private static traverse_VariableDeclaration(query: Query, node) {             // VariableDeclaration
        return TraverseAST.multiTraverse(query, [node.declarations]);
    }

    private static traverse_VariableDeclarator(query: Query, node) {              // VariableDeclarator
        return TraverseAST.multiTraverse(query, [node.id, node.init]);
    }

    ////////////////
    // STATEMENTS //
    ////////////////  

    private static traverse_BlockStatement(query: Query, node) {                  // BlockStatement
        return TraverseAST.multiTraverse(query, [node.body]);
    }

    private static traverse_BreakStatement(query: Query, node) {                  // BreakStatement
        return TraverseAST.multiTraverse(query, [node.label]);
    }

    private static traverse_ContinueStatement(query: Query, node) {               // ContinueStatement
        return TraverseAST.multiTraverse(query, [node.label]);
    }

    private static traverse_DebuggerStatement(query: Query, node) {               // DebuggerStatement
        return;
    }

    private static traverse_DoWhileStatement(query: Query, node) {                // DoWhileStatement
        return TraverseAST.multiTraverse(query, [node.test, node.body]);
    }

    private static traverse_EmptyStatement(query: Query, node) {                  // EmptyStatement
        return;
    }

    private static traverse_ExpressionStatement(query: Query, node) {            // ExpressionStatement
        return TraverseAST.multiTraverse(query, [node.expression]);
    }

    private static traverse_ForInStatement(query: Query, node) {                  // ForInStatement
        return TraverseAST.multiTraverse(query, [node.left, node.right, node.body]);
    }

    private static traverse_ForOfStatement(query: Query, node) {                  // ForOfStatement
        return TraverseAST.multiTraverse(query, [node.left, node.right, node.body]);
    }

    private static traverse_ForStatement(query: Query, node) {                    // ForStatement
        return TraverseAST.multiTraverse(query, [node.init, node.test, node.update, node.body]);
    }

    private static traverse_IfStatement(query: Query, node) {                     // IfStatement
        return TraverseAST.multiTraverse(query, [node.test, node.consequent, node.alternate]);
    }

    private static traverse_LabeledStatement(query: Query, node) {               // LabeledStatement
        return TraverseAST.multiTraverse(query, [node.label, node.body]);
    }

    private static traverse_ReturnStatement(query: Query, node) {                // ReturnStatement
        return TraverseAST.multiTraverse(query, [node.argument]);
    }

    private static traverse_SwitchStatement(query: Query, node) {                // SwitchStatement
        return TraverseAST.multiTraverse(query, [node.discriminant, node.cases]);
    }

    private static traverse_TSExportAssignment(query: Query, node) {             // TSExportAssignment
        return TraverseAST.multiTraverse(query, [node.expression]);
    }

    private static traverse_ThrowStatement(query: Query, node) {                 // ThrowStatement
        return TraverseAST.multiTraverse(query, [node.argument]);
    }

    private static traverse_TryStatement(query: Query, node) {                   // TryStatement
        return TraverseAST.multiTraverse(query, [node.block, node.handler, node.finalizer]);
    }

    private static traverse_WhileStatement(query: Query, node) {                 // WhileStatement
        return TraverseAST.multiTraverse(query, [node.test, node.body]);
    }

    private static traverse_WithStatement(query: Query, node) {                  // WithStatement
        return TraverseAST.multiTraverse(query, [node.object, node.body]);
    }

    /////////////////
    // EXPRESSIONS //
    /////////////////  

    private static traverse_ArrayExpression(query: Query, node) {                // ArrayExpression
        return TraverseAST.multiTraverse(query, [node.elements]);
    }

    private static traverse_ArrowFunctionExpression(query: Query, node) {        // ArrowFunctionExpression
        return TraverseAST.multiTraverse(query, [node.params, node.body, node.returnType, node.typeParameters]);
    }

    private static traverse_AssignmentExpression(query: Query, node) {           // AssignmentExpression
        return TraverseAST.multiTraverse(query, [node.left, node.right]);
    }

    private static traverse_AwaitExpression(query: Query, node) {                // AwaitExpression
        return TraverseAST.multiTraverse(query, [node.argument]);
    }

    private static traverse_BinaryExpression(query: Query, node) {               // BinaryExpression
        return TraverseAST.multiTraverse(query, [node.left, node.right]);
    }

    private static traverse_CallExpression(query: Query, node) {                 // CallExpression
        return TraverseAST.multiTraverse(query, [node.callee, node.arguments, node.typeArguments]);
    }

    private static traverse_ChainExpression(query: Query, node) {                // ChainExpression
        return TraverseAST.multiTraverse(query, [node.expression]);
    }

    private static traverse_ClassExpression(query: Query, node) {                // ClassExpression
        return TraverseAST.multiTraverse(query, [node.body, node.decorators, node.id, node.implements, node.superClass, node.superTypeArguments, node.superTypeParameters, node.typeParameters]);
    }

    private static traverse_ConditionalExpression(query: Query, node) {          // ConditionalExpression
        return TraverseAST.multiTraverse(query, [node.test, node.consequent, node.alternate]);
    }

    private static traverse_FunctionExpression(query: Query, node) {             // FunctionExpression
        return TraverseAST.multiTraverse(query, [node.body, node.id, node.params, node.returnType, node.typeParameters]);
    }

    private static traverse_Identifier(query: Query, node) {                     // Identifier
        return TraverseAST.multiTraverse(query, [node.typeAnnotation, node.decorators]);
    }

    private static traverse_ImportExpression(query: Query, node) {               // ImportExpression
        return TraverseAST.multiTraverse(query, [node.source, node.attributes]);
    }

    private static traverse_JSXElement(query: Query, node) {                     // JSXElement
        return TraverseAST.multiTraverse(query, [node.openingElement, node.closingElement, node.children]);
    }

    private static traverse_JSXFragment(query: Query, node) {                    // JSXFragment
        return TraverseAST.multiTraverse(query, [node.openingFragment, node.closingFragment, node.children]);
    }

    private static traverse_LogicalExpression(query: Query, node) {              // LogicalExpression
        return TraverseAST.multiTraverse(query, [node.left, node.right]);
    }

    private static traverse_MemberExpression(query: Query, node) {               // MemberExpression
        return TraverseAST.multiTraverse(query, [node.object, node.property]);
    }

    private static traverse_MetaProperty(query: Query, node) {                   // MetaProperty
        return TraverseAST.multiTraverse(query, [node.meta, node.property]);
    }

    private static traverse_NewExpression(query: Query, node) {                  // NewExpression
        return TraverseAST.multiTraverse(query, [node.callee, node.arguments, node.typeArguments]);
    }

    private static traverse_ObjectExpression(query: Query, node) {               // ObjectExpression
        return TraverseAST.multiTraverse(query, [node.properties]);
    }

    private static traverse_SequenceExpression(query: Query, node) {             // SequenceExpression
        return TraverseAST.multiTraverse(query, [node.expressions]);
    }

    private static traverse_Super(query: Query, node) {                          // Super
        return;
    }

    private static traverse_TSAsExpression(query: Query, node) {                 // TSAsExpression
        return TraverseAST.multiTraverse(query, [node.expression, node.typeAnnotation]);
    }

    private static traverse_TSEmptyBodyFunctionExpression(query: Query, node) {  // TSEmptyBodyFunctionExpression
        return TraverseAST.multiTraverse(query, [node.body, node.id, node.params, node.returnType, node.typeParameters]);
    }

    private static traverse_TSInstantiationExpression(query: Query, node) {     // TSInstantiationExpression
        return TraverseAST.multiTraverse(query, [node.expression, node.typeArguments]);
    }

    private static traverse_TSNonNullExpression(query: Query, node) {            // TSNonNullExpression
        return TraverseAST.multiTraverse(query, [node.expression]);
    }

    private static traverse_TSSatisfiesExpression(query: Query, node) {          // TSSatisfiesExpression
        return TraverseAST.multiTraverse(query, [node.expression, node.typeAnnotation]);
    }

    private static traverse_TSTypeAssertion(query: Query, node) {                // TSTypeAssertion
        return TraverseAST.multiTraverse(query, [node.typeAnnotation, node.expression]);
    }

    private static traverse_TaggedTemplateExpression(query: Query, node) {       // TaggedTemplateExpression
        return TraverseAST.multiTraverse(query, [node.typeArguments, node.tag, node.quasi]);
    }

    private static traverse_TemplateLiteral(query: Query, node) {                // TemplateLiteral
        return TraverseAST.multiTraverse(query, [node.quasis, node.expressions]);
    }

    private static traverse_ThisExpression(query: Query, node) {                 // ThisExpression
        return;
    }

    private static traverse_UnaryExpression(query: Query, node) {                // UnaryExpression
        return TraverseAST.multiTraverse(query, [node.argument]);
    }

    private static traverse_UpdateExpression(query: Query, node) {               // UpdateExpression
        return TraverseAST.multiTraverse(query, [node.argument]);
    }

    private static traverse_YieldExpression(query: Query, node) {                // YieldExpression
        return TraverseAST.multiTraverse(query, [node.argument]);
    }

    private static traverse_Literal(query: Query, node) {                        // Literal
        return;
    }

    ///////////////
    // PARAMETER //
    ///////////////

    private static traverse_ArrayPattern(query: Query, node) {                   // ArrayPattern
        return TraverseAST.multiTraverse(query, [node.elements, node.typeAnnotation, node.decorators]);
    }

    private static traverse_AssignmentPattern(query: Query, node) {              // AssignmentPattern
        return TraverseAST.multiTraverse(query, [node.left, node.right, node.typeAnnotation, node.decorators]);
    }

    private static traverse_ObjectPattern(query: Query, node) {                  // ObjectPattern
        return TraverseAST.multiTraverse(query, [node.properties, node.typeAnnotation, node.decorators]);
    }

    private static traverse_RestElement(query: Query, node) {                    // RestElement
        return TraverseAST.multiTraverse(query, [node.argument, node.typeAnnotation, node.value, node.decorators]);
    }

    private static traverse_TSParameterProperty(query: Query, node) {            // TSParameterProperty
        return TraverseAST.multiTraverse(query, [node.parameter, node.decorators]);
    }

    /////////////
    // ELEMENT //
    /////////////

    private static traverse_AccessorProperty(query: Query, node) {               // AccessorProperty
        return TraverseAST.multiTraverse(query, [node.key, node.value, node.decorators, node.typeAnnotation]);
    }

    private static traverse_MethodDefinition(query: Query, node) {              // MethodDefinition
        return TraverseAST.multiTraverse(query, [node.key, node.value, node.decorators]);
    }

    private static traverse_Property(query: Query, node) {                      // Property
        return TraverseAST.multiTraverse(query, [node.key, node.value]);
    }

    private static traverse_PropertyDefinition(query: Query, node) {            // PropertyDefinition
        return TraverseAST.multiTraverse(query, [node.key, node.value, node.decorators, node.typeAnnotation]);
    }

    private static traverse_SpreadElement(query: Query, node) {                 // SpreadElement
        return TraverseAST.multiTraverse(query, [node.argument]);
    }

    private static traverse_StaticBlock(query: Query, node) {                   // StaticBlock
        return TraverseAST.multiTraverse(query, [node.body]);
    }

    private static traverse_TSAbstractAccessorProperty(query: Query, node) {    // TSAbstractAccessorProperty
        return TraverseAST.multiTraverse(query, [node.key, node.value, node.decorators, node.typeAnnotation]);
    }

    private static traverse_TSAbstractMethodDefinition(query: Query, node) {   // TSAbstractMethodDefinition
        return TraverseAST.multiTraverse(query, [node.key, node.value, node.decorators]);
    }

    private static traverse_TSAbstractPropertyDefinition(query: Query, node) {  // TSAbstractPropertyDefinition
        return TraverseAST.multiTraverse(query, [node.key, node.value, node.decorators, node.typeAnnotation]);
    }

    private static traverse_TSCallSignatureDeclaration(query: Query, node) {     // TSCallSignatureDeclaration
        return TraverseAST.multiTraverse(query, [node.params, node.returnType, node.typeParameters]);
    }

    private static traverse_TSConstructSignatureDeclaration(query: Query, node) { // TSConstructSignatureDeclaration
        return TraverseAST.multiTraverse(query, [node.params, node.returnType, node.typeParameters]);
    }

    private static traverse_TSEnumMember(query: Query, node) {                   // TSEnumMember
        return TraverseAST.multiTraverse(query, [node.id, node.initializer]);
    }

    private static traverse_TSIndexSignature(query: Query, node) {               // TSIndexSignature
        return TraverseAST.multiTraverse(query, [node.parameters, node.typeAnnotation]);
    }

    private static traverse_TSMethodSignature(query: Query, node) {              // TSMethodSignature
        return TraverseAST.multiTraverse(query, [node.key, node.params, node.returnType, node.typeParameters]);
    }

    private static traverse_TSPropertySignature(query: Query, node) {            // TSPropertySignature
        return TraverseAST.multiTraverse(query, [node.key, node.typeAnnotation]);
    }

    /////////////
    // SPECIAL //
    /////////////

    private static traverse_CatchClause(query: Query, node) {                    // CatchClause
        return TraverseAST.multiTraverse(query, [node.param, node.body]);
    }

    private static traverse_ClassBody(query: Query, node) {                      // ClassBody
        return TraverseAST.multiTraverse(query, [node.body]);
    }

    private static traverse_Decorator(query: Query, node) {                      // Decorator
        return TraverseAST.multiTraverse(query, [node.expression]);
    }

    private static traverse_ExportSpecifier(query: Query, node) {                // ExportSpecifier
        return TraverseAST.multiTraverse(query, [node.local, node.exported]);
    }

    private static traverse_ImportAttribute(query: Query, node) {                // ImportAttribute
        return TraverseAST.multiTraverse(query, [node.key, node.value]);
    }

    private static traverse_ImportDefaultSpecifier(query: Query, node) {         // ImportDefaultSpecifier
        return TraverseAST.multiTraverse(query, [node.local]);
    }

    private static traverse_ImportNamespaceSpecifier(query: Query, node) {       // ImportNamespaceSpecifier
        return TraverseAST.multiTraverse(query, [node.local]);
    }

    private static traverse_ImportSpecifier(query: Query, node) {                // ImportSpecifier
        return TraverseAST.multiTraverse(query, [node.local, node.imported]);
    }

    private static traverse_PrivateIdentifier(query: Query, node) {              // PrivateIdentifier
        return;
    }

    private static traverse_SwitchCase(query: Query, node) {                     // SwitchCase
        return TraverseAST.multiTraverse(query, [node.test, node.consequent]);
    }

    private static traverse_TemplateElement(query: Query, node) {                // TemplateElement
        return;
    }

    private static traverse_TSClassImplements(query: Query, node) {              // TSClassImplements
        return TraverseAST.multiTraverse(query, [node.expression, node.typeArguments]);
    }

    private static traverse_TSExternalModuleReference(query: Query, node) {     // TSExternalModuleReference
        return TraverseAST.multiTraverse(query, [node.expression]);
    }

    private static traverse_TSInterfaceBody(query: Query, node) {                // TSInterfaceBody
        return TraverseAST.multiTraverse(query, [node.body]);
    }

    private static traverse_TSInterfaceHeritage(query: Query, node) {            // TSInterfaceHeritage
        return TraverseAST.multiTraverse(query, [node.expression, node.typeArguments]);
    }

    private static traverse_TSModuleBlock(query: Query, node) {                  // TSModuleBlock
        return TraverseAST.multiTraverse(query, [node.body]);
    }

    private static traverse_TSTypeAnnotation(query: Query, node) {               // TSTypeAnnotation
        return TraverseAST.multiTraverse(query, [node.typeAnnotation]);
    }

    private static traverse_TSTypeParameter(query: Query, node) {                // TSTypeParameter
        return TraverseAST.multiTraverse(query, [node.name, node.constraint, node.default]);
    }

    private static traverse_TSTypeParameterDeclaration(query: Query, node) {     // TSTypeParameterDeclaration
        return TraverseAST.multiTraverse(query, [node.params]);
    }

    private static traverse_TSTypeParameterInstantiation(query: Query, node) {   // TSTypeParameterInstantiation
        return TraverseAST.multiTraverse(query, [node.params]);
    }

    ///////////
    // TYPES //
    ///////////

    private static traverse_TSAbstractKeyword(query: Query, node) {              // TSAbstractKeyword
        return;
    }

    private static traverse_TSAnyKeyword(query: Query, node) {                   // TSAnyKeyword
        return;
    }

    private static traverse_TSArrayType(query: Query, node) {                    // TSArrayType
        return TraverseAST.multiTraverse(query, [node.elementType]);
    }

    private static traverse_TSAsyncKeyword(query: Query, node) {                 // TSAsyncKeyword
        return;
    }

    private static traverse_TSBigIntKeyword(query: Query, node) {                // TSBigIntKeyword
        return;
    }

    private static traverse_TSBooleanKeyword(query: Query, node) {               // TSBooleanKeyword
        return;
    }

    private static traverse_TSConditionalType(query: Query, node) {              // TSConditionalType
        return TraverseAST.multiTraverse(query, [node.checkType, node.extendsType, node.trueType, node.falseType]);
    }

    private static traverse_TSConstructorType(query: Query, node) {              // TSConstructorType
        return TraverseAST.multiTraverse(query, [node.params, node.returnType, node.typeParameters]);
    }

    private static traverse_TSDeclareKeyword(query: Query, node) {               // TSDeclareKeyword
        return;
    }

    private static traverse_TSExportKeyword(query: Query, node) {                // TSExportKeyword
        return;
    }

    private static traverse_TSFunctionType(query: Query, node) {                // TSFunctionType
        return TraverseAST.multiTraverse(query, [node.params, node.returnType, node.typeParameters]);
    }

    private static traverse_TSImportType(query: Query, node) {                   // TSImportType
        return TraverseAST.multiTraverse(query, [node.argument, node.qualifier, node.typeArguments]);
    }

    private static traverse_TSIndexedAccessType(query: Query, node) {            // TSIndexedAccessType
        return TraverseAST.multiTraverse(query, [node.objectType, node.indexType]);
    }

    private static traverse_TSInferType(query: Query, node) {                    // TSInferType
        return TraverseAST.multiTraverse(query, [node.typeParameter]);
    }

    private static traverse_TSIntersectionType(query: Query, node) {            // TSIntersectionType
        return TraverseAST.multiTraverse(query, [node.types]);
    }

    private static traverse_TSIntrinsicKeyword(query: Query, node) {             // TSIntrinsicKeyword
        return;
    }

    private static traverse_TSLiteralType(query: Query, node) {                  // TSLiteralType
        return TraverseAST.multiTraverse(query, [node.literal]);
    }

    private static traverse_TSMappedType(query: Query, node) {                   // TSMappedType
        return TraverseAST.multiTraverse(query, [node.typeParameter, node.typeAnnotation, node.nameType]);
    }

    private static traverse_TSNamedTupleMember(query: Query, node) {             // TSNamedTupleMember
        return TraverseAST.multiTraverse(query, [node.elementType, node.label]);
    }

    private static traverse_TSNeverKeyword(query: Query, node) {                 // TSNeverKeyword
        return;
    }

    private static traverse_TSNullKeyword(query: Query, node) {                  // TSNullKeyword
        return;
    }

    private static traverse_TSNumberKeyword(query: Query, node) {                // TSNumberKeyword
        return;
    }

    private static traverse_TSObjectKeyword(query: Query, node) {                // TSObjectKeyword
        return;
    }

    private static traverse_TSOptionalType(query: Query, node) {                // TSOptionalType
        return TraverseAST.multiTraverse(query, [node.typeAnnotation]);
    }

    private static traverse_TSPrivateKeyword(query: Query, node) {               // TSPrivateKeyword
        return;
    }

    private static traverse_TSProtectedKeyword(query: Query, node) {             // TSProtectedKeyword
        return;
    }

    private static traverse_TSPublicKeyword(query: Query, node) {                // TSPublicKeyword
        return;
    }

    private static traverse_TSQualifiedName(query: Query, node) {                // TSQualifiedName
        return TraverseAST.multiTraverse(query, [node.left, node.right]);
    }

    private static traverse_TSReadonlyKeyword(query: Query, node) {              // TSReadonlyKeyword
        return;
    }

    private static traverse_TSRestType(query: Query, node) {                    // TSRestType
        return TraverseAST.multiTraverse(query, [node.typeAnnotation]);
    }

    private static traverse_TSStaticKeyword(query: Query, node) {                // TSStaticKeyword
        return;
    }

    private static traverse_TSStringKeyword(query: Query, node) {               // TSStringKeyword
        return;
    }

    private static traverse_TSSymbolKeyword(query: Query, node) {               // TSSymbolKeyword
        return;
    }

    private static traverse_TSTemplateLiteralType(query: Query, node) {         // TSTemplateLiteralType
        return TraverseAST.multiTraverse(query, [node.quasis, node.types]);
    }

    private static traverse_TSThisType(query: Query, node) {                    // TSThisType
        return;
    }

    private static traverse_TSTupleType(query: Query, node) {                   // TSTupleType
        return TraverseAST.multiTraverse(query, [node.elementTypes]);
    }

    private static traverse_TSTypeLiteral(query: Query, node) {                 // TSTypeLiteral
        return TraverseAST.multiTraverse(query, [node.members]);
    }

    private static traverse_TSTypeOperator(query: Query, node) {                // TSTypeOperator
        return TraverseAST.multiTraverse(query, [node.typeAnnotation]);
    }

    private static traverse_TSTypePredicate(query: Query, node) {               // TSTypePredicate
        return TraverseAST.multiTraverse(query, [node.parameterName, node.typeAnnotation]);
    }

    private static traverse_TSTypeQuery(query: Query, node) {                   // TSTypeQuery
        return TraverseAST.multiTraverse(query, [node.exprName, node.typeArguments]);
    }

    private static traverse_TSTypeReference(query: Query, node) {               // TSTypeReference
        return TraverseAST.multiTraverse(query, [node.typeArguments, node.typeName]);
    }

    private static traverse_TSUndefinedKeyword(query: Query, node) {            // TSUndefinedKeyword
        return;
    }

    private static traverse_TSUnionType(query: Query, node) {                   // TSUnionType
        return TraverseAST.multiTraverse(query, [node.types]);
    }

    private static traverse_TSUnknownKeyword(query: Query, node) {              // TSUnknownKeyword
        return;
    }

    private static traverse_TSVoidKeyword(query: Query, node) {                 // TSVoidKeyword
        return;
    }

    /////////
    // JSX //
    /////////

    private static traverse_JSXAttribute(query: Query, node) {                   // JSXAttribute
        return TraverseAST.multiTraverse(query, [node.name, node.value]);
    }

    private static traverse_JSXClosingElement(query: Query, node) {              // JSXClosingElement
        return TraverseAST.multiTraverse(query, [node.name]);
    }

    private static traverse_JSXClosingFragment(query: Query, node) {             // JSXClosingFragment
        return;
    }

    private static traverse_JSXEmptyExpression(query: Query, node) {            // JSXEmptyExpression
        return;
    }

    private static traverse_JSXExpressionContainer(query: Query, node) {        // JSXExpressionContainer
        return TraverseAST.multiTraverse(query, [node.expression]);
    }

    private static traverse_JSXIdentifier(query: Query, node) {                  // JSXIdentifier
        return;
    }

    private static traverse_JSXMemberExpression(query: Query, node) {            // JSXMemberExpression
        return TraverseAST.multiTraverse(query, [node.object, node.property]);
    }

    private static traverse_JSXNamespacedName(query: Query, node) {              // JSXNamespacedName
        return TraverseAST.multiTraverse(query, [node.namespace, node.name]);
    }

    private static traverse_JSXOpeningElement(query: Query, node) {              // JSXOpeningElement
        return TraverseAST.multiTraverse(query, [node.typeArguments, node.name, node.attributes]);
    }

    private static traverse_JSXOpeningFragment(query: Query, node) {             // JSXOpeningFragment
        return;
    }

    private static traverse_JSXSpreadAttribute(query: Query, node) {             // JSXSpreadAttribute
        return TraverseAST.multiTraverse(query, [node.argument]);
    }

    private static traverse_JSXSpreadChild(query: Query, node) {                 // JSXSpreadChild
        return TraverseAST.multiTraverse(query, [node.expression]);
    }

    private static traverse_JSXText(query: Query, node) {                        // JSXText
        return;
    }
}