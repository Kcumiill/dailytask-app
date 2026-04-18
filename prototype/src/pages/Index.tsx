import { useAuth } from "@/hooks/useAuth";
import { CreateNoteDialog } from "@/components/CreateNoteDialog";
import { NotesList } from "@/components/NotesList";
import { Button } from "@/components/ui/button";
import { Flame, LogOut } from "lucide-react";
import Auth from "./Auth";

const Dashboard = () => {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container max-w-2xl flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-primary" />
            <span className="font-display font-bold text-foreground">Deadliner</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground hidden sm:block">
              {user?.email}
            </span>
            <Button variant="ghost" size="icon" onClick={signOut} className="h-8 w-8">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>
      
      <main className="container max-w-2xl px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-display font-bold text-foreground">Мои заметки</h1>
          <CreateNoteDialog />
        </div>
        <NotesList />
      </main>
    </div>
  );
};

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Flame className="h-8 w-8 text-primary animate-pulse" />
      </div>
    );
  }

  return user ? <Dashboard /> : <Auth />;
};

export default Index;
