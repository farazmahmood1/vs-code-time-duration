import { useState } from "react";
import {
  useCompanies,
  useCreateCompany,
  useUpdateCompanyStatus,
  type Company,
} from "@/hooks/useSuperAdmin";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Building2,
  Plus,
  Search,
  MoreHorizontal,
  Eye,
  Ban,
  CheckCircle,
  XCircle,
  Upload,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Label } from "@/components/ui/label";

const statusColors: Record<string, string> = {
  ACTIVE:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  SUSPENDED:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  DEACTIVATED:
    "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const CompaniesPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [newCompany, setNewCompany] = useState({
    name: "",
    domain: "",
    maxUsers: 50,
    ownerName: "",
    ownerEmail: "",
    colorPrimary: "#4f46e5",
    colorSecondary: "#818cf8",
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [confirmAction, setConfirmAction] = useState<{ id: string; status: string; name: string } | null>(null);

  const { data, isLoading } = useCompanies({
    page,
    search: search || undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
  });
  const createCompany = useCreateCompany();
  const updateStatus = useUpdateCompanyStatus();

  const handleCreate = () => {
    const errors: Record<string, string> = {};
    if (!newCompany.name.trim()) errors.name = "Company name is required";
    if (!newCompany.ownerName.trim()) errors.ownerName = "Owner name is required";
    if (!newCompany.ownerEmail.trim()) errors.ownerEmail = "Owner email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newCompany.ownerEmail))
      errors.ownerEmail = "Please enter a valid email address";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});

    const formData = new FormData();
    formData.append("name", newCompany.name);
    formData.append("domain", newCompany.domain);
    formData.append("maxUsers", String(newCompany.maxUsers));
    formData.append("ownerName", newCompany.ownerName);
    formData.append("ownerEmail", newCompany.ownerEmail);
    formData.append("colorPrimary", newCompany.colorPrimary);
    formData.append("colorSecondary", newCompany.colorSecondary);
    if (logoFile) {
      formData.append("logo", logoFile);
    }

    createCompany.mutate(formData, {
      onSuccess: () => {
        setCreateOpen(false);
        setNewCompany({
          name: "",
          domain: "",
          maxUsers: 50,
          ownerName: "",
          ownerEmail: "",
          colorPrimary: "#4f46e5",
          colorSecondary: "#818cf8",
        });
        setLogoFile(null);
        setLogoPreview(null);
      },
    });
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return;
    setLogoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setLogoPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleStatusChange = (id: string, status: string, name: string) => {
    if (status === "SUSPENDED" || status === "DEACTIVATED") {
      setConfirmAction({ id, status, name });
    } else {
      updateStatus.mutate({ id, status });
    }
  };

  const confirmStatusChange = () => {
    if (!confirmAction) return;
    updateStatus.mutate({ id: confirmAction.id, status: confirmAction.status });
    setConfirmAction(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  const companies = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Companies</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage all registered companies on the platform.
          </p>
        </div>

        <Dialog open={createOpen} onOpenChange={(open) => { setCreateOpen(open); if (!open) setFormErrors({}); }}>
          <DialogTrigger asChild>
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Company
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Create New Company</DialogTitle>
            </DialogHeader>
            <div className="space-y-5 pt-2 max-h-[70vh] overflow-y-auto pr-1">
              {/* Company Information */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Company Information
                </h3>
                <div>
                  <Label>Company Name *</Label>
                  <Input
                    value={newCompany.name}
                    onChange={(e) => {
                      setNewCompany({ ...newCompany, name: e.target.value });
                      if (formErrors.name) setFormErrors((prev) => { const { name, ...rest } = prev; return rest; });
                    }}
                    placeholder="Acme Corp"
                    className={formErrors.name ? "border-red-500" : ""}
                  />
                  {formErrors.name && <p className="text-xs text-red-500 mt-1">{formErrors.name}</p>}
                </div>
                <div>
                  <Label>Domain</Label>
                  <Input
                    value={newCompany.domain}
                    onChange={(e) =>
                      setNewCompany({ ...newCompany, domain: e.target.value })
                    }
                    placeholder="acme.com"
                  />
                </div>
                <div>
                  <Label>Max Users</Label>
                  <Input
                    type="number"
                    value={newCompany.maxUsers}
                    onChange={(e) =>
                      setNewCompany({
                        ...newCompany,
                        maxUsers: parseInt(e.target.value) || 50,
                      })
                    }
                  />
                </div>
              </div>

              {/* Owner Account */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Owner Account
                </h3>
                <p className="text-xs text-muted-foreground">
                  An admin account will be created and login credentials sent via email.
                </p>
                <div>
                  <Label>Owner Name *</Label>
                  <Input
                    value={newCompany.ownerName}
                    onChange={(e) => {
                      setNewCompany({ ...newCompany, ownerName: e.target.value });
                      if (formErrors.ownerName) setFormErrors((prev) => { const { ownerName, ...rest } = prev; return rest; });
                    }}
                    placeholder="John Doe"
                    className={formErrors.ownerName ? "border-red-500" : ""}
                  />
                  {formErrors.ownerName && <p className="text-xs text-red-500 mt-1">{formErrors.ownerName}</p>}
                </div>
                <div>
                  <Label>Owner Email *</Label>
                  <Input
                    type="email"
                    value={newCompany.ownerEmail}
                    onChange={(e) => {
                      setNewCompany({ ...newCompany, ownerEmail: e.target.value });
                      if (formErrors.ownerEmail) setFormErrors((prev) => { const { ownerEmail, ...rest } = prev; return rest; });
                    }}
                    placeholder="john@acme.com"
                    className={formErrors.ownerEmail ? "border-red-500" : ""}
                  />
                  {formErrors.ownerEmail && <p className="text-xs text-red-500 mt-1">{formErrors.ownerEmail}</p>}
                </div>
              </div>

              {/* Branding */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Branding
                </h3>

                {/* Logo Upload */}
                <div>
                  <Label>Company Logo</Label>
                  <div className="mt-1 flex items-center gap-4">
                    {logoPreview ? (
                      <img
                        src={logoPreview}
                        alt="Logo preview"
                        className="w-16 h-16 rounded-lg object-cover border"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-lg border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
                        <Upload className="h-5 w-5 text-muted-foreground/50" />
                      </div>
                    )}
                    <div>
                      <label
                        htmlFor="logo-upload"
                        className="cursor-pointer text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                      >
                        {logoPreview ? "Change logo" : "Upload logo"}
                      </label>
                      <input
                        id="logo-upload"
                        type="file"
                        accept="image/jpeg,image/png,image/gif,image/webp"
                        className="hidden"
                        onChange={handleLogoChange}
                      />
                      <p className="text-xs text-muted-foreground mt-0.5">
                        JPEG, PNG, GIF or WebP. Max 5MB.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Color Pickers */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Primary Color</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="color"
                        value={newCompany.colorPrimary}
                        onChange={(e) =>
                          setNewCompany({ ...newCompany, colorPrimary: e.target.value })
                        }
                        className="w-10 h-10 rounded-lg border cursor-pointer p-0.5"
                      />
                      <Input
                        value={newCompany.colorPrimary}
                        onChange={(e) =>
                          setNewCompany({ ...newCompany, colorPrimary: e.target.value })
                        }
                        placeholder="#4f46e5"
                        className="font-mono text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Secondary Color</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="color"
                        value={newCompany.colorSecondary}
                        onChange={(e) =>
                          setNewCompany({ ...newCompany, colorSecondary: e.target.value })
                        }
                        className="w-10 h-10 rounded-lg border cursor-pointer p-0.5"
                      />
                      <Input
                        value={newCompany.colorSecondary}
                        onChange={(e) =>
                          setNewCompany({ ...newCompany, colorSecondary: e.target.value })
                        }
                        placeholder="#818cf8"
                        className="font-mono text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <Button
                onClick={handleCreate}
                disabled={createCompany.isPending}
                className="w-full bg-indigo-600 hover:bg-indigo-700"
              >
                {createCompany.isPending ? "Creating..." : "Create Company"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search companies..."
            className="pl-9"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(v) => {
            setStatusFilter(v);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="SUSPENDED">Suspended</SelectItem>
            <SelectItem value="DEACTIVATED">Deactivated</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card className="rounded-2xl border border-border/50 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead>Domain</TableHead>
              <TableHead>Users</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {companies.map((company: Company) => (
              <TableRow key={company.id} className="cursor-pointer" onClick={() => navigate(`/super-admin/companies/${company.id}`)}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600/10 flex items-center justify-center">
                      <Building2 className="h-4 w-4 text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{company.name}</p>
                      <p className="text-xs text-muted-foreground">{company.slug}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-sm">{company.domain || "—"}</TableCell>
                <TableCell className="text-sm">
                  {company._count?.users ?? company.currentUserCount ?? 0}
                  <span className="text-muted-foreground">/{company.maxUsers}</span>
                </TableCell>
                <TableCell>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${statusColors[company.status]}`}
                  >
                    {company.status}
                  </span>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {format(new Date(company.createdAt), "MMM d, yyyy")}
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() =>
                          navigate(`/super-admin/companies/${company.id}`)
                        }
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      {company.status !== "ACTIVE" && (
                        <DropdownMenuItem
                          onClick={() => handleStatusChange(company.id, "ACTIVE", company.name)}
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Activate
                        </DropdownMenuItem>
                      )}
                      {company.status === "ACTIVE" && (
                        <DropdownMenuItem
                          onClick={() =>
                            handleStatusChange(company.id, "SUSPENDED", company.name)
                          }
                        >
                          <Ban className="mr-2 h-4 w-4" />
                          Suspend
                        </DropdownMenuItem>
                      )}
                      {company.status !== "DEACTIVATED" && (
                        <DropdownMenuItem
                          onClick={() =>
                            handleStatusChange(company.id, "DEACTIVATED", company.name)
                          }
                          className="text-destructive focus:text-destructive"
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Deactivate
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {companies.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12">
                  <Building2 className="h-10 w-10 text-muted-foreground/50 mx-auto mb-3" />
                  <p className="text-muted-foreground">No companies found</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      )}

      {/* Confirmation Dialog for Suspend/Deactivate */}
      <AlertDialog open={!!confirmAction} onOpenChange={(open) => { if (!open) setConfirmAction(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmAction?.status === "SUSPENDED" ? "Suspend" : "Deactivate"} Company?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to {confirmAction?.status === "SUSPENDED" ? "suspend" : "deactivate"}{" "}
              <strong>{confirmAction?.name}</strong>?{" "}
              {confirmAction?.status === "SUSPENDED"
                ? "The company will lose access to the platform until reactivated."
                : "This will archive the company and all its data."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmStatusChange}
              className={confirmAction?.status === "DEACTIVATED" ? "bg-red-600 hover:bg-red-700" : "bg-amber-500 hover:bg-amber-600"}
            >
              {confirmAction?.status === "SUSPENDED" ? "Suspend" : "Deactivate"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CompaniesPage;
