import { AnyFunc } from "./types";

import { EventEmitter } from "node:stream";
import { parseTime } from "./date";
import { sleep } from "./async";

export type LoopIntervalCallback = (loop: LoopInterval<AnyFunc>) => any;

interface LoopIntervalEvents {
    executed: [any];
    bumped: [any];
    started: [];
    stopped: [];
}

interface __LoopIntervalEvents {
    execute: [];
    bump: [];
    start: [boolean];
    stop: [];
}

export interface BetterCacheOptions {
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

export interface PerishableOptions {
    expired?: boolean;
    flat?: boolean;
}

export interface MasterCache<T extends any[]> {
    key: string | number;
    value: { item: T[number]; expiresAt: number | undefined }[];
    createdAt: number;
}

export interface PerishableItem<T extends any[]> {
    key: string | number;
    item: T[number];
    expiresAt: number;
}

export class LoopInterval<T extends LoopIntervalCallback> {
    private running: boolean = false;
    private delay: number;

    EventEmitter: EventEmitter<LoopIntervalEvents> = new EventEmitter();
    private __eventEmitter: EventEmitter<__LoopIntervalEvents> = new EventEmitter();

    /** Run a function every interval. If the function is asyncronous, it will wait for completion.
     * @param fn The function that will be run.
     * @param delay The time to wait before running the function again.
     * @param immediate Whether to run the function immediately after initialization. Defaults to `true`.
     *
     * This parameter utilizes {@link parseTime jsTools.parseTime}, letting you use "10s" or "1m 30s" instead of a number. */
    constructor(fn: T, delay: string | number, immediate: boolean = true) {
        this.delay = parseTime(delay);

        const main = async () => {
            if (!this.running) return this.__eventEmitter.emit("stop");
            // Both call the function and emit the executed event
            this.EventEmitter.emit("executed", await fn(this));
        };

        this.__eventEmitter.on("execute", async () => main);

        this.EventEmitter.on("executed", () => {
            if (this.running) {
                sleep(this.delay).then(() => this.__eventEmitter.emit("execute"));
            }
        });

        this.__eventEmitter.on("bump", async () => this.EventEmitter.emit("bumped", await fn(this)));

        this.__eventEmitter.on("start", _immediate => {
            if (this.running) return;

            this.running = true;
            this.__eventEmitter.removeAllListeners("execute");
            this.__eventEmitter.on("execute", main);
            this.EventEmitter.emit("started");

            if (_immediate) {
                this.__eventEmitter.emit("execute");
            } else {
                sleep(this.delay).then(() => this.__eventEmitter.emit("execute"));
            }
        });

        this.__eventEmitter.on("stop", () => {
            this.running = false;
            this.__eventEmitter.removeAllListeners("execute");
            this.EventEmitter.emit("stopped");
        });

        // Start
        this.__eventEmitter.emit("start", immediate);
    }

    /** Change the delay of the loop.
     * @param delay The delay.
     * This parameter utilizes {@link parseTime jsTools.parseTime}, letting you use "10s" or "1m 30s" instead of a number. */
    setDelay(delay: string | number): this {
        this.delay = parseTime(delay);
        return this;
    }

    /** Start the loop if it was stopped.
     * @param immediate Whether to start immediately. */
    start(immediate: boolean = false): this {
        this.__eventEmitter.emit("start", immediate);
        return this;
    }

    /** Stop the loop. */
    stop(): this {
        this.__eventEmitter.emit("stop");
        return this;
    }

    /** Manually trigger the callback. */
    execute(): this {
        this.__eventEmitter.emit("bump");
        return this;
    }

    /** Add a listener to call each time a cycle completes.
     * @param fn The function to call. */
    on(fn: (loop: LoopInterval<T>, ...args: any) => any): this {
        this.EventEmitter.on("executed", (...args: any) => fn(this, args));
        return this;
    }

    /** Add a listener to call once a cycle completes.
     * @param fn The function to call. */
    once(fn: (loop: LoopInterval<T>, ...args: any) => any): this {
        this.EventEmitter.once("executed", (...args: any) => fn(this, args));
        return this;
    }

    /** Remove a listener from the cycle.
     * @param fn The function to remove. */
    off(fn: (loop: LoopInterval<T>, ...args: any) => any): this {
        this.EventEmitter.off("executed", (...args: any) => fn(this, args));
        return this;
    }
}

export class BetterCache<T extends any[]> {
    loop: LoopInterval<AnyFunc>;

    private lifetime: number | null;
    private checkInterval: number;

    private cache: MasterCache<T>[] = [];

    constructor(options?: BetterCacheOptions) {
        this.lifetime = options?.lifetime ? parseTime(options.lifetime) : null;
        this.checkInterval = options?.checkInterval ? parseTime(options?.checkInterval) || 30_000 : 30_000;

        this.loop = new LoopInterval(
            () => {
                if (this.lifetime) {
                    /* Delete expired caches */
                    for (const cache of this.cache) {
                        if (Date.now() - cache.createdAt > this.lifetime) {
                            this.delete(cache.key);
                        }
                    }
                }

                /* Delete expired items */
                const expiredItems = this.perishable({ expired: true, flat: true });
                const previouslyUsedIndexes = new Map<string | number, number>();

                if (expiredItems.length) {
                    for (const item of expiredItems) {
                        // Get the index for this key either from previously used indexes or from the cache
                        const index = previouslyUsedIndexes.get(item.key) ?? this.cache.findIndex(c => c.key === item.key);
                        if (index === -1) continue;

                        // Store the index for this key
                        if (!previouslyUsedIndexes.has(item.key)) {
                            previouslyUsedIndexes.set(item.key, index);
                        }

                        // Filter out expired items
                        this.cache[index].value = this.cache[index].value.filter(i => i.item !== item.item);

                        // Delete the cache if it's empty
                        if (!this.cache[index].value.length) {
                            this.delete(item.key);
                        }
                    }
                }
            },
            this.checkInterval,
            false
        );
    }

    /** The number of keys in the cache. */
    get size() {
        return this.cache.length;
    }

    /** Get an array of keys in the cache. */
    keys() {
        return this.cache.map(c => c.key);
    }

    /** Get a flattened array of values in the cache. */
    values(flat: true): T[number][];
    /** Get an array of values in the cache. */
    values(flat?: false): T[];
    values(flat?: boolean) {
        return flat ? this.cache.flatMap(c => c.value.map(_c => _c.item)) : this.cache.map(c => c.value.map(_c => _c.item));
    }

    /** Check if a key is in the cache.
     * @param key The key to look for. */
    has(key: string | number) {
        return this.cache.some(c => c.key === key);
    }

    /** Clear everything in the cache. */
    clear() {
        this.cache = [];
    }

    /** Get an array of items that have a set expiration. */
    perishable(options: PerishableOptions & { flat: true }): PerishableItem<T>[];
    /** Get an array of items that have a set expiration. */
    perishable(options?: PerishableOptions): PerishableItem<T>[][];
    perishable(options?: PerishableOptions) {
        const perishable = this.cache
            .filter(c => c.value.some(v => v.expiresAt))
            .map(c =>
                c.value
                    .filter(_c => !options?.expired || Date.now() > _c.expiresAt!)
                    .map(_c => ({ key: c.key, ..._c } as PerishableItem<T>))
            );

        return options?.flat ? perishable.flat() : perishable;
    }

    /** Get the number of items in a key. */
    count(key: string | number) {
        return this.cache.find(c => c.key === key)?.value.length;
    }

    /** Get the items in a key. */
    get(key: string | number) {
        return this.cache.find(c => c.key === key)?.value.map(c => c.item);
    }

    /** Add a key or overwrite an existing key in the cache.
     * @param key The key to set.
     * @param value The value to set.
     * @param overwrite Overwrite the key if it already exists. */
    set(key: string | number, value: T, overwrite?: boolean) {
        const cache = this.cache.find(c => c.key === key);

        if (cache) {
            if (overwrite) {
                cache.value = value.map(v => ({ item: v, expiresAt: undefined }));
                return true;
            }
        } else {
            this.cache.push({ key, value: value.map(v => ({ item: v, expiresAt: undefined })), createdAt: Date.now() });
            return true;
        }

        return false;
    }

    /** Delete a key from the cache. Returns the items of the deleted key.
     * @param key The key to delete. */
    delete(key: string | number) {
        const index = this.cache.findIndex(c => c.key === key);
        if (index === -1) return undefined;
        return this.cache.splice(index, 1).map(c => c.value.map(_c => _c.item))[0];
    }

    /** Push an item to a key. If the key does not exist, it will be created.
     * @param key The key to push to.
     * @param item The item to push.
     * @param expiresIn The lifetime of the item. (milliseconds). */
    push(key: string | number, item: T[number], expiresIn?: number) {
        const cache = this.cache.find(c => c.key === key);

        if (cache) {
            cache.value.push({ item, expiresAt: expiresIn ? Date.now() + expiresIn : undefined });
        } else {
            this.cache.push({
                key,
                value: [{ item, expiresAt: expiresIn ? Date.now() + expiresIn : undefined }],
                createdAt: Date.now()
            });
        }
    }

    /** Delete items from a key in a way similar to {@link Array.prototype.filter}.
     * @param key The key to delete items from.
     * @param fn The function to filter with. */
    pull(key: string | number, fn: (item: T[number]) => boolean) {
        const index = this.cache.findIndex(c => c.key === key);
        if (index === -1) return;
        this.cache[index].value = this.cache[index].value.filter(i => fn(i.item));
    }
}
