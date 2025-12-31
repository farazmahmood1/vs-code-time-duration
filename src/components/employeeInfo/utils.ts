import type {
  RawUserData,
  Employee,
  FormattedExperience,
  FormattedEducation,
  UserExperience,
  UserEducation,
  UserSkill,
} from "./types";

export const formatExperienceData = (
  experiences: UserExperience[]
): FormattedExperience[] => {
  return experiences.map((exp) => ({
    id: exp.id,
    title: exp.position,
    company: exp.company,
    period: `${new Date(exp.startDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    })} - ${
      exp.endDate
        ? new Date(exp.endDate).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
          })
        : "Present"
    }`,
    description: exp.description,
  }));
};

export const formatEducationData = (
  educations: UserEducation[]
): FormattedEducation[] => {
  return educations.map((edu) => {
    const startYear = new Date(edu.startDate).getFullYear();
    const endYear = edu.endDate ? new Date(edu.endDate).getFullYear() : null;
    const period = endYear
      ? `${startYear} - ${endYear}`
      : `${startYear} - Present`;

    return {
      id: edu.id,
      degree: edu.educationName,
      field: edu.description || "",
      institution: edu.institute,
      year: startYear,
      period,
    };
  });
};

export const formatSkillsData = (skills: UserSkill[]): string[] => {
  return skills.map((s) => s.skillName);
};

export const transformUserData = (userData: RawUserData): Employee => {
  const formattedExperience = formatExperienceData(userData.experiences || []);
  const formattedEducation = formatEducationData(userData.educations || []);
  const formattedSkills = formatSkillsData(userData.skills || []);

  return {
    id: userData.id,
    uniqueId: userData.uniqueId,
    avatar: userData.image,
    name: userData.name || "Unknown",
    email: userData.email,
    phone: userData.phone || "N/A",
    location: userData.address || "N/A",
    department: userData.department?.name || "Unassigned",
    departmentId: userData.departmentId,
    dateJoined: userData.createdAt,
    status: userData.status || "Active",
    isOnline: userData.isOnline || false,
    salary: userData.salary || 0,
    bio: userData.profile?.about || "No bio available",
    skills: formattedSkills,
    experience: formattedExperience,
    education: formattedEducation,
    role: userData.role || "employee",
    isProfileCompleted: userData.isProfileCompleted,
    githubUrl: userData.githubUrl || null,
    linkedinUrl: userData.linkedinUrl || null,
  };
};
