import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MonthPicker } from "@/components/ui/month-picker";
import { Textarea } from "@/components/ui/textarea";
import { useResumeStore } from "@/stores/resume-store";
import { Plus, Trash2 } from "lucide-react";

export function AchievementsForm() {
  const achievements = useResumeStore((s) => s.resume.achievements);
  const addAchievement = useResumeStore((s) => s.addAchievement);
  const updateAchievement = useResumeStore((s) => s.updateAchievement);
  const removeAchievement = useResumeStore((s) => s.removeAchievement);

  return (
    <div className="space-y-3">
      {achievements.map((ach, index) => (
        <Card key={ach.id}>
          <CardContent className="p-3 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-medium text-muted-foreground flex-1">
                Achievement {index + 1}
              </span>
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={() => removeAchievement(ach.id)}
                aria-label={`Remove achievement ${index + 1}`}
              >
                <Trash2 className="h-3 w-3 text-destructive" />
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label
                  htmlFor={`ach-title-${ach.id}`}
                  className="text-xs sm:text-[10px]"
                >
                  Title *
                </Label>
                <Input
                  id={`ach-title-${ach.id}`}
                  name="achTitle"
                  autoComplete="off"
                  value={ach.title}
                  onChange={(e) =>
                    updateAchievement(ach.id, "title", e.target.value)
                  }
                  placeholder="Best Innovation Award"
                  className="h-10 text-base sm:h-7 sm:text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label
                  htmlFor={`ach-date-${ach.id}`}
                  className="text-xs sm:text-[10px]"
                >
                  Date
                </Label>
                <MonthPicker
                  id={`ach-date-${ach.id}`}
                  value={ach.date}
                  onValueChange={(val) =>
                    updateAchievement(ach.id, "date", val)
                  }
                  className="h-10 text-base sm:h-7 sm:text-xs"
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label
                htmlFor={`ach-desc-${ach.id}`}
                className="text-xs sm:text-[10px]"
              >
                Description
              </Label>
              <Textarea
                id={`ach-desc-${ach.id}`}
                name="achDescription"
                value={ach.description}
                onChange={(e) =>
                  updateAchievement(ach.id, "description", e.target.value)
                }
                placeholder="Brief description of the achievement…"
                className="min-h-15 text-base sm:text-xs resize-y py-2"
              />
            </div>
          </CardContent>
        </Card>
      ))}
      <Button
        variant="outline"
        size="sm"
        className="h-10 text-base sm:h-7 sm:text-xs w-full"
        onClick={addAchievement}
      >
        <Plus className="h-3 w-3 mr-1" aria-hidden="true" />
        Add Achievement
      </Button>
    </div>
  );
}
