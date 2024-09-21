"use client";

import { Button } from "@/components/ui/button"; // shadcn/ui button component
import { useQuery } from "convex/react";
import Link from "next/link";
import { FaRegUserCircle, FaRegBuilding } from "react-icons/fa"; // Use react-icons
import { api } from "../../../convex/_generated/api";
import Loader from "@/components/ui/Loader";
import { useRouter } from "next/navigation";

export default function RegisterPager() {
  const isUserRegistered = useQuery(api.queries.getUserRegistration);
  const router = useRouter();

  if (isUserRegistered === undefined) {
    return <Loader />;
  }

  if (isUserRegistered) {
    if (isUserRegistered.type === "profile") {
      router.push("/profile");
    } else {
      router.push("/organization");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-indigo-50 to-blue-50">
      <div className="bg-white shadow-lg rounded-xl p-10 max-w-md w-full border border-gray-200">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
          Choose Your Registration Category
        </h1>
        <p className="text-gray-600 mb-8 text-center leading-relaxed">
          Please select how you'd like to register. Whether you're an individual
          or an organization, we're here to help you get started!
        </p>

        <div className="space-y-4">
          {/* Individual Registration Button */}
          <Button
            variant="default"
            className="w-full flex items-center justify-center space-x-3 bg-blue-500 hover:bg-blue-600 text-white shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            <FaRegUserCircle className="w-6 h-6" />
            <span className="font-medium text-lg">
              <Link href={`/profile/create`}>Register as Individual</Link>
            </span>
          </Button>

          {/* Organization Registration Button */}
          <Button
            variant="default"
            className="w-full flex items-center justify-center space-x-3 bg-green-500 hover:bg-green-600 text-white shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            <FaRegBuilding className="w-6 h-6" />
            <span className="font-medium text-lg">
              <Link href={`/organization/create`}>
                Register as Organization
              </Link>
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}
