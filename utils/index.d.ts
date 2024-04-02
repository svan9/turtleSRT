import fs from "fs";

export function readdirdeep(path: fs.PathLike, usefullpath: boolean = false): Array<String>;

export function isObjectLikeType<T>(object: {[key: T]: any}, typeObject: {[key: T]: any}, withType: boolean?): boolean;

export function cutObject(object: Object, ...keys: string): Object;

export function transLetters(text: string): string;