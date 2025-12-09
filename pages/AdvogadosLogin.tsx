import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocation } from "wouter";
import { LogOut } from "lucide-react";
import { toast } from "sonner";

export default function AdvogadosLogin() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulação de login (em produção, conectar com API real)
    setTimeout(() => {
      if (email === "admin@djairrotta.com.br" && password === "admin123") {
        localStorage.setItem("advogado_auth", "true");
        localStorage.setItem("advogado_name", "Dr. Djair Rota");
        localStorage.setItem("advogado_role", "Master");
        localStorage.setItem("advogado_user_id", "1");
        toast.success("Login realizado com sucesso!");
        setLocation("/advogados/dashboard");
      } else {
        toast.error("Credenciais inválidas");
        setLoading(false);
      }
    }, 1000);
  };

  const handleLogout = () => {
    setLocation("/");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 relative overflow-hidden">
      {/* Botão Sair - Canto Superior Direito */}
      <Button
        variant="ghost"
        className="absolute top-6 right-6 text-slate-600 hover:text-slate-900 hover:bg-slate-200"
        onClick={handleLogout}
      >
        <LogOut className="h-4 w-4 mr-2" />
        Sair
      </Button>

      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-5">
        <div className="absolute inset-0 bg-[url('/images/hero-bg.jpg')] bg-cover bg-center" />
      </div>

      <div className="w-full max-w-md z-10 px-4">
        <div className="bg-white border border-slate-200 shadow-2xl rounded-lg p-8 md:p-12">
          {/* Título */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-serif text-slate-800 mb-2">Portal do Advogado</h1>
            <p className="text-slate-500 text-sm">Acesso restrito à equipe jurídica</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-700">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12"
              />
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full h-12 bg-slate-800 text-white hover:bg-slate-900 text-sm font-bold uppercase tracking-widest transition-all"
            >
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
