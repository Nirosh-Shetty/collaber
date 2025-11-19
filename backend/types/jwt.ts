export interface AccessTokenPayload {
  uid: string;
  role: "influencer" | "brand";
  username: string;
  iat: number;
  exp: number;
}
 
export interface RefreshTokenPayload {
  uid: string;
  tokenId: string;
  iat: number;
  exp: number;
}
 
