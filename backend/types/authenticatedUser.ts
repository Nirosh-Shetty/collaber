export interface AuthenticatedRequestUser {
  id: string;
  uid?: string;
  username?: string;
  email?: string;
  name?: string;
  role: "influencer" | "brand" | "manager";
}
