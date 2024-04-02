const { cutObject } = require("../../../../utils");
const { Turtle } = require("../../../database");

/**
 * @type { import("../../route").RouteHandlerType }
 */
async function handler(req, reply) {
  reply.status(200).send({message: await Turtle.getMaxId()});
}

module.exports = handler;