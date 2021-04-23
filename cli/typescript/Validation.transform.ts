import { Transform, TransformCallback, TransformOptions } from "stream";

const addValidation = (str: string): string => str
    .replace(/\/\/ @IsOptional\(\)\s+(\w+)/g, "$1?")

export class ValidationTransform extends Transform {
    constructor(options?: TransformOptions) {
        super(options);
    }

    _transform(chunk: any, _encoding: BufferEncoding, _callback: TransformCallback): void {
        const fileText = chunk.toString();
        const converted = addValidation(fileText) + "\n";
        const convertedChunk = Buffer.from(converted);
        this.push(convertedChunk);
    }
}
