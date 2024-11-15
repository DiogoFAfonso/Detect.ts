import * as fs from "fs";
import { getAST } from "./Parser";

var filename = process.argv[2];
var out = getAST(filename);

fs.writeFile(getFilename(filename) + '_AST.json', JSON.stringify(out, (key, value) =>
    typeof value === 'bigint'
        ? value.toString() + '_bigint'
        : value, 4),
    function (err) {
        if (err) {
            return console.error(err);
        }
        console.log("=> AST file created");
    });


function getFilename(file: string) {
    console.log(file);
    return file.split('.ts')[0];
}