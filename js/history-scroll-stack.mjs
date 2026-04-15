/**
 * 연혁 — Mobiem식 Scroll Stack
 *
 * 각 챕터마다 전체화면 배경이 sticky 로 고정되고,
 * 카드 콘텐츠만 그 위를 스크롤해서 지나간다.
 *
 * 원리:
 *   1) sticky top:0 / height:100svh 인 배경 div가 부모(minHeight:200svh) 안에서 고정
 *   2) 콘텐츠 div가 margin-top:-100svh 로 배경과 같은 위치에서 시작해 위로 스크롤
 *   3) 각 section 의 z-index 를 순서대로 높여 다음 챕터가 이전 챕터 위를 덮음
 *
 * 마운트: #cv-history-panels
 */
import React, { StrictMode } from "https://esm.sh/react@19.0.0";
import { createRoot } from "https://esm.sh/react-dom@19.0.0/client";
import {
  motion,
  useReducedMotion,
} from "https://esm.sh/framer-motion@11.15.0?deps=react@19.0.0,react-dom@19.0.0";
import { html } from "https://esm.sh/htm@3.1.1/react?deps=react@19.0.0";

function lineText(line) {
  return typeof line === "string" ? line : line.text;
}

function lineEmphasis(line) {
  return typeof line === "object" && Boolean(line.emphasis);
}

function ScrollChapter({ chapter, chapterIndex, reduceMotion }) {
  return html`
    <section
      className="cv-scroll-chapter"
      style=${{ zIndex: 10 + chapterIndex }}
      aria-label=${chapter.title ?? chapter.periodLabel}
    >
      <!-- 1) 배경: sticky — 부모(200svh)가 뷰포트 바닥에 닿을 때까지 고정 -->
      <div className="cv-scroll-chapter-bg">
        <div className="cv-scroll-chapter-bg-inner">
          <div
            className="cv-scroll-chapter-bg-img"
            style=${{ backgroundImage: `url(${chapter.image})` }}
            role="img"
            aria-label=${chapter.title ?? chapter.periodLabel}
          />
          <div className="cv-scroll-chapter-scrim" aria-hidden="true" />
        </div>
      </div>

      <!-- 2) 콘텐츠: -margin-top 으로 배경 위에 겹쳐 시작, z-index 2로 앞에 표시 -->
      <div className="cv-scroll-chapter-content">
        <${motion.div}
          className="cv-scroll-chapter-card-wrap"
          initial=${reduceMotion ? false : { opacity: 0, y: 28 }}
          whileInView=${reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport=${{ once: true, amount: 0.35, margin: "-10% 0px" }}
          transition=${{
            duration: reduceMotion ? 0 : 0.55,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <article className="cv-scroll-card">
            ${chapter.title
              ? html`<h2 className="cv-scroll-card-heading">${chapter.title}</h2>`
              : html`<p className="cv-scroll-card-period">${chapter.periodLabel}</p>`}
            ${chapter.title && chapter.periodLabel !== chapter.title
              ? html`<p className="cv-scroll-card-period">${chapter.periodLabel}</p>`
              : null}
            <ul className="cv-scroll-card-list">
              ${chapter.items.map(
                (line, j) => html`
                  <li
                    key=${`${chapter.id}-${j}`}
                    className=${lineEmphasis(line) ? "cv-history-line--bold" : ""}
                  >
                    ${lineText(line)}
                  </li>
                `,
              )}
            </ul>
          </article>
        </${motion.div}>

        <!-- 스크롤 여유 공간 — 배경이 완전히 사라질 때까지 시간 확보 -->
        <div className="cv-scroll-chapter-spacer" aria-hidden="true" />
      </div>
    </section>
  `;
}

function ScrollStackMount({ chapters }) {
  const reduceMotion = useReducedMotion();

  return html`
    <div className="cv-scroll-stack">
      ${chapters.map(
        (chapter, i) => html`
          <${ScrollChapter}
            key=${chapter.id}
            chapter=${chapter}
            chapterIndex=${i}
            reduceMotion=${reduceMotion}
          />
        `,
      )}
    </div>
  `;
}

async function boot() {
  const rootEl = document.getElementById("cv-history-panels");
  if (!rootEl) return;

  const url = new URL("../data/history-timeline.json", import.meta.url);
  const res = await fetch(url);
  if (!res.ok) {
    rootEl.innerHTML =
      '<p class="cv-history-err">연혁 데이터를 불러오지 못했습니다.</p>';
    return;
  }
  const chapters = await res.json();

  createRoot(rootEl).render(
    html`<${StrictMode}><${ScrollStackMount} chapters=${chapters} /></${StrictMode}>`,
  );
}

boot();
