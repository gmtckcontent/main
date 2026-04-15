import raw from "../data/history-timeline.json";

export type HistoryLineItem =
  | string
  | { text: string; emphasis?: boolean };

/** [기간, 배경, 상세] — 불릿은 문자열 또는 { text, emphasis } */
export type HistoryDataEntry = {
  id: string;
  periodLabel: string;
  /** 카드 상단 제목 (없으면 periodLabel 만 사용) */
  title?: string;
  image: string;
  items: HistoryLineItem[];
};

export const HISTORY_DATA = raw as HistoryDataEntry[];

/**
 * 전체 엔트리를 하나의 Sticky 패널로 — 왼쪽 연도 레일에 전체 연혁이 표시되고,
 * 오른쪽 카드가 모두 지나간 뒤 섹션 전체가 스크롤되어 나간다.
 */
export const HISTORY_STICKY_PANELS: { id: string; entries: HistoryDataEntry[] }[] =
  [
    { id: "history-sticky-1", entries: HISTORY_DATA },
  ];
