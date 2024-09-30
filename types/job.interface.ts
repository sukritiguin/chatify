// src/types/job.interface.ts

export interface SalaryRange {
  min: number;
  max?: number;
  currency: string;
}

export interface Job {
  id: string;
  organizationName: string;
  organizationLogoUrl?: string;
  title: string;
  description: string;
  location: string;
  employmentType: 'full_time' | 'part_time' | 'contract' | 'internship' | 'temporary' | 'freelance';
  salaryRange?: SalaryRange;
  skills: string[];
  experienceLevel: 'entry' | 'mid' | 'senior' | 'lead' | 'director' | 'executive';
  isActive: boolean;
  createdAt: string;
}
