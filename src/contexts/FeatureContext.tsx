import { createContext, useContext, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useCompanyContext } from "./CompanyContext";
import { useRole } from "@/hooks/useRole";

interface FeatureMap {
  [featureKey: string]: { enabled: boolean; limit: number | null };
}

interface FeatureContextValue {
  features: FeatureMap;
  isLoading: boolean;
  hasFeature: (key: string) => boolean;
  getLimit: (key: string) => number | null;
}

const FeatureContext = createContext<FeatureContextValue>({
  features: {},
  isLoading: true,
  hasFeature: () => true,
  getLimit: () => null,
});

export const FeatureProvider = ({ children }: { children: ReactNode }) => {
  const { companyId } = useCompanyContext();
  const { isSuperAdmin } = useRole();

  const { data: features, isLoading } = useQuery<FeatureMap>({
    queryKey: ["features", companyId],
    queryFn: async () => {
      const res = await api.get("/billing/features");
      return res.data.data;
    },
    enabled: !!companyId && !isSuperAdmin,
  });

  const hasFeature = (key: string) => {
    if (isSuperAdmin) return true;
    if (!features) return true;
    return features[key]?.enabled ?? false;
  };

  const getLimit = (key: string) => {
    if (isSuperAdmin) return null;
    if (!features) return null;
    return features[key]?.limit ?? null;
  };

  return (
    <FeatureContext.Provider
      value={{
        features: features ?? {},
        isLoading,
        hasFeature,
        getLimit,
      }}
    >
      {children}
    </FeatureContext.Provider>
  );
};

export const useFeatures = () => useContext(FeatureContext);

// Convenience component for feature gating
export const FeatureGate = ({
  feature,
  children,
  fallback = null,
}: {
  feature: string;
  children: ReactNode;
  fallback?: ReactNode;
}) => {
  const { hasFeature } = useFeatures();
  return hasFeature(feature) ? <>{children}</> : <>{fallback}</>;
};
