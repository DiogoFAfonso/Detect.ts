import { getAST } from "../../src/ast/Parser";
import { parseCLI } from "../../src/base_cli";
import { UnionTypePropModificationQuery } from "./UnionTypePropModificationQuery"
import * as fs from 'fs';
import * as path from 'path';

const file = parseCLI(process.argv);
const ast = getAST(file);

const utpm_query = new UnionTypePropModificationQuery();
utpm_query.run(ast);

const outputFilePath = path.resolve(__dirname, '../../outputs/OutputUnionTypePropertiesModifications.txt');
try {
    fs.writeFileSync(outputFilePath, JSON.stringify(utpm_query.getState().getUnionTypePropModifications()));
} catch (err) {
    console.error(err);
}