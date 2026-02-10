import { AvailabilityGrid } from "@/components/shifts/AvailabilityGrid";

export default function AvailabilityPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Availability</h1>
        <p className="text-muted-foreground">
          Set your preferred working hours for each day of the week
        </p>
      </div>
      <AvailabilityGrid />
    </div>
  );
}
