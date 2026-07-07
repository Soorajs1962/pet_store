import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { cookies } from "next/headers";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID || "",
      clientSecret: process.env.AUTH_GOOGLE_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Email or Phone", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials) return null;
        const { username, password } = credentials;
        
        // Admin credentials matching either email or custom Indian phone format (Secret Password Required)
        if (
          (username === "admin@aurapet.com" || username === "+91 99999 99999" || username === "9999999999") &&
          password === "admin123"
        ) {
          return {
            id: "admin-id",
            name: "Store Administrator",
            email: "admin@aurapet.com",
            role: "admin",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80"
          };
        }
        
        // Customer credentials matching either email or local Indiranagar default phone number (Secret Password Required)
        if (
          (username === "alexander@mercer.com" || username === "+91 98765 43210" || username === "9876543210") &&
          password === "customer123"
        ) {
          return {
            id: "customer-id",
            name: "Alexander Mercer",
            email: "alexander@mercer.com",
            role: "customer",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
          };
        }

        // Validate against registered cookie users database
        const cookieStore = await cookies();
        const existingUsersRaw = cookieStore.get("aura_pet_users")?.value;
        if (existingUsersRaw) {
          try {
            const users = JSON.parse(existingUsersRaw);
            const foundUser = users.find(
              (u: any) => 
                (u.username.toLowerCase() === username.toLowerCase() || u.phone === username) &&
                u.password === password
            );
            if (foundUser) {
              return {
                id: `dynamic-${Date.now()}`,
                name: foundUser.name,
                email: foundUser.username.includes("@") ? foundUser.username : `${foundUser.username}@aurapet.com`,
                role: "customer",
                avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"
              };
            }
          } catch {
            // Ignore error
          }
        }
        
        // If credentials don't match, return null to fail sign-in
        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.avatar = (user as any).avatar;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).avatar = token.avatar;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login"
  },
  secret: process.env.NEXTAUTH_SECRET || "aurapet-premium-secret-token-key-2026"
});

export { handler as GET, handler as POST };
