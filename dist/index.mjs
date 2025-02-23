var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/async.ts
var async_exports = {};
__export(async_exports, {
  LoopInterval: () => LoopInterval,
  sleep: () => sleep
});
import { setTimeout } from "node:timers/promises";
import { EventEmitter } from "node:stream";

// src/date.ts
var date_exports = {};
__export(date_exports, {
  eta: () => eta,
  etaDigital: () => etaDigital,
  etaHMS: () => etaHMS,
  etaYMDHMS: () => etaYMDHMS,
  parseTime: () => parseTime
});

// src/number.ts
var number_exports = {};
__export(number_exports, {
  clamp: () => clamp,
  formatLargeNumber: () => formatLargeNumber,
  formatMemory: () => formatMemory,
  formatThousands: () => formatThousands,
  msToSec: () => msToSec,
  percent: () => percent,
  secToMs: () => secToMs,
  sum: () => sum,
  toOrdinal: () => toOrdinal
});

// src/object.ts
var object_exports = {};
__export(object_exports, {
  getProp: () => getProp
});
function getProp(obj, path) {
  let _obj = obj;
  const _path = path.trim().replace(/\[(\w+)\]/g, ".$1").replace(/^\./, "").split(".");
  const debug_path = [];
  for (let i = 0; i < _path.length; ++i) {
    const prop = _path[i];
    debug_path.push(prop);
    try {
      if (prop in _obj && _obj[prop] === void 0)
        throw new Error(`Object property '${debug_path.join(".")}' is undefined`);
      _obj = _obj[prop];
    } catch {
      throw new Error(`Cannot get property '${prop}' from '${_obj}'`);
    }
  }
  return _obj;
}

// src/number.ts
function sum(arr, path = "", ignoreNaN = false) {
  const _path = path.trim();
  const _arr = _path ? arr.map((a) => Number(getProp(a, _path))) : arr;
  return _arr.reduce((a, b) => {
    const invalid = isNaN(b) && !ignoreNaN;
    if (invalid) throw new TypeError(`'${b}' is not a valid number`);
    if (invalid && ignoreNaN) b = 0;
    return b < 0 ? a - -b : a + (b || 0);
  }, 0);
}
function clamp(num, range) {
  let _range = { min: 0, max: 0 };
  if (typeof range === "number") _range.max = range;
  else _range = { min: range.min || 0, max: range.max };
  return num < _range.min ? _range.min : num > _range.max ? _range.max : num;
}
function percent(a, b, round = true) {
  return round ? Math.floor(a / b * 100) : a / b * 100;
}
function secToMs(sec, round = true) {
  return round ? Math.floor(sec * 1e3) : sec * 1e3;
}
function msToSec(ms, round = true) {
  return round ? Math.floor(ms / 1e3) : ms / 1e3;
}
function formatThousands(num, sep = ",") {
  return `${num}`.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, sep);
}
function formatLargeNumber(num, units = ["k", "M", "B"]) {
  if (num < 1e3) return num.toString();
  const i = Math.floor(Math.log10(num) / 3);
  const val = num / Math.pow(1e3, i);
  return val.toFixed(val >= 10 ? 1 : 2).replace(/\.0+$/, "").replace(/\.$/, "") + units[i - 1];
}
function toOrdinal(input, useLocale = false) {
  const num = typeof input === "string" ? parseFloat(input) : Number(input);
  if (isNaN(num)) throw TypeError("Invalid input");
  const suffix = ["st", "nd", "rd"][(num % 10 + 10) % 10 - 1] || "th";
  return (useLocale ? num.toLocaleString() : num.toString()) + suffix;
}
function formatMemory(bytes, decimals = 1, units = [
  "B",
  "KB",
  "MB",
  "GB",
  "TB",
  "PB",
  "EB",
  "ZB",
  "YB"
]) {
  return `${(bytes / Math.pow(1024, Math.floor(Math.log2(bytes / 1024)))).toFixed(decimals)} ${units[Math.floor(Math.log2(bytes / 1024))]}`;
}

// src/date.ts
function parseTime(str, options) {
  const _options = { ...{ type: "ms", fromNow: false }, ...options };
  if (typeof str === "number") return str;
  const timeQuery = str.matchAll(/([\d]+)([a-zA-Z]+)/g);
  const isNegative = str.startsWith("-");
  let sum2 = 0;
  for (let query of timeQuery) {
    let time = Number(query[1]);
    const op = query[2] || null;
    if (isNaN(time) || !op)
      throw new TypeError(`'${str}' must be in a parsable time format. Example: '24h' or '1h 30m'`);
    let _parsed = 0;
    switch (op) {
      case "y":
        _parsed = time * 12 * 4 * 7 * 24 * 60 * 60 * 1e3;
        break;
      case "mth":
        _parsed = time * 4 * 7 * 24 * 60 * 60 * 1e3;
        break;
      case "w":
        _parsed = time * 7 * 24 * 60 * 60 * 1e3;
        break;
      case "d":
        _parsed = time * 24 * 60 * 60 * 1e3;
        break;
      case "h":
        _parsed = time * 60 * 60 * 1e3;
        break;
      case "m":
        _parsed = time * 60 * 1e3;
        break;
      case "s":
        _parsed = time * 1e3;
        break;
      case "ms":
        _parsed = time;
        break;
    }
    sum2 += _parsed;
  }
  if (_options.fromNow) isNegative ? sum2 = Date.now() - sum2 : sum2 = Date.now() + sum2;
  if (_options.type === "s") sum2 = msToSec(sum2);
  if (!_options.fromNow && isNegative) sum2 = -sum2;
  return sum2;
}
function eta(unix, options) {
  const _options = {
    ignorePast: false,
    nullIfPast: false,
    decimalLimit: 0,
    ...options,
    since: options?.since ? Number(options.since) : Date.now()
  };
  const _unix = Number(unix);
  const isPast = _unix - _options.since < 0;
  if (_options.ignorePast && isPast) return null;
  let difference = Math.abs(_unix - _options.since);
  if (!difference && _options.nullIfPast) return null;
  if (!difference) return "now";
  const divisions = [
    { name: "milliseconds", amount: 1e3 },
    { name: "seconds", amount: 60 },
    { name: "minutes", amount: 60 },
    { name: "hours", amount: 24 },
    { name: "days", amount: 7 },
    { name: "weeks", amount: 4 },
    { name: "months", amount: 12 },
    { name: "years", amount: Number.POSITIVE_INFINITY }
  ];
  let result = divisions.find((div, idx) => {
    if (difference < div.amount) return div;
    difference = Math.abs(difference / div.amount).toFixed(
      ["milliseconds", "seconds", "minutes", "hours", "days"].includes(div.name) ? 0 : _options.decimalLimit
    );
  });
  if (!result) return null;
  if (difference === 1) result.name = result.name.slice(0, -1);
  return `${difference} ${result.name}${isPast && !_options.ignorePast ? " ago" : ""}`;
}
function etaHMS(unix, options) {
  const _options = {
    ignorePast: false,
    nullIfPast: false,
    decimalLimit: 0,
    ...options,
    since: options?.since ? Number(options.since) : Date.now()
  };
  const _unix = Number(unix);
  const isPast = _unix - _options.since < 0;
  if (_options.ignorePast && isPast) return null;
  let difference = Math.abs(_unix - _options.since);
  if (!difference && _options.nullIfPast) return null;
  if (!difference) return "now";
  const seconds = msToSec(difference);
  const h = Math.floor(seconds / 3600);
  const m = Math.floor(seconds % 3600 / 60);
  const s = Math.floor(seconds % 3600 % 60);
  const h_f = h > 0 ? `${h} ${h === 1 ? "hour" : "hours"}` : "";
  const m_f = m > 0 ? `${m} ${m === 1 ? "minute" : "minutes"}` : "";
  const s_f = s > 0 ? `${s} ${s === 1 ? "second" : "seconds"}` : "";
  const result = [];
  if (h) result.push(h_f);
  if (m) result.push(m_f);
  if (s) result.push(s_f);
  if (result.length > 1) result.splice(-1, 0, "and");
  return result.join(", ").replace("and,", "and");
}
function etaYMDHMS(unix, options) {
  const _options = {
    ignorePast: false,
    nullIfPast: false,
    decimalLimit: 0,
    ...options,
    since: options?.since ? Number(options.since) : Date.now()
  };
  const _unix = Number(unix);
  const isPast = _unix - _options.since < 0;
  if (_options.ignorePast && isPast) return null;
  let difference = Math.abs(_unix - _options.since);
  if (!difference && _options.nullIfPast) return null;
  if (!difference) return "now";
  const seconds = msToSec(difference);
  const y = Math.floor(seconds / 31536e3);
  const mo = Math.floor(seconds % 31536e3 / 2628e3);
  const d = Math.floor(seconds % 31536e3 % 2628e3 / 86400);
  const h = Math.floor(seconds % (3600 * 24) / 3600);
  const m = Math.floor(seconds % 3600 / 60);
  const s = Math.floor(seconds % 60);
  const yDisplay = y > 0 ? y + (y === 1 ? " year" : " years") : "";
  const moDisplay = mo > 0 ? mo + (mo === 1 ? " month" : " months") : "";
  const dDisplay = d > 0 ? d + (d === 1 ? " day" : " days") : "";
  const hDisplay = h > 0 ? h + (h === 1 ? " hour" : " hours") : "";
  const mDisplay = m > 0 ? m + (m === 1 ? " minute" : " minutes") : "";
  const sDisplay = s > 0 ? s + (s === 1 ? " second" : " seconds") : "";
  let result = [];
  if (y) result.push(yDisplay);
  if (mo) result.push(moDisplay);
  if (d) result.push(dDisplay);
  if (h) result.push(hDisplay);
  if (m) result.push(mDisplay);
  if (s) result.push(sDisplay);
  if (result.includes(yDisplay)) {
    result.length = 3;
  } else if (result.includes(moDisplay)) {
    result.length = 3;
  } else if (result.includes(dDisplay)) {
    result.length = 3;
  }
  result = result.filter((f) => f);
  if (result.length > 1) result.splice(-1, 0, "and");
  return result.join(", ").replace("and,", "and");
}
function etaDigital(unix, options) {
  const _options = {
    ignorePast: false,
    nullIfPast: false,
    decimalLimit: 0,
    ...options,
    since: options?.since ? Number(options.since) : Date.now()
  };
  const _unix = Number(unix);
  const isPast = _unix - _options.since < 0;
  if (_options.ignorePast && isPast) return null;
  let difference = Math.abs(_unix - _options.since);
  if (!difference && _options.nullIfPast) return null;
  if (!difference) return "now";
  const seconds = msToSec(difference);
  let d = Math.floor(seconds % 31536e3 / 86400);
  let h = Math.floor(seconds % (3600 * 24) / 3600);
  let m = Math.floor(seconds % 3600 / 60);
  let s = Math.floor(seconds % 60);
  if (d < 0) d = Math.abs(d);
  if (h < 0) h = Math.abs(h);
  if (m < 0) m = Math.abs(m);
  if (s < 0) s = Math.abs(s);
  const dDisplay = `0${d}`.slice(-2);
  const hDisplay = `0${h}`.slice(-2);
  const mDisplay = `0${m}`.slice(-2);
  const sDisplay = `0${s}`.slice(-2);
  let result = [];
  if (d > 0) result.push(dDisplay);
  if (h > 0 || d > 0) result.push(hDisplay);
  if (m) result.push(mDisplay);
  if (s) result.push(sDisplay);
  result = result.filter((f) => f);
  return result.join(":");
}

// src/async.ts
async function sleep(ms) {
  return await setTimeout(parseTime(ms));
}
var LoopInterval = class {
  running = false;
  delay;
  EventEmitter = new EventEmitter();
  __eventEmitter = new EventEmitter();
  /** Run a function every interval. If the function is asyncronous, it will wait for completion.
   * @param fn The function that will be run.
   * @param delay The time to wait before running the function again.
   * @param immediate Whether to run the function immediately after initialization. Defaults to `true`.
   *
   * This parameter utilizes {@link parseTime jsTools.parseTime}, letting you use "10s" or "1m 30s" instead of a number. */
  constructor(fn, delay, immediate = true) {
    this.delay = parseTime(delay);
    const main = async () => {
      if (!this.running) return this.__eventEmitter.emit("stop");
      this.EventEmitter.emit("executed", await fn(this));
    };
    this.__eventEmitter.on("execute", async () => main);
    this.EventEmitter.on("executed", () => {
      if (this.running) {
        sleep(this.delay).then(() => this.__eventEmitter.emit("execute"));
      }
    });
    this.__eventEmitter.on("bump", async () => this.EventEmitter.emit("bumped", await fn(this)));
    this.__eventEmitter.on("start", (_immediate) => {
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
    this.__eventEmitter.emit("start", immediate);
  }
  /** Change the delay of the loop.
   * @param delay The delay.
   * This parameter utilizes {@link parseTime jsTools.parseTime}, letting you use "10s" or "1m 30s" instead of a number. */
  setDelay(delay) {
    this.delay = parseTime(delay);
    return this;
  }
  /** Start the loop if it was stopped.
   * @param immediate Whether to start immediately. */
  start(immediate = false) {
    this.__eventEmitter.emit("start", immediate);
    return this;
  }
  /** Stop the loop. */
  stop() {
    this.__eventEmitter.emit("stop");
    return this;
  }
  /** Manually trigger the callback. */
  execute() {
    this.__eventEmitter.emit("bump");
    return this;
  }
  /** Add a listener to call each time a cycle completes.
   * @param fn The function to call. */
  on(fn) {
    this.EventEmitter.on("executed", (...args) => fn(this, args));
    return this;
  }
  /** Add a listener to call once a cycle completes.
   * @param fn The function to call. */
  once(fn) {
    this.EventEmitter.once("executed", (...args) => fn(this, args));
    return this;
  }
  /** Remove a listener from the cycle.
   * @param fn The function to remove. */
  off(fn) {
    this.EventEmitter.off("executed", (...args) => fn(this, args));
    return this;
  }
};

// src/array.ts
var array_exports = {};
__export(array_exports, {
  betterMap: () => betterMap,
  chunk: () => chunk,
  forceArray: () => forceArray,
  toMap: () => toMap,
  unique: () => unique
});
function chunk(arr, size, copy = false) {
  if (size <= 0) throw new Error("Size cannot be 0 or negative");
  if (!arr.length || arr.length < size) return [arr];
  const chunk2 = [];
  for (let i = 0; i < arr.length; i += size) {
    chunk2.push(arr.slice(i, i + size));
  }
  return copy ? structuredClone(chunk2) : chunk2;
}
function unique(arr, prop, copy = false) {
  const uniqueArray = [];
  const referenceMap = /* @__PURE__ */ new Map();
  for (let item of arr) {
    let property = typeof item === "object" && prop ? getProp(item, prop) : item;
    if (!referenceMap.has(property)) {
      referenceMap.set(property, property);
      uniqueArray.push(item);
    }
  }
  return copy ? structuredClone(uniqueArray) : uniqueArray;
}
function forceArray(item, options) {
  let itemArray = Array.isArray(item) ? item : [item];
  if (options?.filter) itemArray = itemArray.filter((i) => i !== void 0 && i !== null);
  if (options?.copy) itemArray = structuredClone(itemArray);
  return itemArray;
}
function betterMap(arr, callback, copy = false) {
  const originalArray = arr;
  const newArray = [];
  for (let idx = 0; idx < originalArray.length; idx++) {
    const lastElement = newArray[idx - 1];
    newArray.push(callback(originalArray[idx], { idx, lastElement, newArray, originalArray }));
  }
  return copy ? structuredClone(newArray) : newArray;
}
function toMap(arr, callback, copy = false) {
  let arrayOriginal = arr;
  let mapNew = /* @__PURE__ */ new Map();
  for (let idx = 0; idx < arrayOriginal.length; idx++) {
    const lastElement = mapNew.get(idx - 1);
    const item = callback(arrayOriginal[idx], { idx, lastElement, newMap: mapNew, originalArray: arrayOriginal });
    mapNew.set(item.key, copy ? structuredClone(item.value) : item.value);
  }
  return mapNew;
}

// src/file.ts
var file_exports = {};
__export(file_exports, {
  readDir: () => readDir
});
import fs from "node:fs";
function readDir(path, options) {
  const _options = { recursive: true, ...options };
  if (!fs.existsSync(path)) return [];
  if (!_options.recursive) return fs.readdirSync(path);
  const walk = (_dir, _dn) => {
    let results = [];
    let directory = fs.readdirSync(_dir);
    let file_stats = directory.map((fn) => fs.statSync(`${_dir}/${fn}`));
    let files = directory.filter((fn, idx) => file_stats[idx].isFile());
    let dirs = directory.filter((fn, idx) => file_stats[idx].isDirectory());
    for (let fn of files) results.push(`${_dn ? `${_dn}/` : ""}${fn}`);
    for (let dn of dirs) results.push(...walk(`${_dir}/${dn}`, dn));
    return results;
  };
  return walk(path);
}

// src/random.ts
var random_exports = {};
__export(random_exports, {
  alphaNumbericString: () => alphaNumbericString,
  alphaString: () => alphaString,
  chance: () => chance,
  choice: () => choice,
  choiceIndex: () => choiceIndex,
  choiceWeighted: () => choiceWeighted,
  numberString: () => numberString,
  randomNumber: () => randomNumber
});
var alphabet = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z"
];
function randomNumber(min, max, round = true) {
  let sum2 = min + (max - min) * Math.random();
  return round ? Math.round(sum2) : sum2;
}
function numberString(len) {
  let str = "";
  for (let i = 0; i < len; i++) str += randomNumber(0, 9);
  return str;
}
function alphaString(len, includeUpper = false) {
  let str = "";
  for (let i = 0; i < len; i++) str += includeUpper && chance() ? choice(alphabet).toUpperCase() : choice(alphabet);
  return str;
}
function alphaNumbericString(len, includeUpper = false) {
  let str = "";
  for (let i = 0; i < len; i++) {
    const char = str += chance() ? choice(alphabet) : randomNumber(0, 9);
    str += includeUpper && chance() ? char.toUpperCase() : char;
  }
  return str;
}
function chance(percent2 = 50) {
  if (percent2 < 1 || percent2 > 100) throw new Error(`\`${percent2}\` must be within a range of 1 and 100`);
  return randomNumber(0, 100) < percent2;
}
function choice(arr, copy = false) {
  let item = arr[randomNumber(0, arr.length - 1)];
  return copy ? structuredClone(item) : item;
}
function choiceIndex(arr) {
  return randomNumber(0, arr.length - 1);
}
function choiceWeighted(arr, path = "", copy = false) {
  let weights = betterMap(arr, (item2, { lastElement }) => {
    const prop = path ? getProp(item2, path) : item2;
    if (typeof prop !== "number") throw new TypeError(`\`${path}\` must lead to a number property in the array`);
    return prop + (lastElement || 0);
  });
  const decider = Math.random() * weights[weights.length - 1];
  const item = arr[weights.findIndex((w) => w >= decider)];
  return copy ? structuredClone(item) : item;
}

// src/string.ts
var string_exports = {};
__export(string_exports, {
  toLeet: () => toLeet,
  toTitleCase: () => toTitleCase
});
function toTitleCase(str) {
  return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase());
}
function toLeet(str) {
  return str.replace(/a|A/g, "4").replace(/e|E/g, "3").replace(/i|I/g, "1").replace(/o|O/g, "0").replace(/t|T/g, "7");
}

// src/types.ts
var types_exports = {};

// src/index.ts
var index_default = { ...async_exports, ...array_exports, ...date_exports, ...file_exports, ...number_exports, ...object_exports, ...random_exports, ...string_exports, ...types_exports };
export {
  LoopInterval,
  alphaNumbericString,
  alphaString,
  betterMap,
  chance,
  choice,
  choiceIndex,
  choiceWeighted,
  chunk,
  clamp,
  index_default as default,
  eta,
  etaDigital,
  etaHMS,
  etaYMDHMS,
  forceArray,
  formatLargeNumber,
  formatMemory,
  formatThousands,
  getProp,
  msToSec,
  numberString,
  parseTime,
  percent,
  randomNumber,
  readDir,
  secToMs,
  sleep,
  sum,
  toLeet,
  toMap,
  toOrdinal,
  toTitleCase,
  unique
};
