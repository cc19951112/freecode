export type GameMode = 'casual' | 'standard';

export type LifeStage = 'postExam' | 'college' | 'career' | 'family';

export type RoundPhase = 'setup' | 'playing' | 'ended';

/** 本局人生课题（开局选择） */
export type PlayerGoal = 'uric' | 'balance' | 'knowledge' | 'relationship';

export type StreakMilestone = 'streak-3' | 'streak-6' | 'streak-12';

export interface GoalProgress {
  /** 累计「结算时指数 < 50」的月数 */
  monthsUnderUric50: number;
  /** 连续满足：压力 < 65 且 尿酸相关指数 < 70 */
  monthsBalanced: number;
  /** 连续满足：知识 > 60 */
  monthsHighKnowledge: number;
  /** 连续满足：人际 > 72 */
  monthsHighRelationship: number;
  /** 连击：管理顺的连续月数（见 advanceMonth 规则） */
  consecutiveGoodMonths: number;
}

/** 本回合快照：醒目标题区 + 数值反馈，不依赖解析 history */
export interface LastTurnSnapshot {
  month: number;
  age: number;
  lifeStage: LifeStage;
  actionId: string;
  actionLabel: string;
  event: null | {
    id: string;
    title: string;
    description: string;
    isPositive: boolean;
    /** 强负面叙事：UI 可用更醒目警示色 */
    isHardNegative?: boolean;
  };
  /** 相对本回合开始前的总变化（行动+事件合计） */
  deltas: Partial<
    Record<'uricAcid' | 'health' | 'stress' | 'money' | 'knowledge' | 'relationships', number>
  >;
  milestone: StreakMilestone | null;
  /** 一条内联提示，供面板/Toast 使用 */
  feedbackLine: string | null;
}

/** 游戏内 0-100 的相对指标，非血检报告数值 */
export interface GameState {
  /** 存档结构版本，便于迁移 */
  saveVersion: number;
  age: number;
  month: number;
  lifeStage: LifeStage;
  gameMode: GameMode;
  playerGoal: PlayerGoal;
  goalProgress: GoalProgress;
  uricAcid: number;
  health: number;
  stress: number;
  money: number;
  knowledge: number;
  relationships: number;
  history: string[];
  isGameOver: boolean;
  ending: string | null;
  endingTag: string | null;
  roundPhase: RoundPhase;
  pendingKnowledge: KnowledgeCard | null;
  /** 本回合已结算，仅用于弹窗表现；关窗不撤销数值 */
  pendingEventDialog: PendingEventDialog | null;
  lastTurn: LastTurnSnapshot | null;
  /** 上月抽中的事件 id，用于降低连续同质 */
  lastRandomEventId: string | null;
}

export interface KnowledgeCard {
  title: string;
  text: string;
  sourceLabel?: string;
  sourceUrl?: string;
}

export interface Action {
  id: string;
  label: string;
  description: string;
  effects: Partial<Pick<GameState, 'uricAcid' | 'health' | 'stress' | 'money' | 'knowledge' | 'relationships'>>;
  knowledgeGain?: number;
  lifeStages?: LifeStage[];
}

/** 事件弹窗内对话/旁白行（阅读向，无分支） */
export type EventDialogRole = 'narration' | 'self' | 'other' | 'system';

export interface EventDialogLine {
  role: EventDialogRole;
  /** 对 other 等可显示说话者名 */
  name?: string;
  text: string;
}

/** 待展示随机事件弹窗数据（可序列化进存档） */
export interface PendingEventDialog {
  eventId: string;
  title: string;
  lines: EventDialogLine[];
  isPositive: boolean;
  isHardNegative?: boolean;
  /** 仅叙事化概括「本事件」对游戏内指标的大致影响，非本回合行动合计 */
  effectsSummary: string;
}

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  /** 有则优先生效；无则由 description 等拼回退对话 */
  dialogue?: EventDialogLine[];
  lifeStages?: LifeStage[];
  /** 与 age 范围同时满足才进池（缺省不限） */
  ageMin?: number;
  ageMax?: number;
  /** 加权抽样，默认 1 */
  weight?: number;
  condition?: (state: GameState) => boolean;
  effects: Partial<Pick<GameState, 'uricAcid' | 'health' | 'stress' | 'money' | 'knowledge' | 'relationships'>>;
  isPositive: boolean;
  knowledge?: KnowledgeCard;
  /** 强负面：打断「管理连击」计数 */
  isHardNegative?: boolean;
}

export interface EndingResult {
  text: string;
  tag: string;
}
