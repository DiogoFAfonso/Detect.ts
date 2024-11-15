import { getAST } from "../../../src/ast/Parser";
import { parseCLI } from "../../../src/base_cli";
import { CounterSumsQuery } from "./CounterSumsQuery"
import * as fs from 'fs';
import * as path from 'path';

const file = parseCLI(process.argv);
const ast = getAST(file);

const cs_query = new CounterSumsQuery();
cs_query.run(ast);

const outputFilePath = path.resolve(__dirname, '../../../outputs/OutputCountSums.txt');
try {
    fs.writeFileSync(outputFilePath, JSON.stringify(cs_query.getState()));
}
catch (err) {
    console.error(err);
}