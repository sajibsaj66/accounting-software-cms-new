import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/component/providers/AuthProvider";
import ReactQueryProvider from "@/component/providers/ReactQueryProvider";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "CRM Pro",
  description: "CRM Dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ReactQueryProvider>
          <AuthProvider>{children}</AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
