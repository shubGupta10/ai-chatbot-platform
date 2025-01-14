import NextAuth, { DefaultSession, NextAuthOptions } from "next-auth";
import GoogleProvider from 'next-auth/providers/google'
import UserModel from "@/models/userModel";
import dbConnect from "@/libs/dbConnect";

declare module "next-auth" {
    interface Session extends DefaultSession {
        user: {
            id?: string;
            username?: string;
        } & DefaultSession["user"];
    }
}

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
        })
    ],
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: '/auth/signin',
        signOut: '/'
    },
    callbacks: {
        async signIn({ user }) {
            try {
                await dbConnect();
                const existingUser = await UserModel.findOne({ email: user.email });
                if (!existingUser) {
                    await UserModel.create({
                        username: user.email?.split('@')[0], 
                        name: user.name,
                        email: user.email,
                        image: user.image,
                    });
                }
                return true;
            } catch (error: any) {
                console.error("Error saving user to database:", error);
                return false;
            }
        },
        async session({session, token}){
            try {
                await dbConnect();
                const dbUser = await UserModel.findOne({email: session.user?.email}) as { _id: string, username: string, name: string, image: string };
                if (session.user && dbUser) {
                    session.user.id = dbUser._id.toString();
                    session.user.username = dbUser.username;
                    session.user.name = dbUser.name;
                    session.user.image = dbUser.image;
                }
                return session;
            } catch (error) {
                console.error("Error fetching user from database:", error);
                return session;
            }
        }
    }
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }

