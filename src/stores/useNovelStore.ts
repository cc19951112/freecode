import { create } from 'zustand';
import {
  Beat,
  Choice,
  Chapter,
  Scene,
  NovelState,
  NovelEffects,
  NovelEffectsDelta,
  NovelHistoryEntry,
  INITIAL_EFFECTS,
  DEFAULT_PREFS,
} from '../types/novel';
import {
  ALL_CHAPTERS,
  FIRST_CHAPTER_ID,
  getChapter,
  getNextChapter,
} from '../data/chapters';

const SAVE_VERSION = 5 as const;
export const NOVEL_STORAGE_KEY = 'highUricAcidNovelV5';
const LEGACY_KEYS = [
  'highUricAcidGameV4',
  'highUricAcidGameV3',
  'highUricAcidGameV2',
  'highUricAcidGameV1',
];

const clamp = (n: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, n));

function makeMenuState(): NovelState {
  return {
    saveVersion: SAVE_VERSION,
    phase: 'menu',
    chapterId: '',
    sceneId: '',
    beatIndex: -1,
    runtimeBeats: null,
    effects: cloneEffects(INITIAL_EFFECTS),
    history: [],
    unlockedChapters: [],
    prefs: { ...DEFAULT_PREFS },
  };
}

function cloneEffects(e: NovelEffects): NovelEffects {
  return {
    health: e.health,
    shame: e.shame,
    relations: { ...e.relations },
    tendencies: { ...e.tendencies },
    flags: [...e.flags],
  };
}

function applyDelta(prev: NovelEffects, delta?: NovelEffectsDelta): NovelEffects {
  if (!delta) return prev;
  const next = cloneEffects(prev);
  if (typeof delta.health === 'number') {
    next.health = clamp(next.health + delta.health, 0, 100);
  }
  if (typeof delta.shame === 'number') {
    next.shame = clamp(next.shame + delta.shame, 0, 100);
  }
  if (delta.relations) {
    for (const k of Object.keys(delta.relations) as (keyof NovelEffects['relations'])[]) {
      const v = delta.relations[k];
      if (typeof v === 'number') {
        next.relations[k] = clamp(next.relations[k] + v, -100, 100);
      }
    }
  }
  if (delta.tendencies) {
    for (const k of Object.keys(delta.tendencies) as (keyof NovelEffects['tendencies'])[]) {
      const v = delta.tendencies[k];
      if (typeof v === 'number') {
        next.tendencies[k] = clamp(next.tendencies[k] + v, -100, 100);
      }
    }
  }
  if (delta.addFlags) {
    for (const f of delta.addFlags) {
      if (!next.flags.includes(f)) next.flags.push(f);
    }
  }
  return next;
}

function findScene(chapter: Chapter, sceneId: string): Scene | undefined {
  return chapter.scenes.find((s) => s.id === sceneId);
}

function getRuntimeBeats(state: NovelState, chapter: Chapter): Beat[] {
  if (state.runtimeBeats) return state.runtimeBeats;
  const scene = findScene(chapter, state.sceneId);
  return scene ? scene.beats : [];
}

interface NovelStore {
  state: NovelState;
  startNewNovel: () => void;
  continueReading: () => void;
  enterChapter: (chapterId: string) => void;
  backToMenu: () => void;
  dismissIntro: () => void;
  advance: (opts?: { force?: boolean }) => void;
  applyChoice: (choiceId: string) => void;
  finishChapter: () => void;
  togglePref: (key: 'typewriter' | 'showHints') => void;
  setTypewriterSpeed: (ms: number) => void;
  rehydrate: () => void;
  resetAll: () => void;
}

export const useNovelStore = create<NovelStore>((set) => ({
  state: makeMenuState(),

  startNewNovel: () => {
    const ch = getChapter(FIRST_CHAPTER_ID);
    if (!ch) return;
    set((prev) => ({
      state: {
        ...makeMenuState(),
        prefs: { ...prev.state.prefs },
        phase: 'intro',
        chapterId: ch.id,
        sceneId: ch.startSceneId,
        beatIndex: -1,
      },
    }));
  },

  continueReading: () => {
    set((prev) => {
      const { state } = prev;
      if (!state.chapterId) {
        // 无进度,等同新开始
        const ch = getChapter(FIRST_CHAPTER_ID);
        if (!ch) return prev;
        return {
          state: {
            ...state,
            phase: 'intro',
            chapterId: ch.id,
            sceneId: ch.startSceneId,
            beatIndex: -1,
            runtimeBeats: null,
          },
        };
      }
      // 已有进度,直接回到当前 phase (若是 menu 则按上次保存的位置进入 reading)
      const phase = state.phase === 'menu' ? 'reading' : state.phase;
      return { state: { ...state, phase } };
    });
  },

  enterChapter: (chapterId) => {
    const ch = getChapter(chapterId);
    if (!ch) return;
    set((prev) => ({
      state: {
        ...prev.state,
        phase: 'intro',
        chapterId: ch.id,
        sceneId: ch.startSceneId,
        beatIndex: -1,
        runtimeBeats: null,
      },
    }));
  },

  backToMenu: () => {
    set((prev) => ({ state: { ...prev.state, phase: 'menu' } }));
  },

  dismissIntro: () => {
    set((prev) => {
      const { state } = prev;
      const ch = getChapter(state.chapterId);
      if (!ch) return prev;
      // 占位章节直接收尾
      if (ch.status === 'placeholder' || ch.scenes.length === 0) {
        return { state: { ...state, phase: 'outro' } };
      }
      return {
        state: {
          ...state,
          phase: 'reading',
          sceneId: ch.startSceneId,
          beatIndex: 0,
          runtimeBeats: null,
        },
      };
    });
  },

  advance: () => {
    set((prev) => {
      const { state } = prev;
      if (state.phase !== 'reading') return prev;
      const ch = getChapter(state.chapterId);
      if (!ch) return prev;
      const scene = findScene(ch, state.sceneId);
      if (!scene) return prev;
      const beats = getRuntimeBeats(state, ch);
      const nextIndex = state.beatIndex + 1;
      if (nextIndex < beats.length) {
        return { state: { ...state, beatIndex: nextIndex } };
      }
      // 已到最后一个 beat
      if (scene.choice && scene.choice.options.length > 0) {
        return { state: { ...state, phase: 'choosing' } };
      }
      // 跳下一场景
      const nextSceneId = scene.nextSceneId;
      if (nextSceneId) {
        const nextScene = findScene(ch, nextSceneId);
        if (nextScene) {
          return {
            state: {
              ...state,
              sceneId: nextScene.id,
              beatIndex: 0,
              runtimeBeats: null,
            },
          };
        }
      }
      // 没有下一场景,进入章节小结
      return { state: { ...state, phase: 'outro', runtimeBeats: null } };
    });
  },

  applyChoice: (choiceId) => {
    set((prev) => {
      const { state } = prev;
      const ch = getChapter(state.chapterId);
      if (!ch) return prev;
      const scene = findScene(ch, state.sceneId);
      if (!scene || !scene.choice) return prev;
      const opt: Choice | undefined = scene.choice.options.find(
        (o) => o.id === choiceId
      );
      if (!opt) return prev;

      const newEffects = applyDelta(state.effects, opt.effects);
      const historyEntry: NovelHistoryEntry = {
        chapterId: ch.id,
        sceneId: scene.id,
        choiceId: opt.id,
        label: opt.label,
      };

      // 优先 insertBeats
      if (opt.insertBeats && opt.insertBeats.length > 0) {
        return {
          state: {
            ...state,
            phase: 'reading',
            runtimeBeats: opt.insertBeats,
            beatIndex: 0,
            effects: newEffects,
            history: [...state.history, historyEntry],
          },
        };
      }

      const nextSceneId = opt.nextSceneId ?? scene.nextSceneId;
      if (nextSceneId) {
        const nextScene = findScene(ch, nextSceneId);
        if (nextScene) {
          return {
            state: {
              ...state,
              phase: 'reading',
              sceneId: nextScene.id,
              beatIndex: 0,
              runtimeBeats: null,
              effects: newEffects,
              history: [...state.history, historyEntry],
            },
          };
        }
      }
      // 选择后无下一场景 -> 进入章节小结
      return {
        state: {
          ...state,
          phase: 'outro',
          runtimeBeats: null,
          effects: newEffects,
          history: [...state.history, historyEntry],
        },
      };
    });
  },

  finishChapter: () => {
    set((prev) => {
      const { state } = prev;
      const ch = getChapter(state.chapterId);
      if (!ch) return { state: { ...state, phase: 'menu' } };
      const unlocked = state.unlockedChapters.includes(ch.id)
        ? state.unlockedChapters
        : [...state.unlockedChapters, ch.id];
      const nextCh = getNextChapter(ch.id);
      if (!nextCh) {
        return {
          state: { ...state, unlockedChapters: unlocked, phase: 'menu' },
        };
      }
      return {
        state: {
          ...state,
          unlockedChapters: unlocked,
          phase: 'intro',
          chapterId: nextCh.id,
          sceneId: nextCh.startSceneId,
          beatIndex: -1,
          runtimeBeats: null,
        },
      };
    });
  },

  togglePref: (key) => {
    set((prev) => ({
      state: {
        ...prev.state,
        prefs: { ...prev.state.prefs, [key]: !prev.state.prefs[key] },
      },
    }));
  },

  setTypewriterSpeed: (ms) => {
    set((prev) => ({
      state: { ...prev.state, prefs: { ...prev.state.prefs, typewriterSpeed: ms } },
    }));
  },

  rehydrate: () => {
    if (typeof window === 'undefined') return;
    try {
      const raw = window.localStorage.getItem(NOVEL_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<NovelState> | null;
        if (parsed && parsed.saveVersion === SAVE_VERSION) {
          // 兼容性补全
          const merged: NovelState = {
            ...makeMenuState(),
            ...parsed,
            effects: {
              ...INITIAL_EFFECTS,
              ...(parsed.effects || {}),
              relations: {
                ...INITIAL_EFFECTS.relations,
                ...(parsed.effects?.relations || {}),
              },
              tendencies: {
                ...INITIAL_EFFECTS.tendencies,
                ...(parsed.effects?.tendencies || {}),
              },
              flags: parsed.effects?.flags || [],
            },
            prefs: { ...DEFAULT_PREFS, ...(parsed.prefs || {}) },
            history: parsed.history || [],
            unlockedChapters: parsed.unlockedChapters || [],
            runtimeBeats: parsed.runtimeBeats ?? null,
          };
          // 验证 chapter/scene 是否仍然存在
          const ch = getChapter(merged.chapterId);
          if (!ch) {
            merged.phase = 'menu';
            merged.chapterId = '';
            merged.sceneId = '';
            merged.beatIndex = -1;
          }
          set({ state: merged });
          return;
        }
      }
      // 检查旧存档,提示并清掉
      let migrated = false;
      for (const k of LEGACY_KEYS) {
        if (window.localStorage.getItem(k)) {
          window.localStorage.removeItem(k);
          migrated = true;
        }
      }
      if (migrated && typeof window !== 'undefined') {
        // 一次性提示,放在 setTimeout 里避免 SSR/初始化阻塞
        setTimeout(() => {
          try {
            // eslint-disable-next-line no-alert
            alert('已升级到全新阅读模式,旧存档不再兼容,已为你清理。');
          } catch {
            /* ignore */
          }
        }, 50);
      }
    } catch {
      /* ignore */
    }
  },

  resetAll: () => {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.removeItem(NOVEL_STORAGE_KEY);
      } catch {
        /* ignore */
      }
    }
    set({ state: makeMenuState() });
  },
}));

// 导出选择器: 方便组件取数据
export function selectCurrentChapter(state: NovelState): Chapter | undefined {
  return getChapter(state.chapterId);
}

export function selectCurrentScene(state: NovelState): Scene | undefined {
  const ch = selectCurrentChapter(state);
  if (!ch) return undefined;
  return findScene(ch, state.sceneId);
}

export function selectVisibleBeats(state: NovelState): Beat[] {
  const ch = selectCurrentChapter(state);
  if (!ch) return [];
  const all = state.runtimeBeats ?? findScene(ch, state.sceneId)?.beats ?? [];
  return all.slice(0, Math.max(0, state.beatIndex + 1));
}

export function selectAllRuntimeBeats(state: NovelState): Beat[] {
  const ch = selectCurrentChapter(state);
  if (!ch) return [];
  return state.runtimeBeats ?? findScene(ch, state.sceneId)?.beats ?? [];
}

export { ALL_CHAPTERS };
