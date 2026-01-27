import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "INFECTED - Apocalyptic Survival TTRPG",
  description: "A solo survival horror TTRPG experience with an AI Game Master",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
