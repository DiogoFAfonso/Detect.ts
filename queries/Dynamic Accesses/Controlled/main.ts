import { getAST } from "../../../src/ast/Parser";
import { parseCLI } from "../../../src/base_cli";
import { ControlledDynamicAccessQuery } from "./ControlledDynamicAccessQuery"
import * as fs from 'fs';
import * as path from 'path';

const file = parseCLI(process.argv);
const ast = getAST(file);

const cda_query = new ControlledDynamicAccessQuery();
cda_query.run(ast);

const outputFilePath = path.resolve(__dirname, '../../../outputs/OutputControlledDynamicAccesses.txt');
try {
    fs.writeFileSync(outputFilePath, JSON.stringify(cda_query.getState().getControlledDynamicAccesses()));
} catch (err) {
    console.error(err);
}