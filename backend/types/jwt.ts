export interface AccessTokenPayload {
  id: string;
  uid?: string;
  role: "influencer" | "brand" | "manager";
  username?: string;
  iat: number;
  exp: number;
}
 
export interface RefreshTokenPayload {
  id: string;
  uid?: string;
  tokenId: string;
  iat: number;
  exp: number;
}
 
