export interface JwtPayloadToken {
  userId: string;
  userName: string;
  iat: number;
  ext: number;
}