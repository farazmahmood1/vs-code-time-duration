import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "Online" | "Offline" | "Absent" | "Break";
  className?: string;
}

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const variants = {
    Online: "bg-green-100 text-green-800 border-green-200",
    Offline: "bg-gray-100 text-gray-800 border-gray-200",
    Absent: "bg-red-100 text-red-800 border-red-200",
    Break: "bg-yellow-100 text-yellow-800 border-yellow-200",
  };

  const icons = {
    Online: (
      <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 8 8">
        <circle cx="4" cy="4" r="3" />
      </svg>
    ),
    Offline: (
      <svg
        className="h-3 w-3"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="9" strokeWidth="3" />
      </svg>
    ),
    Absent: (
      <svg
        className="h-3 w-3"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth="3"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    ),
    Break: (
      <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="8" />
        <path d="M12 6v6l4 2" stroke="white" strokeWidth="2" fill="none" />
      </svg>
    ),
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        variants[status],
        className
      )}
    >
      {icons[status]}
      {status}
    </span>
  );
};
