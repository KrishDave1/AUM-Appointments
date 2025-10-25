import { type Session, type User } from "next-auth"
import type { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";

export const authOptions: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
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

        const doctor = await prisma.doctor.findUnique({
          where: {
            email: credentials.email as string,
          },
        });

        if (!doctor) {
          return null;
        }

        // For now, we'll use a simple password check
        // In production, you should hash passwords
        const isPasswordValid = credentials.password as string === "admin123"; // Temporary

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: doctor.id,
          email: doctor.email,
          name: doctor.name,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async jwt({ token, user }: { token: any; user: User }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: any }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};
