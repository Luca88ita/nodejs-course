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

  export const fetchSinglePostQuery = gql(`
  query ViewPost($postId: ID!) {
    viewPost(postId: $postId) {
      title
      imageUrl
      creator {
        name
        _id
      }
      createdAt
      content
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

  export const editPostQuery = gql(`
  mutation EditPost($postId: ID!, $postInput: PostInputData!) {
    editPost(postId: $postId, postInput: $postInput) {
      title
      imageUrl
      content
      _id
    }
  }
`) as DocumentNode | TypedDocumentNode<any, OperationVariables>;

  export const deletePostQuery = gql(`
  mutation DeletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`) as DocumentNode | TypedDocumentNode<any, OperationVariables>;

  export const fetchUserStatusQuery = gql(`
  query FetchUserStatus {
    fetchUserStatus
  }
`) as DocumentNode | TypedDocumentNode<any, OperationVariables>;

  export const editUserStatusQuery = gql(`
  mutation EditUserStatus($newStatus: String!) {
    editUserStatus(newStatus: $newStatus) {
      _id
      name
      status
    }
  }
`) as DocumentNode | TypedDocumentNode<any, OperationVariables>;
}

export default Queries;
