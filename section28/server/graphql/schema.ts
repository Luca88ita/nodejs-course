export const typeDefs = `#graphql
   type Post {
    _id: ID!
    title: String!
    content: String!
    imageUrl: String!
    creator: User!
    createdAt: String!
    updatedAt: String!
  }

  type PostsData {
    posts: [Post]!
    totalItems: Int!
  }
  
  type User {
    _id: ID!
    email: String!
    name: String!
    password: String
    status: String
    posts: [Post!]!
  }

  type AuthData {
    token: String!
    userId: String!
  }

  input PostInputData {
    title: String!
    content: String!
    imageUrl: String
  }

  input UserInputData {
    email: String!
    name: String!
    password: String!
  }

  type Mutation {
    createUser(userInput: UserInputData): User!
    createPost(postInput: PostInputData): Post!
    editPost(postId: ID!, postInput: PostInputData!): Post!
    deletePost(postId: ID!): ID!
  }

  type Query {
    login(email: String!, password: String!): AuthData!
    fetchPosts(currentPage: Int!, postPerPage: Int!): PostsData!
    viewPost(postId: ID!): Post!
  }
`;
