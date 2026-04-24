// 互动小说核心类型 (重构 v5)
// 与旧 src/types/game.ts 并存,旧的留作过渡期参考。

export type BeatRole = 'narration' | 'self' | 'other' | 'system';

export interface Beat {
  id: string;
  role: BeatRole;
  speaker?: string;
  text: string;
}

export interface NovelRelations {
  haoran: number;
  yifan: number;
  luozhan: number;
  shenZhiyao: number;
  family: number;
}

export interface NovelTendencies {
  defiant: number;
  honest: number;
  avoidant: number;
}

export interface NovelEffects {
  health: number;
  shame: number;
  relations: NovelRelations;
  tendencies: NovelTendencies;
  flags: string[];
}

export type NovelEffectsDelta = {
  health?: number;
  shame?: number;
  relations?: Partial<NovelRelations>;
  tendencies?: Partial<NovelTendencies>;
  addFlags?: string[];
};

export interface Choice {
  id: string;
  label: string;
  hint?: string;
  effects?: NovelEffectsDelta;
  nextSceneId?: string;
  insertBeats?: Beat[];
}

export interface Scene {
  id: string;
  beats: Beat[];
  choice?: { prompt?: string; options: Choice[] };
  nextSceneId?: string;
}

export interface ChapterSummaryRule {
  whenFlag?: string;
  text: string;
}

export type ChapterStatus = 'ready' | 'placeholder';

export interface Chapter {
  id: string;
  index: number;
  title: string;
  subtitle?: string;
  intro?: string;
  scenes: Scene[];
  startSceneId: string;
  outroLines?: ChapterSummaryRule[];
  status: ChapterStatus;
}

export interface NovelHistoryEntry {
  chapterId: string;
  sceneId: string;
  choiceId: string;
  label: string;
}

export type NovelPhase = 'menu' | 'intro' | 'reading' | 'choosing' | 'outro';

export interface NovelPrefs {
  typewriter: boolean;
  typewriterSpeed: number; // ms/字
  showHints: boolean;
}

export interface NovelState {
  saveVersion: 5;
  phase: NovelPhase;
  chapterId: string;
  sceneId: string;
  beatIndex: number; // -1 表示尚未开始播 beats
  // 当前 scene 的 beats 可能被 insertBeats 临时扩展;实际播放走 runtimeBeats
  runtimeBeats: Beat[] | null;
  effects: NovelEffects;
  history: NovelHistoryEntry[];
  unlockedChapters: string[];
  prefs: NovelPrefs;
}

export const INITIAL_EFFECTS: NovelEffects = {
  health: 78,
  shame: 10,
  relations: { haoran: 50, yifan: 50, luozhan: 50, shenZhiyao: 0, family: 60 },
  tendencies: { defiant: 0, honest: 0, avoidant: 0 },
  flags: [],
};

export const DEFAULT_PREFS: NovelPrefs = {
  typewriter: true,
  typewriterSpeed: 28,
  showHints: true,
};

export const RELATION_LABELS: Record<keyof NovelRelations, string> = {
  haoran: '王浩然',
  yifan: '邓一帆',
  luozhan: '罗展',
  shenZhiyao: '沈知遥',
  family: '家人',
};

export const TENDENCY_LABELS: Record<keyof NovelTendencies, string> = {
  defiant: '硬撑',
  honest: '坦诚',
  avoidant: '回避',
};
