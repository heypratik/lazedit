import { pgTable, text, timestamp, foreignKey, integer, boolean, primaryKey, unique } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const user = pgTable("user", {
	id: text().primaryKey().notNull(),
	name: text(),
	email: text().notNull(),
	emailVerified: timestamp({ mode: 'string' }),
	image: text(),
	password: text(),
});

export const project = pgTable("project", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	userId: text().notNull(),
	json: text().notNull(),
	height: integer().notNull(),
	width: integer().notNull(),
	thumbnailUrl: text(),
	isTemplate: boolean(),
	isPro: boolean(),
	createdAt: timestamp({ mode: 'string' }).notNull(),
	updatedAt: timestamp({ mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "project_userId_user_id_fk"
		}).onDelete("cascade"),
]);

export const session = pgTable("session", {
	sessionToken: text().primaryKey().notNull(),
	userId: text().notNull(),
	expires: timestamp({ mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "session_userId_user_id_fk"
		}).onDelete("cascade"),
]);

export const subscription = pgTable("subscription", {
	id: text().primaryKey().notNull(),
	userId: text().notNull(),
	subscriptionId: text().notNull(),
	customerId: text().notNull(),
	priceId: text().notNull(),
	status: text().notNull(),
	currentPeriodEnd: timestamp({ mode: 'string' }),
	createdAt: timestamp({ mode: 'string' }).notNull(),
	updatedAt: timestamp({ mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "subscription_userId_user_id_fk"
		}).onDelete("cascade"),
]);

export const verificationToken = pgTable("verificationToken", {
	identifier: text().notNull(),
	token: text().notNull(),
	expires: timestamp({ mode: 'string' }).notNull(),
}, (table) => [
	primaryKey({ columns: [table.identifier, table.token], name: "verificationToken_identifier_token_pk"}),
]);

export const authenticator = pgTable("authenticator", {
	credentialId: text().notNull(),
	userId: text().notNull(),
	providerAccountId: text().notNull(),
	credentialPublicKey: text().notNull(),
	counter: integer().notNull(),
	credentialDeviceType: text().notNull(),
	credentialBackedUp: boolean().notNull(),
	transports: text(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "authenticator_userId_user_id_fk"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.credentialId, table.userId], name: "authenticator_userId_credentialID_pk"}),
	unique("authenticator_credentialID_unique").on(table.credentialId),
]);

export const account = pgTable("account", {
	userId: text().notNull(),
	type: text().notNull(),
	provider: text().notNull(),
	providerAccountId: text().notNull(),
	refreshToken: text("refresh_token"),
	accessToken: text("access_token"),
	expiresAt: integer("expires_at"),
	tokenType: text("token_type"),
	scope: text(),
	idToken: text("id_token"),
	sessionState: text("session_state"),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "account_userId_user_id_fk"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.provider, table.providerAccountId], name: "account_provider_providerAccountId_pk"}),
]);
