import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useResumeStore } from "@/stores/resume-store";
import { Plus, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function LanguagesForm() {
  const languages = useResumeStore((s) => s.resume.languages);
  const addLanguage = useResumeStore((s) => s.addLanguage);
  const updateLanguage = useResumeStore((s) => s.updateLanguage);
  const removeLanguage = useResumeStore((s) => s.removeLanguage);

  return (
    <div className="space-y-1.5">
      {languages.map((lang, index) => (
        <div key={lang.id} className="flex items-center gap-2">
          <Input
            name="langName"
            autoComplete="off"
            value={lang.name}
            onChange={(e) => updateLanguage(lang.id, "name", e.target.value)}
            placeholder="Language"
            className="h-10 text-base sm:h-7 sm:text-xs flex-1 min-w-0"
          />
          <Select
            value={lang.proficiency}
            onValueChange={(value) => {
              if (value) updateLanguage(lang.id, "proficiency", value);
            }}
          >
            <SelectTrigger
              className="h-10 text-base sm:h-7 sm:text-xs w-30"
              aria-label="Proficiency level"
            >
              <SelectValue placeholder="Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Native">Native</SelectItem>
              <SelectItem value="Fluent">Fluent</SelectItem>
              <SelectItem value="Advanced">Advanced</SelectItem>
              <SelectItem value="Intermediate">Intermediate</SelectItem>
              <SelectItem value="Basic">Basic</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => removeLanguage(lang.id)}
            aria-label={`Remove language ${index + 1}`}
          >
            <Trash2 className="h-3 w-3 text-destructive" />
          </Button>
        </div>
      ))}
      <Button
        variant="outline"
        size="sm"
        className="h-10 text-base sm:h-7 sm:text-xs w-full"
        onClick={addLanguage}
      >
        <Plus className="h-3 w-3 mr-1" aria-hidden="true" />
        Add Language
      </Button>
    </div>
  );
}
