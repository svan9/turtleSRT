const { cutObject, transLetters } = require("../../../../utils");
const { Turtle } = require("../../../database");

/**
 * 
 * @param {string[]} words 
 */
async function translateToTrt(words) {
  let whole$1 = await wholeTranslate({ru: words});
  
  if (whole$1 != undefined) {
    return whole$1;
  }
}

/**
 * 
 * @param {string[]} words 
 */
async function translateToRu(words) {
  let whole$1 = await wholeTranslate({trt: words});
  
  if (whole$1 != undefined) {
    return whole$1;
  }
}

/**
 * 
 * @param {{trt: string[]?, ru: string[]?}} o 
 */
async function wholeTranslate(o) {
  if (o.ru != null || o.trt != null) {
    var aa, bb;
    if (o.ru != null) {
      aa = "ru";
      bb = "trt";
      let toTrt = true;
    } else 
    if (o.trt != null) {
      aa = "trt";
      bb = "ru";
      let toRu = true;
    } 

    var result = [];
    let words = o[aa];

    
    for (let i = 0; i < words.length; i++) {
      let arr = await Turtle.getWord({[aa]: words[i]}, true);
      let word = (aa == "trt") ? await Turtle.getRu(words[i]) : await Turtle.getTrt(words[i]);
      
      let arr2 = arr
        ?.filter(e=>checkByWordsPart(e?.[aa]?.split(/\s+/gm), words))
        ?.filter(e=>e?.[aa].split(/\s+/gm).includes(words[i]))
        ?.sort((a, b) => b[aa].length - a[aa].length);
      
      if (/^\d+$/.test(words[i])) { 
        result.push(words[i]);
      } else 
      if (arr2 != void 0 && arr2?.[0] != void 0) {
        let r = arr2[0][bb].split(/\s+/gm);
        result = [...result, ...r];
        i += arr2[0][aa].split(/\s+/gm).length-1;
      } else
      if (word != void 0) {
        result.push(word);
      } else {
        result.push(transLetters(words[i]));
      }
    }
    
    if (result.length != 0) {
      return result;
    }

  }

  return undefined;
}

function checkByWords(a, b) {
  for (let i in a) {
    if (a[i] != b[i]) return false;
  }
  return true;
}

function checkByWordsPart(a$1, b$1) {
  let min = a$1.length >= b$1.length ? b$1: a$1;
  let max = a$1.length >= b$1.length ? a$1: b$1;

  for (let i = 0; i < min.length; i++) {
    if (min[i] != max[i]) return false;
  }

  return true;
}

/**
 * 
 * @param {{trt: string?, ru: string?}} o 
 */
async function translate(o) {
  const wordMatch = /([a-zA-Zа-яА-Я']+)/gmu;
  
  if (!!o.trt || !!o.ru) {
    let aa, bb;
    let toTrt = false;
    if (o.ru != null) {
      aa = "ru";
      bb = "trt";
      toTrt = true;
    } else 
    if (o.trt != null) {
      aa = "trt";
      bb = "ru";
    } 
    let ws = [...o[aa].matchAll(wordMatch)].map(e=>e[0]);
    let rs = toTrt ? await translateToTrt(ws) : await translateToRu(ws);

    if (rs.length > ws.length) {
      let newRs = [];
      for (let i = 0; i < rs.length; i+=2) {
        newRs.push((rs[i] ?? "")+" "+(rs[i+1] ?? ""));
      }
      rs = newRs;
    }


    let i = 0;
    return o[aa].replace(wordMatch, function(str) {
      if (rs.length <= i) {
        return "";
      }
      return rs[i++];
    }).replace(/,/gm, "");
  }
  return void 0;
}

/**
 * @type { import("../../route").RouteHandlerType }
 */
async function handler(req, reply) {
  let body = req.body;

  //? return error if request is empty
  if (!body.trt && !body.ru) {
    reply.status(400).send("please use form like { trt: string } or { ru: string }");
    return;
  }

  
  let message = await translate(cutObject(body, "trt", "ru"));
  
  reply.status(200).send({message});
}

module.exports = handler;