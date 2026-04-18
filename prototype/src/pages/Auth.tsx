import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Flame } from "lucide-react";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Добро пожаловать!");
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        toast.success("Проверьте почту для подтверждения!");
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm animate-fade-in">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Flame className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold font-display text-foreground">Deadliner</h1>
        </div>
        
        <div className="bg-card rounded-lg border p-6 shadow-sm">
          <h2 className="text-lg font-semibold font-display text-card-foreground mb-4">
            {isLogin ? "Войти" : "Регистрация"}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "..." : isLogin ? "Войти" : "Создать аккаунт"}
            </Button>
          </form>
          
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors w-full text-center"
          >
            {isLogin ? "Нет аккаунта? Зарегистрироваться" : "Уже есть аккаунт? Войти"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
