import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "http://localhost:8080/graphql",
  documents: ["src/gql/queries.ts"],
  generates: {
    "./src/__generated__/": {
      //preset: "client",
      schema: "./schema.graphql",
      plugins: ["typescript", "typescript-operations"],
      presetConfig: {
        gqlTagName: "gql",
      },
    },
  },
  ignoreNoDocuments: true,
};

export default config;
