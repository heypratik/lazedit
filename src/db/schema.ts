import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import {
  boolean,
  timestamp,
  pgTable,
  text,
  integer,
  serial,
  jsonb,
  json,
} from "drizzle-orm/pg-core"

// Better-auth tables (auto-generated)
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => new Date())
    .notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => new Date())
    .notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// Organizations table (from your live Neon database)
export const organizations = pgTable("organizations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  created_at: timestamp("created_at", { mode: "date" }).notNull(),
  updated_at: timestamp("updated_at", { mode: "date" }).notNull(),
});

// Users table (from your live Neon database)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  organization_id: integer("organization_id").references(() => organizations.id, { onDelete: "set null" }),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  stripeCustomerId: text("stripeCustomerId"),
  stripePlanEndsAt: timestamp("stripePlanEndsAt", { mode: "date" }),
  onboarded: boolean("onboarded").default(false),
  creditsAvailable: integer("creditsAvailable").default(0).notNull(),
  created_at: timestamp("created_at", { mode: "date" }).notNull(),
  updated_at: timestamp("updated_at", { mode: "date" }).notNull(),
});

// Projects table (from your live Neon database)
export const projects = pgTable("projects", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  organization_id: integer("organization_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  user_id: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  json: json("json"),
  height: integer("height"),
  width: integer("width"),
  thumbnail_url: text("thumbnail_url"),
  created_at: timestamp("created_at", { mode: "date" }).notNull(),
  updated_at: timestamp("updated_at", { mode: "date" }).notNull(),
});

// Images table (from your live Neon database)
export const images = pgTable("images", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  organization_id: integer("organization_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  filename: text("filename").notNull(),
  media_object_key: text("media_object_key").notNull(),
  metadata: jsonb("metadata"),
  created_at: timestamp("created_at", { mode: "date" }).notNull(),
  updated_at: timestamp("updated_at", { mode: "date" }).notNull(),
});

// Relations
export const organizationsRelations = relations(organizations, ({ many }) => ({
  users: many(users),
  projects: many(projects),
  images: many(images),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [users.organization_id],
    references: [organizations.id],
  }),
  projects: many(projects),
  images: many(images),
}));

export const projectsRelations = relations(projects, ({ one }) => ({
  organization: one(organizations, {
    fields: [projects.organization_id],
    references: [organizations.id],
  }),
  user: one(users, {
    fields: [projects.user_id],
    references: [users.id],
  }),
}));

export const imagesRelations = relations(images, ({ one }) => ({
  user: one(users, {
    fields: [images.user_id],
    references: [users.id],
  }),
  organization: one(organizations, {
    fields: [images.organization_id],
    references: [organizations.id],
  }),
}));

// Schema exports for easy use
export const projectsInsertSchema = createInsertSchema(projects);
export const usersInsertSchema = createInsertSchema(users);
export const organizationsInsertSchema = createInsertSchema(organizations);
export const imagesInsertSchema = createInsertSchema(images);
