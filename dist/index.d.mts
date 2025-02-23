import { EventEmitter } from 'node:stream';

type AnyFunc = (...args: any) => any;
type LoopIntervalCallback = (loop: LoopInterval<AnyFunc>) => any;
interface LoopIntervalEvents {
    executed: [any];
    bumped: [any];
    started: [];
    stopped: [];
}
/** A wrapper of {@link setTimeout}. */
declare function sleep(ms: string | number): Promise<void>;
declare class LoopInterval<T extends LoopIntervalCallback> {
    private running;
    private delay;
    EventEmitter: EventEmitter<LoopIntervalEvents>;
    private __eventEmitter;
    /** Run a function every interval. If the function is asyncronous, it will wait for completion.
     * @param fn The function that will be run.
     * @param delay The time to wait before running the function again.
     * @param immediate Whether to run the function immediately after initialization. Defaults to `true`.
     *
     * This parameter utilizes {@link __date.parseTime jsTools.parseTime}, letting you use "10s" or "1m 30s" instead of a number. */
    constructor(fn: T, delay: string | number, immediate?: boolean);
    /** Change the delay of the loop.
     * @param delay The delay.
     * This parameter utilizes {@link __date.parseTime jsTools.parseTime}, letting you use "10s" or "1m 30s" instead of a number. */
    setDelay(delay: string | number): this;
    /** Start the loop if it was stopped.
     * @param immediate Whether to start immediately. */
    start(immediate?: boolean): this;
    /** Stop the loop. */
    stop(): this;
    /** Manually trigger the callback. */
    execute(): this;
    /** Add a listener to call each time a cycle completes.
     * @param fn The function to call. */
    on(fn: (loop: LoopInterval<T>, ...args: any) => any): this;
    /** Add a listener to call once a cycle completes.
     * @param fn The function to call. */
    once(fn: (loop: LoopInterval<T>, ...args: any) => any): this;
    /** Remove a listener from the cycle.
     * @param fn The function to remove. */
    off(fn: (loop: LoopInterval<T>, ...args: any) => any): this;
}

type ForcedArray<T> = T extends any[] ? T : T[];
type NonNullableForcedArray<T> = T extends any[] ? T[number] extends infer U ? U extends null | undefined ? never : U : never : NonNullable<T>[];
interface ForceArrayOptions {
    /** Return a deep copy of the array using {@link structuredClone}. */
    copy?: boolean;
    /** Remove undefined and null values from the array. */
    filter?: boolean;
}
type BetterMapCallback<T extends any[]> = (item: T[number], extra: {
    idx: number;
    lastElement: T[number] | undefined;
    newArray: T[number][];
    originalArray: T;
}) => any;
type ToMapCallback<T extends any[]> = (item: T[number], extra: {
    idx: number;
    lastElement: T[number] | undefined;
    newMap: Map<any, any>;
    originalArray: T;
}) => {
    key: any;
    value: any;
};
/** Split an array into groups that don't exceed the given size.
 * @param {array} arr The array to split.
 * @param {number} size The max size before splitting.
 * @param {boolean} copy Return a deep copy of the array using {@link structuredClone}. */
declare function chunk<T extends any[]>(arr: T, size: number, copy?: boolean): T[];
/** Filter out duplicate items or items that contain the same nested property value in the given array.
 *
 * If a property path isn't provided, items will be sorted by direct comparison.
 *
 * Property paths utilize {@link __object.getProp getProp} which allows for advanced property paths.
 *
 * @example
 * ```ts
 * const arr = [
 *     { user: [{ id: 1 }, { id: 2 }] },
 *     { user: [{ id: 3 }, { id: 2 }] }
 * ];
 *
 * // Filters out items that contain the same 'id' value for the 2nd item of the 'user' array
 * console.log(unique(arr, "user[1].id"));
 *
 * // output: [{user: [{id: 1}, {id: 2}]}, {user: [{id: 3}]}]
 * ```
 * @param arr The array of items to filter.
 * @param prop The nested property within each item to filter by.
 * @param copy Return a deep copy of the array using {@link structuredClone}. */
declare function unique<T extends any[]>(arr: T, prop?: string, copy?: boolean): T;
/** Convert the given item into an array if it is not already.
 * @param item The item to be converted into an array.
 * @param options Optional settings for the conversion. */
declare function forceArray<T>(item: T, options: ForceArrayOptions & {
    filter: true;
}): NonNullableForcedArray<T>;
declare function forceArray<T>(item: T, options: ForceArrayOptions & {
    filter?: boolean;
}): ForcedArray<T>;
/** Similar to {@link Array.prototype.map}, but gives the callback access to the new array being constructed.
 * @param arr The array to map over.
 * @param callback The callback to run on each item in the array.
 * @param copy Return a deep copy of the array using {@link structuredClone}. */
declare function betterMap<T extends any[]>(arr: T, callback: BetterMapCallback<T>, copy?: boolean): T;
/** Similar to {@link Array.prototype.map}, but instead returns a {@link Map}.
 *
 * The callback is given access to the new map being constructed.
 * @param arr The array to map.
 * @param callback The callback to run on each item in the array.
 * @param copy Return a deep copy of the map's values using {@link structuredClone}. */
declare function toMap<T extends any[]>(arr: T, callback: ToMapCallback<T>, copy?: boolean): Map<any, any>;

interface ParseTimeOptions {
    /** Return "s" (seconds) or "ms" (milliseconds). */
    type?: "ms" | "s";
    /** Add `Date.now()` to the result. */
    fromNow?: boolean;
}
interface ETAOptions {
    /** The anchor to go off of, a unix timestamp in milliseconds. `Date.now()` is default */
    since?: number | string;
    /** Leaves out "ago" if the result is in the past. */
    ignorePast?: boolean;
    /** Returns `null` if `unix` is before `since`. */
    nullIfPast?: boolean;
    /** The number of decimal places to round the result to. `0` is default. */
    decimalLimit?: number;
}
/** Parse a string into either milliseconds or seconds.
 * @param str The string to parse.
 * @param options An optional object to configure the behavior of the function.
 *
 * @example
 * parse("1m") --> 60000
 * parse("1h 30m") --> 5400000
 *
 * parse("1h", { fromNow: true }) --> Date.now() + 3600000
 * parse("-1m", { type: "s" }) --> -60 */
declare function parseTime(str: string | number, options?: ParseTimeOptions): number;
/** Parses the time difference between a given Unix timestamp and a reference point into a human-readable string.
 * @param unix The Unix timestamp in milliseconds for which the time difference is calculated.
 * @param options An optional object to configure the behavior of the function.
 *
 * @example
 * eta(1703001733955) --> "1 hour" (from now)
 * eta(1702994533936, { nullIfPast: true }) --> null */
declare function eta(unix: number | string, options?: ETAOptions): string | null;
/** Parses the time difference between a given Unix timestamp and a reference point into a dynamic "H, M, and S" string format.
 * @param unix The Unix timestamp in milliseconds for which the time difference is calculated.
 * @param options An optional object to configure the behavior of the function.
 *
 * @example
 * etaHMS(1703001733955) // returns "1 hour, 0 minutes, and 0 seconds" (from now)
 * etaHMS(1702994533936, { nullIfPast: true }) // returns null */
declare function etaHMS(unix: number | string, options?: ETAOptions): string | null;
/** Format a unix timestamp into a dynamic "Y, MTH, D, H, M, and S" time string format.
 * @param unix The Unix timestamp in milliseconds for which the time difference is calculated.
 * @param options An optional object to configure the behavior of the function.
 *
 * @copyright *Code written by **@fujimori_*** */
declare function etaYMDHMS(unix: number | string, options?: ETAOptions): string | null;
/**Format a Unix timestamp into a dynamic "DD:HH:MM:SS" time string format.
 * @param unix The Unix timestamp in milliseconds to convert.
 * @param options An optional object to configure the behavior of the function.
 * @copyright *Code written by **@fujimori_*** */
declare function etaDigital(unix: number | string, options?: ETAOptions): string | null;

interface ReadDirOptions {
    /** Return nested files inside of the directory. */
    recursive?: boolean;
}
/** Get an array of file paths inside of a folder.
 * @param path The path to the folder.
 * @param options An optional object to configure the behavior of the function. */
declare function readDir(path: string, options?: ReadDirOptions): string[];

/** Get the sum of an array of numbers. Any negative numbers will subtract from the total.
 * @param arr The array to sum.
 * @param path The path to a nested array property.
 * @param ignoreNaN Ignore non-numerical values and use 0 instead. */
declare function sum(arr: number[], path?: string, ignoreNaN?: boolean): number;
/** Clamps a number within a specified range.
 * @param num Number to be clamped.
 * @param range The range to clamp. `min` defaults to 0. */
declare function clamp(num: number, max: number): number;
declare function clamp(num: number, range: {
    min?: number;
    max: number;
}): number;
/** Get the percentage value between two numbers.
 * @param a The numerator.
 * @param b The denominator.
 * @param round Whether to round the result to the nearest integer.
 *
 * @example
 * percent(50, 100) --> 50 // 50%
 * percent(30, 40) --> 75 // 75% */
declare function percent(a: number, b: number, round?: boolean): number;
/** Converts seconds to milliseconds.
 * @param sec The number of seconds to convert.
 * @param round Whether to round the result to the nearest integer. */
declare function secToMs(sec: number, round?: boolean): number;
/** Convert milliseconds to seconds.
 * @param ms The number of milliseconds to convert.
 * @param round Whether to round the result to the nearest integer. */
declare function msToSec(ms: number, round?: boolean): number;
/** Format a number adding a decimal point to each thousand's place.
 * @param num The number to format.
 * @param sep The decimal point to use.
 *
 * @example
 * formatThousands(1000) --> "1,000"
 * formatThousands(1000, ".") --> "1.000" */
declare function formatThousands(num: number, sep?: string): string;
/** Format a number into a short, human-readable string.
 * @param num The number to format.
 * @param units Custom unit names to use.
 *
 * @example
 * formatNumber(1000) -> "1k"
 * formatNumber(1000000) -> "1mil"
 * formatNumber(1000000000) -> "1bil"
 * formatNumber(1000, [" thou", " mill", " bill"]) -> "1 thou" */
declare function formatLargeNumber(num: number, units?: [string, string, string]): string;
/** Add the ordinal place to the end of a given number.
 * @param num The number to add the ordinal to.
 *
 * @example
 * ordinal(1) -> "1st"
 * ordinal(2) -> "2nd"
 * ordinal(3) -> "3rd"
 * ordinal(4) -> "4th" */
declare function toOrdinal(num: number): string;

/** Return a nested property from a given object using the provided path.
 *
 * @example
 * ```ts
 * // returns 5
 * let obj = { a: 5 };
 * getProp(obj, "a");
 *
 * // returns "hello, world!"
 * let obj = { a: [{ content: "hello, world!" }] };
 * getProp(obj, "a[0].content");
 * ```
 * @param obj The object.
 * @param path Path to the nested property within the object. */
declare function getProp(obj: {}, path: string): any;

/** Choose a psuedo-random number within a min-max range.
 * @param minimum Minimum value.
 * @param maximum Maximum value.
 * @param round Round up the sum. */
declare function randomNumber(min: number, max: number, round?: boolean): number;
/** Create a psuedo-random string of numbers [0-9] for the given length.
 * @param len The length of the string. */
declare function numberString(len: number): string;
/** Create a psuedo-random string of letters [a-zA-Z] for the given length.
 * @param len The length of the string.
 * @param includeUpper Include uppercase letters in the string. Default is `false`. */
declare function alphaString(len: number, includeUpper?: boolean): string;
/** Create a pseudo-random alphanumeric string [a-zA-Z0-9] of the specified length.
 * @param len The length of the string.
 * @param includeUpper Include uppercase letters in the string. Default is `false`. */
declare function alphaNumbericString(len: number, includeUpper?: boolean): string;
/** Create a psuedo-random chance based on the given percentage.
 * @param percent The percentage chance of success. Must be between 1 and 100. Default is 50.*/
declare function chance(percent?: number): boolean;
/** Choose a psuedo-random item from an array.
 * @param arr Array of items to choose from.
 * @param copy Return a deep copy of the array using {@link structuredClone}. */
declare function choice<T>(arr: T[], copy?: boolean): T;
/** Return a psuedo-random index from the given array.
 * @param arr The array to generate an index for. */
declare function choiceIndex(arr: any[]): number;
/** Choose a psuedo-random item from an array by weighted rarity.
 * @param arr The array of items to choose from.
 * @param path The nested property path to calculate weights. By default, the item at the current index is used.
 * @param copy Whether to return a copy of the chosen item. Default is `false`. */
declare function choiceWeighted<T extends any[]>(arr: T, path?: string, copy?: boolean): T[number];

/** Make the first letter of every alphanumeric word uppercase.
 * @param str The string to format. */
declare function toTitleCase(str: string): string;
/** Format a string to "1337" speak.
 * @param str The string to format. */
declare function toLeet(str: string): string;

type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export { type AnyFunc, type BetterMapCallback, type DeepPartial, type ETAOptions, type ForceArrayOptions, type ForcedArray, LoopInterval, type LoopIntervalCallback, type NonNullableForcedArray, type ParseTimeOptions, type ReadDirOptions, type ToMapCallback, alphaNumbericString, alphaString, betterMap, chance, choice, choiceIndex, choiceWeighted, chunk, clamp, eta, etaDigital, etaHMS, etaYMDHMS, forceArray, formatLargeNumber, formatThousands, getProp, msToSec, numberString, parseTime, percent, randomNumber, readDir, secToMs, sleep, sum, toLeet, toMap, toOrdinal, toTitleCase, unique };
