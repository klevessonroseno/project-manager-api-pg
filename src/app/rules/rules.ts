export interface JwtPayloadToken {
  managerId: string;
  managerName: string;
  managerEmail: string;
  iat: number;
  ext: number;
}

export interface IEmailData {
  from?: string,
  to?: string,
  subject?: string,
  html?: string
};
