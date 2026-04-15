/**
 * Core Values — 연혁 (Next HistoryScrollSection 과 동일: 2패널 Sticky)
 * 마운트: #cv-history-panels
 */
import React, {
  StrictMode,
  useRef,
  useState,
  useEffect,
  useCallback,
} from "https://esm.sh/react@19.0.0";
import { createRoot } from "https://esm.sh/react-dom@19.0.0/client";
import {
  motion,
  AnimatePresence,
  useInView,
  useReducedMotion,
} from "https://esm.sh/framer-motion@11.15.0?deps=react@19.0.0,react-dom@19.0.0";
import { html } from "https://esm.sh/htm@3.1.1/react?deps=react@19.0.0";

const CENTER_VIEWPORT_MARGIN = "-42% 0px -42% 0px";

function useCenterInView(ref, onCenter) {
  const inCenter = useInView(ref, {
    margin: CENTER_VIEWPORT_MARGIN,
    amount: 0,
  });
  useEffect(() => {
    if (inCenter) onCenter();
  }, [inCenter, onCenter]);
}

function lineText(line) {
  return typeof line === "string" ? line : line.text;
}

function lineEmphasis(line) {
  return typeof line === "object" && Boolean(line.emphasis);
}

function railTitle(row) {
  return row.title ?? row.periodLabel;
}

/** 스크롤 센티넬 — 보이지 않음, 각 엔트리 구간(100svh)에 절대 배치해 activeIndex 변경 트리거 */
function ScrollSentinel({ index, onBecomeActive }) {
  const ref = useRef(null);
  const handleCenter = useCallback(() => {
    onBecomeActive(index);
  }, [index, onBecomeActive]);
  useCenterInView(ref, handleCenter);

  return html`
    <div
      ref=${ref}
      style=${{
        position: "absolute",
        left: 0,
        width: "100%",
        top: `${index * 100}svh`,
        height: "100svh",
        pointerEvents: "none",
      }}
      aria-hidden="true"
    />
  `;
}

function YearRail({ entries, activeIndex, reduceMotion }) {
  return html`
    <div className="cv-history-m-year-rail">
      <div className="cv-history-m-year-motion">
        ${entries.map((row, i) => {
          const isActive = i === activeIndex;
          return html`
            <div
              key=${row.id}
              className="cv-history-m-year-row"
            >
              <${motion.p}
                animate=${{
                  scale: isActive ? 1 : 0.92,
                  opacity: isActive ? 1 : 0.38,
                }}
                transition=${{
                  duration: reduceMotion ? 0 : 0.28,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style=${{
                  boxSizing: "border-box",
                  width: "100%",
                  maxWidth: "min(100%, 44ch)",
                  margin: 0,
                  marginLeft: "auto",
                  marginRight: "auto",
                  textAlign: "center",
                  transformOrigin: "center center",
                  fontSize: isActive
                    ? "clamp(1.125rem, 2.2vw, 1.5rem)"
                    : "clamp(0.875rem, 1.6vw, 1.125rem)",
                  fontWeight: isActive ? 800 : 500,
                  color: isActive ? "#ffffff" : "rgba(255,255,255,0.45)",
                  textShadow: isActive ? "0 4px 40px rgba(0,0,0,0.35)" : "none",
                  fontFamily: '"Overpass","Noto Sans KR",sans-serif',
                }}
              >
                ${railTitle(row)}
              </${motion.p}>
            </div>
          `;
        })}
      </div>
    </div>
  `;
}

function HistoryStickyScrollPanel({ panelId, entries, diagramSlotId }) {
  const reduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const active = entries[activeIndex] ?? entries[0];
  const setActive = useCallback((i) => {
    setActiveIndex((prev) => (prev !== i ? i : prev));
  }, []);
  const fadeDuration = reduceMotion ? 0 : 0.45;

  return html`
    <section
      className="cv-history-m-panel"
      style=${{ position: "relative", minHeight: `${entries.length * 100}svh` }}
      aria-label=${`GMTCK Strategy Pillars ${panelId}`}
    >
      <!-- shell: CSS가 sticky + 고정 높이를 담당 -->
      <div className="cv-history-m-shell">
        <!-- 배경: shell 전체 커버 -->
        <div className="cv-history-m-bg cv-history-m-bg--fill-shell">
          <${AnimatePresence} initial=${false} mode="sync">
            <${motion.div}
              key=${active.id}
              className="cv-history-m-bg-layer"
              style=${{ backgroundImage: `url(${active.image})` }}
              initial=${{ opacity: reduceMotion ? 1 : 0 }}
              animate=${{ opacity: 1 }}
              exit=${{ opacity: reduceMotion ? 1 : 0 }}
              transition=${{ duration: fadeDuration, ease: [0.4, 0, 0.2, 1] }}
            />
          </${AnimatePresence}>
          <div className="cv-history-m-overlay" aria-hidden="true"></div>
        </div>

        <div className="cv-history-m-grid">
          <!-- 왼쪽: 연도 레일 -->
          <div className="cv-history-m-sticky-col">
            <div className="cv-history-m-left">
              <${YearRail}
                entries=${entries}
                activeIndex=${activeIndex}
                reduceMotion=${reduceMotion}
              />
              ${diagramSlotId
                ? html`<div
                    id=${diagramSlotId}
                    className="cv-history-diagram-slot"
                    aria-hidden="true"
                  ></div>`
                : null}
            </div>
          </div>

          <!-- 오른쪽: 활성 카드만 표시, activeIndex 변경 시 animate 교체 -->
          <div className="cv-history-m-rail-col">
            <${AnimatePresence} mode="wait" initial=${false}>
              <${motion.article}
                key=${active.id}
                className="cv-history-m-card"
                initial=${{ opacity: 0, y: 14 }}
                animate=${{ opacity: 1, y: 0 }}
                exit=${{ opacity: 0, y: -10 }}
                transition=${{ duration: reduceMotion ? 0 : fadeDuration, ease: [0.22, 1, 0.36, 1] }}
              >
                <ul className="cv-history-m-card-list">
                  ${active.items.map(
                    (line, j) => html`
                      <li
                        key=${`${active.id}-${j}`}
                        className=${lineEmphasis(line) ? "cv-history-line--bold" : ""}
                      >
                        ${lineText(line)}
                      </li>
                    `,
                  )}
                </ul>
              </${motion.article}>
            </${AnimatePresence}>
          </div>
        </div>
      </div>

      <!-- 센티넬: 보이지 않음, 각 엔트리 구간(100svh)마다 배치해 activeIndex 변경 트리거 -->
      ${entries.map(
        (entry, index) => html`
          <${ScrollSentinel}
            key=${entry.id}
            index=${index}
            onBecomeActive=${setActive}
          />
        `,
      )}
    </section>
  `;
}

function HistoryPanelsMount({ panels }) {
  return html`
    <${React.Fragment}>
      ${panels.map(
        (panel, i) => html`
          <${HistoryStickyScrollPanel}
            key=${panel.id}
            panelId=${panel.id}
            entries=${panel.entries}
            diagramSlotId=${i === 0 ? "cv-dd-diagram-slot" : undefined}
          />
        `,
      )}
    </${React.Fragment}>
  `;
}

async function boot() {
  const rootEl = document.getElementById("cv-history-panels");
  if (!rootEl) return;

  const url = new URL("../data/history-timeline.json", import.meta.url);
  const res = await fetch(url);
  if (!res.ok) {
    rootEl.innerHTML =
      '<p class="cv-history-err">전략 필러 데이터를 불러오지 못했습니다.</p>';
    return;
  }
  const timeline = await res.json();
  const panels = [
    { id: "history-sticky-1", entries: timeline },
  ];

  createRoot(rootEl).render(
    html`<${StrictMode}><${HistoryPanelsMount} panels=${panels} /></${StrictMode}>`,
  );
}

boot();
