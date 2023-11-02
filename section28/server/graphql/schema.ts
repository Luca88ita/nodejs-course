// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
export const typeDefs = `#graphql
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type Post {
    _id: ID!
    title: String!
    content: String!
    imageUrl: String!
    creator: User!
    createdAt: String!
    updatedAt: String!
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
    imageUrl: String!
  }

  input UserInputData {
    email: String!
    name: String!
    password: String!
  }

  type Mutation {
    createUser(userInput: UserInputData): User!
    createPost(postInput: PostInputData): Post!
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    login(email: String!, password: String!): AuthData!
  }
`;
