const fastify = require("fastify")({
  logger: true
});

const { extname, join } = require("path");
const { readFileSync } = require("fs");
const { readdirdeep } = require("../utils/index"); // ${process.cwd()}
const { Turtle } = require("./database/index");

//? constaints pathes
const route_dir = __dirname+"/routes";
const src_dir = process.cwd()+"/client/src";
const pages_dir = process.cwd()+"/client/pages";

const assertSourceExt = [".css", ".js", ".svg", ".jpg", ".png", ".gif", ".mp3", ".ogg", ".mpeg", ".mp4"];
//? get routes 
const routes = readdirdeep(route_dir).filter(e=>extname(e) == ".js");
const srces  = readdirdeep(src_dir).filter(e=>assertSourceExt.includes(extname(e)));
const pages  = readdirdeep(pages_dir).filter(e=>extname(e) == ".html");

//? include routes
routes.forEach(route => {
  let handler = require(route_dir + route);
  let ps = route.replace(/\\/gm, "/").slice(0, -3).split("/")

  let url = ps.slice(0, -1).join("/");

  if (!url.startsWith("/")) {
    url = "/"+url;
  }
  
  let route_ = {
    method: ps.at(-1), url, handler
  };

  fastify.route(route_);
});

//? include src [sources]
srces.forEach(src => {
  let abs_path = join(src_dir, src);
  let bufferedFile = readFileSync(abs_path, {encoding: "utf-8"});

  let content_type = "plain/text";

  if (extname(abs_path) == ".css") {
    content_type = "text/css";
  } else
  if (extname(abs_path) == ".svg") {
    content_type = "image/svg+xml";
  }

  let url = join("/src", src).replace(/\\/gm, "/");

  if (!url.startsWith("/")) {
    url = "/"+url;
  }

  fastify.route({
    method: "get", url,
    handler: function(req, reply) {
      reply.type(content_type).send(bufferedFile);
    }
  });
  
});

//? include src [sources]
pages.forEach(page => {

  let name = /\/(.*)\.html/.exec(page)[1];

  if (name == "index") { 
    name = ""; 
  }
  
  let abs_path = join(pages_dir, page);
  let bufferedFile = readFileSync(abs_path, {encoding: "utf-8"});

  fastify.route({
    method: "get",
    url: "/"+name,
    handler: function(req, reply) {
      reply.type("text/html").send(bufferedFile);
    }
  });
});

fastify.route({
  method: "get",
  url: "/api/printroutes",
  handler: function(req, reply) {
    reply.send(fastify.printRoutes());
  }
});

//# tests 
(async function() {
  // Turtle.getWord({})
  // console.log(await Turtle.getMaxId());
  // console.log(await Turtle.getTrt("so"));
  // console.log(await Turtle.getRu("немного"));
})();

fastify.listen({
  port: 3000, // http://127.0.0.1:3000
})
 