/**
 * @todo add `NestedKeyOf<T>[]` of properties to skip and format option.
 */
export const convertObjToGraphqlQuery = <T extends Record<string, any>>(obj: T): string => {
  return Object.entries(obj)
    .map(([key, value]) => {
      if (typeof value !== 'object') return key;
      if (value === null) return key;
      if (Array.isArray(value)) {
        if (value.length === 0) return;
        return `${key} {\n\t${convertObjToGraphqlQuery(value[0])}\n\t}`;
      }
      return `${key} {\n\t${convertObjToGraphqlQuery(value)}\n\t}`;
    })
    .filter(Boolean)
    .join('\n');
};
