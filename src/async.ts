import { setTimeout } from "node:timers/promises";
import { parseTime } from "./date";

/** A wrapper of {@link setTimeout}. */
export async function sleep(ms: string | number): Promise<void> {
    return await setTimeout(parseTime(ms));
}
