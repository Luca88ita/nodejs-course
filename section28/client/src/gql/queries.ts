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
}

export default Queries;
