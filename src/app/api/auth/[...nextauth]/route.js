import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const authHandler = NextAuth({
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim();
        const password = credentials?.password;

        if (!email || !password) {
          throw new Error("Email and password are required");
        }

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
        if (!baseUrl) {
          throw new Error("NEXT_PUBLIC_BASE_URL is not configured");
        }

        const res = await fetch(
          `${baseUrl}/public/get-sals-person`,
          {
            method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),  },
        );

         if (!res.ok) return null;

        const result = await res.json();
        if (result?.error || !result?.data || !result?.token) {
          return null;
        }

        const salesPerson = result.data;
        const token =
          result?.token ||
          salesPerson?.token ||
          salesPerson?.auth_token ||
          salesPerson?.authToken ||
          null;
 if (!token) return null;
        return {
          id: String(
            salesPerson?.id ??
              salesPerson?.sale_person_id ??
              salesPerson?.sales_person_id ??
              email,
          ),
          email: salesPerson?.email ?? email,
          name:
            salesPerson?.name ||
            salesPerson?.full_name ||
            salesPerson?.sales_person_name ||
            email,
          token,
          rawUser: salesPerson,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user.rawUser ?? null;
        token.accessToken = user.token ?? null;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user ?? session.user;
      session.accessToken = token.accessToken ?? null;
      return session;
    },
  },
  pages: {
    signIn: "/",
  },
});

export { authHandler as GET, authHandler as POST };

