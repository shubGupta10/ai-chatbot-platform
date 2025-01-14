import type { Metadata } from "next";
import "./globals.css";
import { SessionWrapper } from "@/components/SessionWrapper";
import  { Toaster } from 'react-hot-toast';


export const metadata: Metadata = {
  title: "DevChat - AI-Powered Chatbot Platform",
  description: "DevChat allows you to create AI chatbots that interact with visitors and provide personalized responses based on the context you set.",
};


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionWrapper>
    <html lang="en">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
    </SessionWrapper>
  );
}
