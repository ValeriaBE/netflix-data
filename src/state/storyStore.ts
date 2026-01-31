import { create } from "zustand";
import type { FocusMode, ChapterKey } from "../app/constants";
import { CHAPTERS } from "../app/constants";

type StoryState = {
  focus: FocusMode;
  chapterIndex: number;

  setFocus: (f: FocusMode) => void;
  next: () => void;
  prev: () => void;
  setChapter: (idx: number) => void;

  chapterKey: () => ChapterKey;
};

export const useStoryStore = create<StoryState>((set, get) => ({
  focus: "both",
  chapterIndex: 0,

  setFocus: (focus) => set({ focus }),

  next: () =>
    set((s) => ({
      chapterIndex: Math.min(s.chapterIndex + 1, CHAPTERS.length - 1),
    })),

  prev: () => set((s) => ({ chapterIndex: Math.max(s.chapterIndex - 1, 0) })),

  setChapter: (chapterIndex) =>
    set({ chapterIndex: Math.max(0, Math.min(chapterIndex, CHAPTERS.length - 1)) }),

  chapterKey: () => CHAPTERS[get().chapterIndex].key,
}));
