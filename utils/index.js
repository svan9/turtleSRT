const { readdirSync, statSync, fsync } = require("fs");
const { join } = require("path");

/**
 * 
 * @param {import("fs").PathLike} path 
 * @param {boolean} usefullpath
 */
function readdirdeep(path, usefullpath = false) {
  var files = readdirSync(path);
  var full_files = files.map(e=>join(path, e));
  var out = [];

  for (let f in files) {
    let info = statSync(full_files[f]);
    if (info.isDirectory()) {
      let inner = readdirdeep(full_files[f]).map(e=>join((!usefullpath ? "\\"+files[f] : full_files[f]), e));
      out.push(...inner);
    } else {
      out.push((!usefullpath ? "\\"+files[f] : full_files[f]));
    }
  }

  return out.map(e=>e.replace("\\", "/"));
}

/**
 * @template T
 * @param {{[key: T]: any}} object 
 * @param {{[key: T]: any}} typeObject 
 * @param {boolean?} withType
 */
function isObjectLikeType(object, typeObject, withType = true) {
  let keys = Object.keys(typeObject);
  for (let key of keys) {
    if (
      !object[key] || 
      (withType && typeof object[key] != typeof typeObject[key])
    ) { return false; }
  }
  return true;
}

function cutObject(object, ...keys) {
  let newObject = {};
  for (let key of keys) {
    newObject[key] = object[key];
  }
  return newObject;
}

const getLetterAnalog = (function() {
  let alphabet = {
    //# ru
    "а": "a",
    "б": "b",
    "в": "v",
    "г": "g",
    "д": "d",
    "е": "e",
    "ё": "ie",
    "ж": "j",
    "з": "z",
    "и": "i",
    "й": "ii",
    "к": "k",
    "л": "l",
    "м": "m",
    "н": "n",
    "о": "o",
    "п": "p",
    "р": "r",
    "с": "s",
    "т": "t",
    "у": "u",
    "ф": "f",
    "х": "h",
    "ц": "c",
    "ч": "ch",
    "ш": "sh",
    "щ": "csh",
    "ъ": "",
    "ы": "i",
    "ь": "",
    "э": "e",
    "ю": "u",
    "я": "ya",

    //# engl
    "a": "а",
    "b": "б",
    "c": "ц",
    "d": "д",
    "e": "е",
    "f": "ф",
    "g": "г",
    "h": "х",
    "i": "и",
    "j": "ж",
    "k": "к",
    "l": "л",
    "m": "м",
    "n": "н",
    "o": "о",
    "p": "п",
    "q": "к",
    "r": "р",
    "s": "с",
    "t": "т",
    "u": "н",
    "v": "в",
    "w": "в",
    "x": "кс",
    "y": "я",
    "z": "з"
  }
  
  return function(letter) {
    let isUpperCase = letter.toUpperCase() == letter;
    let text = alphabet[letter.toLowerCase()] ?? letter; 

    return (isUpperCase ? text.toUpperCase() : text.toLowerCase());
  }
})();

function transLetters(text) {
  console.log(text);
  return text.split("").map(e=>getLetterAnalog(e)).join("");
}

module.exports = {
  readdirdeep, isObjectLikeType, cutObject, transLetters
}