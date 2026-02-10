import { useState } from "react";
import { useDocuments } from "@/hooks/useDocuments";
import { DocumentTable } from "@/components/documents/DocumentTable";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useSession } from "@/lib/auth-client";

const CATEGORIES = [
  { value: "ALL", label: "All Categories" },
  { value: "CONTRACT", label: "Contract" },
  { value: "POLICY", label: "Policy" },
  { value: "HANDBOOK", label: "Handbook" },
  { value: "NDA", label: "NDA" },
  { value: "OTHER_DOCUMENT", label: "Other" },
];

export default function EmployeeDocumentsPage() {
  const { data: session } = useSession();
  const [category, setCategory] = useState("ALL");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useDocuments({
    category: category === "ALL" ? undefined : category,
    page,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Company Documents
        </h1>
        <p className="text-muted-foreground">
          Access company policies, handbooks, and other important documents.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Select
          value={category}
          onValueChange={(val) => {
            setCategory(val);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <>
          <DocumentTable
            documents={data?.data || []}
            isAdmin={false}
            userId={session?.user?.id || ""}
          />

          {data?.meta && data.meta.totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Page {data.meta.page} of {data.meta.totalPages} ({data.meta.total}{" "}
                total documents)
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= (data?.meta?.totalPages || 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
