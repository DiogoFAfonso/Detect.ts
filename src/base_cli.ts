function printUsage() {
    const str = "=================== Detect.ts TypeScript Pattern Detection ===================\n\n" +
        "Usage (if added in npm scripts): npm run [query] <target_file>.[ts|json]   or\n" +
        "  (if not added in npm scripts): ts-node [query_path]/main.ts"
    console.log(str);
}

export function parseCLI(args: string[]) {
    if (args.length < 3) {
        console.log("Missing target file path...\n")
        printUsage();
        process.exit(1);
    }
    return args[2];
}