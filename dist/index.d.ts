import { EventEmitter } from 'node:stream';

type AnyFunc = (...args: any) => any;
type LoopIntervalCallback = (loop: LoopInterval<AnyFunc>) => any;
interface LoopIntervalEvents {
    executed: [any];
    bumped: [any];
    started: [];
    stopped: [];
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
interface ForceArrayOptions {
    /** Return a deep copy of the array using {@link structuredClone}. */
    copy?: boolean;
    /** Remove falsey values from the array. */
    filterFalsey?: boolean;
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

interface ReadDirOptions {
    /** Return nested files inside of the directory. */
    recursive?: boolean;
}

/** Make the first letter of every alphanumeric word uppercase.
 * @param str The string to format. */
declare function toTitleCase(str: string): string;
/** Format a string to "1337" speak.
 * @param str The string to format. */
declare function toLeet(str: string): string;

declare const _default: {
    toTitleCase(str: string): string;
    toLeet(str: string): string;
    default: {
        toTitleCase: typeof toTitleCase;
        toLeet: typeof toLeet;
    };
    randomNumber(min: number, max: number, round?: boolean): number;
    numberString(len: number): string;
    alphaString(len: number, includeUpper?: boolean): string;
    alphaNumbericString(len: number, includeUpper?: boolean): string;
    chance(percent?: number): boolean;
    choice<T>(arr: T[], copy?: boolean): T;
    choiceIndex(arr: any[]): number;
    choiceWeighted<T extends any[]>(arr: T, path?: string, copy?: boolean): T[number];
    getProp(obj: {}, path: string): any;
    sum(arr: number[], path?: string, ignoreNaN?: boolean): number;
    clamp(num: number, max: number): number;
    clamp(num: number, range: {
        min?: number;
        max: number;
    }): number;
    percent(a: number, b: number, round?: boolean): number;
    secToMs(sec: number, round?: boolean): number;
    msToSec(ms: number, round?: boolean): number;
    formatThousands(num: number, sep?: string): string;
    formatLargeNumber(num: number, units?: [string, string, string]): string;
    toOrdinal(num: number): string;
    readDir(path: string, options?: ReadDirOptions): string[];
    parseTime(str: string | number, options?: ParseTimeOptions): number;
    eta(unix: number | string, options?: ETAOptions): string | null;
    etaHMS(unix: number | string, options?: ETAOptions): string | null;
    etaYMDHMS(unix: number | string, options?: ETAOptions): string | null;
    etaDigital(unix: number | string, options?: ETAOptions): string | null;
    chunk<T extends any[]>(arr: T, size: number, copy?: boolean): T[];
    unique<T extends any[]>(arr: T, prop?: string, copy?: boolean): T;
    forceArray<T>(item: T, options?: ForceArrayOptions): ForcedArray<T>;
    betterMap<T extends any[]>(arr: T, callback: BetterMapCallback<T>, copy?: boolean): T;
    toMap<T extends any[]>(arr: T, callback: ToMapCallback<T>, copy?: boolean): Map<any, any>;
    sleep(ms: string | number): Promise<void>;
    LoopInterval: typeof LoopInterval;
};

export { _default as default };
