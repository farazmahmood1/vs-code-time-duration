import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api, { type ApiError } from "@/lib/axios";
import { toast } from "sonner";

export interface Profile {
  id: string;
  userId: string;
  about?: string;
}

export interface Experience {
  id: string;
  userId: string;
  position: string;
  company: string;
  startDate: string;
  endDate?: string;
  description?: string;
}

export interface Education {
  id: string;
  userId: string;
  educationName: string;
  institute: string;
  startDate: string;
  endDate?: string;
  description?: string;
}

export interface Skill {
  id: string;
  userId: string;
  skillName: string;
}

export interface OnboardingData {
  id: string;
  name: string;
  email: string;
  isProfileCompleted: boolean;
  profile?: Profile;
  experiences: Experience[];
  educations: Education[];
  skills: Skill[];
}

/**
 * Get all onboarding data
 */
export const useGetOnboardingData = () => {
  return useQuery<OnboardingData>({
    queryKey: ["onboarding"],
    queryFn: async () => {
      const { data } = await api.get("/onboarding");
      return data.data;
    },
  });
};

/**
 * Update profile/about
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (about: string) => {
      const { data } = await api.put("/onboarding/profile", { about });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["onboarding"] });
      toast.success("Profile updated successfully!");
    },
    onError: (error: ApiError) => {
      toast.error(error.response?.data?.message || "Failed to update profile");
    },
  });
};

/**
 * Add experience
 */
export const useAddExperience = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Omit<Experience, "id" | "userId">) => {
      const { data: response } = await api.post("/onboarding/experience", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["onboarding"] });
      toast.success("Experience added successfully!");
    },
    onError: (error: ApiError) => {
      toast.error(error.response?.data?.message || "Failed to add experience");
    },
  });
};

/**
 * Update experience
 */
export const useUpdateExperience = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: Experience & { id: string }) => {
      const { data: response } = await api.put(
        `/onboarding/experience/${id}`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["onboarding"] });
      toast.success("Experience updated successfully!");
    },
    onError: (error: ApiError) => {
      toast.error(
        error.response?.data?.message || "Failed to update experience"
      );
    },
  });
};

/**
 * Delete experience
 */
export const useDeleteExperience = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/onboarding/experience/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["onboarding"] });
      toast.success("Experience deleted successfully!");
    },
    onError: (error: ApiError) => {
      toast.error(
        error.response?.data?.message || "Failed to delete experience"
      );
    },
  });
};

/**
 * Add education
 */
export const useAddEducation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Omit<Education, "id" | "userId">) => {
      const { data: response } = await api.post("/onboarding/education", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["onboarding"] });
      toast.success("Education added successfully!");
    },
    onError: (error: ApiError) => {
      toast.error(error.response?.data?.message || "Failed to add education");
    },
  });
};

/**
 * Update education
 */
export const useUpdateEducation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: Education & { id: string }) => {
      const { data: response } = await api.put(
        `/onboarding/education/${id}`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["onboarding"] });
      toast.success("Education updated successfully!");
    },
    onError: (error: ApiError) => {
      toast.error(
        error.response?.data?.message || "Failed to update education"
      );
    },
  });
};

/**
 * Delete education
 */
export const useDeleteEducation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/onboarding/education/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["onboarding"] });
      toast.success("Education deleted successfully!");
    },
    onError: (error: ApiError) => {
      toast.error(
        error.response?.data?.message || "Failed to delete education"
      );
    },
  });
};

/**
 * Add skill
 */
export const useAddSkill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (skillName: string) => {
      const { data } = await api.post("/onboarding/skill", { skillName });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["onboarding"] });
      toast.success("Skill added successfully!");
    },
    onError: (error: ApiError) => {
      toast.error(error.response?.data?.message || "Failed to add skill");
    },
  });
};

/**
 * Delete skill
 */
export const useDeleteSkill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/onboarding/skill/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["onboarding"] });
      toast.success("Skill deleted successfully!");
    },
    onError: (error: ApiError) => {
      toast.error(error.response?.data?.message || "Failed to delete skill");
    },
  });
};

/**
 * Complete onboarding
 */
export const useCompleteOnboarding = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post("/onboarding/complete");
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["onboarding"] });
      // Refresh session to update isProfileCompleted
      queryClient.invalidateQueries({ queryKey: ["session"] });
      queryClient.refetchQueries({ queryKey: ["session"] });
      toast.success("Profile completed successfully!");
    },
    onError: (error: ApiError) => {
      toast.error(
        error.response?.data?.message || "Failed to complete onboarding"
      );
    },
  });
};
