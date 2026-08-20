import type { ReactNode } from "react";

type MockShellProps = {
  testId: string;
  label: string;
  meta?: string;
  dotClass: string;
  children: ReactNode;
};

export function MockShell({ testId, label, meta, dotClass, children }: MockShellProps) {
  return (
    <div
      data-testid={testId}
      className="rounded-[16px] border border-outline bg-white overflow-hidden text-mg-ink"
    >
      <div className="flex items-center gap-2 px-4 min-h-12 border-b border-outline bg-mg-ivory">
        <span className={`inline-block w-2.5 h-2.5 rounded-full ${dotClass}`} aria-hidden="true" />
        <p className="font-ui text-xs uppercase tracking-wide text-mg-ink">
          {label}
          {meta ? ` · ${meta}` : ""}
        </p>
      </div>
      {children}
    </div>
  );
}

export function MockRow({
  children,
  alt,
}: {
  children: ReactNode;
  alt?: boolean;
}) {
  return (
    <div
      className={`mock-row min-h-12 px-4 py-3 flex items-center gap-3 border-b border-outline last:border-b-0 ${
        alt ? "bg-mg-ivory" : "bg-white"
      }`}
    >
      {children}
    </div>
  );
}

export function StatusPill({
  tone,
  children,
}: {
  tone: "ok" | "warn" | "deny" | "gold";
  children: ReactNode;
}) {
  const cls = {
    ok: "bg-ledger text-white",
    warn: "bg-mg-ivory text-mg-ink border border-outline",
    deny: "bg-deny text-white",
    gold: "bg-mg-indigo text-white",
  }[tone];
  return (
    <span className={`inline-flex items-center min-h-6 px-2 rounded-full font-ui text-xs font-bold shrink-0 ${cls}`}>
      {children}
    </span>
  );
}
