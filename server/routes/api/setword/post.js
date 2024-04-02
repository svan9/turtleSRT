const { isObjectLikeType, cutObject } = require("../../../../utils");
const { Turtle } = require("../../../database");

/**
 * @type { import("../../route").RouteHandlerType }
 */
async function handler(req, reply) {
  let body = req.body;

  //? return error if request uncorrect
  if (!isObjectLikeType(body, {trt: "string", ru: "string", /*priority: 0,*/ byToken: "trt|ru"})) {
    reply
      .status(400)
      .send("please use form like {trt: string, ru: string, priority: number?, byToken: trt|ru}");
    return;
  }

  let id_word = await Turtle.getId(body);

  let message = await Turtle.insertOrUpdateWord(cutObject(body, "trt", "ru", "priority"), id_word??body.byToken);

  reply.status(200).send("ok");
}

module.exports = handler;