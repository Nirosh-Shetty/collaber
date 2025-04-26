// types/express/index.d.ts or types/express.d.ts (whichever convention you follow)

import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface User extends JwtPayload {
      id: string;
      email: string;
      role?: string;
    }
  }
}
