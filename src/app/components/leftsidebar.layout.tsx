"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useQuery } from "convex/react";
import Link from "next/link";
import { api } from "../../../convex/_generated/api";

export const LeftSideBar = () => {
  const commonDetails = useQuery(api.queries.getCommonDetails);

  return (
    <aside className="w-64 hidden md:block">
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center space-x-4 mb-6">
          <Avatar>
            <AvatarImage src={commonDetails?.avatar} alt="User" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-lg text-gray-900 font-semibold">{commonDetails?.name}</h3>
            <p className="text-sm text-gray-800">{commonDetails?.bio}</p>
          </div>
        </div>
        <nav className="space-y-2 text-gray-800 font-semibold">
          <Link href="/">
            <Button variant="ghost" className="w-full justify-start">
              Home
            </Button>
          </Link>
          <Link href="/network">
            <Button variant="ghost" className="w-full justify-start">
              My Network
            </Button>
          </Link>
          <Link href="/jobs">
            <Button variant="ghost" className="w-full justify-start">
              Jobs
            </Button>
          </Link>
          <Link href="/message">
            <Button variant="ghost" className="w-full justify-start">
              Messaging
            </Button>
          </Link>
        </nav>
      </div>
    </aside>
  );
};
