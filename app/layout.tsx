import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.scss";
import { Toaster } from "react-hot-toast";
import SessionWraper from "../../nomina/app/SessionWrapper";
import { UsersDetailsProvider } from "./Context/UsersDetailsContext";
import GoogleMapsProvider from "./GoogleMapsProvider";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nomina - DOCHUB",
  description: "Nomina management system for Dochub",
  keywords: [
    "Nomina",
    "Dochub",
    "Payroll",
    "Employee Management",
    "HR Software",
    "Salary Management",
    "Workforce Solutions",
    "Business Management",
    "Employee Records",
    "Payroll Processing",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster position="top-right" reverseOrder={false} />
        <SessionWraper>
          <UsersDetailsProvider>{children}</UsersDetailsProvider>
        </SessionWraper>{" "}
      </body>
    </html>
  );
}
