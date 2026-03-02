import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api, { type ApiError } from "@/lib/axios";
import { toast } from "sonner";

export interface OwnerOnboardingData {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  designation: string | null;
  isProfileCompleted: boolean;
  companyId: string | null;
  company: {
    id: string;
    name: string;
    description: string | null;
    industry: string | null;
    teamSize: string | null;
    website: string | null;
    companyAddress: string | null;
    timezone: string | null;
    workingHours: string | null;
  } | null;
}

export const useGetOwnerOnboardingData = () => {
  return useQuery<OwnerOnboardingData>({
    queryKey: ["owner-onboarding"],
    queryFn: async () => {
      const { data } = await api.get("/owner-onboarding");
      return data.data;
    },
  });
};

export const useUpdateOwnerProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { phone: string; designation: string }) => {
      const { data: response } = await api.put(
        "/owner-onboarding/profile",
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["owner-onboarding"] });
      toast.success("Profile updated successfully!");
    },
    onError: (error: ApiError) => {
      toast.error(
        error.response?.data?.message || "Failed to update profile"
      );
    },
  });
};

export const useUpdateCompanyDetails = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      description: string;
      industry: string;
      teamSize: string;
      website: string;
      companyAddress: string;
    }) => {
      const { data: response } = await api.put(
        "/owner-onboarding/company",
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["owner-onboarding"] });
      toast.success("Company details updated successfully!");
    },
    onError: (error: ApiError) => {
      toast.error(
        error.response?.data?.message || "Failed to update company details"
      );
    },
  });
};

export const useUpdateWorkSetup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { timezone: string; workingHours: string }) => {
      const { data: response } = await api.put(
        "/owner-onboarding/work-setup",
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["owner-onboarding"] });
      toast.success("Work setup updated successfully!");
    },
    onError: (error: ApiError) => {
      toast.error(
        error.response?.data?.message || "Failed to update work setup"
      );
    },
  });
};

export const useCompleteOwnerOnboarding = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post("/owner-onboarding/complete");
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["owner-onboarding"] });
      queryClient.invalidateQueries({ queryKey: ["session"] });
      queryClient.refetchQueries({ queryKey: ["session"] });
      toast.success("Onboarding completed successfully!");
    },
    onError: (error: ApiError) => {
      toast.error(
        error.response?.data?.message || "Failed to complete onboarding"
      );
    },
  });
};
