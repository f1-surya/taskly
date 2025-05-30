import { relations } from "drizzle-orm";
import * as t from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "next-auth/adapters";

const timestamps = {
  createdAt: t.timestamp().notNull().defaultNow(),
  updatedAt: t
    .timestamp()
    .notNull()
    .$onUpdate(() => new Date()),
};

export const users = t.pgTable(
  "user",
  {
    id: t
      .text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    email: t.text().unique().notNull(),
    name: t.text().notNull(),
    emailVerfied: t.timestamp("emailVerified", { mode: "date" }),
    image: t.text("image"),
  },
  (table) => [t.index("emailIndex").on(table.email)],
);

export const userRelations = relations(users, ({ many }) => ({
  boards: many(boards),
}));

export const accounts = t.pgTable(
  "account",
  {
    userId: t
      .text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: t.text("type").$type<AdapterAccountType>().notNull(),
    provider: t.text("provider").notNull(),
    providerAccountId: t.text("providerAccountId").notNull(),
    refresh_token: t.text("refresh_token"),
    access_token: t.text("access_token"),
    expires_at: t.integer("expires_at"),
    token_type: t.text("token_type"),
    scope: t.text("scope"),
    id_token: t.text("id_token"),
    session_state: t.text("session_state"),
  },
  (account) => [
    {
      compoundKey: t.primaryKey({
        columns: [account.provider, account.providerAccountId],
      }),
    },
  ],
);

export const sessions = t.pgTable("session", {
  sessionToken: t.text().primaryKey(),
  userId: t
    .text()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: t.timestamp("expires", { mode: "date" }).notNull(),
});

export const veriffcationTokens = t.pgTable(
  "verificationToken",
  {
    identifier: t.text().notNull(),
    token: t.text().notNull(),
    expires: t.timestamp("expires", { mode: "date" }).notNull(),
  },
  (token) => [
    {
      compositePk: t.primaryKey({
        columns: [token.identifier, token.token],
      }),
    },
  ],
);

export const authenticators = t.pgTable(
  "authenticator",
  {
    credentialId: t.text().notNull().unique(),
    userId: t
      .text()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: t.text().notNull(),
    credentialPublicKey: t.text().notNull(),
    counter: t.integer().notNull(),
    credentialDeviceType: t.text().notNull(),
    crendentialBackedUp: t.boolean().notNull(),
    transports: t.text(),
  },
  (auth) => [
    {
      compositePk: t.primaryKey({
        columns: [auth.userId, auth.credentialId],
      }),
    },
  ],
);

export const boards = t.pgTable(
  "boards",
  {
    id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
    name: t.varchar().notNull(),
    isPinned: t.boolean().notNull().default(false),
    owner: t
      .text()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    ...timestamps,
  },
  (table) => [t.index("id_idx").on(table.id)],
);

export const boardRelations = relations(boards, ({ one, many }) => ({
  owner: one(users, {
    fields: [boards.owner],
    references: [users.id],
  }),
  columns: many(columns),
}));

export const columns = t.pgTable(
  "columns",
  {
    id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
    name: t.varchar().notNull(),
    board: t
      .integer()
      .notNull()
      .references(() => boards.id, { onDelete: "cascade" }),
    index: t.integer().notNull(),
    ...timestamps,
  },
  (table) => [t.index("parent_idx").on(table.board)],
);

export const columnRelations = relations(columns, ({ one, many }) => ({
  board: one(boards, {
    fields: [columns.board],
    references: [boards.id],
  }),
  tasks: many(tasks),
}));

export const tasks = t.pgTable(
  "tasks",
  {
    id: t
      .text()
      .primaryKey()
      .$defaultFn(() => `task-${crypto.randomUUID()}`),
    title: t.varchar().notNull(),
    body: t.varchar(),
    column: t
      .integer()
      .notNull()
      .references(() => columns.id, { onDelete: "cascade" }),
    index: t.integer().notNull(),
    ...timestamps,
  },
  (table) => [t.index("columnIndex").on(table.column)],
);

export const taskRelations = relations(tasks, ({ one }) => ({
  column: one(columns, {
    fields: [tasks.column],
    references: [columns.id],
  }),
}));
