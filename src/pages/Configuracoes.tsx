import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Sun, Moon, Monitor } from "lucide-react";

type Theme = "light" | "dark" | "system";

const Configuracoes = () => {
  const [theme, setTheme] = useState<Theme>("dark");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <AppLayout>
      <div className="flex-1 overflow-y-auto px-6 py-10">
        <div className="mx-auto max-w-lg space-y-8">
          {/* Aparência */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-1">Aparência</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Tema — Escolha como você quer que a interface apareça
            </p>
            <div className="space-y-2">
              {([
                { value: "light" as Theme, label: "Claro", desc: "Interface com fundo claro", icon: Sun },
                { value: "dark" as Theme, label: "Escuro", desc: "Interface com fundo escuro", icon: Moon },
                { value: "system" as Theme, label: "Sistema", desc: "Seguir configuração do sistema", icon: Monitor },
              ]).map((opt) => (
                <label
                  key={opt.value}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    theme === opt.value
                      ? "border-foreground/30 bg-surface"
                      : "border-border hover:bg-surface-hover"
                  }`}
                >
                  <input
                    type="radio"
                    name="theme"
                    value={opt.value}
                    checked={theme === opt.value}
                    onChange={() => setTheme(opt.value)}
                    className="accent-foreground"
                  />
                  <opt.icon className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{opt.label}</p>
                    <p className="text-xs text-muted-foreground">{opt.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </section>

          {/* Informações da Conta */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-4">Informações da Conta</h2>
            <div>
              <label className="text-sm font-medium text-foreground">Email</label>
              <p className="text-sm text-muted-foreground mt-1">usuario@email.com</p>
              <p className="text-xs text-muted-foreground/70 mt-0.5">O email não pode ser alterado</p>
            </div>
          </section>

          {/* Alterar Senha */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-4">Alterar Senha</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-foreground">Senha Atual</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Digite sua senha atual"
                  className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-foreground/30 transition-colors"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Nova Senha</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Digite sua nova senha"
                  className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-foreground/30 transition-colors"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Confirmar Nova Senha</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirme sua nova senha"
                  className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-foreground/30 transition-colors"
                />
              </div>
              <button className="flex items-center gap-2 rounded-lg bg-surface-hover border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-surface transition-colors">
                🔒 Salvar Nova Senha
              </button>
            </div>
          </section>
        </div>
      </div>
    </AppLayout>
  );
};

export default Configuracoes;
