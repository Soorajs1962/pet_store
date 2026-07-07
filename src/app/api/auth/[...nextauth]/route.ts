import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

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
        const { username } = credentials;
        
        // Admin credentials matching either email or custom Indian phone format
        if (username === "admin@aurapet.com" || username === "+91 99999 99999" || username === "9999999999") {
          return {
            id: "admin-id",
            name: "Store Administrator",
            email: "admin@aurapet.com",
            role: "admin",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80"
          };
        }
        
        // Customer credentials matching either email or local Indiranagar default phone number
        if (username === "alexander@mercer.com" || username === "+91 98765 43210" || username === "9876543210") {
          return {
            id: "customer-id",
            name: "Alexander Mercer",
            email: "alexander@mercer.com",
            role: "customer",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
          };
        }
        
        // Generate dynamic customer profile if they sign in with any other credentials
        const isEmail = username.includes("@");
        const displayName = isEmail ? username.split("@")[0] : "Premium Customer";
        
        return {
          id: `dynamic-${Date.now()}`,
          name: displayName.charAt(0).toUpperCase() + displayName.slice(1),
          email: isEmail ? username : `${username}@aurapet.com`,
          role: "customer",
          avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"
        };
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
