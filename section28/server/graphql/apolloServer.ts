import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} from "@apollo/server/plugin/landingPage/default";
import {
  ApolloServerErrorCode,
  unwrapResolverError,
} from "@apollo/server/errors";
import { typeDefs } from "../graphql/schema";
import { resolvers } from "../graphql/resolvers";
import mongoose from "mongoose";

interface MyContext {
  token?: string;
}

export const apolloServer = (httpServer) =>
  new ApolloServer<MyContext>({
    typeDefs,
    resolvers,
    includeStacktraceInErrorResponses: false,
    formatError: (formattedError, error) => {
      // unwrapResolverError removes the outer GraphQLError wrapping from
      // errors thrown in resolvers, enabling us to check the instance of
      // the original error
      if (unwrapResolverError(error) instanceof mongoose.mongo.MongoError) {
        return {
          message: "Internal server error",
          extensions: { code: 500, errors: [] },
        };
      }
      return formattedError;
    },
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      process.env.NODE_ENV === "production"
        ? ApolloServerPluginLandingPageProductionDefault({
            graphRef: "my-graph-id@my-graph-variant",
            footer: false,
          })
        : ApolloServerPluginLandingPageLocalDefault({ footer: false }),
    ],
  });
