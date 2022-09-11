/**
 * Stringify object removing properties quotes.
 * @see https://stackoverflow.com/a/11233515
 */
const objectToGraphqlString = (object: Record<string, any>): string => {
  const json = JSON.stringify(object, null, 2);
  return json.replace(/"([^"]+)":/g, '$1:');
};

interface BuildGraphqlQueryArgs {
  functionName: string;
  paramName?: string;
  input: Record<string, any>;
  // TODO: returnKeys: string[];
}

const DEFAULT_ARGS_NAME = 'data';

export const buildGraphqlQuery = (args: BuildGraphqlQueryArgs) => {
  const { functionName, paramName = DEFAULT_ARGS_NAME, input } = args;
  return {
    query: `{
      ${functionName}(${paramName}: ${objectToGraphqlString(input)}) {
        todo
      }
    }`,
  };
};
