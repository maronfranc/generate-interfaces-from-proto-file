import * as fs from "fs";

const ARGS = process.argv.slice(2);
const READ_FILE_PATH_AND_NAME = ARGS[0];
const WRITE_FILE_PATH_AND_NAME = ARGS[1];

function main() {
    const file = fs.createReadStream(READ_FILE_PATH_AND_NAME);
    const writableStream = fs.createWriteStream(WRITE_FILE_PATH_AND_NAME);
    
    file.pipe(writableStream);
}
main();
