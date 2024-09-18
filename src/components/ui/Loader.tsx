// components/Loader.tsx
import React from "react";
import { cn } from "@/lib/utils"; // Utility for conditional classNames

interface LoaderProps {
  size?: "small" | "medium" | "large"; // Define sizes for the loader
  color?: string; // Optionally allow custom color
}

const Loader: React.FC<LoaderProps> = ({
  size = "medium",
  color = "#3b82f6", // Default color (blue-500)
}) => {
  const sizeClasses = {
    small: "h-4 w-4",
    medium: "h-8 w-8",
    large: "h-16 w-16",
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div
        className={cn(
          "animate-spin rounded-full border-t-2 border-b-2",
          sizeClasses[size],
          "border-t-transparent",
          "border-b-transparent"
        )}
        style={{ borderColor: color }}
      />
    </div>
  );
};

export default Loader;
