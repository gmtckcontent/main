"use client";

import {
  useRef,
  useEffect,
  useCallback,
  useState,
  useLayoutEffect,
  type RefObject,
} from "react";
import {
  motion,
  AnimatePresence,
  useInView,
  useReducedMotion,
} from "framer-motion";
import {
  HISTORY_STICKY_PANELS,
  type HistoryDataEntry,
  type HistoryLineItem,
} from "@/constants/historyData";

// 뷰포트 중앙 16% 구간에 들어오면 트리거
const CENTER_VIEWPORT_MARGIN = "-42% 0px -42% 0px";

function useCenterInView(
  ref: RefObject<Element | null>,
  onCenter: () => void,
) {
  const inCenter = useInView(ref, { margin: CENTER_VIEWPORT_MARGIN, amount: 0 });
  useEffect(() => {
    if (inCenter) onCenter();
  }, [inCenter, onCenter]);
}

function lineText(line: HistoryLineItem): string {
  return typeof line === "string" ? line : line.text;
}

function lineEmphasis(line: HistoryLineItem): boolean {
  return typeof line === "object" && Boolean(line.emphasis);
}

/**
 * 스크롤 센티넬 — 화면에 보이지 않으나, 각 엔트리 구간에 절대 배치되어
 * 뷰포트 중앙을 통과할 때 activeIndex를 변경한다.
 */
function ScrollSentinel({
  index,
  onBecomeActive,
}: {
  index: number;
  onBecomeActive: (i: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const handleCenter = useCallback(
    () => onBecomeActive(index),
    [index, onBecomeActive],
  );
  useCenterInView(ref, handleCenter);

  return (
    <div
      ref={ref}
      className="pointer-events-none absolute left-0 w-full"
      style={{ top: `${index * 100}svh`, height: "100svh" }}
      aria-hidden
    />
  );
}

function YearRail({
  entries,
  activeIndex,
  reduceMotion,
}: {
  entries: HistoryDataEntry[];
  activeIndex: number;
  reduceMotion: boolean | null;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [yAlign, setYAlign] = useState(0);

  const measureAlign = useCallback(() => {
    const c = containerRef.current;
    const el = rowRefs.current[activeIndex];
    if (!c || !el) return;
    const cRect = c.getBoundingClientRect();
    const eRect = el.getBoundingClientRect();
    const delta =
      eRect.top + eRect.height / 2 - (cRect.top + cRect.height / 2);
    setYAlign(-delta);
  }, [activeIndex]);

  useLayoutEffect(() => {
    const id = requestAnimationFrame(() => measureAlign());
    return () => cancelAnimationFrame(id);
  }, [measureAlign]);

  useEffect(() => {
    window.addEventListener("resize", measureAlign);
    return () => window.removeEventListener("resize", measureAlign);
  }, [measureAlign]);

  return (
    <div
      ref={containerRef}
      className="relative z-[2] flex h-full w-full flex-col items-center justify-center overflow-hidden px-5"
    >
      <motion.div
        className="flex w-full max-w-full flex-col gap-2 sm:gap-2.5"
        animate={{ y: yAlign, x: 0 }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : { type: "spring", stiffness: 320, damping: 36, mass: 0.85 }
        }
      >
        {entries.map((row, i) => {
          const isActive = i === activeIndex;
          return (
            <div
              key={row.id}
              ref={(node) => {
                rowRefs.current[i] = node;
              }}
              className="flex min-w-0 w-full items-center justify-center"
            >
              <motion.p
                className="w-full max-w-[min(100%,44ch)] text-center font-semibold tracking-tight"
                animate={{
                  scale: isActive ? 1 : 0.92,
                  opacity: isActive ? 1 : 0.38,
                }}
                transition={{
                  duration: reduceMotion ? 0 : 0.28,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{
                  boxSizing: "border-box",
                  transformOrigin: "center center",
                  fontSize: isActive
                    ? "clamp(1.125rem, 2.2vw, 1.5rem)"
                    : "clamp(0.875rem, 1.6vw, 1.125rem)",
                  fontWeight: isActive ? 800 : 500,
                  color: isActive ? "#ffffff" : "rgba(255,255,255,0.45)",
                  textShadow: isActive ? "0 4px 40px rgba(0,0,0,0.35)" : "none",
                }}
              >
                {row.title ?? row.periodLabel}
              </motion.p>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}

/**
 * 패널 shell 전체가 sticky — 고정된 창처럼 보이며,
 * 오른쪽 카드는 activeIndex가 바뀔 때 animate 교체된다.
 * 보이지 않는 sentinel들이 스크롤 구간마다 activeIndex를 변경한다.
 * 모든 sentinel이 지나고 나면 section이 끝나 패널도 함께 올라간다.
 */
function HistoryStickyScrollPanel({
  panelId,
  entries,
  diagramSlotId,
}: {
  panelId: string;
  entries: HistoryDataEntry[];
  diagramSlotId?: string;
}) {
  const reduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const active = entries[activeIndex] ?? entries[0];

  const setActive = useCallback((i: number) => {
    setActiveIndex((prev) => (prev !== i ? i : prev));
  }, []);

  const fadeDuration = reduceMotion ? 0 : 0.45;

  return (
    <section
      className="relative"
      // section 높이 = 각 엔트리마다 100svh — 이 구간 동안 패널이 고정됨
      style={{ minHeight: `${entries.length * 100}svh` }}
      aria-label={`연혁 타임라인 ${panelId}`}
    >
      {/* ── 패널 shell: sticky ── 뷰포트에 고정된 창처럼 보임 */}
      <div
        className="sticky [overflow:clip] rounded-[28px] md:rounded-[40px]
                   shadow-[0_28px_90px_-24px_rgba(15,23,42,0.18)] ring-1 ring-black/5"
        style={{ top: "22svh", height: "56svh" }}
      >
        {/* 배경 이미지 — shell 전체 커버 (왼쪽,오른쪽 동일 배경) */}
        <div className="absolute inset-0 bg-neutral-900">
          <AnimatePresence initial={false} mode="sync">
            <motion.div
              key={active.id}
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${active.image})` }}
              initial={{ opacity: reduceMotion ? 1 : 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: reduceMotion ? 1 : 0 }}
              transition={{ duration: fadeDuration, ease: [0.4, 0, 0.2, 1] }}
            />
          </AnimatePresence>
        </div>
        {/* 어두운 오버레이 + blur — 배경 이미지 억제 */}
        <div
          className="pointer-events-none absolute inset-0 bg-black/55 backdrop-blur-[8px]"
          aria-hidden
        />

        {/* 그리드 콘텐츠 */}
        <div className="relative z-[1] grid h-full grid-cols-1 lg:grid-cols-2">

          {/* 왼쪽: 연도 레일 */}
          <div className="relative flex h-full items-center justify-center">
            <YearRail
              entries={entries}
              activeIndex={activeIndex}
              reduceMotion={reduceMotion}
            />
            {diagramSlotId && (
              <div
                id={diagramSlotId}
                className="pointer-events-none absolute bottom-5 left-1/2 z-[3] w-[min(90%,340px)] -translate-x-1/2"
                aria-hidden
              />
            )}
          </div>

          {/* 오른쪽: 카드 — 레일 컬럼 배경 없음, 패딩으로 카드 위치 살짝 왼쪽으로 */}
          <div className="relative flex items-center justify-center bg-transparent px-[clamp(1rem,3vw,1.75rem)] py-6 sm:px-[clamp(1.25rem,3.5vw,2rem)] lg:py-8 lg:px-[clamp(1.5rem,4vw,2.25rem)]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.article
                key={active.id}
                className="box-border flex min-h-[min(42svh,420px)] w-full max-w-[460px] flex-col items-center justify-center rounded-[1.75rem] border border-white/40 bg-transparent px-9 py-11 text-center shadow-none sm:px-11 sm:py-14 lg:px-14 lg:py-[4.75rem]"
                initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
                transition={{ duration: fadeDuration, ease: [0.22, 1, 0.36, 1] }}
              >
                <ul className="mx-auto w-full max-w-[min(100%,48ch)] space-y-3 text-center text-[14px] leading-[1.65] text-white sm:text-[15px]">
                  {active.items.map((line, j) => (
                    <li
                      key={`${active.id}-${j}`}
                      className={
                        lineEmphasis(line)
                          ? "list-none pl-0 font-bold text-white"
                          : "list-none pl-0 font-normal text-white"
                      }
                    >
                      {lineText(line)}
                    </li>
                  ))}
                </ul>
              </motion.article>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* 스크롤 센티넬 — 보이지 않음, 각 엔트리 구간(100svh)에 절대 배치 */}
      {entries.map((entry, index) => (
        <ScrollSentinel
          key={entry.id}
          index={index}
          onBecomeActive={setActive}
        />
      ))}
    </section>
  );
}

export function HistoryScrollSection() {
  return (
    <section
      className="relative bg-[#e8ecf2] pb-10 pt-10 md:pb-16 md:pt-14"
      id="cv-history"
      aria-labelledby="cv-history-heading"
    >
      <div className="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-8">
        <header className="pointer-events-none sticky top-[15svh] z-20 mb-3 text-center md:top-[15svh] md:mb-4">
          <h2
            id="cv-history-heading"
            className="cv-dd-label-en mx-auto mb-3 max-w-[min(52rem,100%)] text-balance"
          >
            Fundamental Value of GMTCK Strategy Pillars
          </h2>
          {/* @ts-ignore */}
          <p className="cv-history-page-desc cv-history-page-desc--pre">
            {"Safety & The Five Elements\nTCK's vision is anchored in our \"Five Elements\". These frameworks shape what we do and how we do it.\nSafety is non-negotiable — every initiative shall be built on this foundation"}
          </p>
        </header>

        {HISTORY_STICKY_PANELS.map((panel, i) => (
          <HistoryStickyScrollPanel
            key={panel.id}
            panelId={panel.id}
            entries={panel.entries}
            diagramSlotId={i === 0 ? "cv-dd-diagram-slot" : undefined}
          />
        ))}
      </div>
    </section>
  );
}
