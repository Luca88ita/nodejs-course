import {
  DocumentNode,
  OperationVariables,
  TypedDocumentNode,
} from "@apollo/client";
import { gql } from "../__generated__";

namespace Queries {
  export const signupQuery = gql(`
  mutation CreateUser($userInput: UserInputData) {
    createUser(userInput: $userInput) {
      email
      name
    }
  } 
`) as DocumentNode | TypedDocumentNode<any, OperationVariables>;

  export const loginQuery = gql(`
  query Login($password: String!, $email: String!) {
    login(password: $password, email: $email) {
      token
      userId
    }
  }
`) as DocumentNode | TypedDocumentNode<any, OperationVariables>;

  export const fetchPostsQuery = gql(`
  query GetPosts($currentPage: Int!, $postPerPage: Int!) {
    fetchPosts(currentPage: $currentPage, postPerPage: $postPerPage) {
      totalItems
      posts {
        _id
        title
        content
        imageUrl
        createdAt
        updatedAt
        creator {
          name
          _id
        }
      }
    }
  }
`) as DocumentNode | TypedDocumentNode<any, OperationVariables>;

  export const createPostQuery = gql(`
  mutation CreatePost($postInput: PostInputData) {
    createPost(postInput: $postInput) {
      _id
      title
      content
      imageUrl
    }
  }
`) as DocumentNode | TypedDocumentNode<any, OperationVariables>;
}

export default Queries;
