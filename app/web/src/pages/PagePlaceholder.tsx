import { Card } from "@/components/ui/connexo-primitives";

type Props = { title: string; hint?: string };

export function PagePlaceholder({ title, hint }: Props) {
  return (
    <Card className="max-w-3xl">
      <h2 className="text-2xl font-semibold text-ink tracking-tight font-theme-display">{title}</h2>
      {hint && <p className="mt-2 text-on-surface-variant/70 font-theme-body">{hint}</p>}
      <p className="mt-6 text-sm text-on-surface-variant/50 font-theme-body">
        Esta pagina esta em construcao e sera disponibilizada em uma proxima atualizacao.
      </p>
      {hint && (
        <div className="mt-3 inline-block px-3 py-1 bg-surface-2 rounded-full border border-outline/30">
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary/30">{hint}</span>
        </div>
      )}
    </Card>
  );
}
