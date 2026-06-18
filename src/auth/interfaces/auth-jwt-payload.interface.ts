export interface AuthJwtPayload {
  sub: string;
  familyId: string;
  type: "family_session" | "member_session";
  memberId?: string;
  role?: string;
  isAdmin?: boolean;
}
