type Props = { title: string; hint?: string };

export function PagePlaceholder({ title, hint }: Props) {
  return (
    <div className="max-w-3xl">
      <h2 className="text-2xl font-extrabold text-primary tracking-tight">{title}</h2>
      {hint && <p className="mt-2 text-slate-600">{hint}</p>}
      <p className="mt-6 text-sm text-slate-500">
        Esta pagina esta em construcao e sera disponibilizada em uma proxima atualizacao.
      </p>
      {hint && (
        <div className="mt-3 inline-block px-3 py-1 bg-surface-2 rounded-full border border-outline/30">
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary/30">{hint}</span>
        </div>
      )}
    </div>
  );
}
