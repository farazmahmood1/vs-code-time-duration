// Employee data types
export interface UserExperience {
  id: string;
  position: string;
  company: string;
  startDate: string;
  endDate?: string | null;
  description?: string | null;
}

export interface FormattedExperience {
  id: string;
  title: string;
  company: string;
  period: string;
  description?: string | null;
}

export interface UserEducation {
  id: string;
  educationName: string;
  institute: string;
  startDate: string;
  endDate?: string | null;
  description?: string | null;
}

export interface FormattedEducation {
  id: string;
  degree: string;
  field: string;
  institution: string;
  year: number;
  period: string;
}

export interface UserSkill {
  id: string;
  skillName: string;
}

export interface Department {
  id: string;
  name: string;
}

export interface UserProfile {
  about?: string;
}

export interface RawUserData {
  id: string;
  uniqueId?: string;
  image?: string | null;
  name: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  salary?: number | null;
  role?: string | null;
  createdAt: string;
  isProfileCompleted: boolean;
  departmentId?: string | null;
  department?: Department | null;
  profile?: UserProfile | null;
  experiences?: UserExperience[];
  educations?: UserEducation[];
  skills?: UserSkill[];
  githubUrl?: string | null;
  linkedinUrl?: string | null;
  status?: "Online" | "Offline" | "Break";
  isOnline?: boolean;
}

export interface Employee {
  id: string;
  uniqueId?: string;
  avatar?: string | null;
  name: string;
  email: string;
  phone: string;
  location: string;
  department: string;
  departmentId?: string | null;
  dateJoined: string;
  status: string;
  isOnline: boolean;
  salary: number;
  bio: string;
  skills: string[];
  experience: FormattedExperience[];
  education: FormattedEducation[];
  role: string;
  isProfileCompleted: boolean;
  githubUrl?: string | null;
  linkedinUrl?: string | null;
}
