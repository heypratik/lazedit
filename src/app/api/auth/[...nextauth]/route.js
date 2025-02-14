import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { authOptions } from '@/lib/authOptions';

// NextAuth configuration
// const authOptions = {
//   providers: [
//     CredentialsProvider({
//       name: 'Credentials',
//       async authorize(credentials) {
//         try {
//           const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/auth/login`, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({
//               email: credentials.email,
//               password: credentials.password,
//             }),
//           });

//           const data = await response.json();

//           if (data.success) {
//             return data.user; // Return user object with additional data
//           } else {
//             console.log(data);
//             throw new Error(data.message);
//           }
//         } catch (error) {
//           console.log(error);
//           throw new Error('Authorization failed');
//         }
//       },
//     }),
//   ],
//   callbacks: {
//     async session({ session, token }) {
//       // Add user ID to the session object
//       if (token) {
//         session.user.id = token.id; // Add user ID to session
//       }
//       return session;
//     },
//     async jwt({ token, user }) {
//       // Persist the user ID to the token
//       if (user) {
//         token.id = user.id; // Add user ID to token
//       }
//       return token;
//     },
//   },
//   secret: process.env.NEXT_PUBLIC_SECRET,
// };

// Initialize NextAuth
const handler = NextAuth(authOptions);

// Export named handlers
export { handler as GET, handler as POST };
