import { getAST } from "../../../src/ast/Parser";
import { parseCLI } from "../../../src/base_cli";
import { CounterObjectTypesUnionQuery } from "./CounterObjectTypesUnionQuery"
import * as fs from 'fs';
import * as path from 'path';

const file = parseCLI(process.argv);
const ast = getAST(file);

const cotu_query = new CounterObjectTypesUnionQuery();
cotu_query.run(ast);

const outputFilePath = path.resolve(__dirname, '../../../outputs/OutputCountObjectTypesUnion.txt');
try {
    fs.writeFileSync(outputFilePath, JSON.stringify(cotu_query.getState()));
}
catch (err) {
    console.error(err);
}