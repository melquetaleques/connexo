import type { ReactNode } from "react";

type RitoChapterProps = {
  time: string;
  titleStart: string;
  titleEnd: string;
  body: string;
  chips: string[];
  reverse?: boolean;
  tone: "ink" | "vinho" | "teal";
  children: ReactNode;
};

const TONE_FIELD = {
  ink: "mag-field-ink",
  vinho: "mag-field-vinho",
  teal: "mag-field-teal",
} as const;

export function RitoChapter({
  time,
  titleStart,
  titleEnd,
  body,
  chips,
  reverse,
  tone,
  children,
}: RitoChapterProps) {
  return (
    <article
      className={`landing-reveal relative flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-12 ${
        reverse ? "lg:flex-row-reverse" : ""
      }`}
    >
      <div className="lg:w-2/5">
        <div className="flex items-center gap-3 mb-4">
          <span
            className="hidden sm:inline-flex w-3 h-3 rounded-full bg-mg-magenta shrink-0"
            aria-hidden="true"
          />
          <p className="rito-time font-ui text-xl font-bold">{time}</p>
        </div>
        <h3 className="rito-title font-display font-semibold text-mg-vinho mb-4">
          {titleStart} {titleEnd}
        </h3>
        <p className="font-ui text-base font-medium text-mg-ink leading-relaxed mb-5">{body}</p>
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
      <div className={`mag-field ${TONE_FIELD[tone]} relative isolate lg:w-3/5 rounded-[16px] p-2 sm:p-3 overflow-hidden`}>
        <div className="mag-grain" aria-hidden="true" />
        <div className="relative">{children}</div>
      </div>
    </article>
  );
}
