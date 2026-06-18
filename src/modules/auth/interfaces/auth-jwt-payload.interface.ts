export interface AuthJwtPayload {
  sub: string;
  email: string;
  applicationId: string;
  clientId: string;
  role: string;
}
