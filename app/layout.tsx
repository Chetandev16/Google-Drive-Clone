import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";
import ModalProvider from "@/components/provider/ModalProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "G-Drive Clone",
  description:
    "made google drive clone for eductational purposes and learning of files uploading functionality",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          {children}
          <ModalProvider />
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
