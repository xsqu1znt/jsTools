export * from "./async";
export * from "./array";
export * from "./date";
export * from "./file";
export * from "./number";
export * from "./object";
export * from "./random";
export * from "./string";
export * from "./utils";
export * from "./types";

import * as async from "./async";
import * as array from "./array";
import * as date from "./date";
import * as file from "./file";
import * as number from "./number";
import * as object from "./object";
import * as random from "./random";
import * as string from "./string";
import * as utils from "./utils";
import * as types from "./types";

const jsTools = { ...async, ...array, ...date, ...file, ...number, ...object, ...random, ...string, ...utils, ...types };
export default jsTools;
