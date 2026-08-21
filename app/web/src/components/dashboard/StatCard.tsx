import { Card, Icon } from "@/components/ui/connexo-primitives";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  icon,
  highlight = false,
  className,
}: {
  label: string;
  value: string | number;
  icon?: string;
  highlight?: boolean;
  className?: string;
}) {
  return (
    <Card
      className={cn(
        "p-8 border-b-4 cx-reveal transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md motion-reduce:transition-none motion-reduce:hover:translate-y-0",
        highlight ? "border-b-secondary" : "border-b-primary/10",
        className
      )}
    >
      {icon && (
        <div className="flex items-center justify-between mb-4">
          <div
            className={cn(
              "w-[34px] h-[34px] rounded-[9px] flex items-center justify-center",
              highlight ? "bg-secondary/10 text-secondary" : "bg-surface-2 text-primary/40"
            )}
          >
            <Icon name={icon} className="text-2xl" />
          </div>
        </div>
      )}
      <p className="text-3xl font-semibold text-ink mb-1 tracking-tight font-theme-display">{value}</p>
      <p className="text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-[0.15em] font-theme-body">
        {label}
      </p>
    </Card>
  );
}
