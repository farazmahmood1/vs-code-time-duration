import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";

interface LocationBadgeProps {
  location?: { lat: number; lng: number; address?: string | null } | null;
  onClick?: () => void;
}

export function LocationBadge({ location, onClick }: LocationBadgeProps) {
  if (!location) return <span className="text-muted-foreground text-xs">-</span>;

  return (
    <Badge
      variant="outline"
      className="cursor-pointer gap-1 text-xs"
      onClick={onClick}
    >
      <MapPin className="h-3 w-3" />
      {location.address?.split(",")[0] || `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`}
    </Badge>
  );
}
