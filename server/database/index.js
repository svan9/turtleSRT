const { fetchQuery } = require("./base");

const { Ydb, ColumnFamilyPolicy } = require("ydb-sdk");

// UPSERT INTO `my_table`
//     ( `id`, `name` )
// VALUES ( );

/**
 * @deprecated
 * @param {} table 
 * @param {*} order 
 * @param  {...any} fields 
 * @returns 
 */
async function selectFromTable(table, order, ...fields) {
  return await fetchQuery(
    `SELECT \`id\`, \`name\`
    FROM \`${table}\`
    ORDER BY \`${order}\``
  );
}

async function getTrt(ru) {
  let result = await fetchQuery(/*sql*/`
    SELECT trt
    FROM words
    WHERE ru = '${ru}'`
  );

  result = parseResultQuery(result);

  return result?.[0]?.trt;
}

async function getRu(trt) {
  let result = await fetchQuery(/*sql*/`
    SELECT ru
    FROM words
    WHERE trt = '${trt}'`
  );

  result = parseResultQuery(result);
  return result?.[0]?.ru;
}

/**
 * 
 * @param {{trt: string?, ru: string?}} o 
 * todo priority
 */
async function getWord(o, isUncutted = false) {
  let query;

  if (!!o.trt) {
    query = 
    /*sql*/`
    SELECT ru${(isUncutted? ", trt" : "")}
    FROM words
    WHERE trt LIKE '%${o.trt}%'`
  } else if (!!o.ru) {
    query = 
    /*sql*/`
    SELECT trt${(isUncutted? ", ru" : "")}
    FROM words
    WHERE ru LIKE '%${o.ru}%'`
  }

  if (!query) return undefined;

  let result = await fetchQuery(query);
  result = parseResultQuery(result);
  
  return isUncutted ? result : (result?.map(e=>e.ru ?? e.trt));
}

async function getMaxId() {
  let result = await fetchQuery(/*sql*/`
    SELECT MAX(id) FROM words`
  );
  result = parseResultQuery(result);
  // console.log(result);
  return result?.[0]?.column0?.low ?? 0;
}

/**
 * 
 * @param {{ru: string, trt: string, priority: number?}} o 
 */
async function insertWord(o) {
  let result = await fetchQuery(/*sql*/`
    INSERT INTO words (trt, ru, priority, id)
    VALUES ('${o.ru}', '${o.trt}', '${o.priority ?? 1}', ${(await Turtle.getMaxId())+1})`
  );
  return result;
}

/**
 * @deprecated
 * @param {{ru: string, trt: string, priority: number?}} o 
 */
async function insertWordIfNotExsist(o) {
  let query = 
  /*sql*/`

    UPSERT INTO words (trt, ru, priority, id)
    VALUES ('${o.ru}', '${o.trt}', ${o.priority ?? 1}, ${(await Turtle.getMaxId())+1})
  `

  let result = await fetchQuery(query);
  
  return result;
  
}

/**
 * 
 * @param {{ru: string, trt: string, priority: number?}} o
 * @param {"trt" | "ru"} token
 */
async function insertOrUpdateWord(o, token) {
  let query = ""
  if (typeof token == "number") {
    query = 
      /*sql*/`
    UPSERT INTO words (trt, ru, priority, id)
    VALUES ('${o.trt}', '${o.ru}', ${o.priority ?? 1}, ${token});
    `
  } else {
    query = 
      /*sql*/`
    $ID = (SELECT id FROM words WHERE ${token} == '${o[token]}');

    UPSERT INTO words (trt, ru, priority, id)
    VALUES ('${o.trt}', '${o.ru}', ${o.priority ?? 1}, 
      IF($ID IS NOT NULL, $ID, ${(await Turtle.getMaxId())+1})
    )
    `
  }

  // console.log(query);
  let result = await fetchQuery(query);

  return result;
}

/**
 * 
 * @param {{ru: string, trt: string}} o
 */
async function getId(o) {
  if (o.trt == void 0 && o.ru == void 0) {
    return undefined;
  }

  let token = (o.ru != void 0)? "ru" : "trt";
  

  let query = /*sql*/`
    SELECT id FROM words
    WHERE ${token} = '${o[token].trim()}'
  `

  let result = await fetchQuery(query);
  result = parseResultQuery(result);
  return result?.[0]?.id?.low;
}

/**
 * 
 * @param {Ydb.Table.ExecuteQueryResult} result 
 */
function parseResultQuery(result) {
  //? convert result to object
  result = Ydb.Table.ExecuteQueryResult.toObject(result);

  let exit_ = [];

  //? execute rows and columns
  let rows = result?.resultSets?.[0]?.rows;
  let columns = result?.resultSets?.[0]?.columns;
  
  if (!rows || !columns) {
    return void 0;
  }

  for (let i in rows) {
    let r, c;
    r = rows?.[i]?.items?.map(e=>Object.values(e)[0]);
    c = columns?.map(e=>e.name);

    //? concat rows and columns
    let result_ = r.map((e, i) => {let a = {}; a[c[i]] = e; return a;});
    
    //? concat all to one
    result_ = result_.reduce((a, b) => a = {...a, ...b}, {});
    
    exit_.push(result_);
  }

  return exit_;
}

var Turtle = {
  getTrt, getRu, getMaxId, 
  insertWord, insertOrUpdateWord, insertWordIfNotExsist,
  getWord, getId
}


module.exports = {
  fetchQuery, parseResultQuery, 
  Turtle
}