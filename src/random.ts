import { randomBytes } from "node:crypto";
import { betterMap } from "./array";
import { getProp } from "./object";

// prettier-ignore
const alphabet = [
    "a", "b", "c", "d",
    "e", "f", "g", "h",
    "i", "j", "k", "l",
    "m", "n", "o", "p",
    "q", "r", "s", "t",
    "u", "v", "w", "x",
    "y", "z"
];

export class SecureRandom {
    static float() {
        const buffer = randomBytes(4);
        const randomInt = buffer.readUInt32BE(0);
        return randomInt / (0xffffffff + 1);
    }
}

/** Choose a pseudo-random number within a min-max range.
 * @param min Minimum value.
 * @param max Maximum value.
 * @param round Round up the sum. */
export function randomNumber(min: number, max: number, round: boolean = true): number {
    let sum = min + (max - min) * Math.random();
    return round ? Math.round(sum) : sum;
}

/** Create a pseudo-random string of numbers [0-9] for the given length.
 * @param len The length of the string. */
export function numberString(len: number): string {
    let str = "";
    for (let i = 0; i < len; i++) str += randomNumber(0, 9);
    return str;
}

/** Create a pseudo-random string of letters [a-zA-Z] for the given length.
 * @param len The length of the string.
 * @param includeUpper Include uppercase letters in the string. Default is `false`. */
export function alphaString(len: number, includeUpper: boolean = false): string {
    let str = "";
    for (let i = 0; i < len; i++) str += includeUpper && chance() ? choice(alphabet).toUpperCase() : choice(alphabet);
    return str;
}

/** Create a pseudo-random alphanumeric string [a-zA-Z0-9] of the specified length.
 * @param len The length of the string.
 * @param includeUpper Include uppercase letters in the string. Default is `false`. */
export function alphaNumericString(len: number, includeUpper: boolean = false): string {
    let str = "";
    for (let i = 0; i < len; i++) {
        const char = chance() ? choice(alphabet) : randomNumber(0, 9).toString();
        str += includeUpper && chance() ? char.toUpperCase() : char;
    }
    return str;
}

/** Create a pseudo-random chance based on the given percentage.
 * @param percent The percentage chance of success. Must be between 1 and 100. Default is `50`.*/
export function chance(percent: number = 50): boolean {
    if (percent < 1 || percent > 100) throw new Error(`\`${percent}\` must be within a range of 1 and 100`);
    return randomNumber(0, 100) < percent;
}

/** Choose a pseudo-random item from an array.
 * @param arr Array of items to choose from.
 * @param copy Return a deep copy of the array using {@link structuredClone}. */
export function choice<T>(arr: T[], copy: boolean = false): T {
    let item = arr[randomNumber(0, arr.length - 1)];
    return copy ? structuredClone(item) : item;
}

/** Return a pseudo-random index from the given array.
 * @param arr The array to generate an index for. */
export function choiceIndex(arr: any[]): number {
    return randomNumber(0, arr.length - 1);
}

/** Choose a pseudo-random item from an array by weighted rarity.
 * @param arr The array of items to choose from.
 * @param path The nested property path to calculate weights. By default, the item in the current index is used.
 * @param copy Whether to return a copy of the chosen item. Default is `false`. */
export function choiceWeighted<T extends any[]>(arr: T, path = "", copy = false): T[number] {
    // Calculate the weight of each element in the array
    let weights = betterMap(arr, (item, { lastElement }) => {
        const prop: any = path.length ? getProp(item, path) : item;
        if (typeof prop !== "number") throw new TypeError(`\`${path}\` must lead to a number property in the array`);
        return (prop as number) + (lastElement || 0);
    });

    // Generates a random float and multiplies it by the largest sum in the array of weights
    const decider = Math.random() * weights[weights.length - 1];

    // Returns the first item in the original array that has a rarity higher than or equal to decider
    /* NOTE: how this picks a random item from that rarity I still have no idea, but at least it's less work for me, lol */
    const item = arr[weights.findIndex(w => w >= decider)];
    return copy ? structuredClone(item) : item;
}

export function choiceProbability<T extends Record<string, any>, P extends keyof T>(
    items: T[],
    path: P,
    copy?: boolean
): T | null {
    if (!items.length) return null;

    /* Filter out non-numbers and 0 weight */
    const validItems = items.filter(i => !isNaN(i[path]) && i[path]);
    if (!validItems.length) return null;

    // Validate range
    for (const item of validItems) {
        if (item[path] < 0 || item[path] > 1) {
            throw new Error(`Weight ${item[path]} is out of range [0, 1]`);
        }
    }

    // Generate the probability
    const probability = SecureRandom.float();

    /* Pick candidates from the item array that are weight >= probability */
    const candidates: T[] = [];
    for (const item of validItems) {
        if (probability <= item[path]) {
            candidates.push(item);
        }
    }

    // Sort by weight ascending (lowest first) to get items closest to probability
    candidates.sort((a, b) => a[path] - b[path]);

    // Get the lowest weight among candidates (closest to probability threshold)
    const lowestWeight = candidates[0]?.[path];

    // Filter to only items with the lowest weight (most precise rarity match)
    const closestCandidates = candidates.filter(item => item[path] === lowestWeight);

    // Pick the result
    let result: T =
        closestCandidates.length > 1
            ? (closestCandidates[Math.floor(SecureRandom.float() * closestCandidates.length)] as T)
            : (closestCandidates[0] as T);

    // Fallback to guarantee the most common item
    result ??= validItems.reduce((prev, curr) => {
        return prev[path] > curr[path] ? prev : curr;
    });

    // Return the result
    return copy ? structuredClone(result) : result;
}
