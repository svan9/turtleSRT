import {
  RouteHandlerMethod,
  RawServer,
  RawRequest,
  RawReply,
  RouteGeneric,
  ContextConfig,
  SchemaCompiler,
  TypeProvider,
  Logger
} from "fastify";

type RouteHandlerType = RouteHandlerMethod<RawServer, RawRequest, RawReply, RouteGeneric, ContextConfig, SchemaCompiler, TypeProvider, Logger>
