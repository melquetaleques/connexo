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
    <Card className={cn("p-6 cx-reveal", className)}>
      <div className="flex items-center justify-between mb-6">
        <p className="font-theme-body text-[15px] leading-none text-[#7c726d]">{label}</p>
        {icon && (
          <div
            className={cn(
              "w-[34px] h-[34px] rounded-[9px] flex items-center justify-center shrink-0",
              highlight ? "bg-[#fdeef4] text-[#c11e63]" : "bg-[#edf0fd] text-[#4c63c7]"
            )}
          >
            <Icon name={icon} className="text-base" />
          </div>
        )}
      </div>
      <p className="text-[34px] font-extrabold leading-none tracking-tight text-[#1c1b1a] font-theme-display">{value}</p>
    </Card>
  );
}
