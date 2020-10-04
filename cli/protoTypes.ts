export const unsignedNumbers = ["uint32", "uint64"] as const;
export const decimalNumbers = ["float", "double"] as const;
export const numbers = ["int32", "int64", "sint64", "sint32", "sfixed32", "sfixed64", "fixed32", "fixed64",] as const;
export const allNumberTypes = [...unsignedNumbers, ...decimalNumbers, ...numbers] as const;
export const protoVariableTypes = ["bool", "bytes", "enum", "string", ...numbers, ...unsignedNumbers, ...decimalNumbers] as const;
export const oneOf = "oneof";
