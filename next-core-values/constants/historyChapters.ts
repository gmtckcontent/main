import type { HistoryDataEntry } from "./historyData";
import raw from "../data/history-timeline.json";

const entries = raw as HistoryDataEntry[];

/**
 * Mobiem식: 챕터마다 다른 배경 — 각 챕터는 sticky 풀스크린 배경 + 그 위로 블록이 스크롤
 */
export type ScrollChapterBlock = {
  id: string;
  periodLabel: string;
  title?: string;
  items: HistoryDataEntry["items"];
};

export type ScrollChapter = {
  id: string;
  image: string;
  alt: string;
  /** 같은 배경 위에서 순차 스크롤되는 블록(보통 1개 + 여유 스크롤용 spacer 는 컴포넌트에서 처리) */
  blocks: ScrollChapterBlock[];
};

export const SCROLL_STACK_CHAPTERS: ScrollChapter[] = entries.map((e) => ({
  id: e.id,
  image: e.image,
  alt: e.title ?? e.periodLabel,
  blocks: [
    {
      id: `${e.id}-main`,
      periodLabel: e.periodLabel,
      title: e.title,
      items: e.items,
    },
  ],
}));
