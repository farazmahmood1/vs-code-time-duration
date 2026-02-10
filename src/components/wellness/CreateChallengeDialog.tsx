import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ResponsiveDialog from "@/components/ResponsiveDialog";
import {
  useCreateChallenge,
  type WellnessChallengeType,
} from "@/hooks/useWellness";

interface CreateChallengeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const challengeTypes: { value: WellnessChallengeType; label: string }[] = [
  { value: "STEPS", label: "Steps" },
  { value: "MINDFULNESS", label: "Mindfulness" },
  { value: "HYDRATION", label: "Hydration" },
  { value: "EXERCISE", label: "Exercise" },
  { value: "CUSTOM", label: "Custom" },
];

const unitSuggestions: Record<WellnessChallengeType, string> = {
  STEPS: "steps",
  MINDFULNESS: "minutes",
  HYDRATION: "glasses",
  EXERCISE: "minutes",
  CUSTOM: "",
};

export function CreateChallengeDialog({
  open,
  onOpenChange,
}: CreateChallengeDialogProps) {
  const createChallenge = useCreateChallenge();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<WellnessChallengeType>("STEPS");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [goal, setGoal] = useState("");
  const [unit, setUnit] = useState("steps");

  const handleTypeChange = (value: WellnessChallengeType) => {
    setType(value);
    const suggested = unitSuggestions[value];
    if (suggested) setUnit(suggested);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createChallenge.mutate(
      {
        title,
        description: description || undefined,
        type,
        startDate,
        endDate,
        goal: parseFloat(goal),
        unit,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          setTitle("");
          setDescription("");
          setType("STEPS");
          setStartDate("");
          setEndDate("");
          setGoal("");
          setUnit("steps");
        },
      }
    );
  };

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Create Wellness Challenge"
      description="Set up a new wellness challenge for your team."
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            placeholder="e.g. 10K Steps a Day"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description (optional)</Label>
          <Input
            id="description"
            placeholder="Describe the challenge..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Type</Label>
          <Select value={type} onValueChange={handleTypeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select challenge type" />
            </SelectTrigger>
            <SelectContent>
              {challengeTypes.map((ct) => (
                <SelectItem key={ct.value} value={ct.value}>
                  {ct.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="goal">Goal</Label>
            <Input
              id="goal"
              type="number"
              min="1"
              step="any"
              placeholder="e.g. 10000"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="unit">Unit</Label>
            <Input
              id="unit"
              placeholder="e.g. steps, minutes, glasses"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={createChallenge.isPending}>
            {createChallenge.isPending ? "Creating..." : "Create Challenge"}
          </Button>
        </div>
      </form>
    </ResponsiveDialog>
  );
}
