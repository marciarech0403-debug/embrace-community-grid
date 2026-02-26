import { useNavigate } from "react-router-dom";
import wuazeLogo from "@/assets/wuaze-logo.svg";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="dark min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-violet-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-rose-500/8 rounded-full blur-[100px] animate-pulse delay-700" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-fuchsia-500/5 rounded-full blur-[150px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-8 px-6">
        <img src={wuazeLogo} alt="Wuaze" className="h-20 w-20 drop-shadow-2xl" />
        
        <div className="text-center space-y-3">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">
            wuaze
          </h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-md leading-relaxed">
            Seu sócio digital que domina tudo sobre ganhar dinheiro com IA.
          </p>
        </div>

        {/* Fancy button */}
        <button
          onClick={() => navigate("/dashboard")}
          className="group relative bg-neutral-800 h-16 w-64 border border-border text-left p-3 text-foreground text-base font-bold rounded-lg overflow-hidden
            underline underline-offset-2
            before:absolute before:w-12 before:h-12 before:right-1 before:top-1 before:z-10 before:bg-violet-500 before:rounded-full before:blur-lg
            after:absolute after:z-10 after:w-20 after:h-20 after:bg-rose-300 after:right-8 after:top-3 after:rounded-full after:blur-lg
            hover:border-rose-300 hover:text-rose-300 hover:underline-offset-4 hover:decoration-2
            hover:before:right-12 hover:before:-bottom-8 hover:before:blur hover:before:[box-shadow:_20px_20px_20px_30px_#a21caf]
            hover:after:-right-8
            duration-500 before:duration-500 after:duration-500
            group-hover:before:duration-500 group-hover:after:duration-500
            origin-left transition-all"
        >
          Comece já →
        </button>
      </div>
    </div>
  );
}
