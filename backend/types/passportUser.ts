export interface PassportUser {
  id: string;
  uid: string;
  name: string;
  email: string;
  username: string;
  role: "influencer" | "brand" | "manager";
}
