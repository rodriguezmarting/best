/**
 * Unparse a kebab text into natural language and capitalize each word
 * @param kebabString kebab text to unparse.
 * @returns Natural language version of the text with all capitalized words.
 *
 * @example
 * ```
 * // Prints "This Is An Example":
 * console.log(unKebab("this-is-an-example"));
 * ```
 */
export const unKebab = (kebabString?: string) => {
  const kebabUnparsed =
    kebabString?.replace(/-./g, (x) => " " + (x[1] || "").toUpperCase()) || "";

  const capitalized =
    kebabUnparsed.charAt(0).toUpperCase() + kebabUnparsed.slice(1);

  return capitalized;
};
