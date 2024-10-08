import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ConvexClientProvider } from "@/components/ConvexClientProvider";
import {
  ConvexAuthNextjsServerProvider,
  isAuthenticatedNextjs,
} from "@convex-dev/auth/nextjs/server";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button"; // Assuming Shadcn's Button component
import { LeftSideBar } from "./components/leftsidebar.layout";
import { Header } from "./components/header.layout";
import { ToastContainer } from "react-toastify";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "LinkedIn Clone",
  description: "Professional networking platform clone using Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isAuthenticated = isAuthenticatedNextjs();

  return (
    <ConvexAuthNextjsServerProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-100`}
        >
          <ConvexClientProvider>
            <div className="flex flex-col min-h-screen">
              {/* Header */}
              {isAuthenticated && <Header />}

              {/* Main Layout Body */}
              <div className="flex-grow flex py-6">
                {/* Left Sidebar */}
                {isAuthenticated && <LeftSideBar />}

                {/* Main Content Area */}
                <main className="flex-grow bg-gray-100 text-gray-900 rounded-lg p-6 shadow">
                  {children}
                </main>

                {/* Right Sidebar */}
                {isAuthenticated && (
                  <aside className="w-64 flex-shrink-0 mx-2 hidden lg:block">
                    <div className="bg-white rounded-lg shadow p-4">
                      <h3 className="font-bold text-gray-700 mb-4">
                        Who to follow
                      </h3>
                      <div className="space-y-4">
                        {/* User Example */}
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage
                              src="https://via.placeholder.com/150"
                              alt="User"
                            />
                            <AvatarFallback>A</AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="text-sm font-semibold">
                              Alice Johnson
                            </h4>
                            <p className="text-xs text-gray-500">
                              Product Manager
                            </p>
                            <Button
                              variant="link"
                              className="text-blue-600 text-xs"
                            >
                              Follow
                            </Button>
                          </div>
                        </div>
                        {/* Add more users as needed */}
                      </div>
                    </div>
                  </aside>
                )}
              </div>

              {/* Footer */}
              <footer className="bg-white py-4">
                <div className="container mx-auto text-center text-gray-500">
                  © 2024 MyLinkedIn - All rights reserved
                </div>
              </footer>
            </div>

            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored" // Optional: choose a theme
            />
          </ConvexClientProvider>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}
