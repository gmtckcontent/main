"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { SCROLL_STACK_CHAPTERS } from "@/constants/historyChapters";
import type { HistoryLineItem } from "@/constants/historyData";

function lineText(line: HistoryLineItem): string {
  return typeof line === "string" ? line : line.text;
}

function lineEmphasis(line: HistoryLineItem): boolean {
  return typeof line === "object" && Boolean(line.emphasis);
}

/**
 * 배경: sticky top-0 + 100vh — 이 래퍼의 min-height 동안 뷰포트에 고정된 것처럼 보임
 * (background-attachment: fixed 대신, 모바일 호환)
 *
 * 전경: -margin-top 으로 배경과 같은 시작선에서 겹치며 위로만 스크롤
 */
export function ScrollStackSections() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative bg-neutral-950">
      {SCROLL_STACK_CHAPTERS.map((chapter, chapterIndex) => {
        const blockCount = chapter.blocks.length;
        /** 스크롤 거리: 카드 높이 + 아래 spacer — sticky 가 풀리기 전까지 충분히 길게 */
        const scrollMultiplier = Math.max(blockCount + 1, 2);

        return (
          <section
            key={chapter.id}
            className="relative w-full"
            style={{ zIndex: 10 + chapterIndex }}
            aria-label={chapter.alt}
          >
            <div
              className="relative w-full"
              style={{
                minHeight: `${scrollMultiplier * 100}svh`,
              }}
            >
              {/* 1) 배경: sticky — 부모(위 래퍼)가 충분히 길어야 스크롤 내내 고정 */}
              <div className="sticky top-0 z-[1] h-[100svh] min-h-[100vh] w-full">
                <div className="relative h-[100svh] min-h-[100vh] w-full">
                  <Image
                    src={chapter.image}
                    alt={chapter.alt}
                    fill
                    className="object-cover object-center"
                    sizes="100vw"
                    priority={chapterIndex === 0}
                    draggable={false}
                  />
                  <div
                    className="pointer-events-none absolute inset-0 bg-black/55"
                    aria-hidden
                  />
                </div>
              </div>

              {/* 2) 전경: 배경과 같은 뷰 높이만큼 위로 당겨 겹침 — overflow-hidden 금지(sticky 깨짐 방지) */}
              <div className="relative z-[2] -mt-[100svh]">
                {chapter.blocks.map((block) => (
                  <motion.div
                    key={block.id}
                    className="flex min-h-[100svh] items-center justify-center px-4 py-16 sm:px-8"
                    initial={reduceMotion ? false : { opacity: 0, y: 28 }}
                    whileInView={
                      reduceMotion ? undefined : { opacity: 1, y: 0 }
                    }
                    viewport={{ once: true, amount: 0.35, margin: "-10% 0px" }}
                    transition={{
                      duration: reduceMotion ? 0 : 0.55,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <article className="w-full max-w-lg rounded-[2rem] border border-white/10 bg-white/95 p-8 shadow-2xl backdrop-blur-sm sm:max-w-xl sm:rounded-[2.5rem] sm:p-10 md:p-12">
                      {block.title ? (
                        <h2 className="text-xl font-extrabold leading-snug tracking-tight text-neutral-950 sm:text-2xl">
                          {block.title}
                        </h2>
                      ) : null}
                      {(!block.title || block.periodLabel !== block.title) && (
                        <p
                          className={
                            block.title
                              ? "mt-2 text-xs font-bold uppercase tracking-[0.2em] text-[#003478] sm:text-sm"
                              : "text-xs font-bold uppercase tracking-[0.2em] text-[#003478] sm:text-sm"
                          }
                        >
                          {block.periodLabel}
                        </p>
                      )}
                      <ul className="mt-6 space-y-3.5 text-left text-[15px] leading-relaxed text-neutral-900 sm:text-base">
                        {block.items.map((line, j) => (
                          <li
                            key={`${block.id}-${j}`}
                            className={
                              lineEmphasis(line)
                                ? "list-none pl-0 font-bold text-neutral-950"
                                : "list-none pl-0 text-neutral-800"
                            }
                          >
                            {lineText(line)}
                          </li>
                        ))}
                      </ul>
                    </article>
                  </motion.div>
                ))}

                <div className="min-h-[50svh] sm:min-h-[55svh]" aria-hidden />
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
