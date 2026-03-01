import api from "@/lib/axios";
import { useSession } from "@/lib/auth-client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart3,
  Briefcase,
  Building,
  Calendar,
  CalendarCheck,
  CalendarCheck2,
  CalendarDays,
  Clock,
  DollarSign,
  FileSpreadsheet,
  FileText,
  FolderOpen,
  Heart,
  Hourglass,
  LayoutDashboard,
  MessageCircle,
  MessageSquareText,
  MessagesSquare,
  Network,
  Package,
  Receipt,
  Search,
  Settings,
  SmilePlus,
  Star,
  Timer,
  Trophy,
  User,
  UserMinus,
  Users,
} from "lucide-react";

interface NavItem {
  url: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  url: string;
  category: "page" | "employee" | "project";
  icon: React.ComponentType<{ className?: string }>;
}

const ADMIN_NAV: NavItem[] = [
  { url: "/app", title: "Dashboard", icon: LayoutDashboard },
  { url: "/app/employees", title: "Employees", icon: BarChart3 },
  { url: "/app/departments", title: "Departments", icon: Building },
  { url: "/app/projects", title: "Projects", icon: FolderOpen },
  { url: "/app/shifts", title: "Shifts", icon: Clock },
  { url: "/app/attendance", title: "Attendance Tracking", icon: CalendarCheck },
  { url: "/app/overtime", title: "Overtime", icon: Timer },
  { url: "/app/timesheets", title: "Timesheets", icon: FileSpreadsheet },
  { url: "/app/leaves", title: "Leave Management", icon: Briefcase },
  { url: "/app/announcements", title: "Announcements", icon: Calendar },
  { url: "/app/reports", title: "Reports", icon: BarChart3 },
  { url: "/app/reviews", title: "Reviews", icon: Star },
  { url: "/app/assets", title: "Assets", icon: Package },
  { url: "/app/standups", title: "Standups", icon: MessageSquareText },
  { url: "/app/chat", title: "Chat", icon: MessagesSquare },
  { url: "/app/calendar", title: "Calendar", icon: CalendarDays },
  { url: "/app/feedback", title: "Feedback", icon: MessageCircle },
  { url: "/app/pomodoro", title: "Pomodoro", icon: Hourglass },
  { url: "/app/mood-analytics", title: "Mood Analytics", icon: SmilePlus },
  { url: "/app/org-chart", title: "Org Chart", icon: Network },
  { url: "/app/compensation", title: "Compensation", icon: DollarSign },
  { url: "/app/expenses", title: "Expenses", icon: Receipt },
  { url: "/app/offboarding", title: "Offboarding", icon: UserMinus },
  { url: "/app/leaderboard", title: "Leaderboard", icon: Trophy },
  { url: "/app/wellness", title: "Wellness", icon: Heart },
  { url: "/app/documents", title: "Documents", icon: FileText },
  { url: "/app/profile", title: "Profile", icon: User },
  { url: "/app/settings", title: "Settings", icon: Settings },
];

const EMPLOYEE_NAV: NavItem[] = [
  { url: "/app", title: "Dashboard", icon: LayoutDashboard },
  { url: "/app/shifts", title: "My Shifts", icon: Clock },
  { url: "/app/availability", title: "My Availability", icon: CalendarCheck2 },
  { url: "/app/attendance", title: "My Attendance", icon: CalendarCheck },
  { url: "/app/timesheets", title: "My Timesheets", icon: FileSpreadsheet },
  { url: "/app/leaves", title: "My Leaves", icon: Briefcase },
  { url: "/app/announcements", title: "Company Updates", icon: Calendar },
  { url: "/app/chat", title: "Chat", icon: MessagesSquare },
  { url: "/app/calendar", title: "Calendar", icon: CalendarDays },
  { url: "/app/feedback", title: "Feedback", icon: MessageCircle },
  { url: "/app/pomodoro", title: "Pomodoro", icon: Hourglass },
  { url: "/app/compensation", title: "My Compensation", icon: DollarSign },
  { url: "/app/expenses", title: "My Expenses", icon: Receipt },
  { url: "/app/leaderboard", title: "Leaderboard", icon: Trophy },
  { url: "/app/wellness", title: "Wellness", icon: Heart },
  { url: "/app/documents", title: "Documents", icon: FileText },
  { url: "/app/profile", title: "Profile", icon: User },
  { url: "/app/settings", title: "Settings", icon: Settings },
];

export const GlobalSearch = () => {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const navigate = useNavigate();
  const { data: session } = useSession();

  const isAdmin = session?.user?.role === "admin";
  const navItems = isAdmin ? ADMIN_NAV : EMPLOYEE_NAV;

  const searchAll = useCallback(
    async (q: string) => {
      const lower = q.toLowerCase().trim();
      if (!lower) {
        setResults([]);
        setIsSearching(false);
        return;
      }

      // 1. Filter pages (instant)
      const pageResults: SearchResult[] = navItems
        .filter((item) => item.title.toLowerCase().includes(lower))
        .slice(0, 5)
        .map((item) => ({
          id: `page-${item.url}`,
          title: item.title,
          subtitle: "Page",
          url: item.url,
          category: "page" as const,
          icon: item.icon,
        }));

      // Show page results immediately
      setResults(pageResults);

      // 2. Search employees + projects via API (debounced, only if 2+ chars)
      if (lower.length >= 2) {
        setIsSearching(true);
        try {
          const promises: Promise<SearchResult[]>[] = [];

          // Employees (search via chat user search endpoint)
          promises.push(
            api
              .get("/chat/users/search", { params: { q: lower } })
              .then((res) => {
                const users = res.data?.data || [];
                return users.slice(0, 5).map(
                  (u: { id: string; name: string; email: string }) => ({
                    id: `emp-${u.id}`,
                    title: u.name,
                    subtitle: u.email,
                    url: isAdmin ? `/app/employees/${u.id}` : `/app/chat`,
                    category: "employee" as const,
                    icon: Users,
                  })
                );
              })
              .catch(() => [] as SearchResult[])
          );

          // Projects
          promises.push(
            api
              .get("/projects", { params: { search: lower, limit: 5 } })
              .then((res) => {
                const projects = res.data?.data || [];
                return projects.slice(0, 5).map(
                  (p: { id: string; name: string; status: string }) => ({
                    id: `proj-${p.id}`,
                    title: p.name,
                    subtitle: p.status,
                    url: `/app/projects`,
                    category: "project" as const,
                    icon: FolderOpen,
                  })
                );
              })
              .catch(() => [] as SearchResult[])
          );

          const apiResults = await Promise.all(promises);
          const combined = [...pageResults, ...apiResults.flat()];
          setResults(combined);
        } catch {
          // Keep page results on error
        } finally {
          setIsSearching(false);
        }
      } else {
        setIsSearching(false);
      }
    },
    [isAdmin, navItems]
  );

  const handleChange = (value: string) => {
    setQuery(value);
    setActiveIndex(0);
    if (!value.trim()) {
      setResults([]);
      setOpen(false);
      return;
    }
    setOpen(true);

    // Debounce API calls
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => searchAll(value), 250);
  };

  const handleSelect = (result: SearchResult) => {
    navigate(result.url);
    setQuery("");
    setOpen(false);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open || results.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      handleSelect(results[activeIndex]);
    } else if (e.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
    }
  };

  // Close on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Ctrl+K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        if (query.trim()) setOpen(true);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [query]);

  const categoryLabel = (cat: string) => {
    switch (cat) {
      case "page": return "Pages";
      case "employee": return "Employees";
      case "project": return "Projects";
      default: return cat;
    }
  };

  // Group results by category
  const grouped = results.reduce<Record<string, SearchResult[]>>((acc, r) => {
    if (!acc[r.category]) acc[r.category] = [];
    acc[r.category].push(r);
    return acc;
  }, {});

  // Flat index for keyboard nav
  let flatIndex = 0;

  return (
    <div ref={containerRef} className="relative hidden sm:block w-full max-w-md">
      <div className="flex items-center gap-3 bg-muted/60 rounded-xl px-4 py-2.5 transition-all focus-within:bg-muted focus-within:ring-2 focus-within:ring-primary/20">
        <Search className="h-4 w-4 text-muted-foreground shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => { if (query.trim()) setOpen(true); }}
          onKeyDown={handleKeyDown}
          placeholder="Search pages, employees, projects..."
          className="bg-transparent text-sm outline-none w-full placeholder:text-muted-foreground/70"
        />
        <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground bg-background border border-border/60 rounded-md shrink-0">
          Ctrl K
        </kbd>
      </div>

      {/* Dropdown */}
      {open && (query.trim()) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border/50 rounded-xl shadow-lg overflow-hidden z-50 max-h-[400px] overflow-y-auto">
          {results.length === 0 && !isSearching && (
            <div className="px-4 py-8 text-center">
              <p className="text-sm text-muted-foreground">No results found</p>
              <p className="text-xs text-muted-foreground/60 mt-1">Try a different search term</p>
            </div>
          )}

          {results.length === 0 && isSearching && (
            <div className="px-4 py-8 text-center">
              <p className="text-sm text-muted-foreground">Searching...</p>
            </div>
          )}

          {Object.entries(grouped).map(([category, items]) => (
            <div key={category}>
              <div className="px-3 py-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider bg-muted/30">
                {categoryLabel(category)}
              </div>
              {items.map((result) => {
                const idx = flatIndex++;
                const Icon = result.icon;
                return (
                  <button
                    key={result.id}
                    onClick={() => handleSelect(result)}
                    onMouseEnter={() => setActiveIndex(idx)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors cursor-pointer ${
                      idx === activeIndex
                        ? "bg-primary/10 text-foreground"
                        : "text-foreground hover:bg-muted/50"
                    }`}
                  >
                    <div className={`p-1.5 rounded-lg shrink-0 ${
                      idx === activeIndex ? "bg-primary/15" : "bg-muted/60"
                    }`}>
                      <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{result.title}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{result.subtitle}</p>
                    </div>
                    {result.category === "page" && (
                      <span className="text-[10px] text-muted-foreground/50 shrink-0">Go to page</span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}

          {isSearching && results.length > 0 && (
            <div className="px-3 py-2 text-center border-t border-border/30">
              <p className="text-[11px] text-muted-foreground">Loading more results...</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
