export enum InputType {
  TITLE = "title",
  IMAGE = "image",
  CONTENT = "content",
  PASSWORD = "password",
  EMAIL = "email",
  NAME = "name",
}

export enum FeedType {
  TITLE = "title",
  IMAGE = "image",
  CONTENT = "content",
}

export enum LoginType {
  PASSWORD = "password",
  EMAIL = "email",
}

export enum SignupType {
  PASSWORD = "password",
  EMAIL = "email",
  NAME = "name",
}

export type PostType = {
  _id: string;
  title: string;
  content: string;
  creator: { _id: string; name: string };
  createdAt: string;
  imageUrl?: string;
};
