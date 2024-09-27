// src/components/NetworkPage.jsx
"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card"; // Adjust path based on your project structure
import { Button } from "@/components/ui/button"; // Adjust path based on your project structure
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Adjust path based on your project structure
import { Input } from "@/components/ui/input"; // Adjust path based on your project structure
import { FiUserCheck, FiUserX, FiSearch, FiUserPlus } from "react-icons/fi";

// Mock Data for Connection Requests
const mockConnectionRequests = [
  {
    id: 1,
    name: "Jane Doe",
    avatar: "https://i.pravatar.cc/150?img=1",
    mutualConnections: 5,
    occupation: "Marketing Manager at ABC Corp",
  },
  {
    id: 2,
    name: "John Smith",
    avatar: "https://i.pravatar.cc/150?img=2",
    mutualConnections: 3,
    occupation: "Software Engineer at XYZ Inc",
  },
  // Add more mock connection requests as needed
];

// Mock Data for People You May Know
const mockPeopleYouMayKnow = [
  {
    id: 1,
    name: "Alice Johnson",
    avatar: "https://i.pravatar.cc/150?img=3",
    coverPhoto: "https://via.placeholder.com/400x150", // Placeholder cover photo
    mutualConnections: 2,
    occupation: "Product Manager at InnovateX",
    bio: "Passionate about building user-centric products and leading cross-functional teams.",
  },
  {
    id: 2,
    name: "Bob Williams",
    avatar: "https://i.pravatar.cc/150?img=4",
    coverPhoto: "https://via.placeholder.com/400x150",
    mutualConnections: 4,
    occupation: "UI/UX Designer at CreativeStudio",
    bio: "Designing intuitive interfaces and enhancing user experiences.",
  },
  {
    id: 3,
    name: "Charlie Brown",
    avatar: "https://i.pravatar.cc/150?img=5",
    coverPhoto: "https://via.placeholder.com/400x150",
    mutualConnections: 1,
    occupation: "Data Analyst at DataCorp",
    bio: "Specializing in data visualization and statistical analysis.",
  },
  {
    id: 4,
    name: "Bob Williams",
    avatar: "https://i.pravatar.cc/150?img=4",
    coverPhoto: "https://via.placeholder.com/400x150",
    mutualConnections: 4,
    occupation: "UI/UX Designer at CreativeStudio",
    bio: "Designing intuitive interfaces and enhancing user experiences.",
  },
  {
    id: 5,
    name: "Charlie Brown",
    avatar: "https://i.pravatar.cc/150?img=5",
    coverPhoto: "https://via.placeholder.com/400x150",
    mutualConnections: 1,
    occupation: "Data Analyst at DataCorp",
    bio: "Specializing in data visualization and statistical analysis.",
  },
  // Add more mock people as needed
];

const NetworkPage = () => {
  const [connectionRequests, setConnectionRequests] = useState(
    mockConnectionRequests
  );
  const [peopleYouMayKnow, setPeopleYouMayKnow] =
    useState(mockPeopleYouMayKnow);
  const [searchTerm, setSearchTerm] = useState("");

  // Handler to accept a connection request
  const handleAccept = (id) => {
    setConnectionRequests(connectionRequests.filter((req) => req.id !== id));
    // Additional logic to add to existing connections can be added here
  };

  // Handler to decline a connection request
  const handleDecline = (id) => {
    setConnectionRequests(connectionRequests.filter((req) => req.id !== id));
    // Additional logic can be added here
  };

  // Handler to connect with a suggested person
  const handleConnect = (id) => {
    setPeopleYouMayKnow(peopleYouMayKnow.filter((person) => person.id !== id));
    // Additional logic to add to existing connections can be added here
  };

  // Filtered People You May Know based on search term
  const filteredPeople = peopleYouMayKnow.filter((person) =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Network</h1>

      {/* Connection Requests Section */}
      <Card className="p-6 mb-8 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Connection Requests</h2>
          <Button variant="ghost" size="icon" aria-label="Search">
            <FiSearch size={20} />
          </Button>
        </div>
        {connectionRequests.length === 0 ? (
          <p className="text-gray-500">You have no new connection requests.</p>
        ) : (
          connectionRequests.map((request) => (
            <div
              key={request.id}
              className="flex items-center justify-between mb-4"
            >
              <div className="flex items-center">
                <Avatar>
                  <AvatarImage src={request.avatar} />
                  <AvatarFallback>S</AvatarFallback>
                </Avatar>
                <div className="ml-2">
                  <p className="font-medium">{request.name}</p>
                  <p className="text-sm text-gray-500">{request.occupation}</p>
                  <p className="text-sm text-gray-500">
                    {request.mutualConnections} mutual connection
                    {request.mutualConnections > 1 ? "s" : ""}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAccept(request.id)}
                  aria-label={`Accept connection request from ${request.name}`}
                >
                  <FiUserCheck className="mr-2" />
                  Accept
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDecline(request.id)}
                  aria-label={`Decline connection request from ${request.name}`}
                >
                  <FiUserX className="mr-2" />
                  Decline
                </Button>
              </div>
            </div>
          ))
        )}
      </Card>

      {/* People You May Know Section */}
      <Card className="p-6 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">People You May Know</h2>
          <div className="w-1/3">
            <Input
              type="text"
              placeholder="Search people..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              // If the Input component supports an icon prop, uncomment the line below
              // icon={<FiSearch />}
              aria-label="Search People You May Know"
            />
          </div>
        </div>
        {filteredPeople.length === 0 ? (
          <p className="text-gray-500">No suggestions found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPeople.map((person) => (
              <Card
                key={person.id}
                className="p-4 shadow-sm flex flex-col relative"
              >
                {/* Cover Photo */}
                <div
                  className="w-full h-32 bg-cover bg-center rounded-t-md"
                  style={{ backgroundImage: `url(${person.coverPhoto})` }}
                >
                  {/* Empty div for cover photo */}
                </div>

                {/* Profile Avatar */}
                <div className="absolute top-24 left-1/2 transform -translate-x-1/2">
                  <Avatar className="border-4 border-white min-h-28 min-w-28">
                    <AvatarImage src={person.avatar} alt={person.name} />
                    <AvatarFallback>{person.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </div>

                {/* Content Below Avatar */}
                <div className="mt-16 text-center">
                  <p className="font-medium text-lg">{person.name}</p>
                  <p className="text-sm text-gray-500">{person.bio}</p>
                </div>

                {/* Mutual Connections */}
                <div className="mt-4 flex items-center justify-center space-x-2">
                  {/* Example mutual connection avatar */}
                  <Avatar>
                    <AvatarImage
                      src="https://i.pravatar.cc/150?img=6"
                      alt="Damini"
                    />
                    <AvatarFallback>D</AvatarFallback>
                  </Avatar>
                  <p className="text-sm text-gray-500">
                    Damini and {person.mutualConnections} other mutual
                    connection
                    {person.mutualConnections > 1 ? "s" : ""}
                  </p>
                </div>

                {/* Connect Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleConnect(person.id)}
                  aria-label={`Connect with ${person.name}`}
                  className="mt-4 flex items-center justify-center mx-auto"
                >
                  <FiUserPlus className="mr-2" />
                  Connect
                </Button>
              </Card>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default NetworkPage;
