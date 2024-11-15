import { getAST } from "../../src/ast/Parser";
import { TraverseAST } from "../../src/traverse"
import { parseCLI } from "../../src/base_cli";
import { UncontrolledAliasingQuery } from "./UncontrolledAliasingQuery"
import * as fs from 'fs';
import * as path from 'path';

const file = parseCLI(process.argv);
const ast = getAST(file);

const ua_query = new UncontrolledAliasingQuery();
ua_query.run(ast);

const outputFilePath = path.resolve(__dirname, '../../outputs/OutputUncontrolledAliasing.txt');
try {
    fs.writeFileSync(outputFilePath, JSON.stringify(ua_query.getState().getUncontrolledAliasing()));
} catch (err) {
    console.error(err);
}