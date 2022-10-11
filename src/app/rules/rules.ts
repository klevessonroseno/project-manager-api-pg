export interface IUser {
  id?: string;
  name?: string;
  email?: string;
  password?: string;
}

export interface ICollaborators {
  id?: string;
  name?: string;
  email?: string;
  password?: string;
  userId?: string;
}

export interface TokenPayload {
  userId: string;
  userName: string;
  iat: number;
  ext: number;
}