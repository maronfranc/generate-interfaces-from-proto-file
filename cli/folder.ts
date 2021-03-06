import * as fs from "fs";
import { generateTypescript } from "./typescript/generateTypescript";

export interface IPath {
    readFrom: string;
    writeTo: string;
}

const ARGS = process.argv.slice(2);
const READ_FOLDER_PATH = ARGS[0];
const WRITE_FILE_PATH = ARGS[1];
const foldersToRead: IPath[] = [];

function generateFolder(readFolderPath: IPath) {
    if (!fs.existsSync(readFolderPath.writeTo)) {
        fs.mkdirSync(readFolderPath.writeTo);
    }

    const files = fs.readdirSync(readFolderPath.readFrom);
    files.forEach(fileOrFolder => {
        const stat = fs.statSync(`${readFolderPath.readFrom}/${fileOrFolder}`);
        if (!stat.isDirectory()) {
            const fileTs = fileOrFolder.replace(/(.*)(.proto)$/, (_match, filename): string => {
                const camelCaseFileName = filename.replace(/([-_]\w)+/g, (match: string): string => match[1].toUpperCase());
                return `${camelCaseFileName}.ts`;
            });
            generateTypescript({
                readFrom: `${readFolderPath.readFrom}/${fileOrFolder}`,
                writeTo: `${readFolderPath.writeTo}/${fileTs}`,
            });
        } else {
            foldersToRead.push({
                readFrom: `${readFolderPath.readFrom}/${fileOrFolder}`,
                writeTo: `${readFolderPath.writeTo}/${fileOrFolder}`
            });
        }
    });

    if (foldersToRead.length > 0) {
        const folderPaths = foldersToRead.pop();
        generateFolder(folderPaths);
    }
}

generateFolder({
    readFrom: READ_FOLDER_PATH,
    writeTo: WRITE_FILE_PATH
});
