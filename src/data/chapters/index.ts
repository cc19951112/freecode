import type { Chapter } from '../../types/novel';
import { chapter01 } from './chapter01';
import { chapter02 } from './chapter02';
import { chapter03 } from './chapter03';
import { chapter04 } from './chapter04';
import { placeholderChapters } from './placeholders';

export const ALL_CHAPTERS: Chapter[] = [
  chapter01,
  chapter02,
  chapter03,
  chapter04,
  ...placeholderChapters,
].sort((a, b) => a.index - b.index);

export function getChapter(id: string): Chapter | undefined {
  return ALL_CHAPTERS.find((c) => c.id === id);
}

export function getChapterByIndex(index: number): Chapter | undefined {
  return ALL_CHAPTERS.find((c) => c.index === index);
}

export function getNextChapter(currentId: string): Chapter | undefined {
  const cur = getChapter(currentId);
  if (!cur) return undefined;
  return getChapterByIndex(cur.index + 1);
}

export const FIRST_CHAPTER_ID = 'ch01';
