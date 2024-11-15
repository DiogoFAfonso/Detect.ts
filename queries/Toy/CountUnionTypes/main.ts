import { getAST } from "../../../src/ast/Parser";
import { parseCLI } from "../../../src/base_cli";
import { CounterUnionTypesQuery } from "./CounterUnionTypesQuery"
import * as fs from 'fs';
import * as path from 'path';

const file = parseCLI(process.argv);
const ast = getAST(file);

const cut_query = new CounterUnionTypesQuery();
cut_query.run(ast);

const outputFilePath = path.resolve(__dirname, '../../../outputs/OutputCountUnionTypes.txt');
try {
    fs.writeFileSync(outputFilePath, JSON.stringify(cut_query.getState()));
}
catch (err) {
    console.error(err);
}