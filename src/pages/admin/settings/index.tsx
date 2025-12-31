import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRole } from "@/hooks/useRole";
import {
  useImportantLinks,
  useTermsConditions,
  type ImportantLinkFormData,
  type TermsConditionFormData,
} from "@/hooks/useSettings";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import ImportantLinksTab from "./tabs/ImportantLinksTab";
import TermsConditionsTab from "./tabs/TermsConditionsTab";

export default function SettingsPage() {
  const { isAdmin } = useRole();

  const linksData = useImportantLinks();
  const termsData = useTermsConditions(isAdmin);
  const [activeTab, setActiveTab] = useState("links");

  return (
    <div className="max-w-2xl ">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">
          {isAdmin
            ? "Manage company links and terms & conditions"
            : "View company links and terms & conditions"}
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full space-y-6"
      >
        <TabsList className="grid w-full max-w-xs grid-cols-2 bg-gray-100">
          <TabsTrigger value="links">Important Links</TabsTrigger>
          <TabsTrigger value="terms">Terms & Conditions</TabsTrigger>
        </TabsList>

        {/* Important Links Tab */}
        <TabsContent value="links" className="mt-0">
          {linksData.isLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : (
            <ImportantLinksTab
              links={linksData.links}
              isAdmin={isAdmin}
              isCreating={linksData.isCreating}
              isUpdating={linksData.isUpdating}
              isDeleting={linksData.isDeleting}
              onCreateLink={(data: ImportantLinkFormData) =>
                linksData.createLink(data)
              }
              onUpdateLink={(
                id: string,
                data: Partial<ImportantLinkFormData>
              ) => linksData.updateLink({ id, data })}
              onDeleteLink={(id: string) =>
                linksData.deleteLink(id).then(() => undefined)
              }
            />
          )}
        </TabsContent>

        {/* Terms & Conditions Tab */}
        <TabsContent value="terms" className="mt-0">
          {termsData.isLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : (
            <TermsConditionsTab
              terms={termsData.terms}
              isAdmin={isAdmin}
              isCreating={termsData.isCreating}
              isUpdating={termsData.isUpdating}
              isDeleting={termsData.isDeleting}
              onCreateTerms={(data: TermsConditionFormData) =>
                termsData.createTerms(data)
              }
              onUpdateTerms={(
                id: string,
                data: Partial<TermsConditionFormData>
              ) => termsData.updateTerms({ id, data })}
              onDeleteTerms={(id: string) =>
                termsData.deleteTerms(id).then(() => undefined)
              }
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
