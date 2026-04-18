import { useState } from "react";
import { useCreateNote } from "@/hooks/useNotes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Plus, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const CreateNoteDialog = () => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [deadline, setDeadline] = useState<Date>();
  const [deadlineTime, setDeadlineTime] = useState("23:59");
  const [priority, setPriority] = useState("medium");
  const createNote = useCreateNote();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    let deadlineStr: string | undefined;
    if (deadline) {
      const [h, m] = deadlineTime.split(":").map(Number);
      const d = new Date(deadline);
      d.setHours(h, m, 0, 0);
      deadlineStr = d.toISOString();
    }

    try {
      await createNote.mutateAsync({ title: title.trim(), content: content.trim() || undefined, deadline: deadlineStr, priority });
      toast.success("Заметка создана");
      setTitle("");
      setContent("");
      setDeadline(undefined);
      setDeadlineTime("23:59");
      setPriority("medium");
      setOpen(false);
    } catch {
      toast.error("Ошибка при создании");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Новая заметка
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">Новая заметка</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Заголовок"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <Textarea
            placeholder="Описание (необязательно)"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
          />
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("flex-1 justify-start text-left font-normal", !deadline && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {deadline ? format(deadline, "d MMM yyyy", { locale: ru }) : "Дедлайн"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={deadline}
                  onSelect={setDeadline}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            {deadline && (
              <Input
                type="time"
                value={deadlineTime}
                onChange={(e) => setDeadlineTime(e.target.value)}
                className="w-28"
              />
            )}
          </div>
          <Select value={priority} onValueChange={setPriority}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Низкий приоритет</SelectItem>
              <SelectItem value="medium">Средний приоритет</SelectItem>
              <SelectItem value="high">Высокий приоритет</SelectItem>
            </SelectContent>
          </Select>
          <Button type="submit" className="w-full" disabled={createNote.isPending}>
            {createNote.isPending ? "Создание..." : "Создать"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
