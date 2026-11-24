import type { ReactNode } from "react";

export function Panel({
  title,
  subtitle,
  children,
  className = "",
}: {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-[28px] bg-white p-7 shadow-[0_2px_20px_rgba(0,0,0,0.05)] ring-1 ring-black/5 ${className}`}>
      {title ? <h2 className="text-xl font-semibold">{title}</h2> : null}
      {subtitle ? <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p> : null}
      <div className={title || subtitle ? "mt-6" : ""}>{children}</div>
    </section>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="text-sm font-medium text-muted-foreground">{children}</p>;
}
