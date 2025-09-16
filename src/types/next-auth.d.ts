import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session extends DefaultSession {
    accessToken?: string;
    tokenType?: string;
    user?: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  interface User extends DefaultUser {
    id?: string;
    accessToken?: string;
    tokenType?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    accessToken?: string;
    tokenType?: string;
  }
}
