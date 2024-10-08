import type { Metadata, Viewport } from "next";
import "./globals.css";
import { kalnia, lato } from "@/assets/fonts";

export const metadata: Metadata = {
  title: "Purrr.chat | Talk to Strangers Online | Connect Now",
  description: "You can now connect with a random stranger online and chat.",
  metadataBase: new URL(process.env.BASE_URL || "http://localhost:3000"),
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  interactiveWidget: "resizes-content",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={kalnia.variable + " " + lato.variable}>
        {children}
      </body>
    </html>
  );
}
