import { createContext, useContext, type ReactNode } from "react";
import { useSession } from "@/lib/auth-client";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import type { Company, Subscription } from "@/hooks/useSuperAdmin";

interface CompanyContextValue {
  company: Company | null;
  subscription: Subscription | null;
  isLoading: boolean;
  companyId: string | null;
}

const CompanyContext = createContext<CompanyContextValue>({
  company: null,
  subscription: null,
  isLoading: true,
  companyId: null,
});

export const CompanyProvider = ({ children }: { children: ReactNode }) => {
  const { data: session } = useSession();
  const companyId = (session?.user as { companyId?: string })?.companyId ?? null;

  const { data: company, isLoading: companyLoading } = useQuery<Company>({
    queryKey: ["company", companyId],
    queryFn: async () => {
      const res = await api.get("/billing/company");
      return res.data.data;
    },
    enabled: !!companyId,
  });

  const { data: subscription, isLoading: subLoading } = useQuery<Subscription>({
    queryKey: ["billing", "subscription"],
    queryFn: async () => {
      const res = await api.get("/billing/subscription");
      return res.data.data;
    },
    enabled: !!companyId,
  });

  return (
    <CompanyContext.Provider
      value={{
        company: company ?? null,
        subscription: subscription ?? null,
        isLoading: companyLoading || subLoading,
        companyId,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompanyContext = () => useContext(CompanyContext);
