import { IPath } from "./folder";
import { generateTypescript } from "./typescript/generateTypescript";

const ARGS = process.argv.slice(2);
const READ_FILE_PATH_AND_NAME = ARGS[0];
const WRITE_FILE_PATH_AND_NAME = ARGS[1];

export function generateFile(filePath: IPath) {
    generateTypescript(filePath);
}

generateFile({
    readFrom: READ_FILE_PATH_AND_NAME,
    writeTo: WRITE_FILE_PATH_AND_NAME
});
