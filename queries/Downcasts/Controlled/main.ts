import { getAST } from "../../../src/ast/Parser";
import { parseCLI } from "../../../src/base_cli";
import { ControlledDowncastQuery } from "./ControlledDowncastQuery"
import * as fs from 'fs';
import * as path from 'path';

const file = parseCLI(process.argv);
const ast = getAST(file);

const cd_query = new ControlledDowncastQuery();
cd_query.run(ast);

const outputFilePath = path.resolve(__dirname, '../../../outputs/OutputControlledDowncasts.txt');
try {
    fs.writeFileSync(outputFilePath, JSON.stringify(cd_query.getState().getControlledDowncasts()));
} catch (err) {
    console.error(err);
}