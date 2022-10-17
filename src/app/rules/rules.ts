export interface JwtPayloadToken {
  managerId: string;
  managerName: string;
  managerEmail: string;
  iat: number;
  ext: number;
}