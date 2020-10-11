
import { Transform, TransformCallback, TransformOptions } from "stream";

const IMPORT_LIST = [
    'import { Metadata } from "grpc";',
    'import { Observable } from "rxjs";',
] as const;

export class ImportTransform extends Transform {
    constructor(options?: TransformOptions) {
        super(options);
    }

    _transform(chunk: any, _encoding: BufferEncoding, _callback: TransformCallback): void {
        let fileText = chunk.toString();
        const textWithValidation = IMPORT_LIST.join("\n") + "\n\n" + fileText;
        const convertedChunk = Buffer.from(textWithValidation);
        this.push(convertedChunk);
    }
}
