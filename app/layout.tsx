"use client";

import "./globals.css";

import {
  usePathname,
} from "next/navigation";

import Sidebar from "./components/Sidebar";
import AuthGuard from "./components/AuthGuard";
import BackButton from "./components/BackButton";

import { ThemeProvider } from "./providers/ThemeProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname =
    usePathname();

  const isLoginPage =
    pathname === "/login";

  const isDashboardPage =
    pathname === "/";

  const isTicketPage =
    pathname.startsWith(
      "/ticket/"
    );

  const showBackButton =
    !isLoginPage &&
    !isDashboardPage &&
    !isTicketPage;

  return (
    <html lang="pt-BR">
      <body>
        <ThemeProvider>
          {isLoginPage ? (
            children
          ) : (
            <AuthGuard>
              <div className="flex min-h-screen w-full bg-[var(--background)]">
  <Sidebar />

  <section className="flex-1 overflow-auto min-h-screen">
    {showBackButton && (
      <div className="px-4 pt-4 md:px-8 md:pt-8">
        <BackButton />
      </div>
    )}

    {children}
  </section>
</div>
            </AuthGuard>
          )}
        </ThemeProvider>
      </body>
    </html>
  );
}