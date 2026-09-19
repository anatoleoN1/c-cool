import type { Metadata } from "next";
import "./globals.css";
import "./c-cool-pages.css";
import AuthProvider from "@/components/auth/AuthProvider";

export const metadata: Metadata = {
  title: {
    default: "C-Cool",
    template: "%s · C-Cool",
  },
  description: "La plateforme d'éducation collective de votre établissement.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className="h-full antialiased" data-scroll-behavior="smooth">
      <body className="min-h-full flex flex-col">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
