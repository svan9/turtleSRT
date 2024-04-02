const { cutObject } = require("../../../../utils");
const { Turtle } = require("../../../database");

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

  let message = null;

  message = await Turtle.getWord(cutObject(body, "trt", "ru"));

  if (message == void 0) {
    reply.status(404).send({message: "undefined word"})
    return;
  }

  if (message == null) {
    reply.status(404).send({message: "no result"})
    return;
  }
  
  reply.status(200).send({message});
}

module.exports = handler;