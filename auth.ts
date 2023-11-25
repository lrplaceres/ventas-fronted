import NextAuth from "next-auth";
import type { NextAuthConfig, User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";

declare module "next-auth" {
  interface Session {
    user: {
      //picture?: string;
      access_token?: string;
    } & Omit<User, "id">;
  }
}

export const authConfig = {
  debug: true,
  providers: [
    Credentials({
      credentials: { username: { label: "Username", type: "text" }, password: { label: "Password", type: "password" }, csrf: { type: "hidden" } },

      authorize(c) {

        var formData = new FormData();
        formData.append("username", c.username);
        formData.append("password", c.password);

        return fetch(`${process.env.MI_API_BACKEND}/token`, {
          method: "POST",
          body: formData,
        })
          .then(function (response) {
            if (response.status != 200) return null;
            return response.json().then((data) => {
              //console.log(data)
              return data;
            })
          }
          );

        //if (c.password !== "1") return null;
        /*return {
          name: "Fill Murray",
          email: "bill@fillmurray.com",
          image: "https://www.fillmurray.com/64/64",
          id: "1",
        };*/
      },
    }),
  ],
  callbacks: {
    authorized(params) {
      return !!params.auth?.user;
    },
    async redirect({ url, baseUrl }) {
      return baseUrl
    },
    async jwt({ token, user }) {
      // Persist the OAuth access_token to the token right after signin
      if (user) {
        token.rol = user.rol;
        token.access_token = user.access_token;
        token.token_type = user.token_type;
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client, like an access_token from a provider.
      session.rol = token.rol;
      session.access_token = token.access_token;
      session.token_type = token.token_type;
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 20 * 60 * 60, // 20 horas
    async encode() {},
    async decode() {},
  },
  pages: {
    signIn: '/login',
    error: '/error/server',
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);