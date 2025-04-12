export interface SumOptions {
    /** An optional path to a nested array property. */
    path?: string;
    /** Whether to convert non-numerical values to 0. Default is `false`. */
    ignoreNaN?: boolean;
}

import { getProp } from "./object";

/** Get the sum of an array of numbers. Negative values subtract from the total.
 * @param arr The array to sum.
 * @param options Optional optioins. */
export function sum(arr: number[], options?: SumOptions): number {
    const _path = options?.path?.trim();

    // Map the array if a path is provided
    const _arr = _path ? arr.map(a => Number(getProp(a, _path))) : arr;

    return _arr.reduce((a, b) => {
        const invalid = isNaN(b) && !options?.ignoreNaN;
        if (invalid) throw new TypeError(`\'${b}\' is not a valid number`);
        return (isNaN(b) ? 0 : b) < 0 ? a - -b : a + (b || 0);
    }, 0);
}

/** Clamps a number within a specified range.
 * @param num Number to be clamped.
 * @param range The range to clamp. `min` defaults to 0. */
export function clamp(num: number, max: number): number;
export function clamp(num: number, range: { min?: number; max: number }): number;
export function clamp(num: number, range: { min?: number; max: number } | number): number {
    let _range = { min: 0, max: 0 };
    if (typeof range === "number") _range.max = range;
    else _range = { min: range.min || 0, max: range.max };
    return num < _range.min ? _range.min : num > _range.max ? _range.max : num;
}

/** Check if a number is within a specified range.
 * @param num The number to check.
 * @param range The range to check. `min` defaults to 0. */
export function inRange(num: number, max: number): boolean;
export function inRange(num: number, range: { min?: number; max: number }): boolean;
export function inRange(num: number, range: { min?: number; max: number } | number): boolean {
    let _range = { min: 0, max: 0 };
    if (typeof range === "number") _range.max = range;
    else _range = { min: range.min || 0, max: range.max };
    return num >= _range.min && num <= _range.max;
}

/** Get the percentage value between two numbers.
 * @param a The numerator.
 * @param b The denominator.
 * @param round Whether to round the result to the nearest integer.
 *
 * @example
 * percent(50, 100) --> 50 // 50%
 * percent(30, 40) --> 75 // 75% */
export function percent(a: number, b: number, round: boolean = true): number {
    return round ? Math.floor((a / b) * 100) : (a / b) * 100;
}

/** Converts seconds to milliseconds.
 * @param sec The number of seconds to convert.
 * @param round Whether to round the result to the nearest integer. */
export function secToMs(sec: number, round: boolean = true): number {
    return round ? Math.floor(sec * 1000) : sec * 1000;
}

/** Convert milliseconds to seconds.
 * @param ms The number of milliseconds to convert.
 * @param round Whether to round the result to the nearest integer. */
export function msToSec(ms: number, round: boolean = true): number {
    return round ? Math.floor(ms / 1000) : ms / 1000;
}

/** Format a number adding a decimal point to each thousand's place.
 * @param num The number to format.
 * @param sep The decimal point to use.
 *
 * @example
 * formatThousands(1000) --> "1,000"
 * formatThousands(1000, ".") --> "1.000" */
export function formatThousands(num: number, sep: string = ","): string {
    return `${num}`.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, sep);
}

/** Format a number into a short, human-readable string.
 * @param num The number to format.
 * @param units Custom unit names to use.
 * @example
 * formatNumber(1000) -> "1k"
 * formatNumber(1000000) -> "1mil"
 * formatNumber(1000000000) -> "1bil"
 * formatNumber(1000, [" thou", " mill", " bill"]) -> "1 thou"
 * @copyright *Utility modified by **@fujimori_***  */
export function formatLargeNumber(num: number, units: [string, string, string] = ["k", "M", "B"]): string {
    if (num < 1000) return num.toString();
    const i = Math.floor(Math.log10(num) / 3);
    const val = num / Math.pow(1000, i);
    return (
        val
            .toFixed(val >= 10 ? 1 : 2)
            .replace(/\.0+$/, "")
            .replace(/\.$/, "") + units[i - 1]
    );
}

/** Format a number to an ordinal number (e.g. 1 -> "1st", 2 -> "2nd", 3 -> "3rd", 4 -> "4th").
 * @param input The number to format.
 * @param useLocale Whether to use the user's locale for formatting the number.
 * @copyright *Utility modified by **@fujimori_*** */
export function toOrdinal(input: number | string, useLocale = false): string {
    const num = typeof input === "string" ? parseFloat(input) : Number(input);
    if (isNaN(num)) throw TypeError("Invalid input");

    const suffix = ["st", "nd", "rd"][(((num % 10) + 10) % 10) - 1] || "th";
    return (useLocale ? num.toLocaleString() : num.toString()) + suffix;
}

/** Format a memory size in bytes into a human-readable string.
 * @param bytes The number of bytes to format.
 * @param decimals The number of decimal places to round the result to.
 * @example
 * formatMemory(1024) --> "1.0 KB"
 * formatMemory(1024000) --> "1.0 MB"
 * @copyright *Utility created by **@fujimori_***
 * @returns A human-readable representation of the memory size. */
export function formatMemory(
    bytes: number,
    decimals: number = 1,
    units: [string, string, string, string, string, string, string, string, string] = [
        "B",
        "KB",
        "MB",
        "GB",
        "TB",
        "PB",
        "EB",
        "ZB",
        "YB"
    ]
): string {
    return `${(bytes / Math.pow(1024, Math.floor(Math.log2(bytes / 1024)))).toFixed(decimals)} ${
        units[Math.floor(Math.log2(bytes / 1024))]
    }`;
}
