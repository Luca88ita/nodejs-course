import { gql } from "../__generated__";

namespace Queries {
  export const signupQuery = gql(`
  mutation Mutation($userInput: UserInputData) {
    createUser(userInput: $userInput) {
      email
      name
    }
  } 
`);
  export const loginQuery = gql(`
  query Query($password: String!, $email: String!) {
    login(password: $password, email: $email) {
      token
      userId
    }
  }
`);
}

export default Queries;
