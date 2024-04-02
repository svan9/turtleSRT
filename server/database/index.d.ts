import { fetchQuery } from "./base";

type fieldsType<T> = Array<T>;

async function selectFromTable(table: string, ...fields: fieldsType): any;

async function getTrt(trt: string): Promise<Ydb.Table.ExecuteQueryResult>;
async function getRu(trt: string): Promise<Ydb.Table.ExecuteQueryResult>;
async function getMaxId(): Promise<number>;

async function getWord(o: {trt: string?, ru: string?}): Promise<{ru: string, trt: string}[]>;

type FullWordType = {ru: string, trt: string, priority: number?};

async function insertOrUpdateWord(o: FullWordType, token: "trt" | "ru"): Promise<Ydb.Table.ExecuteQueryResult>;
async function insertOrUpdateWord(o: FullWordType, id: number): Promise<Ydb.Table.ExecuteQueryResult>;
async function insertWord(o: FullWordType): Promise<Ydb.Table.ExecuteQueryResult>;

/** @deprecated */
async function insertWordIfNotExsist(o: FullWordType): Promise<Ydb.Table.ExecuteQueryResult>;

function parseResultQuery(result: Ydb.Table.ExecuteQueryResult): { [k: string]: any; };

const Turtle = {
  getTrt, getRu, getMaxId,
  insertWord, insertOrUpdateWord, insertWordIfNotExsist,
  getWord
};

export {
  Turtle, parseResultQuery
};