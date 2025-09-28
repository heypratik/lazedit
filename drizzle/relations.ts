import { relations } from "drizzle-orm/relations";
import { user, project, session, subscription, authenticator, account } from "./schema";

export const projectRelations = relations(project, ({one}) => ({
	user: one(user, {
		fields: [project.userId],
		references: [user.id]
	}),
}));

export const userRelations = relations(user, ({many}) => ({
	projects: many(project),
	sessions: many(session),
	subscriptions: many(subscription),
	authenticators: many(authenticator),
	accounts: many(account),
}));

export const sessionRelations = relations(session, ({one}) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id]
	}),
}));

export const subscriptionRelations = relations(subscription, ({one}) => ({
	user: one(user, {
		fields: [subscription.userId],
		references: [user.id]
	}),
}));

export const authenticatorRelations = relations(authenticator, ({one}) => ({
	user: one(user, {
		fields: [authenticator.userId],
		references: [user.id]
	}),
}));

export const accountRelations = relations(account, ({one}) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id]
	}),
}));