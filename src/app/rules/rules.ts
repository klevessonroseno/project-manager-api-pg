export interface JwtPayloadToken {
  managerId: string;
  managerName: string;
  managerEmail: string;
  iat: number;
  ext: number;
}

export interface ICollaborator {
  id?: string;
  name: string;
  email: string;
  password?: string;
  managerId?: string;
}

export interface IEmailData {
  from?: string,
  to?: string,
  subject?: string,
  html?: string
};
