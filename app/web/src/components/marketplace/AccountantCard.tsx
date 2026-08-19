import { Card, GoldButton, Pill, Avatar, Icon } from "@/components/ui/connexo-primitives";
import { Accountant } from "@/types";
import { useNavigate } from "react-router-dom";

interface AccountantCardProps {
  accountant: Accountant & { name: string; avatar_url?: string };
}

export function AccountantCard({ accountant }: AccountantCardProps) {
  const navigate = useNavigate();

  const handleViewProfile = () => {
    navigate(`/contadores/${accountant.slug || accountant.id}`);
  };

  return (
    <Card className="group relative h-full flex flex-col justify-between overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 bg-white border-outline/50">
      {/* Decoração de Fundo Sutil */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-secondary/5 rounded-full blur-3xl group-hover:bg-secondary/10 transition-colors" />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-6">
          <div className="relative">
            <div className="rounded-full ring-4 ring-secondary/5 group-hover:ring-secondary/20 transition-all inline-block">
              <Avatar
                initials={accountant.name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()}
                size="lg"
                tone="navy"
              />
            </div>
            {accountant.is_public && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white shadow-lg" title="Verificado">
                <Icon name="check" className="text-[14px] text-white font-black" />
              </div>
            )}
          </div>
          
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1 text-secondary mb-1">
              <Icon name="star" fill className="text-sm" />
              <span className="text-sm font-black">{accountant.rating.toFixed(1)}</span>
            </div>
            <p className="text-[10px] font-bold text-primary/40 uppercase tracking-widest">
              {accountant.completed_cases} Perícias
            </p>
          </div>
        </div>

        <div className="mb-4">
          <h4 className="text-lg font-black text-primary tracking-tight leading-tight mb-1 group-hover:text-secondary transition-colors">
            {accountant.name}
          </h4>
          <div className="flex items-center gap-1.5 text-primary/40 text-[11px] font-bold uppercase tracking-wider">
            <Icon name="location_on" className="text-xs" />
            {accountant.city}, {accountant.state}
          </div>
        </div>

        <p className="text-sm text-primary/60 line-clamp-2 mb-6 font-medium leading-relaxed">
          {accountant.bio || "Especialista em perícias contábeis judiciais com foco em precisão e conformidade técnica."}
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          {(accountant.specialties || []).slice(0, 3).map((spec) => (
            <Pill key={spec} tone="gold" className="text-[9px] py-0.5 px-2.5">
              {spec}
            </Pill>
          ))}
          {(accountant.specialties || []).length > 3 && (
            <span className="text-[10px] font-bold text-primary/30 py-1">+{accountant.specialties.length - 3}</span>
          )}
        </div>
      </div>

      <div className="relative z-10 pt-4 border-t border-outline/30">
        <GoldButton 
          className="w-full py-4 text-[10px] shadow-none hover:shadow-lg group-hover:bg-primary transition-all" 
          onClick={handleViewProfile}
          icon="arrow_forward"
        >
          Ver Perfil Profissional
        </GoldButton>
      </div>
    </Card>
  );
}
