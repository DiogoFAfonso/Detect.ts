import { getAST } from "../../../src/ast/Parser";
import { parseCLI } from "../../../src/base_cli";
import { UncontrolledDynamicAccessQuery } from "./UncontrolledDynamicAccessQuery"
import * as fs from 'fs';
import * as path from 'path';

const file = parseCLI(process.argv);
const ast = getAST(file);

const uda_query = new UncontrolledDynamicAccessQuery();
uda_query.run(ast);

const outputFilePath = path.resolve(__dirname, '../../../outputs/OutputUncontrolledDynamicAccesses.txt');
try {
    fs.writeFileSync(outputFilePath, JSON.stringify(uda_query.getState().getUncontrolledDynamicAccesses()));
} catch (err) {
    console.error(err);
}