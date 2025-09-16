import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const response = await fetch("https://api.artlighthouse.ge/en/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          const data = await response.json();

          if (response.ok && data.success) {
            const { user, token, token_type } = data.data;

            // Return user with token data - localStorage will be handled on client side
            return {
              id: user.id.toString(),
              email: user.email,
              name: user.first_name,
              accessToken: token,
              tokenType: token_type,
            };
          }

          return null;
        } catch (error) {
          console.error("Login error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.tokenType = user.tokenType;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.tokenType = token.tokenType;
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
  },
};
