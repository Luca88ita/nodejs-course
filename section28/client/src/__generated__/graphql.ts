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

export type AuthData = {
  __typename?: "AuthData";
  token: Scalars["String"]["output"];
  userId: Scalars["String"]["output"];
};

export type Mutation = {
  __typename?: "Mutation";
  createPost: Post;
  createUser: User;
  editPost: Post;
};

export type MutationCreatePostArgs = {
  postInput?: InputMaybe<PostInputData>;
};

export type MutationCreateUserArgs = {
  userInput?: InputMaybe<UserInputData>;
};

export type MutationEditPostArgs = {
  postId: Scalars["ID"]["input"];
  postInput: PostInputData;
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

export type PostInputData = {
  content: Scalars["String"]["input"];
  imageUrl?: InputMaybe<Scalars["String"]["input"]>;
  title: Scalars["String"]["input"];
};

export type PostsData = {
  __typename?: "PostsData";
  posts: Array<Maybe<Post>>;
  totalItems: Scalars["Int"]["output"];
};

export type Query = {
  __typename?: "Query";
  fetchPosts: PostsData;
  login: AuthData;
  viewPost: Post;
};

export type QueryFetchPostsArgs = {
  currentPage: Scalars["Int"]["input"];
  postPerPage: Scalars["Int"]["input"];
};

export type QueryLoginArgs = {
  email: Scalars["String"]["input"];
  password: Scalars["String"]["input"];
};

export type QueryViewPostArgs = {
  postId: Scalars["ID"]["input"];
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

export type CreateUserMutationVariables = Exact<{
  userInput?: InputMaybe<UserInputData>;
}>;

export type CreateUserMutation = {
  __typename?: "Mutation";
  createUser: { __typename?: "User"; email: string; name: string };
};

export type LoginQueryVariables = Exact<{
  password: Scalars["String"]["input"];
  email: Scalars["String"]["input"];
}>;

export type LoginQuery = {
  __typename?: "Query";
  login: { __typename?: "AuthData"; token: string; userId: string };
};

export type GetPostsQueryVariables = Exact<{
  currentPage: Scalars["Int"]["input"];
  postPerPage: Scalars["Int"]["input"];
}>;

export type GetPostsQuery = {
  __typename?: "Query";
  fetchPosts: {
    __typename?: "PostsData";
    totalItems: number;
    posts: Array<{
      __typename?: "Post";
      _id: string;
      title: string;
      content: string;
      imageUrl: string;
      createdAt: string;
      updatedAt: string;
      creator: { __typename?: "User"; name: string; _id: string };
    } | null>;
  };
};

export type ViewPostQueryVariables = Exact<{
  postId: Scalars["ID"]["input"];
}>;

export type ViewPostQuery = {
  __typename?: "Query";
  viewPost: {
    __typename?: "Post";
    title: string;
    imageUrl: string;
    createdAt: string;
    content: string;
    creator: { __typename?: "User"; name: string; _id: string };
  };
};

export type CreatePostMutationVariables = Exact<{
  postInput?: InputMaybe<PostInputData>;
}>;

export type CreatePostMutation = {
  __typename?: "Mutation";
  createPost: {
    __typename?: "Post";
    _id: string;
    title: string;
    content: string;
    imageUrl: string;
  };
};

export type EditPostMutationVariables = Exact<{
  postId: Scalars["ID"]["input"];
  postInput: PostInputData;
}>;

export type EditPostMutation = {
  __typename?: "Mutation";
  editPost: {
    __typename?: "Post";
    title: string;
    imageUrl: string;
    content: string;
    _id: string;
  };
};

export const CreateUserDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "CreateUser" },
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
} as unknown as DocumentNode<CreateUserMutation, CreateUserMutationVariables>;
export const LoginDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "Login" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "password" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "email" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "login" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "password" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "password" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "email" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "email" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "token" } },
                { kind: "Field", name: { kind: "Name", value: "userId" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<LoginQuery, LoginQueryVariables>;
export const GetPostsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "GetPosts" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "currentPage" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "postPerPage" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "fetchPosts" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "currentPage" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "currentPage" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "postPerPage" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "postPerPage" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "totalItems" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "posts" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "_id" } },
                      { kind: "Field", name: { kind: "Name", value: "title" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "content" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "imageUrl" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "createdAt" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "updatedAt" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "creator" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "name" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "_id" },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetPostsQuery, GetPostsQueryVariables>;
export const ViewPostDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "ViewPost" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "postId" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "viewPost" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "postId" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "postId" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "title" } },
                { kind: "Field", name: { kind: "Name", value: "imageUrl" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "creator" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      { kind: "Field", name: { kind: "Name", value: "_id" } },
                    ],
                  },
                },
                { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                { kind: "Field", name: { kind: "Name", value: "content" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ViewPostQuery, ViewPostQueryVariables>;
export const CreatePostDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "CreatePost" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "postInput" },
          },
          type: {
            kind: "NamedType",
            name: { kind: "Name", value: "PostInputData" },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "createPost" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "postInput" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "postInput" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "_id" } },
                { kind: "Field", name: { kind: "Name", value: "title" } },
                { kind: "Field", name: { kind: "Name", value: "content" } },
                { kind: "Field", name: { kind: "Name", value: "imageUrl" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CreatePostMutation, CreatePostMutationVariables>;
export const EditPostDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "EditPost" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "postId" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "postInput" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "PostInputData" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "editPost" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "postId" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "postId" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "postInput" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "postInput" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "title" } },
                { kind: "Field", name: { kind: "Name", value: "imageUrl" } },
                { kind: "Field", name: { kind: "Name", value: "content" } },
                { kind: "Field", name: { kind: "Name", value: "_id" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<EditPostMutation, EditPostMutationVariables>;
/** All built-in and custom scalars, mapped to their actual values */
