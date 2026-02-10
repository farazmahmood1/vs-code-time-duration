import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useSubmitMood } from "@/hooks/useMood";
import { cn } from "@/lib/utils";

const MOODS = [
  { value: 1, emoji: "\u{1F622}", label: "Terrible" },
  { value: 2, emoji: "\u{1F615}", label: "Bad" },
  { value: 3, emoji: "\u{1F610}", label: "Okay" },
  { value: 4, emoji: "\u{1F642}", label: "Good" },
  { value: 5, emoji: "\u{1F604}", label: "Great" },
];

export function MoodCheckIn() {
  const [selected, setSelected] = useState<number | null>(null);
  const [note, setNote] = useState("");
  const submitMood = useSubmitMood();

  const handleSubmit = () => {
    if (!selected) return;
    submitMood.mutate(
      { mood: selected, note: note.trim() || undefined },
      {
        onSuccess: () => {
          setSelected(null);
          setNote("");
        },
      }
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          How are you feeling today?
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center gap-3">
          {MOODS.map((m) => (
            <button
              key={m.value}
              onClick={() => setSelected(m.value)}
              className={cn(
                "flex flex-col items-center gap-1 p-2 rounded-lg transition-all",
                selected === m.value
                  ? "bg-primary/10 ring-2 ring-primary scale-110"
                  : "hover:bg-muted"
              )}
            >
              <span className="text-3xl">{m.emoji}</span>
              <span className="text-xs text-muted-foreground">{m.label}</span>
            </button>
          ))}
        </div>
        {selected && (
          <>
            <Textarea
              placeholder="Any thoughts? (optional)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
            />
            <Button
              onClick={handleSubmit}
              disabled={submitMood.isPending}
              className="w-full"
            >
              Submit
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
