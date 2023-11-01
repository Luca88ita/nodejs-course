/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never;
    };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
};

export type Mutation = {
  __typename?: "Mutation";
  createUser: User;
};

export type MutationCreateUserArgs = {
  userInput?: InputMaybe<UserInputData>;
};

export type Post = {
  __typename?: "Post";
  _id: Scalars["ID"]["output"];
  content: Scalars["String"]["output"];
  createdAt: Scalars["String"]["output"];
  creator: User;
  imageUrl: Scalars["String"]["output"];
  title: Scalars["String"]["output"];
  updatedAt: Scalars["String"]["output"];
};

export type Query = {
  __typename?: "Query";
  users?: Maybe<Array<Maybe<User>>>;
};

export type User = {
  __typename?: "User";
  _id: Scalars["ID"]["output"];
  email: Scalars["String"]["output"];
  name: Scalars["String"]["output"];
  password?: Maybe<Scalars["String"]["output"]>;
  posts: Array<Post>;
  status?: Maybe<Scalars["String"]["output"]>;
};

export type UserInputData = {
  email: Scalars["String"]["input"];
  name: Scalars["String"]["input"];
  password: Scalars["String"]["input"];
};

export type MutationMutationVariables = Exact<{
  userInput?: InputMaybe<UserInputData>;
}>;

export type MutationMutation = {
  __typename?: "Mutation";
  createUser: { __typename?: "User"; email: string; name: string };
};

export const MutationDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "Mutation" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "userInput" },
          },
          type: {
            kind: "NamedType",
            name: { kind: "Name", value: "UserInputData" },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "createUser" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "userInput" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "userInput" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "email" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<MutationMutation, MutationMutationVariables>;
/** All built-in and custom scalars, mapped to their actual values */