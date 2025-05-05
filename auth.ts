import { db } from "@/db";
import { boards, columns } from "@/db/schema";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth from "next-auth";
import type { Provider } from "next-auth/providers";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";

const providers: Provider[] = [GitHub];

if (process.env.NODE_ENV === "development") {
  providers.push(
    Credentials({
      id: "password",
      name: "Password",
      credentials: {
        password: { label: "Password", type: "password" },
      },
      authorize: (credentials) => {
        if (credentials.password === "password") {
          return {
            email: "bob@alice.com",
            name: "Bob Alice",
            image: "https://avatars.githubusercontent.com/u/67470890?s=200&v=4",
          };
        }
      },
    }),
  );
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers,
  pages: {
    signIn: "/login",
  },
  events: {
    async createUser({ user }) {
      const [defaultBoard] = await db
        .insert(boards)
        .values({
          name: "My first board",
          owner: user.id!,
        })
        .returning();
      const defaultColumns = [
        { name: "To Do", index: 0 },
        { name: "In Progress", index: 1 },
        { name: "Done", index: 2 },
      ];

      await db.insert(columns).values(
        defaultColumns.map((column) => ({
          name: column.name,
          board: defaultBoard.id,
          index: column.index,
        })),
      );
    },
  },
});
