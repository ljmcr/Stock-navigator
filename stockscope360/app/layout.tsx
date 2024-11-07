import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QCProvider } from "./provider";
import { Session } from "next-auth";
import { headers } from "next/headers";
import AuthContext from "./AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "StockScope360",
  description:
    "The stock market visualization application addresses the need for a user-friendly platform that simplifies stock tracking and analysis",
};

async function getSession(cookie: string): Promise<Session> {
  const response = await fetch(`http://localhost:3000/api/auth/session`, {
    headers: {
      cookie,
    },
  });

  const session = await response.json();

  return Object.keys(session).length > 0 ? session : null;
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession(headers().get("cookie") ?? "");

  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthContext session={session}>
          <QCProvider>{children}</QCProvider>
        </AuthContext>
      </body>
    </html>
  );
}
