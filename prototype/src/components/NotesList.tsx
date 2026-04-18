import { useState } from "react";
import { useNotes, Note } from "@/hooks/useNotes";
import { NoteCard } from "./NoteCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText } from "lucide-react";

export const NotesList = () => {
  const { data: notes, isLoading } = useNotes();
  const [tab, setTab] = useState("active");

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 rounded-lg" />
        ))}
      </div>
    );
  }

  const active = notes?.filter((n) => !n.completed) ?? [];
  const completed = notes?.filter((n) => n.completed) ?? [];

  const renderNotes = (list: Note[]) => {
    if (list.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <FileText className="h-12 w-12 mb-3 opacity-40" />
          <p className="text-sm">Нет заметок</p>
        </div>
      );
    }
    return (
      <div className="space-y-3">
        {list.map((note) => (
          <NoteCard key={note.id} note={note} />
        ))}
      </div>
    );
  };

  return (
    <Tabs value={tab} onValueChange={setTab}>
      <TabsList className="mb-4">
        <TabsTrigger value="active">
          Активные {active.length > 0 && `(${active.length})`}
        </TabsTrigger>
        <TabsTrigger value="completed">
          Выполненные {completed.length > 0 && `(${completed.length})`}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="active">{renderNotes(active)}</TabsContent>
      <TabsContent value="completed">{renderNotes(completed)}</TabsContent>
    </Tabs>
  );
};
