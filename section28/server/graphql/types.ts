export type UserInputData = {
  email: string;
  name?: string;
  password: string;
};

export type PostInputData = {
  title?: string;
  content?: string;
  imageUrl?: string;
};

export type AuthData = {
  token: string;
  userId: string;
};

export type UserArguments = {
  userInput?: UserInputData;
  authData?: AuthData;
  email?: string;
  password?: string;
};

export type PostArguments = {
  postInput?: PostInputData;
};
