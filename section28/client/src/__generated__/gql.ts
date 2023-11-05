/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  mutation CreateUser($userInput: UserInputData) {\n    createUser(userInput: $userInput) {\n      email\n      name\n    }\n  } \n": types.CreateUserDocument,
    "\n  query Login($password: String!, $email: String!) {\n    login(password: $password, email: $email) {\n      token\n      userId\n    }\n  }\n": types.LoginDocument,
    "\n  query GetPosts($currentPage: Int!, $postPerPage: Int!) {\n    fetchPosts(currentPage: $currentPage, postPerPage: $postPerPage) {\n      totalItems\n      posts {\n        _id\n        title\n        content\n        imageUrl\n        createdAt\n        updatedAt\n        creator {\n          name\n          _id\n        }\n      }\n    }\n  }\n": types.GetPostsDocument,
    "\n  query ViewPost($postId: ID!) {\n    viewPost(postId: $postId) {\n      title\n      imageUrl\n      creator {\n        name\n        _id\n      }\n      createdAt\n      content\n    }\n  }\n": types.ViewPostDocument,
    "\n  mutation CreatePost($postInput: PostInputData) {\n    createPost(postInput: $postInput) {\n      _id\n      title\n      content\n      imageUrl\n    }\n  }\n": types.CreatePostDocument,
    "\n  mutation EditPost($postId: ID!, $postInput: PostInputData!) {\n    editPost(postId: $postId, postInput: $postInput) {\n      title\n      imageUrl\n      content\n      _id\n    }\n  }\n": types.EditPostDocument,
    "\n  mutation DeletePost($postId: ID!) {\n    deletePost(postId: $postId)\n  }\n": types.DeletePostDocument,
    "\n  query FetchUserStatus {\n    fetchUserStatus\n  }\n": types.FetchUserStatusDocument,
    "\n  mutation EditUserStatus($newStatus: String!) {\n    editUserStatus(newStatus: $newStatus) {\n      _id\n      name\n      status\n    }\n  }\n": types.EditUserStatusDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateUser($userInput: UserInputData) {\n    createUser(userInput: $userInput) {\n      email\n      name\n    }\n  } \n"): (typeof documents)["\n  mutation CreateUser($userInput: UserInputData) {\n    createUser(userInput: $userInput) {\n      email\n      name\n    }\n  } \n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query Login($password: String!, $email: String!) {\n    login(password: $password, email: $email) {\n      token\n      userId\n    }\n  }\n"): (typeof documents)["\n  query Login($password: String!, $email: String!) {\n    login(password: $password, email: $email) {\n      token\n      userId\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetPosts($currentPage: Int!, $postPerPage: Int!) {\n    fetchPosts(currentPage: $currentPage, postPerPage: $postPerPage) {\n      totalItems\n      posts {\n        _id\n        title\n        content\n        imageUrl\n        createdAt\n        updatedAt\n        creator {\n          name\n          _id\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetPosts($currentPage: Int!, $postPerPage: Int!) {\n    fetchPosts(currentPage: $currentPage, postPerPage: $postPerPage) {\n      totalItems\n      posts {\n        _id\n        title\n        content\n        imageUrl\n        createdAt\n        updatedAt\n        creator {\n          name\n          _id\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query ViewPost($postId: ID!) {\n    viewPost(postId: $postId) {\n      title\n      imageUrl\n      creator {\n        name\n        _id\n      }\n      createdAt\n      content\n    }\n  }\n"): (typeof documents)["\n  query ViewPost($postId: ID!) {\n    viewPost(postId: $postId) {\n      title\n      imageUrl\n      creator {\n        name\n        _id\n      }\n      createdAt\n      content\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreatePost($postInput: PostInputData) {\n    createPost(postInput: $postInput) {\n      _id\n      title\n      content\n      imageUrl\n    }\n  }\n"): (typeof documents)["\n  mutation CreatePost($postInput: PostInputData) {\n    createPost(postInput: $postInput) {\n      _id\n      title\n      content\n      imageUrl\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation EditPost($postId: ID!, $postInput: PostInputData!) {\n    editPost(postId: $postId, postInput: $postInput) {\n      title\n      imageUrl\n      content\n      _id\n    }\n  }\n"): (typeof documents)["\n  mutation EditPost($postId: ID!, $postInput: PostInputData!) {\n    editPost(postId: $postId, postInput: $postInput) {\n      title\n      imageUrl\n      content\n      _id\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation DeletePost($postId: ID!) {\n    deletePost(postId: $postId)\n  }\n"): (typeof documents)["\n  mutation DeletePost($postId: ID!) {\n    deletePost(postId: $postId)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query FetchUserStatus {\n    fetchUserStatus\n  }\n"): (typeof documents)["\n  query FetchUserStatus {\n    fetchUserStatus\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation EditUserStatus($newStatus: String!) {\n    editUserStatus(newStatus: $newStatus) {\n      _id\n      name\n      status\n    }\n  }\n"): (typeof documents)["\n  mutation EditUserStatus($newStatus: String!) {\n    editUserStatus(newStatus: $newStatus) {\n      _id\n      name\n      status\n    }\n  }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;