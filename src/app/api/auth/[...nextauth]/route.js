import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import crypto from "crypto";
import { getDbPool } from "@/lib/db";
import { verifyPassword } from "@/lib/password";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const normalizeBaseUrl = (url) => url?.replace(/\/+$/, "");

async function authorizeFromApi(email, password) {
  const apiBaseUrl = normalizeBaseUrl(process.env.AUTH_API_BASE_URL);
  if (!apiBaseUrl) return null;

  try {
    const res = await fetch(`${apiBaseUrl}/public/get-sals-person`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      console.error(
        `[auth] Login API failed: ${res.status} ${res.statusText} (${apiBaseUrl}/public/get-sals-person)`,
      );
      return null;
    }

    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      console.error("[auth] Login API returned a non-JSON response");
      return null;
    }

    const result = await res.json();
    if (result?.error || !result?.data || !result?.token) {
      return null;
    }

    const salesPerson = result.data;
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
      token: result.token,
      rawUser: salesPerson,
    };
  } catch {
    console.error("[auth] Login API unavailable, falling back to database");
    return null;
  }
}

async function authorizeFromDatabase(email, password) {
  const db = getDbPool();
  const [rows] = await db.execute(
    `SELECT id, full_name, email, phone_number, password, department, account_status
     FROM tbl_sales_persons
     WHERE email = :email
     LIMIT 1`,
    { email },
  );

  const salesPerson = rows[0];
  if (!salesPerson || Number(salesPerson.account_status) !== 1) {
    return null;
  }

  if (!verifyPassword(password, salesPerson.password)) {
    return null;
  }

  const safeSalesPerson = { ...salesPerson };
  delete safeSalesPerson.password;

  return {
    id: String(salesPerson.id ?? email),
    email: salesPerson.email ?? email,
    name: salesPerson.full_name || email,
    token: crypto.randomBytes(32).toString("hex"),
    rawUser: safeSalesPerson,
  };
}

const authHandler = NextAuth({
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
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

        return (
          (await authorizeFromApi(email, password)) ||
          (await authorizeFromDatabase(email, password))
        );
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

