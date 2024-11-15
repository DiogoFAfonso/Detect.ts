# Detect.ts

*Detect.ts* is a TypeScript library designed to detect syntactic patterns in codebases. It offers predefined queries to identify unsafe patterns and their mitigation strategies. These queries were specifically created to study the frequency of unsafe patterns and their mitigation strategies in real-world TypeScript projects.


## Installation

Clone the project

```bash
  git clone https://github.com/DiogoFAfonso/Detect.ts
```

Go to the project directory

```bash
  cd Detect.ts
```

Install dependencies

```bash
  npm install
```

You're ready to go!


## Usage

### Running Predefined Queries

If you just want to run the predefined queries, you can use the provided npm scripts. For example, to run the **Uncontrolled Dynamic Accesses** query, simply execute the following command:

```bash
npm run UncontrolledDynamicAccess input_file.ts
```

Below is a list of available npm scripts for each query:
- **Controlled Dynamic Accesses** – `npm run ControlledDynamicAccess input_file.ts`
- **Uncontrolled Dynamic Accesses** – `npm run UncontrolledDynamicAccess input_file.ts`
- **Controlled Downcasts** – `npm run ControlledDowncast input_file.ts`
- **Uncontrolled Downcasts** – `npm run UncontrolledDowncast input_file.ts`
- **Union-Type Property Updates** – `npm run UnionTypePropMod input_file.ts`
- **Unsafe Object Aliasing** – `npm run UnsafeAliasing input_file.ts`

### Creating a New Query

First, create a new folder inside the `queries` folder for your query. In this new folder, create a TypeScript file that will define your query. This file should contain a class that extends the base `Query` class.

Within this class, define an internal state that will be maintained during the traversal of the TypeScript AST. Then, for each node relevant to the analysis you want to perform, create entry and/or exit methods. These methods are used to update or inspect the state of the query when the traversal enters or exits the respective node. The AST used is from the [TypeScript ESLint parser](https://typescript-eslint.io/packages/parser/), and the AST format follows the ESTree specification. For more information about the structure of the nodes generated in the AST, see the [ESTree specification](https://github.com/estree/estree).

For reference, you can check the `queries/Toy` folder to see examples of how to set up your query, structure the class, and implement the methods.