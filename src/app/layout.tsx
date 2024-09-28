import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ConvexClientProvider } from "@/components/ConvexClientProvider";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import {
  FaHome,
  FaBriefcase,
  FaBell,
  FaEnvelope,
  FaUsers,
} from "react-icons/fa";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Button } from "@/components/ui/button"; // Assuming Shadcn's Button component

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
  return (
    <ConvexAuthNextjsServerProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-100`}
        >
          <ConvexClientProvider>
            <div className="flex flex-col min-h-screen">
              {/* Header */}
              <header className="bg-white shadow-sm sticky top-0 z-50">
                <div className="container mx-auto flex items-center justify-between py-4 px-6">
                  {/* Logo and Search Bar */}
                  <div className="flex items-center space-x-4">
                    <Link href="/">
                      <div className="text-xl font-bold text-blue-600 cursor-pointer uppercase">
                        Chatify
                      </div>
                    </Link>
                    <Input
                      type="text"
                      placeholder="Search..."
                      className="w-80"
                    />
                  </div>

                  {/* Icons and Avatar */}
                  <div className="flex items-center space-x-6">
                    <Link href="/">
                      <FaHome className="text-gray-600 w-6 h-6 cursor-pointer" />
                    </Link>
                    <Link href="/network">
                      <FaUsers className="text-gray-600 w-6 h-6 cursor-pointer" />
                    </Link>
                    <Link href="/jobs">
                      <FaBriefcase className="text-gray-600 w-6 h-6 cursor-pointer" />
                    </Link>
                    <Link href="/notifications">
                      <FaBell className="text-gray-600 w-6 h-6 cursor-pointer" />
                    </Link>
                    <Link href="/message">
                      <FaEnvelope className="text-gray-600 w-6 h-6 cursor-pointer" />
                    </Link>
                    <Link href="/profile">
                      <Avatar>
                        <AvatarImage
                          src="https://via.placeholder.com/150"
                          alt="User"
                        />
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                    </Link>
                  </div>
                </div>
              </header>

              {/* Main Layout Body */}
              <div className="flex-grow container mx-auto flex py-6 space-x-6">
                {/* Left Sidebar */}
                <aside className="w-64 hidden md:block">
                  <div className="bg-white rounded-lg shadow p-4">
                    <div className="flex items-center space-x-4 mb-6">
                      <Avatar>
                        <AvatarImage
                          src="https://via.placeholder.com/150"
                          alt="User"
                        />
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-lg font-semibold">John Doe</h3>
                        <p className="text-sm text-gray-500">
                          Software Engineer
                        </p>
                      </div>
                    </div>
                    <nav className="space-y-2">
                      <Link href="/">
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                        >
                          Home
                        </Button>
                      </Link>
                      <Link href="/network">
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                        >
                          My Network
                        </Button>
                      </Link>
                      <Link href="/jobs">
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                        >
                          Jobs
                        </Button>
                      </Link>
                      <Link href="/messages">
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                        >
                          Messaging
                        </Button>
                      </Link>
                    </nav>
                  </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-grow bg-gray-100 text-gray-900 rounded-lg p-6 shadow">
                  {children}
                </main>

                {/* Right Sidebar */}
                <aside className="w-64 hidden lg:block">
                  <div className="bg-white rounded-lg shadow p-4">
                    <h3 className="font-bold text-gray-700 mb-4">
                      Who to follow
                    </h3>
                    <div className="space-y-4">
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
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage
                            src="https://via.placeholder.com/150"
                            alt="User"
                          />
                          <AvatarFallback>B</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="text-sm font-semibold">Bob Smith</h4>
                          <p className="text-xs text-gray-500">
                            Data Scientist
                          </p>
                          <Button
                            variant="link"
                            className="text-blue-600 text-xs"
                          >
                            Follow
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </aside>
              </div>

              {/* Footer */}
              <footer className="bg-white py-4">
                <div className="container mx-auto text-center text-gray-500">
                  © 2024 MyLinkedIn - All rights reserved
                </div>
              </footer>
            </div>
          </ConvexClientProvider>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}
