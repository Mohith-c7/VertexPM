import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/features/auth/providers/AuthProvider";
import { ToastProvider } from "@/providers/ToastProvider";
import { WorkItemDrawerProvider, WorkItemDrawer } from "@/features/workitems";
import { RealtimeProvider } from "@/services/realtime";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VertexPM",
  description: "AI-powered collaborative project management platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ToastProvider>
          <AuthProvider>
            <RealtimeProvider>
              <WorkItemDrawerProvider>
                {children}
                <WorkItemDrawer />
              </WorkItemDrawerProvider>
            </RealtimeProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
