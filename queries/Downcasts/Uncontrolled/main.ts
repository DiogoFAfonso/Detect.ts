import { getAST } from "../../../src/ast/Parser";
import { parseCLI } from "../../../src/base_cli";
import { UncontrolledDowncastQuery } from "./UncontrolledDowncastQuery"
import * as fs from 'fs';
import * as path from 'path';

const file = parseCLI(process.argv);
const ast = getAST(file);

const ud_query = new UncontrolledDowncastQuery();
ud_query.run(ast);

const outputFilePath = path.resolve(__dirname, '../../../outputs/OutputUncontrolledDowncasts.txt');
try {
    fs.writeFileSync(outputFilePath, JSON.stringify(ud_query.getState().getUncontrolledDowncasts()));
} catch (err) {
    console.error(err);
}