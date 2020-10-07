import { Transform, TransformCallback, TransformOptions } from "stream";
import { allNumberTypes } from "../protoTypes";

const rxAllNumberTypes = new RegExp(`(${allNumberTypes.join("|")})`, "g");
const groupTypeAndVariableName = new RegExp(`(${allNumberTypes.join("|")}|\\w+)\\s+(\\w+)\\s*=\\s*\\d+`, "g");

const replaceProtoToTypescript = (str: string): string => str
    // erases proto file syntax
    .replace("syntax = \"proto3\";", "")
    .replace("package checkout;", "")
    .replace(/rpc\s*(\w+)\s*\((\w+)\)\s*returns\s*\((\w+)\);/g, "$1: ($2: $2) => Observable<$3>;")
    // change to lowercase function name e param
    .replace(/(\w+):\s*\((\w+)\s*:\s*(\w+)\)\s*=>\s*Observable<(\w+)>;/g, "->L<-$1: (->L<-$2: $3) => Observable<$4>;")
    .replace(/->L<-(\w+)/g, (_, word: string): string => word[0].toLowerCase() + word.substring(1))
    // creates classes and interfaces
    .replace(/service/g, "export class")
    .replace(/message/g, "export interface")
    .replace(/enum/g, "// TODO: enum convertion\nexport enum")
    // add [] when starts with repeated word
    .replace(/repeated\s+(\w+)\s+(\w+):?\w*?\s(=\s*\d+|\w+)/g, "$2: $1[]")
    // changes words order
    .replace(groupTypeAndVariableName, "$2: $1")
    // replace incorrects type names
    .replace(/bool/g, "boolean")
    .replace(rxAllNumberTypes, "number")
    // Failed enum attempts
    // .replace(/enum\s+(\w+)\s*{(\s*(\w+)\s*=\s*(\d+);\s*)+\}/g, "enum $1 {\n\t$2 = $3,\n}")
    // .replace(/enum\s*(\w+)\s*{\n(?:\s*(\w+)\s*=\s*(\d+);)+\s*\n\s*}/, "enum $1 {\n\t$2 = $3,\n}")
    .trim();


export class ConvertToTypescriptTransform extends Transform {
    constructor(options?: TransformOptions) {
        super(options);
    }

    _transform(chunk: any, _encoding: BufferEncoding, _callback: TransformCallback): void {
        const fileText = chunk.toString();
        const converted = replaceProtoToTypescript(fileText);
        const convertedChunk = Buffer.from(converted);
        this.push(convertedChunk);
    }
}
