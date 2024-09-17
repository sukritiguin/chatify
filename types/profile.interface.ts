export interface Skill {
  skill: string;
  level?: "Beginner" | "Intermediate" | "Advanced" | "Proficient" | "Expert" | "Master" | ""; // e.g., "Beginner", "Intermediate", "Expert"
}

export interface Socials {
  linkedIn?: string;
  github?: string;
  twitter?: string;
}

export interface Education {
  institute: string;
  course: string;
  start: string;
  end: string;
  story?: string;
}

export interface Experience {
  company: string;
  designation: string;
  type?: "fulltime" | "internship" | "apprenticeship" | "part time" | "WFH" | "freelance" | ""; // Use a union type;
  start: string;
  end?: string;
}

export interface Profile {
  coverPhoto?: string;
  profilePhoto?: string;
  bio?: string;
  educations?: Education[];
  experiences?: Experience[];
  skills?: Skill[];
  socials?: Socials;
}

export interface UserProfile {
  _creationTime: number;
  _id: string;
  bio?: string;
  coverPhoto?: string;
  educations?: Education[];
  experiences?: Experience[];
  profilePhoto?: string;
  skills?: Skill[];
  socials?: Socials;
  userId: string;
}