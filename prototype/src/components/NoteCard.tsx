import { Note, useUpdateNote, useDeleteNote } from "@/hooks/useNotes";
import { getDeadlineStatus, formatDeadline } from "@/lib/deadline-utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash2, Clock, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

const priorityLabels: Record<string, string> = {
  low: "Низкий",
  medium: "Средний",
  high: "Высокий",
};

export const NoteCard = ({ note }: { note: Note }) => {
  const updateNote = useUpdateNote();
  const deleteNote = useDeleteNote();
  const status = getDeadlineStatus(note.deadline);
  const deadlineText = formatDeadline(note.deadline);

  return (
    <div
      className={cn(
        "group bg-card border rounded-lg p-4 transition-all hover:shadow-md animate-fade-in",
        note.completed && "opacity-60",
        status === "urgent" && !note.completed && "border-deadline-urgent/30",
        status === "warning" && !note.completed && "border-deadline-warning/30"
      )}
    >
      <div className="flex items-start gap-3">
        <Checkbox
          checked={note.completed}
          onCheckedChange={(checked) =>
            updateNote.mutate({ id: note.id, completed: !!checked })
          }
          className="mt-1"
        />
        <div className="flex-1 min-w-0">
          <h3
            className={cn(
              "font-display font-semibold text-card-foreground",
              note.completed && "line-through"
            )}
          >
            {note.title}
          </h3>
          {note.content && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {note.content}
            </p>
          )}
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            {deadlineText && (
              <span
                className={cn(
                  "inline-flex items-center gap-1 text-xs font-medium",
                  status === "urgent" && "deadline-urgent",
                  status === "warning" && "deadline-warning",
                  status === "safe" && "deadline-safe",
                  status === "passed" && "deadline-passed"
                )}
              >
                {status === "urgent" ? (
                  <AlertTriangle className="h-3 w-3" />
                ) : (
                  <Clock className="h-3 w-3" />
                )}
                {deadlineText}
              </span>
            )}
            <span
              className={cn(
                "text-xs px-2 py-0.5 rounded-full",
                note.priority === "high" && "bg-deadline-urgent text-deadline-urgent",
                note.priority === "medium" && "bg-deadline-warning text-deadline-warning",
                note.priority === "low" && "bg-deadline-safe text-deadline-safe"
              )}
            >
              {priorityLabels[note.priority]}
            </span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 text-muted-foreground hover:text-destructive"
          onClick={() => deleteNote.mutate(note.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
