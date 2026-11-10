const STEPS = ["프레임", "필터", "촬영", "확인"] as const;

export default function StepIndicator({ current }: { current: number }) {
  return (
    <ol className="flex items-center gap-2" aria-label="진행 단계">
      {STEPS.map((label, index) => {
        const done = index < current;
        const active = index === current;
        return (
          <li
            key={label}
            className="flex items-center gap-2"
            aria-current={active ? "step" : undefined}
          >
            <span
              className={[
                "text-small flex items-center gap-1.5 rounded-full px-3 py-1.5 font-semibold transition-all",
                active
                  ? "bg-primary-600 text-white shadow-md"
                  : done
                    ? "bg-primary-100 text-primary-600"
                    : "text-gray-650 bg-white/70",
              ].join(" ")}
            >
              <span className="text-caption tabular-nums">{index + 1}</span>
              <span className="hidden sm:inline">{label}</span>
              {active && <span className="sm:hidden">{label}</span>}
            </span>
            {index < STEPS.length - 1 && (
              <span className={`h-px w-4 sm:w-6 ${done ? "bg-primary-300" : "bg-gray-400"}`} />
            )}
          </li>
        );
      })}
    </ol>
  );
}
