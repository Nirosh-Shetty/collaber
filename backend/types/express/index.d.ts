// types/express/index.d.ts or types/express.d.ts (whichever convention you follow)

import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface User extends JwtPayload {
      uid: string;
      username?:string,
      role: "influencer" | "brand" | "manager";
    }
  }
}
