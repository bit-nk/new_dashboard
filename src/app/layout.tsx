import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import { ThemeProvider } from "@/lib/ThemeContext";
import { CustomerProvider } from "@/lib/CustomerContext";

export const metadata: Metadata = {
  title: "CrushBank Dashboard",
  description: "System Monitoring & Analytics Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta
          httpEquiv="Content-Security-Policy"
          content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self';"
        />
      </head>
      <body className="min-h-screen bg-[#f8f9fb] dark:bg-[#0f1117] transition-colors duration-200">
        <ThemeProvider>
          <CustomerProvider>
            <Header />
            <main className="max-w-[1440px] mx-auto px-4 sm:px-6 py-4 sm:py-6">
              {children}
            </main>
          </CustomerProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
