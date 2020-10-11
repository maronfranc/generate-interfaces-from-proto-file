import * as fs from "fs";
import { IPath } from "../folder";
import { ConvertToTypescriptTransform } from "./ConvertToTypescript.transform";
import { ImportTransform } from "./Import.transform";

export function generateTypescript(filePath: IPath) {
    const file = fs.createReadStream(filePath.readFrom);
    const writableStream = fs.createWriteStream(filePath.writeTo);

    const convertToTypescriptStream = new ConvertToTypescriptTransform();
    // const importStream = new ImportTransform();

    file
        .pipe(convertToTypescriptStream)
        // .pipe(importStream)
        .pipe(writableStream);
}
