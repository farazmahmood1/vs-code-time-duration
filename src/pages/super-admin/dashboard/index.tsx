import { usePlatformOverview } from "@/hooks/useSuperAdmin";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Building2,
  Users,
  DollarSign,
  TrendingUp,
  Activity,
  AlertTriangle,
  Ban,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const StatCard = ({
  label,
  value,
  icon: Icon,
  color,
  onClick,
}: {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  onClick?: () => void;
}) => (
  <Card
    className={`p-6 bg-card rounded-2xl border border-border/50 shadow-sm ${onClick ? "cursor-pointer hover:shadow-md transition-shadow" : ""}`}
    onClick={onClick}
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-muted-foreground font-medium">{label}</p>
        <p className="text-3xl font-bold mt-1">{value}</p>
      </div>
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon className="h-5 w-5 text-white" />
      </div>
    </div>
  </Card>
);

const SuperAdminDashboard = () => {
  const { data: overview, isLoading } = usePlatformOverview();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!overview) return null;

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Platform Overview</h1>
        <p className="text-muted-foreground mt-1">
          Monitor all companies, subscriptions, and revenue across the platform.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          label="Total Companies"
          value={overview.totalCompanies}
          icon={Building2}
          color="bg-indigo-600"
          onClick={() => navigate("/super-admin/companies")}
        />
        <StatCard
          label="Active Companies"
          value={overview.activeCompanies}
          icon={Activity}
          color="bg-emerald-600"
        />
        <StatCard
          label="Total Users"
          value={overview.totalUsers}
          icon={Users}
          color="bg-blue-600"
        />
        <StatCard
          label="Active Subscriptions"
          value={overview.activeSubscriptions}
          icon={TrendingUp}
          color="bg-purple-600"
        />
        <StatCard
          label="Monthly Revenue (MRR)"
          value={formatCurrency(overview.mrr)}
          icon={DollarSign}
          color="bg-emerald-600"
        />
        <StatCard
          label="Annual Revenue (ARR)"
          value={formatCurrency(overview.arr)}
          icon={DollarSign}
          color="bg-indigo-600"
        />
        <StatCard
          label="Suspended"
          value={overview.suspendedCompanies}
          icon={AlertTriangle}
          color="bg-amber-500"
        />
        <StatCard
          label="Deactivated"
          value={overview.deactivatedCompanies}
          icon={Ban}
          color="bg-red-500"
        />
      </div>

      {/* Subscriptions by Plan */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-card rounded-2xl border border-border/50 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Subscriptions by Plan</h2>
          <div className="space-y-3">
            {overview.subscriptionsByPlan.map((item) => (
              <div key={item.planSlug} className="flex items-center justify-between">
                <span className="text-sm font-medium">{item.planName}</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 rounded-full"
                      style={{
                        width: `${overview.activeSubscriptions > 0 ? (item.count / overview.activeSubscriptions) * 100 : 0}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-bold w-8 text-right">{item.count}</span>
                </div>
              </div>
            ))}
            {overview.subscriptionsByPlan.length === 0 && (
              <p className="text-sm text-muted-foreground">No subscriptions yet</p>
            )}
          </div>
        </Card>

        {/* Recent Companies */}
        <Card className="p-6 bg-card rounded-2xl border border-border/50 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Recent Companies</h2>
          <div className="space-y-3">
            {overview.recentCompanies.map((company) => (
              <div
                key={company.id}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => navigate(`/super-admin/companies/${company.id}`)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-indigo-600/10 flex items-center justify-center">
                    <Building2 className="h-4 w-4 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{company.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {company._count.users} user{company._count.users !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                    company.status === "ACTIVE"
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                      : company.status === "SUSPENDED"
                        ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                  }`}
                >
                  {company.status}
                </span>
              </div>
            ))}
            {overview.recentCompanies.length === 0 && (
              <p className="text-sm text-muted-foreground">No companies yet</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
