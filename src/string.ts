/** Escape all special regex characters in the given string.
 * @param str - The string to escape. */
export function escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Split a string by whitespace and return the substring after the specified flag.
 * @param str - The string to parse.
 * @param flag - A string or expression to look for.
 * @param length - Max length of the substring. If omitted, will return everything after the flag. */
export function getFlagSubstring(str: string, flag: string | RegExp, length?: number): string | null {
    const split = str.split(" ");
    const findIndex = split.findIndex(s =>
        flag instanceof RegExp ? !!s.match(flag) : !!s.match(new RegExp(`${escapeRegex(flag)}\\b`))
    );
    if (findIndex === -1) return null;

    return split.slice(findIndex, length ? findIndex + length : undefined).join(" ");
}

/** Check if a string contains the specified flag.
 * @param str - The string to parse.
 * @param flag - A string or expression to look for. */
export function hasFlag(str: string, flag: string | RegExp): boolean {
    if (flag instanceof RegExp) {
        return !!str.match(flag);
    }
    return !!str.match(new RegExp(`${escapeRegex(flag)}\\b`));
}

/** Make the first letter of every alphanumeric word uppercase.
 * @param str The string to format. */
export function toTitleCase(str: string): string {
    return str.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase());
}

/** Format a string to "1337" speak.
 * @param str The string to format. */
export function toLeet(str: string): string {
    return str.replace(/a|A/g, "4").replace(/e|E/g, "3").replace(/i|I/g, "1").replace(/o|O/g, "0").replace(/t|T/g, "7");
}
