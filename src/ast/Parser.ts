import * as fs from "fs";
import { parse } from '@typescript-eslint/typescript-estree';

function readJSONFile(path: string): JSON {
    try {
        const data = fs.readFileSync(path);
        return JSON.parse(data.toString(), (key, value) => {
            if (typeof value === 'string' && value.endsWith('_bigint')) {
                return BigInt(value.slice(0, -7));
            }
            return value;
        });
    } catch (e: any) {
        console.log("Bad JSON format: " + e.toString());
        process.exit(1);
    }
}

function fileExtension(path: string): string {
    let split = path.split('.');
    return split[split.length - 1];
}

export function getAST(path: string) {

    let extension: string = fileExtension(path);

    if (extension.toLowerCase() == "json") {
        return readJSONFile(path)
    }
    else {
        extension as "ts";
        const ast = parse(fs.readFileSync(path).toString(), {
            allowInvalidAST: true,
            // loc: true,
            range: true,
        });

        return ast;
    }
}