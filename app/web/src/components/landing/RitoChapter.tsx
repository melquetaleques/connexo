import type { ReactNode } from "react";

type RitoChapterProps = {
  time: string;
  titleStart: string;
  titleEnd: string;
  body: string;
  chips: string[];
  reverse?: boolean;
  children: ReactNode;
};

export function RitoChapter({
  time,
  titleStart,
  titleEnd,
  body,
  chips,
  reverse,
  children,
}: RitoChapterProps) {
  return (
    <article
      className={`landing-reveal relative flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-16 ${
        reverse ? "lg:flex-row-reverse" : ""
      }`}
    >
      <div className="lg:w-1/2">
        <div className="flex items-center gap-3 mb-4">
          <span
            className="hidden sm:inline-flex w-3 h-3 rounded-full bg-mg-magenta shrink-0"
            aria-hidden="true"
          />
          <p className="font-ui text-xl font-bold text-mg-magenta">{time}</p>
        </div>
        <h3 className="rito-title font-display font-semibold text-mg-ink mb-4">
          {titleStart} {titleEnd}
        </h3>
        <p className="font-ui text-base text-on-surface-variant leading-relaxed mb-5">{body}</p>
        <ul className="flex flex-wrap gap-2">
          {chips.map((chip) => (
            <li
              key={chip}
              className="min-h-11 px-3 inline-flex items-center rounded-full border border-outline bg-white font-ui text-xs text-mg-ink"
            >
              {chip}
            </li>
          ))}
        </ul>
      </div>
      <div className="lg:w-1/2">{children}</div>
    </article>
  );
}
