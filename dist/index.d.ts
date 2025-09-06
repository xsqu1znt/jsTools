import { EventEmitter } from 'node:stream';

/** A wrapper of {@link setTimeout}. */
declare function sleep(ms: string | number): Promise<void>;

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
declare function forceArray<T>(item: T, options?: ForceArrayOptions & {
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
 * @copyright *Utility created by **@fujimori_*** */
declare function etaYMDHMS(unix: number | string, options?: ETAOptions): string | null;
/**Format a Unix timestamp into a dynamic "DD:HH:MM:SS" time string format.
 * @param unix The Unix timestamp in milliseconds to convert.
 * @param options An optional object to configure the behavior of the function.
 * @copyright *Utility created by **@fujimori_*** */
declare function etaDigital(unix: number | string, options?: ETAOptions): string | null;

interface ReadDirOptions {
    /** Return nested files inside of the directory. */
    recursive?: boolean;
}
/** Get an array of file paths inside of a folder.
 * @param path The path to the folder.
 * @param options An optional object to configure the behavior of the function. */
declare function readDir(path: string, options?: ReadDirOptions): string[];

interface SumOptions {
    /** An optional path to a nested array property. */
    path?: string;
    /** Whether to convert non-numerical values to 0. Default is `false`. */
    ignoreNaN?: boolean;
}
/** Get the sum of an array of numbers. Negative values subtract from the total.
 * @param arr The array to sum.
 * @param options Optional optioins. */
declare function sum(arr: number[], options?: SumOptions): number;
/** Clamps a number within a specified range.
 * @param num Number to be clamped.
 * @param range The range to clamp. `min` defaults to 0. */
declare function clamp(num: number, max: number): number;
declare function clamp(num: number, range: {
    min?: number;
    max: number;
}): number;
/** Check if a number is within a specified range.
 * @param num The number to check.
 * @param range The range to check. `min` defaults to 0. */
declare function inRange(num: number, max: number): boolean;
declare function inRange(num: number, range: {
    min?: number;
    max: number;
}): boolean;
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
 * @example
 * formatNumber(1000) -> "1k"
 * formatNumber(1000000) -> "1mil"
 * formatNumber(1000000000) -> "1bil"
 * formatNumber(1000, [" thou", " mill", " bill"]) -> "1 thou"
 * @copyright *Utility modified by **@fujimori_***  */
declare function formatLargeNumber(num: number, units?: [string, string, string]): string;
/** Format a number to an ordinal number (e.g. 1 -> "1st", 2 -> "2nd", 3 -> "3rd", 4 -> "4th").
 * @param input The number to format.
 * @param useLocale Whether to use the user's locale for formatting the number.
 * @copyright *Utility modified by **@fujimori_*** */
declare function toOrdinal(input: number | string, useLocale?: boolean): string;
/** Format a memory size in bytes into a human-readable string.
 * @param bytes The number of bytes to format.
 * @param decimals The number of decimal places to round the result to.
 * @example
 * formatMemory(1024) --> "1.0 KB"
 * formatMemory(1024000) --> "1.0 MB"
 * @copyright *Utility created by **@fujimori_***
 * @returns A human-readable representation of the memory size. */
declare function formatMemory(bytes: number, decimals?: number, units?: [string, string, string, string, string, string, string, string, string]): string;

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
declare function unwrapEnum<T extends Record<string, string | number>>(enumObj: T): {
    name: string;
    value: number;
}[];

declare class SecureRandom {
    static float(): number;
}
/** Choose a pseudo-random number within a min-max range.
 * @param min Minimum value.
 * @param max Maximum value.
 * @param round Round up the sum. */
declare function randomNumber(min: number, max: number, round?: boolean): number;
/** Create a pseudo-random string of numbers [0-9] for the given length.
 * @param len The length of the string. */
declare function numberString(len: number): string;
/** Create a pseudo-random string of letters [a-zA-Z] for the given length.
 * @param len The length of the string.
 * @param includeUpper Include uppercase letters in the string. Default is `false`. */
declare function alphaString(len: number, includeUpper?: boolean): string;
/** Create a pseudo-random alphanumeric string [a-zA-Z0-9] of the specified length.
 * @param len The length of the string.
 * @param includeUpper Include uppercase letters in the string. Default is `false`. */
declare function alphaNumericString(len: number, includeUpper?: boolean): string;
/** Create a pseudo-random chance based on the given percentage.
 * @param percent The percentage chance of success. Must be between 1 and 100. Default is `50`.*/
declare function chance(percent?: number): boolean;
/** Choose a pseudo-random item from an array.
 * @param arr Array of items to choose from.
 * @param copy Return a deep copy of the array using {@link structuredClone}. */
declare function choice<T>(arr: T[], copy?: boolean): T;
/** Return a pseudo-random index from the given array.
 * @param arr The array to generate an index for. */
declare function choiceIndex(arr: any[]): number;
/** Choose a pseudo-random item from an array by weighted rarity.
 * @param arr The array of items to choose from.
 * @param path The nested property path to calculate weights. By default, the item in the current index is used.
 * @param copy Whether to return a copy of the chosen item. Default is `false`. */
declare function choiceWeighted<T extends any[]>(arr: T, path?: string, copy?: boolean): T[number];
declare function choiceProbability<T extends Record<string, any>, P extends keyof T>(items: T[], path: P, copy?: boolean): T | null;

/** Escape all special regex characters in the given string.
 * @param str - The string to escape. */
declare function escapeRegex(str: string): string;
/** Split a string by whitespace and return the substring after the specified flag.
 * @param str - The string to parse.
 * @param flag - A string or expression to look for.
 * @param length - Max length of the substring. If omitted, will return everything after the flag. */
declare function getFlagSubstring(str: string, flag: string | RegExp, length?: number): string | null;
/** Check if a string contains the specified flag.
 * @param str - The string to parse.
 * @param flag - A string or expression to look for. */
declare function hasFlag(str: string, flag: string | RegExp): boolean;
/** Make the first letter of every alphanumeric word uppercase.
 * @param str The string to format. */
declare function toTitleCase(str: string): string;
/** Format a string to "1337" speak.
 * @param str The string to format. */
declare function toLeet(str: string): string;

type AnyFunc = (...args: any) => any;
type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

type LoopIntervalCallback = (loop: LoopInterval<AnyFunc>) => any;
interface LoopIntervalEvents {
    executed: [any];
    bumped: [any];
    started: [];
    stopped: [];
}
interface ItemCacheOptions {
    /** How long a key should last until its cache is deleted. (milliseconds)
     *
     * Set to `0` or `null` to disable.
     *
     * This parameter utilizes {@link parseTime jsTools.parseTime}, letting you use "10s" or "1m 30s" instead of a number. */
    lifetime?: string | number;
    /** The interval to check for expired keys and items. (milliseconds)
     *
     * Cannot be 0, will default to 30 seconds.
     *
     * This parameter utilizes {@link parseTime jsTools.parseTime}, letting you use "10s" or "1m 30s" instead of a number. */
    checkInterval?: string | number;
}
interface PerishableOptions {
    expired?: boolean;
    flat?: boolean;
}
interface MasterCache<T extends any[]> {
    key: string | number;
    value: {
        item: T[number];
        expiresAt: number | undefined;
    }[];
    createdAt: number;
}
interface PerishableItem<T extends any[]> {
    key: string | number;
    item: T[number];
    expiresAt: number;
}
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
     * This parameter utilizes {@link parseTime jsTools.parseTime}, letting you use "10s" or "1m 30s" instead of a number. */
    constructor(fn: T, delay: string | number, immediate?: boolean);
    /** Change the delay of the loop.
     * @param delay The delay.
     * This parameter utilizes {@link parseTime jsTools.parseTime}, letting you use "10s" or "1m 30s" instead of a number. */
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
declare class ItemsCache<T extends any[]> {
    loop: LoopInterval<AnyFunc>;
    private lifetime;
    private checkInterval;
    private cache;
    /** An in-memory cache system that uses arrays to store items, allowing for high I/O usage **not susceptible to race conditions**.
     *
     * This implementation keeps a **<key, value>** workflow that you'd expect using a {@link Map Map}.
     *
     * Every interval expired items/caches will be deleted or cleared.
     * Caches will only be deleted if `lifetime` is set.
     *
     * @param options Options for the cache.
     * @note Utilizes {@link LoopInterval jsTools.LoopInterval} for the check interval. */
    constructor(options?: ItemCacheOptions);
    /** The number of keys in the cache. */
    get size(): number;
    /** Get an array of keys in the cache. */
    keys(): (string | number)[];
    /** Get a flattened array of values in the cache. */
    values(flat: true): T[number][];
    /** Get an array of values in the cache. */
    values(flat?: false): T[];
    /** Check if a key is in the cache.
     * @param key The key to look for. */
    has(key: string | number): boolean;
    /** Clear everything in the cache. */
    clear(): void;
    /** Get an array of items that have a set expiration. */
    perishable(options: PerishableOptions & {
        flat: true;
    }): PerishableItem<T>[];
    /** Get an array of items that have a set expiration. */
    perishable(options?: PerishableOptions): PerishableItem<T>[][];
    /** Get the number of items in a key. */
    count(key: string | number): number | undefined;
    /** Get the items in a key. */
    get(key: string | number): T[number][] | undefined;
    /** Add a key or overwrite an existing key in the cache.
     * @param key The key to set.
     * @param value The value to set.
     * @param overwrite Overwrite the key if it already exists. */
    set(key: string | number, value: T, overwrite?: boolean): boolean;
    /** Delete a key from the cache. Returns the items of the deleted key.
     * @param key The key to delete. */
    delete(key: string | number): T[number][] | undefined;
    /** Push an item to a key. If the key does not exist, it will be created.
     * @param key The key to push to.
     * @param item The item to push.
     * @param expiresIn The lifetime of the item. (milliseconds). */
    push(key: string | number, item: T[number], expiresIn?: number): T[number][];
    /** Delete items from a key in a way similar to {@link Array.prototype.filter}.
     * @param key The key to delete items from.
     * @param fn The function to filter with. */
    pull(key: string | number, fn: (item: T[number]) => boolean): void;
}

declare const jsTools: {
    LoopInterval: typeof LoopInterval;
    ItemsCache: typeof ItemsCache;
    escapeRegex(str: string): string;
    getFlagSubstring(str: string, flag: string | RegExp, length?: number): string | null;
    hasFlag(str: string, flag: string | RegExp): boolean;
    toTitleCase(str: string): string;
    toLeet(str: string): string;
    randomNumber(min: number, max: number, round?: boolean): number;
    numberString(len: number): string;
    alphaString(len: number, includeUpper?: boolean): string;
    alphaNumericString(len: number, includeUpper?: boolean): string;
    chance(percent?: number): boolean;
    choice<T>(arr: T[], copy?: boolean): T;
    choiceIndex(arr: any[]): number;
    choiceWeighted<T extends any[]>(arr: T, path?: string, copy?: boolean): T[number];
    choiceProbability<T extends Record<string, any>, P extends keyof T>(items: T[], path: P, copy?: boolean): T | null;
    SecureRandom: typeof SecureRandom;
    getProp(obj: {}, path: string): any;
    unwrapEnum<T extends Record<string, string | number>>(enumObj: T): {
        name: string;
        value: number;
    }[];
    sum(arr: number[], options?: SumOptions): number;
    clamp(num: number, max: number): number;
    clamp(num: number, range: {
        min?: number;
        max: number;
    }): number;
    inRange(num: number, max: number): boolean;
    inRange(num: number, range: {
        min?: number;
        max: number;
    }): boolean;
    percent(a: number, b: number, round?: boolean): number;
    secToMs(sec: number, round?: boolean): number;
    msToSec(ms: number, round?: boolean): number;
    formatThousands(num: number, sep?: string): string;
    formatLargeNumber(num: number, units?: [string, string, string]): string;
    toOrdinal(input: number | string, useLocale?: boolean): string;
    formatMemory(bytes: number, decimals?: number, units?: [string, string, string, string, string, string, string, string, string]): string;
    readDir(path: string, options?: ReadDirOptions): string[];
    parseTime(str: string | number, options?: ParseTimeOptions): number;
    eta(unix: number | string, options?: ETAOptions): string | null;
    etaHMS(unix: number | string, options?: ETAOptions): string | null;
    etaYMDHMS(unix: number | string, options?: ETAOptions): string | null;
    etaDigital(unix: number | string, options?: ETAOptions): string | null;
    chunk<T extends any[]>(arr: T, size: number, copy?: boolean): T[];
    unique<T extends any[]>(arr: T, prop?: string, copy?: boolean): T;
    forceArray<T>(item: T, options: ForceArrayOptions & {
        filter: true;
    }): NonNullableForcedArray<T>;
    forceArray<T>(item: T, options?: ForceArrayOptions & {
        filter?: boolean;
    }): ForcedArray<T>;
    betterMap<T extends any[]>(arr: T, callback: BetterMapCallback<T>, copy?: boolean): T;
    toMap<T extends any[]>(arr: T, callback: ToMapCallback<T>, copy?: boolean): Map<any, any>;
    sleep(ms: string | number): Promise<void>;
};

export { type AnyFunc, type BetterMapCallback, type DeepPartial, type ETAOptions, type ForceArrayOptions, type ForcedArray, type ItemCacheOptions, ItemsCache, LoopInterval, type LoopIntervalCallback, type MasterCache, type NonNullableForcedArray, type ParseTimeOptions, type PerishableItem, type PerishableOptions, type ReadDirOptions, SecureRandom, type SumOptions, type ToMapCallback, alphaNumericString, alphaString, betterMap, chance, choice, choiceIndex, choiceProbability, choiceWeighted, chunk, clamp, jsTools as default, escapeRegex, eta, etaDigital, etaHMS, etaYMDHMS, forceArray, formatLargeNumber, formatMemory, formatThousands, getFlagSubstring, getProp, hasFlag, inRange, msToSec, numberString, parseTime, percent, randomNumber, readDir, secToMs, sleep, sum, toLeet, toMap, toOrdinal, toTitleCase, unique, unwrapEnum };
