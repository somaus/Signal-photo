import type { ReactNode } from "react";
import Backdrop from "./Backdrop";
import StepIndicator from "./StepIndicator";

interface BoothLayoutProps {
  /** 0~3. 생략하면 단계 표시를 숨김 */
  stepIndex?: number;
  title?: string;
  description?: string;
  onBack?: () => void;
  footer?: ReactNode;
  children: ReactNode;
}

export default function BoothLayout({
  stepIndex,
  title,
  description,
  onBack,
  footer,
  children,
}: BoothLayoutProps) {
  return (
    <main className="relative flex h-dvh w-full flex-col overflow-hidden">
      <Backdrop />

      <header className="relative z-10 grid grid-cols-[1fr_auto_1fr] items-center px-5 pt-5 sm:px-8 sm:pt-7">
        <div>
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="text-small inline-flex cursor-pointer items-center gap-1 rounded-full bg-white/80 px-4 py-2.5 font-semibold text-gray-700 shadow-md backdrop-blur transition-all hover:bg-white active:scale-95"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M15 5l-7 7 7 7"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              이전
            </button>
          )}
        </div>
        <div>{stepIndex !== undefined && <StepIndicator current={stepIndex} />}</div>
        <div />
      </header>

      {(title || description) && (
        <section className="animate-step-in relative z-10 px-6 pt-5 text-center sm:pt-7">
          {title && <h1 className="text-h3 text-primary-600 sm:text-h2 font-bold">{title}</h1>}
          {description && (
            <p className="text-body-2 text-gray-650 sm:text-body-1 mt-1">{description}</p>
          )}
        </section>
      )}

      <div className="relative z-10 flex min-h-0 flex-1 flex-col px-5 py-4 sm:px-8">{children}</div>

      {footer && (
        <footer className="relative z-10 flex flex-col items-center gap-3 px-5 pb-6 sm:px-8 sm:pb-8">
          {footer}
        </footer>
      )}
    </main>
  );
}
