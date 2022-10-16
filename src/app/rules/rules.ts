export interface JwtPayloadToken {
  userId: string;
  userName: string;
  userEmail: string;
  iat: number;
  ext: number;
}