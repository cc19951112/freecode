import { create } from 'zustand';
import {
  GameState,
  Action,
  GameEvent,
  GameMode,
  PlayerGoal,
  LastTurnSnapshot,
  StreakMilestone,
} from '../types/game';
import { addMonths, format } from 'date-fns';
import { getLifeStage } from '../lib/lifeStage';
import { isForcedBadEnd, resolveFiveYearEnding, resolveEarlyExcellence } from '../lib/endings';
import { ALL_GAME_EVENTS } from '../data/gameEvents';
import { buildEventDialogLines, narrateEventEffects } from '../lib/eventDialog';

const SAVE_VERSION = 4;
export const STORAGE_KEY = 'highUricAcidGameV4';

const baseHistoryLine =
  '【主线】19岁高考后：体检提示需关注尿酸（本游戏用 0–100 的「尿酸相关指数」表示，并非化验单 μmol/L）。';

const emptyGoalProgress = () => ({
  monthsUnderUric50: 0,
  monthsBalanced: 0,
  monthsHighKnowledge: 0,
  monthsHighRelationship: 0,
  consecutiveGoodMonths: 0,
});

function makeInitialState(mode: GameMode, playerGoal: PlayerGoal = 'balance'): GameState {
  return {
    saveVersion: SAVE_VERSION,
    age: 19,
    month: 0,
    lifeStage: 'postExam',
    gameMode: mode,
    playerGoal: playerGoal,
    goalProgress: emptyGoalProgress(),
    uricAcid: 65,
    health: 85,
    stress: 40,
    money: 5000,
    knowledge: 10,
    relationships: 70,
    history: [baseHistoryLine],
    isGameOver: false,
    ending: null,
    endingTag: null,
    roundPhase: 'playing',
    pendingKnowledge: null,
    pendingEventDialog: null,
    lastTurn: null,
    lastRandomEventId: null,
  };
}

const ALL_ACTIONS: Action[] = [
  {
    id: 'diet',
    label: '严格控制饮食（低嘌呤）',
    description: '减少高嘌呤食物与过量酒精的叙事选择（游戏化）',
    effects: { uricAcid: -8, health: 5, stress: 5, money: -300 },
    knowledgeGain: 3,
  },
  {
    id: 'exercise',
    label: '坚持适量运动',
    description: '规律有氧与力量搭配的叙事选择',
    effects: { uricAcid: -6, health: 8, stress: -10, money: -100 },
    knowledgeGain: 2,
  },
  {
    id: 'medical',
    label: '定期复查并遵医嘱',
    description: '就医与依从性（不替代现实中的个体处方）',
    effects: { uricAcid: -12, health: 6, knowledge: 5, money: -800 },
    knowledgeGain: 5,
  },
  {
    id: 'work',
    label: '全力工作/备考',
    description: '冲刺学业或职场目标',
    effects: { stress: 15, money: 2000, uricAcid: 5, health: -5 },
  },
  {
    id: 'social',
    label: '维系家庭与社交',
    description: '陪伴与联络，也可能面对饮食场景',
    effects: { relationships: 10, stress: -8, uricAcid: 3 },
  },
  {
    id: 'club',
    label: '社团与校园活动',
    description: '大学节奏：排练、比赛与熬夜交织',
    effects: { uricAcid: 2, health: 2, stress: 12, knowledge: 3, money: -200 },
    knowledgeGain: 1,
    lifeStages: ['college'],
  },
  {
    id: 'overtime_career',
    label: '项目冲刺与加班',
    description: '职场高压与久坐叙事',
    effects: { money: 3500, stress: 18, uricAcid: 6, health: -4 },
    lifeStages: ['career'],
  },
  {
    id: 'family_care',
    label: '家庭事务与亲子',
    description: '时间被切分，自我照护更吃紧',
    effects: { relationships: 12, stress: 10, uricAcid: 2, health: 2, money: -400 },
    lifeStages: ['family'],
  },
];

function actionAllowed(a: Action, stage: import('../types/game').LifeStage) {
  if (!a.lifeStages || a.lifeStages.length === 0) return true;
  return a.lifeStages.includes(stage);
}

type NumKey = 'uricAcid' | 'health' | 'stress' | 'knowledge' | 'relationships' | 'money';

const NUM_SNAP_KEYS: NumKey[] = ['uricAcid', 'health', 'stress', 'knowledge', 'relationships', 'money'];

function snapNums(s: GameState): Record<NumKey, number> {
  return {
    uricAcid: s.uricAcid,
    health: s.health,
    stress: s.stress,
    knowledge: s.knowledge,
    relationships: s.relationships,
    money: s.money,
  };
}

function diffNums(before: Record<NumKey, number>, after: Record<NumKey, number>) {
  const d: LastTurnSnapshot['deltas'] = {};
  for (const k of NUM_SNAP_KEYS) {
    const diff = after[k] - before[k];
    if (diff !== 0) d[k] = diff;
  }
  return d;
}

function adjustDeltaForMode(key: NumKey, delta: number, casual: boolean): number {
  if (!casual) return delta;
  if (key === 'uricAcid' && delta > 0) return Math.round(delta * 0.9);
  if (key === 'stress' && delta > 0) return Math.round(delta * 0.9);
  if (key === 'health' && delta < 0) return Math.round(delta * 0.9);
  if (key === 'money' && delta < 0) return Math.round(delta * 0.92);
  return delta;
}

function applyNumeric(s: GameState, key: NumKey, delta: number, casual: boolean): void {
  const d = adjustDeltaForMode(key, delta, casual);
  if (key === 'money') {
    s.money = Math.max(0, s.money + d);
  } else {
    s[key] = Math.max(0, Math.min(100, s[key] + d));
  }
}

function applyEffectPatch(s: GameState, effects: Partial<Pick<GameState, NumKey>>, casual: boolean) {
  (Object.keys(effects) as NumKey[]).forEach((k) => {
    const v = effects[k];
    if (typeof v === 'number') applyNumeric(s, k, v, casual);
  });
}

function filterEventPool(s: GameState, events: GameEvent[]): GameEvent[] {
  return events.filter((e) => {
    if (e.lifeStages && e.lifeStages.length > 0 && !e.lifeStages.includes(s.lifeStage)) return false;
    if (e.ageMin != null && s.age < e.ageMin) return false;
    if (e.ageMax != null && s.age > e.ageMax) return false;
    if (e.condition && !e.condition(s)) return false;
    return true;
  });
}

function pickWeightedEvent(pool: GameEvent[], lastId: string | null): GameEvent | null {
  if (!pool.length) return null;
  const entries = pool.map((ev) => {
    let w = ev.weight ?? 1;
    if (lastId && ev.id === lastId) w *= 0.35;
    return { ev, w };
  });
  const total = entries.reduce((a, b) => a + b.w, 0);
  if (total <= 0) return pool[0] ?? null;
  let r = Math.random() * total;
  for (const { ev, w } of entries) {
    r -= w;
    if (r <= 0) return ev;
  }
  return pool[pool.length - 1] ?? null;
}

const LEGACY_STORAGE_KEYS = ['highUricAcidGameV3', 'highUricAcidGameV2', 'highUricAcidGameV1'] as const;

type Store = {
  state: GameState;
  allActions: Action[];
  allEvents: GameEvent[];
  getAvailableActions: () => Action[];
  advanceMonth: (selectedAction: Action) => void;
  clearPendingKnowledge: () => void;
  startGame: (mode: GameMode, goal: PlayerGoal) => void;
  resetToSetup: () => void;
  getCurrentDate: () => string;
  hydrateState: (raw: unknown) => GameState;
  /** 启动时从 localStorage 读档；兼容旧键并迁移到当前键 */
  rehydrateFromStorage: () => void;
  clearPendingEventDialog: () => void;
};

const defaultStateForSetup: GameState = {
  ...makeInitialState('standard', 'balance'),
  roundPhase: 'setup',
};

function mergeStateWithDefaults(partial: Partial<GameState>): GameState {
  const base = makeInitialState('standard', partial.playerGoal ?? 'balance');
  return {
    ...base,
    ...partial,
    saveVersion: partial.saveVersion ?? SAVE_VERSION,
    playerGoal: partial.playerGoal ?? 'balance',
    lastTurn: partial.lastTurn ?? null,
    pendingEventDialog: partial.pendingEventDialog ?? null,
    lastRandomEventId: partial.lastRandomEventId ?? null,
    goalProgress: {
      ...emptyGoalProgress(),
      ...partial.goalProgress,
    },
  };
}

export const useGameStore = create<Store>((set, get) => ({
  state: defaultStateForSetup,
  allActions: ALL_ACTIONS,
  allEvents: ALL_GAME_EVENTS,
  getAvailableActions: () => {
    const s = get().state;
    if (s.roundPhase !== 'playing') return [];
    return ALL_ACTIONS.filter((a) => actionAllowed(a, s.lifeStage));
  },
  hydrateState: (raw) => {
    if (raw && typeof raw === 'object') {
      const p = raw as Partial<GameState>;
      return mergeStateWithDefaults(p);
    }
    return makeInitialState('standard', 'balance');
  },
  rehydrateFromStorage: () => {
    try {
      const tryOrder = [STORAGE_KEY, ...LEGACY_STORAGE_KEYS] as const;
      for (const key of tryOrder) {
        const raw = localStorage.getItem(key);
        if (!raw) continue;
        const merged = get().hydrateState(JSON.parse(raw) as unknown);
        if (merged.roundPhase === 'playing' || merged.roundPhase === 'ended') {
          set({ state: merged });
          if (key !== STORAGE_KEY) {
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
              localStorage.removeItem(key);
            } catch {
              /* ignore */
            }
          }
          return;
        }
      }
    } catch {
      /* ignore */
    }
  },
  startGame: (mode, goal) => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      for (const k of LEGACY_STORAGE_KEYS) localStorage.removeItem(k);
    } catch {
      /* ignore */
    }
    set({ state: makeInitialState(mode, goal) });
  },
  resetToSetup: () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      for (const k of LEGACY_STORAGE_KEYS) localStorage.removeItem(k);
    } catch {
      /* ignore */
    }
    set({
      state: {
        ...defaultStateForSetup,
        isGameOver: false,
        ending: null,
        endingTag: null,
        pendingKnowledge: null,
        pendingEventDialog: null,
        lastTurn: null,
        lastRandomEventId: null,
        history: [baseHistoryLine],
      },
    });
  },
  clearPendingKnowledge: () => {
    set((prev) => ({ state: { ...prev.state, pendingKnowledge: null } }));
  },
  clearPendingEventDialog: () => {
    set((prev) => ({ state: { ...prev.state, pendingEventDialog: null } }));
  },
  advanceMonth: (selectedAction) => {
    const current = get().state;
    if (current.isGameOver || current.roundPhase !== 'playing') return;

    const casual = current.gameMode === 'casual';
    // 标准模式约 32% 触发随机事件；休闲仍更低
    const eventThreshold = casual ? 0.86 : 0.68;

    const beforeAll = snapNums(current);

    const newState: GameState = {
      ...current,
      pendingKnowledge: null,
      pendingEventDialog: null,
      goalProgress: { ...current.goalProgress },
    };

    applyEffectPatch(newState, selectedAction.effects, casual);
    if (selectedAction.knowledgeGain) {
      newState.knowledge = Math.min(100, newState.knowledge + selectedAction.knowledgeGain);
    }

    newState.month += 1;
    if (newState.month > 0 && newState.month % 12 === 0) {
      newState.age += 1;
    }
    newState.lifeStage = getLifeStage(newState.age);

    const m = newState.month;
    let lastEvent: GameEvent | null = null;

    if (Math.random() > eventThreshold) {
      const pool = filterEventPool(newState, ALL_GAME_EVENTS);
      const picked = pickWeightedEvent(pool, newState.lastRandomEventId);
      if (picked) {
        if (!picked.condition || picked.condition(newState)) {
          lastEvent = picked;
          applyEffectPatch(newState, picked.effects, casual);
          if (picked.knowledge) {
            newState.pendingKnowledge = picked.knowledge;
          }
          newState.lastRandomEventId = picked.id;
        } else {
          newState.lastRandomEventId = newState.lastRandomEventId;
        }
      }
    } else {
      // 本月无随机故事时，仍保持 lastId 以略降下月同 id
      newState.lastRandomEventId = current.lastRandomEventId;
    }

    const afterAll = snapNums(newState);
    const deltas = diffNums(beforeAll, afterAll);

    // —— 课题与连击
    const gp = { ...newState.goalProgress };
    if (newState.uricAcid < 50) gp.monthsUnderUric50 += 1;
    if (newState.stress < 65 && newState.uricAcid < 70) gp.monthsBalanced = (current.goalProgress.monthsBalanced || 0) + 1;
    else gp.monthsBalanced = 0;
    if (newState.knowledge > 60) gp.monthsHighKnowledge = (current.goalProgress.monthsHighKnowledge || 0) + 1;
    else gp.monthsHighKnowledge = 0;
    if (newState.relationships > 72) gp.monthsHighRelationship = (current.goalProgress.monthsHighRelationship || 0) + 1;
    else gp.monthsHighRelationship = 0;

    const strongNeg = !!(lastEvent?.isHardNegative);
    const uricDown = newState.uricAcid < beforeAll.uricAcid;
    const under50 = newState.uricAcid < 50;
    const goodStreak = (under50 || uricDown) && !strongNeg;
    const prevStreak = current.goalProgress.consecutiveGoodMonths;
    if (goodStreak) gp.consecutiveGoodMonths = prevStreak + 1;
    else gp.consecutiveGoodMonths = 0;

    newState.goalProgress = gp;

    let milestone: StreakMilestone | null = null;
    if (goodStreak) {
      if (gp.consecutiveGoodMonths >= 12 && prevStreak < 12) milestone = 'streak-12';
      else if (gp.consecutiveGoodMonths >= 6 && prevStreak < 6) milestone = 'streak-6';
      else if (gp.consecutiveGoodMonths >= 3 && prevStreak < 3) milestone = 'streak-3';
    }

    let feedbackLine: string | null = null;
    if (milestone === 'streak-3') feedbackLine = '管理连击 x3：节奏正在成形。';
    else if (milestone === 'streak-6') feedbackLine = '管理连击 x6：你正在把自己押回正反馈里。';
    else if (milestone === 'streak-12') feedbackLine = '管理连击 x12：这一局，你是认真的。';
    if (!milestone && lastEvent?.isPositive) feedbackLine = '事件带来一点暖意——记得这不是现实处方。';
    if (!milestone && !lastEvent && newState.uricAcid < beforeAll.uricAcid) {
      feedbackLine = '这月主行动在帮你把「尿酸相关指数」往下拉。';
    }

    const lastTurn: LastTurnSnapshot = {
      month: m,
      age: newState.age,
      lifeStage: newState.lifeStage,
      actionId: selectedAction.id,
      actionLabel: selectedAction.label,
      event: lastEvent
        ? {
            id: lastEvent.id,
            title: lastEvent.title,
            description: lastEvent.description,
            isPositive: lastEvent.isPositive,
            isHardNegative: lastEvent.isHardNegative,
          }
        : null,
      deltas,
      milestone,
      feedbackLine,
    };
    newState.lastTurn = lastTurn;

    if (lastEvent) {
      newState.pendingEventDialog = {
        eventId: lastEvent.id,
        title: lastEvent.title,
        lines: buildEventDialogLines(lastEvent),
        isPositive: lastEvent.isPositive,
        isHardNegative: lastEvent.isHardNegative,
        effectsSummary: narrateEventEffects(lastEvent.effects, casual),
      };
    }

    const topLines: string[] = [];
    if (lastEvent) {
      topLines.push(
        `【事件】第${m}月（${newState.age}岁 · ${newState.lifeStage}）${lastEvent.title}：${lastEvent.description}`
      );
    }
    topLines.push(`【行动】第${m}月：「${selectedAction.label}」`);
    newState.history = [...topLines, ...newState.history];

    let isGameOver = false;
    let ending: string | null = null;
    let endingTag: string | null = null;

    if (isForcedBadEnd(newState)) {
      isGameOver = true;
      ending = '健康与指数已走到危险边缘（游戏内判定）。';
      endingTag = '健康危机型';
    } else if (newState.month > 60) {
      isGameOver = true;
      const e = resolveFiveYearEnding(newState, newState.gameMode);
      ending = e.text;
      endingTag = e.tag;
    } else {
      const early = resolveEarlyExcellence(newState);
      if (early) {
        isGameOver = true;
        ending = early.text;
        endingTag = early.tag;
      }
    }

    newState.isGameOver = isGameOver;
    newState.ending = ending;
    newState.endingTag = endingTag;
    if (isGameOver) {
      newState.roundPhase = 'ended';
    }

    set({ state: newState });
  },
  getCurrentDate: () => {
    const st = get().state;
    return format(addMonths(new Date(2026, 5, 1), st.month), 'yyyy年MM月');
  },
}));

export { getGoalCompletionPercent } from '../lib/goalProgress';
