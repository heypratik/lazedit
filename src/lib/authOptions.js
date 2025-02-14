import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      async authorize(credentials) {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/auth/login`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
                type: credentials.type,
                shopifyStoreId: credentials.shopifyStoreId || null,
              }),
            }
          );

          const data = await response.json();

          if (data.success) {
            return data.user; // Return user object with additional data
          } else {
            throw new Error(data.message);
          }
        } catch (error) {
          console.log(error);
          throw new Error("Authorization failed");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Persist the user data to the token
      if (user) {
        token.id = user.id;
        token.shopifyStoreId = user.shopifyStoreId; // Add shopifyStoreId to the token
        token.stripePlanEndsAt = user.stripePlanEndsAt; // Add stripePlanEndsAt to the token
        token.stripeCustomerId = user.stripeCustomerId; // Add stripeCustomerId to the token
        token.userType = user.userType; // Add userType to the token
        token.onboarded = user.onboarded; // Add onboarded to the token
        token.settingsCompleted = user.settingsCompleted; // Add settingsCompleted to the token
      }
      return token;
    },
    async session({ session, token }) {
      // Add user ID and shopifyStoreId to the session object
      if (token) {
        session.user.id = token.id;
        session.user.shopifyStoreId = token.shopifyStoreId; // Add shopifyStoreId to the session
        session.user.stripePlanEndsAt = token.stripePlanEndsAt; // Add stripePlanEndsAt to the session
        session.user.stripeCustomerId = token.stripeCustomerId; // Add stripeCustomerId to the session
        session.user.userType = token.userType; // Add userType to the session
        session.user.onboarded = token.onboarded; // Add onboarded to the session
        session.user.settingsCompleted = token.settingsCompleted; // Add settingsCompleted to the session
      }
      return session;
    },
  },
  secret: process.env.NEXT_PUBLIC_SECRET,
};

export default NextAuth(authOptions);
