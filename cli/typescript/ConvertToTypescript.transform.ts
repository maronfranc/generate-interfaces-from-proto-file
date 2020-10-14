import { Transform, TransformCallback, TransformOptions } from "stream";
import { allNumberTypes } from "../protoTypes";
import { firstLetterLowerCase } from "../utils/format";

const rxAllNumberTypes = new RegExp(`(${allNumberTypes.join("|")})`, "g");
const groupTypeAndVariableName = new RegExp(`(${allNumberTypes.join("|")}|\\w+)\\s+(\\w+)\\s*=\\s*\\d+`, "g");

const replaceProtoToTypescript = (str: string): string => str
    .replace("syntax = \"proto3\";", "")
    .replace("package checkout;", "")
    .replace(/rpc\s*(\w+)\s*\((\w+)\)\s*returns\s*\((\w+)\);/g, (
        _match: string,
        functionName: string,
        paramTypeName: string,
        returnTypeName: string
    ): string => {
        return `${firstLetterLowerCase(functionName)}: (${firstLetterLowerCase(paramTypeName)}: ${paramTypeName}, metadata?: Metadata) => Observable<${returnTypeName}>;`
    })
    // change to lowercase function name e param
    .replace(/(\w+):\s*\((\w+)\s*:\s*(\w+)\)\s*=>\s*Observable<(\w+)>;/g, "->L<-$1: (->L<-$2: $3) => Observable<$4>;")
    .replace(/->L<-(\w+)/g, (_, word: string): string => firstLetterLowerCase(word))
    // creates classes and interfaces
    .replace(/service/g, "export class")
    .replace(/message/g, "export interface")
    // changes words order
    .replace(groupTypeAndVariableName, "$2: $1")
    // convert snake_case to camelCase
    .replace(/([-_]\w)/g, (match: string): string => match[1].toUpperCase())
    // replace incorrects type names
    .replace(/bool/g, "boolean")
    .replace(rxAllNumberTypes, "number")
    .replace(/\w+\.(\w+):/g, "$1:")
    .replace(/import\s+(".+");/g, "")
    // add [] when starts with repeated word
    .replace(/repeated\s+(\w+):?\w*?\s(=\s*\d+|\w+)/g, "$1: $2[]")
    .replace(/enum\s*(\w+)\s*{\n(?:\s*(\w+)\s*=\s*(\d+);)+\s*\n\s*}/, (match: string): string => "export " + match.replace(/;/g, ","))
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
